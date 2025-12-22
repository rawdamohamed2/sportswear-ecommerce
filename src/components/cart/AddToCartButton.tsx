'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/CartStore';
import { Product } from '@/types';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
    variantId: string;
    userId?: string;
    className?: string;
}

export function AddToCartButton({ product, variantId, userId, className }: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart, addToGuestCart } = useCartStore();

    const handleAddToCart = async () => {
        setIsLoading(true);

        try {
            if (userId) {
                // Logged in user
                await addToCart(userId, product.id, 1);
                toast.success('Added to cart!');
            } else {
                // Guest user
                addToGuestCart(product,  1);
                toast.success('Added to cart!');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error( error.message);
            } else {
                toast.error('Failed to add to cart');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isLoading || (product.stock || 0) <= 0}
            className={className}
        >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading ? 'Adding...' : (product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
    );
}