'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStat, CartItem, Product } from '@/types';
import { CartService } from '@/lib/services/cart';



interface CartStore {
    // State
    cart: CartStat | null;
    isLoading: boolean;
    error: string | unknown;
    guestCart: CartItem[]|null;

    // Actions
    fetchCart: (userId: string) => Promise<void>;
    addToCart: (userId: string, productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: (userId: string) => Promise<void>;
    getCartCount: () => number;
    getCartTotal: () => Promise<number>;
    validateCart: (userId: string) => Promise<{ valid: boolean; errors: string[] }>;
    mergeGuestCart: (userId: string) => Promise<void>;

    // Guest cart actions
    addToGuestCart: (product: Product, quantity?: number) => void;
    updateGuestQuantity: (productId: string,  quantity: number) => void;
    removeFromGuestCart: (productId: string) => void;
    clearGuestCart: () => void;
    getGuestCartCount: () => number;
    logout: () => void;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // Initial State
            cart: null,
            isLoading: false,
            error: null,
            guestCart: [],

            // Fetch user cart
            fetchCart: async (userId: string) => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await CartService.getCart(userId);
                    set({ cart, isLoading: false });
                } catch (error) {
                    if (error instanceof Error) {
                        set({ error: error.message, isLoading: false });
                    } else {
                        set({ error: "Something went wrong", isLoading: false });
                    }
                }
            },

            // Add item to cart
            addToCart: async (userId: string, productId: string,quantity: number = 1) => {
                set({ isLoading: true, error: null });
                try {
                    const cart = await CartService.addToCart(userId, productId, quantity);
                    set({
                        cart: cart,
                        isLoading: false
                    });
                    console.log(cart);

                } catch (error) {
                    if (error instanceof Error) {
                        set({ error: error.message, isLoading: false });
                    } else {
                        set({ error: "Something went wrong", isLoading: false });
                    }
                }
            },

            // Update item quantity
            updateQuantity: async (itemId: string, quantity: number) => {
                const { cart } = get();
                if (!cart) return;

                set({ isLoading: true, error: null });
                try {
                    await CartService.updateCartItem(itemId, quantity);

                    // Update local state
                    const updatedItems = cart.items.map(item =>
                        item.id === itemId ? { ...item, quantity } : item
                    );

                    set({
                        cart: { ...cart, items: updatedItems },
                        isLoading: false
                    });
                } catch (error) {
                    if (error instanceof Error) {
                        set({ error: error.message, isLoading: false });
                    } else {
                        set({ error: "Something went wrong", isLoading: false });
                    }
                }
            },

            // Remove item from cart
            removeItem: async (itemId: string) => {
                const { cart } = get();
                if (!cart) return;

                set({ isLoading: true, error: null });
                try {
                    await CartService.removeFromCart(itemId);

                    const updatedItems = cart.items.filter(item => item.id !== itemId);
                    set({
                        cart: { ...cart, items: updatedItems },
                        isLoading: false
                    });
                } catch (error) {
                    if (error instanceof Error) {
                        set({ error: error.message, isLoading: false });
                    } else {
                        set({ error: "Something went wrong", isLoading: false });
                    }
                }
            },

            // Clear cart
            clearCart: async (userId: string) => {
                set({ isLoading: true, error: null });
                try {
                    await CartService.clearCart(userId);
                    set({ cart: null, isLoading: false });
                } catch (error) {
                    if (error instanceof Error) {
                        set({ error: error.message, isLoading: false });
                    } else {
                        set({ error: "Something went wrong", isLoading: false });
                    }
                }
            },

            // Get cart item count
            getCartCount: () => {
                const { cart } = get();
                return cart ? cart.items?.reduce((sum, item) => sum + item.quantity, 0) : 0;
            },

            // Calculate cart total
            getCartTotal: async () => {
                const { cart } = get();
                if (!cart) return 0;

                try {
                    return await CartService.calculateCartTotal(cart.user_id);
                } catch (error) {
                    console.error('Error calculating total:', error);
                    return 0;
                }
            },

            // Validate cart
            validateCart: async (userId: string) => {
                try {
                    const result = await CartService.validateCart(userId);
                    return {
                        valid: result.valid,
                        errors: result.errors
                    };
                } catch (error) {
                    return {
                        valid: false,
                        errors: ['Unable to validate cart']
                    };
                }
            },

            // Merge guest cart with user cart
            mergeGuestCart: async (userId: string) => {
                const { guestCart } = get();
                if (guestCart?.length === 0) return;

                set({ isLoading: true, error: null });
                try {
                    const cart = await CartService.mergeCarts(userId, guestCart?guestCart:[]);
                    set({ cart, guestCart: [], isLoading: false });
                } catch (error) {
                    if (error instanceof Error) {
                        set({ error: error.message, isLoading: false });
                    } else {
                        set({ error: "Something went wrong", isLoading: false });
                    }
                }
            },

            // Guest cart actions
            addToGuestCart: (product: Product, quantity: number = 1) => {
                let { guestCart } = get();
                guestCart = guestCart?guestCart:[];
                let existingItemIndex = guestCart?.findIndex(item =>
                    item.product_id === product.id
                );
                existingItemIndex = existingItemIndex?existingItemIndex:0;
                if (existingItemIndex > -1) {
                    // Update quantity
                    const updatedCart = [...guestCart];
                    updatedCart[existingItemIndex].quantity += quantity;
                    set({ guestCart: updatedCart });
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        id: `guest-${Date.now()}`,
                        cart_id: 'guest',
                        product_id: product.id,
                        quantity,
                        product,
                    };
                    set({ guestCart: [...guestCart, newItem] });
                }
            },

            updateGuestQuantity: (productId: string, quantity: number) => {
                const { guestCart } = get();

                if (quantity < 1) {
                    get().removeFromGuestCart(productId);
                    return;
                }

                const updatedCart = guestCart?.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity }
                        : item
                );

                set({ guestCart: updatedCart });
            },

            removeFromGuestCart: (productId: string) => {
                const { guestCart } = get();

                const updatedCart = guestCart?.filter(item =>
                    !(item.product_id === productId)
                );

                set({ guestCart: updatedCart });
            },

            clearGuestCart: () => {
                set({ guestCart: [] });
            },

            getGuestCartCount: () => {
                let { guestCart } = get();
                guestCart =guestCart?guestCart:[];
                return guestCart?.reduce((sum, item) => sum + item.quantity, 0);
            },

            logout: () => {
                set({ guestCart: null, cart: null});
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ guestCart: state.guestCart,cart: state.cart }),
        }
    )
);