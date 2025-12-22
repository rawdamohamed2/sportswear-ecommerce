import { supabase } from '../supabase/supabase';
import {Order, orderResponse, OrderStatus} from '@/types';

import {toast} from "sonner";


interface OrderItem {
    product_id: string;
    quantity: number;
    unit_price: number;
}

export class OrderService {
    // Create new order
    static createOrder = async (orderData: {
        user_id: string | null;
        total_price: number;
        payment_method: string;
        address: string;
        items: OrderItem[];
    }) => {
        try {
            console.log('Creating order with data:', {
                ...orderData,
                items_count: orderData.items.length
            });

            // 1. Create the order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: orderData.user_id,
                    total_price: orderData.total_price,
                    payment_method: orderData.payment_method,
                    address: orderData.address,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) {
                console.error('Order creation error:', orderError);
                throw orderError;
            }

            toast('Order created successfully');

            // 2. Create order items
            if (orderData.items.length > 0) {
                const orderItems = orderData.items.map(item => ({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price
                }));

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems);

                if (itemsError) {
                    console.error('Order items creation error:', itemsError);
                    // Rollback: delete the order
                    await supabase.from('orders').delete().eq('id', order.id);
                    throw itemsError;
                }

                console.log('Order items created successfully');
            }

            return {
                success: true,
                order,
                message: 'Order created successfully!'
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create order: ${error.message || 'Unknown error'}`);
            } else {
                console.error('Error in createOrder:', error);
            }
        }
    };

    // Get order by ID
    static async getOrderById(orderId: string): Promise<Order> {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `).eq('id', orderId).single();

            if (error) {
                console.error('Joined query error:', error);
                // Fall back to separate queries
                return this.getOrderById(orderId);
            }

            return data as Order;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch order: ${error.message}`);
            } else {
                console.error('Error in getOrderByIdJoined:', error);
            }
        }
    }


    // Get user orders
    static async getUserOrders(userId: string) {
        console.log(userId);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *
              `)
            .eq('user_id', userId);

        console.log(data,error);
        if (error) return  error.message;

        return data as Order[];
    };

    // Get all orders (admin)
    static async getAllOrders(options?: {
        status?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
        page?: number;
    }) {
        try {
            // Start building the query
            let query = supabase
                .from('orders')
                .select(`
                *,
                order_items (
                    *,
                    products (*)
                ),
                users (*)
            `, { count: 'exact' });

            // Apply filters
            if (options?.status) {
                query = query.eq('status', options.status);
            }

            if (options?.startDate) {
                query = query.gte('created_at', options.startDate);
            }

            if (options?.endDate) {
                query = query.lte('created_at', options.endDate);
            }

            // Pagination
            const limit = options?.limit || 20;
            const page = options?.page || 1;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            // Execute query with ordering and pagination
            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);
            console.log(error)
            if (error) {
                console.error('Error fetching orders:', error);
                throw error;
            }

            // const formattedProducts:orderResponse = {
            //     orders: data || [],
            //     total: count || 0,
            //     page,
            //     limit,
            //     totalPages: Math.ceil((count || 0) / limit)
            // };
            // Return the raw data as-is (no transformation)
            return {
                orders: data || [],
                total: count || 0,
                page,
                limit,
                totalPages: Math.ceil((count || 0) / limit)
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch orders: ${error.message}`);
            } else {
                console.error('Error in getAllOrders:', error);
            }
        }
    }


    static async cancelOrder(orderId: string, reason?: string): Promise<Order> {
        try {
            // Get order details
            const order = await this.getOrderById(orderId);

            if (!order) {
                throw new Error('Order not found');
            }

            // Check if order can be cancelled
            const nonCancellableStatuses: OrderStatus[] = ['delivered', 'cancelled'];
            if (nonCancellableStatuses.includes(order.status)) {
                throw new Error(`Cannot cancel order with status: ${order.status}`);
            }

            // Restore stock for all items
            if (order.order_items) {
                for (const item of order.order_items) {
                    if (item.product_id) {
                        await supabase.rpc('increment_product_stock', {
                            product_id: item.product_id,
                            increment_by: item.quantity
                        });

                    }
                }
            }

            // Update order status
            const { data: updatedOrder, error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'cancelled',
                    notes: reason ?
                        `${order.status || ''}\n[CANCELLED] ${new Date().toISOString()}: ${reason}`.trim()
                        : order.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Update payment status
            try {
                await supabase
                    .from('payments')
                    .update({
                        status: 'refunded',
                        updated_at: new Date().toISOString()
                    })
                    .eq('order_id', orderId);
            } catch (paymentError) {
                console.warn('Could not update payment status:', paymentError);
            }

            return updatedOrder;

        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    };
    // Update order status (admin)
    static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({
                status,
            })
            .eq('id', orderId);
        console.log(error)
        if (error) throw error;
    }

    // Get order statistics (admin)
    static async getOrderStats() {
        const { count: totalOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

        const { count: pendingOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        const { count: completedOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'delivered');

        // Get today's sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: todaySales } = await supabase
            .from('orders')
            .select('total_price')
            .gte('created_at', today.toISOString())
            .eq('status', 'delivered');

        const todayTotal = todaySales?.reduce((sum, order) => sum + order.total_price, 0) || 0;

        // Get monthly sales
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: monthlySales } = await supabase
            .from('orders')
            .select('total_price')
            .gte('created_at', startOfMonth.toISOString())
            .eq('status', 'delivered');

        const monthlyTotal = monthlySales?.reduce((sum, order) => sum + order.total_price, 0) || 0;

        return {
            totalOrders: totalOrders || 0,
            pendingOrders: pendingOrders || 0,
            completedOrders: completedOrders || 0,
            todaySales: todayTotal,
            monthlySales: monthlyTotal
        };
    };

    static async getFilteredOrders(userId: string,orderstatus:string) {
        console.log(userId);
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *
              `)
            .eq('user_id', userId)
            .eq('status',orderstatus);

        console.log(data,error);
        if (error) return  error.message;

        return data as Order[];
    }
}