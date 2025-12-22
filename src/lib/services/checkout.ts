// services/checkout.ts
import { supabase } from '@/lib/supabase/supabase';
import { CartService } from './cart';

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullName: string;
    phone: string;
}

export interface OrderItem {
    product_id: string;
    quantity: number;
    unit_price: number;
}

export interface CreateOrderData {
    user_id: string | null;
    total_price: number;
    payment_method: 'credit_card' | 'paypal' | 'cash_on_delivery' | 'bank_transfer';
    address: string;
    items: OrderItem[];
}

export class CheckoutService {
    /**
     * Create a new order in Supabase
     */
    static async createOrder(data: CreateOrderData) {
        try {
            // Start a transaction
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: data.user_id,
                    total_price: data.total_price,
                    payment_method: data.payment_method,
                    address: data.address,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = data.items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            return {
                success: true,
                order,
                message: 'Order created successfully!'
            };
        } catch (error: any) {
            console.error('Error creating order:', error);
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    /**
     * Process checkout for authenticated user
     */
    static async processCheckout(
        userId: string,
        shippingAddress: ShippingAddress,
        paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery' | 'bank_transfer'
    ) {
        try {
            // 1. Get user's cart
            const cart = await CartService.getCart(userId);

            if (!cart || cart.items.length === 0) {
                throw new Error('Cart is empty');
            }

            // 2. Calculate total price
            let totalPrice = 0;
            const orderItems: OrderItem[] = [];

            for (const item of cart.items) {
                if (!item.product) {
                    throw new Error(`Product not found for item: ${item.id}`);
                }

                // Get the current price (considering discounts)
                const productPrice = item.product?.discount
                    ? item.product.price * (1 - item.product?.discount / 100)
                    : item.product.price;

                const itemTotal = productPrice * item.quantity;
                totalPrice += itemTotal;

                orderItems.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: productPrice
                });
            }

            // 3. Format address string
            const addressString = `${shippingAddress.fullName}\n${shippingAddress.street}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}\n${shippingAddress.country}\nPhone: ${shippingAddress.phone}`;

            // 4. Create order
            const orderData: CreateOrderData = {
                user_id: userId,
                total_price: totalPrice,
                payment_method: paymentMethod,
                address: addressString,
                items: orderItems
            };

            const result = await this.createOrder(orderData);

            // 5. Clear cart after successful order
            if (result.success) {
                await CartService.clearCart(userId);
            }

            return result;
        } catch (error: any) {
            console.error('Checkout error:', error);
            throw new Error(`Checkout failed: ${error.message}`);
        }
    }

    /**
     * Process checkout for guest user
     */
    static async processGuestCheckout(
        guestCart: Array<{
            product_id: string;
            quantity: number;
            product: {
                id: string;
                price: number;
                discount: number;
            } | null;
        }>,
        shippingAddress: ShippingAddress,
        paymentMethod: 'credit_card' | 'paypal' | 'cash_on_delivery' | 'bank_transfer',
        customerEmail: string
    ) {
        try {
            // Validate guest cart
            const validItems = guestCart.filter(item => item.product);

            if (validItems.length === 0) {
                throw new Error('Cart is empty');
            }

            // Calculate total price
            let totalPrice = 0;
            const orderItems: OrderItem[] = [];

            for (const item of validItems) {
                if (!item.product) continue;

                // Get the current price
                const productPrice = item.product.discount > 0
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;

                const itemTotal = productPrice * item.quantity;
                totalPrice += itemTotal;

                orderItems.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: productPrice
                });
            }

            // Format address with email
            const addressString = `${shippingAddress.fullName}\n${shippingAddress.street}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}\n${shippingAddress.country}\nPhone: ${shippingAddress.phone}\nEmail: ${customerEmail}`;

            // Create order (guest users have null user_id)
            const orderData: CreateOrderData = {
                user_id: null,
                total_price: totalPrice,
                payment_method: paymentMethod,
                address: addressString,
                items: orderItems
            };

            const result = await this.createOrder(orderData);

            return result;
        } catch (error: any) {
            console.error('Guest checkout error:', error);
            throw new Error(`Guest checkout failed: ${error.message}`);
        }
    }

    /**
     * Get user's orders
     */
    static async getUserOrders(userId: string) {
        try {
            const { data: orders, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return orders || [];
        } catch (error: any) {
            console.error('Error getting user orders:', error);
            throw new Error(`Failed to get orders: ${error.message}`);
        }
    }

    /**
     * Get order by ID
     */
    static async getOrderById(orderId: string) {
        try {
            const { data: order, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
                .eq('id', orderId)
                .single();

            if (error) throw error;
            return order;
        } catch (error: any) {
            console.error('Error getting order:', error);
            throw new Error(`Failed to get order: ${error.message}`);
        }
    }

    /**
     * Update order status
     */
    static async updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded') {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId);

            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Error updating order status:', error);
            throw new Error(`Failed to update order status: ${error.message}`);
        }
    }
}