'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/CartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Loader from "@/components/Loader";
import {useStore} from "@/lib/store/store";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";


export function CartPage() {

    const router = useRouter();
    const cart=useCartStore((s) => s.cart);
    const { fetchCart,updateQuantity,removeItem, isLoading,
        error,
        removeFromGuestCart,
        getCartTotal,
        mergeGuestCart} = useCartStore();
    let {guestCart} = useCartStore();
    const currentUser = useStore((s) => s.CurrentUser);
    const userId= currentUser?.id;
    const [cartTotal, setCartTotal] = useState(0);
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    guestCart=guestCart?guestCart:[];
    useEffect(() => {
        if (userId) {
            fetchCart(userId);
        }
    }, [userId]);

    useEffect(() => {
        const calculateTotal = async () => {
            if (userId && cart) {
                const total = await getCartTotal();
                setCartTotal(total);
            } else {
                // Calculate guest cart total
                const total = guestCart?.reduce((sum, item) => {
                    if (item.product) {
                        const discount = item.product.discount || 0;
                        const price = discount > 0
                            ? item.product.price * (1 - discount / 100)
                            : item.product.price;
                        return sum + (price * item.quantity);
                    }
                    return sum;
                }, 0);
                setCartTotal(total?total:0);
            }
        };
        calculateTotal();
    }, [cart, guestCart, userId]);

    const handleQuantityChange = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;

        if (userId) {
            await updateQuantity(itemId, quantity);

        } else {
            const item = guestCart?.find(i => i.id === itemId);
            if (item) {
                await updateQuantity(item.id, quantity);
            }
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (userId) {
            await removeItem(itemId);
        } else {
            const item = guestCart?.find(i => i.id === itemId);
            if (item) {
                removeFromGuestCart(item.product_id);
            }
        }
    };

    const handleCheckout = () => {
        if (!userId) {
            router.push('/auth/login?redirect=/checkout');
            return;
        }
        if (guestCart?.length > 0) {
            mergeGuestCart(userId);
        }

        router.push('/checkout');
    };

    const items = currentUser?.id ? cart?.items || [] : guestCart;

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error("Something went wrong");
    }

    if (items.length === 0) {
        return (
            <div className="margin-up container mx-auto p-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
                        <p className="text-muted-foreground mt-2">
                            Add some products to get started
                        </p>
                        <Button className="mt-6" onClick={() => router.push('/products')}>
                            Continue Shopping
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="margin-up container mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex sm:flex-row flex-col gap-4 border-b bg-gray-100 rounded-3xl p-3">
                                        {/* Product Image */}
                                        <div className="w-24 h-26 flex-shrink-0">
                                            <Image
                                                src={item.product?.image_url
                                                    ? item.product.image_url
                                                    : "/images/download.png"}
                                                alt={item.product?.name ?? "product image"}
                                                width={200}
                                                height={200}
                                                unoptimized
                                                onError={() => setImgError(true)}
                                                onLoadingComplete={() => setImgLoading(false)}
                                                className={`w-full h-full rounded-3xl`}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{item.product?.name}</h4>
                                            {
                                                item.product?.discount
                                                    ?<div>
                                                            <span className="text-xl font-bold text-gray-900 pe-3">
                                                                {( item.product.price * (1 - item.product?.discount / 100) * item.quantity).toFixed(2)} EGP
                                                            </span>
                                                        <span className="text-sm text-gray-500 line-through">
                                                                 {item.product.price .toFixed(2)} EGP
                                                            </span>
                                                        <Badge variant="outline" className="text-xs text-red-500 border-red-200 ms-3">
                                                            Save  {(item.product.price  - item.product.price * (1 - item.product?.discount / 100)).toFixed(2)} EGP
                                                        </Badge>
                                                    </div>
                                                    :<p>
                                                        {((item.product?.price || 0) * item.quantity).toFixed(2)}
                                                    </p>
                                            }
                                        </div>

                                        <div className={`flex items-center justify-between`}>
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                    className="w-16 text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    value={item.quantity}
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{cartTotal.toFixed(2)} EGP</span>
                                </div>
                                <div className="flex justify-between gap-1">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between gap-1">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>{cartTotal.toFixed(2)} EGP</span>
                                </div>

                                <Button
                                    className="w-full mt-6"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={items.length === 0}
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>

                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    Free shipping on orders over $50
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}