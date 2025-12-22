'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/CartStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartIconProps {
    userId?: string;
}

export function CartIcon({ userId }: CartIconProps) {
    const [itemCount, setItemCount] = useState(0);
    const { cart, guestCart, fetchCart, getCartCount, getGuestCartCount } = useCartStore();
    const router = useRouter();

    useEffect(() => {
        if (userId) {
            fetchCart(userId);
        }
    }, [userId]);

    useEffect(() => {
        if (userId && cart) {
            setItemCount(getCartCount());
        } else {
            setItemCount(getGuestCartCount());
        }
    }, [cart, guestCart, userId]);

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push('/cart')}
        >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </Button>
    );
}