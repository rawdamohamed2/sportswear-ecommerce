import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}
const LoadingProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group cursor-pointer">
      <div className="bg-surface p-8 aspect-[4/5] relative overflow-hidden border border-outline hover:border-primary-brand transition-colors">
        {product.categories && product.categories.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex flex-row gap-2 font-bold uppercase tracking-widest text-[10px]">
            {product.categories.slice(0, 2).map((category, index) => (
              // <span
              //   key={index}
              //   className="bg-on-background text-white px-2 py-1"
              // >
              //   {category.name}
              // </span>
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
          className="h-9/10 h-9/10object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
        />
        <div className="absolute w-full h-full flex justify-end flex-col p-3 bg-primaryHover/40 gap-2 text-surface top-0 left-0 inset-x-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
          <div className={`flex gap-2`}></div>
          <h3 className="text-base uppercase font-bold tracking-tight">
            {product.name}
          </h3>
          <span className="text-end text-base text-primary-brand font-bold">
            {product.price} EGP
          </span>
          <button className="w-full bg-on-background text-white font-bold py-3 uppercase text-xs hover:bg-primary transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoadingProductCard;
