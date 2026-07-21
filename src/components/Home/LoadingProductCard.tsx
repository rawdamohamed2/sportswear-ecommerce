import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/CartStore";
import { toast } from "sonner";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}
const LoadingProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToGuestCart } = useCartStore();
  const isOutOfStock = product.stock !== null && product.stock <= 0;
  const CurrentUser = useStore((s) => s.CurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddToCart = async () => {
    setIsLoading(true);
    const userId = CurrentUser?.id;
    console.log(userId);
    const productId = product?.id;
    const quantity = 1;
    try {
      if (userId) {
        await addToCart(userId, productId, quantity);
        toast.success("Added to cart!");
      } else {
        addToGuestCart(product, 1);
        toast.success("Added to cart!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message || "Failed to add to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="group">
      <div className="bg-surface p-8 aspect-[4/5] relative overflow-hidden border border-outline hover:border-primary-brand transition-colors">
        {product.categories && product.categories.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex flex-row gap-2 font-bold uppercase tracking-widest text-[10px]">
            {product.categories.slice(0, 2).map((category, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-primary/90 backdrop-blur-sm text-white hover:bg-primary"
              >
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        <Image
          src={product.image_url}
          alt={product.name}
          width={300}
          height={300}
          className="h-9/10 w-9/10 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-4"
        />
        <div className="absolute w-full h-full flex justify-end flex-col p-3 bg-primaryHover/40 gap-2 text-surface top-0 left-0 inset-x-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
          <h3 className="text-base uppercase font-bold tracking-tight">
            {product.name}
          </h3>
          <span className="text-end text-base text-primary-brand font-bold">
            {product.price} EGP
          </span>
          <Button
            className="w-full cursor-pointer bg-on-background text-white font-bold py-3 uppercase text-xs hover:bg-primary transition-colors"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="me-2 h-4 w-4" />
            {isLoading
              ? "Adding..."
              : (product.stock || 0) <= 0
                ? "Out of Stock"
                : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LoadingProductCard;
