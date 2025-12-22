'use client'

import Image from "next/image";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product} from "@/types";
import { ShoppingCart, Star } from "lucide-react";
import {useStore} from "@/lib/store/store";
import {useCartStore} from  '@/lib/store/CartStore'
import {useState} from "react";
import { toast } from "sonner"

interface ProductCardProps {
    product: Product
}

export default function ProductCard({product}: ProductCardProps) {
    const {
        id,
        name,
        description,
        price,
        discount,
        stock,
        image_url,
        categories,
        brands,
    } = product;

    const finalPrice = discount ? price - price * (discount / 100) : price;
    const discountPercentage = discount ? Math.round(discount) : 0;
    const isOutOfStock = stock !== null && stock <= 0;
    const CurrentUser = useStore((s) => s.CurrentUser);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart, addToGuestCart } = useCartStore();

    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);


    const handleAddToCart = async () => {
        setIsLoading(true);
        const userId = CurrentUser?.id;
        console.log(userId);
        const productId = product?.id;
        const quantity = 1;
        try {
            if (userId) {
                await addToCart(userId, productId,quantity);
                toast.success('Added to cart!');
            } else {
                addToGuestCart(product,  1);
                toast.success('Added to cart!');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error( error?.message || 'Failed to add to cart');
            } else {
                toast.error(  'Failed to add to cart');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Card className={`pt-0 group relative overflow-hidden hover:shadow-xl transition-all duration-300 `}>
            {/* Discount Badge */}
            {discountPercentage > 0 && (
                <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg">
                    -{discountPercentage}%
                </Badge>
            )}

            {/* Stock Badge */}
            {isOutOfStock && (
                <Badge className="absolute top-3 right-3 z-10 bg-gray-800 hover:bg-gray-900 text-white border-0 shadow-lg">
                    Out of Stock
                </Badge>
            )}

            <Link href={`/products/${id}`}>
                <CardHeader className="p-0 relative overflow-hidden">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {/* Skeleton Loader */}
                        {imgLoading && (
                            <div className="absolute inset-0 animate-pulse bg-primary" />
                        )}

                        <Image
                            src={
                                imgError || !image_url
                                    ? "/images/download.png"
                                    : image_url
                            }
                            unoptimized
                            loader={({ src }) => src}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`object-cover group-hover:scale-110 transition-all duration-500 ${
                                imgLoading ? "opacity-0" : "opacity-100"
                            }`}
                            onLoadingComplete={() => setImgLoading(false)}
                            onError={() => {
                                setImgError(true);
                                setImgLoading(false);
                            }}
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>


                    {/* Category Badges */}
                    {categories && categories.length > 0 && (
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                            {categories.slice(0, 2).map((category, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-4">
                    {/* Product Title */}
                    <CardTitle className="text-lg font-semibold mb-2 line-clamp-1 hover:text-primary transition-colors">
                        {name}
                    </CardTitle>

                    {/* Product Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[40px]">
                        {description}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                            {finalPrice.toFixed(2)} EGP
                        </span>

                        {discountPercentage > 0 && (
                            <>
                                <span className="text-sm text-gray-500 line-through">
                                     {price.toFixed(2)} EGP
                                </span>
                                <Badge variant="outline" className="text-xs text-red-500 border-red-200">
                                    Save  {(price - finalPrice).toFixed(2)} EGP
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Brand */}
                    {brands && (
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">Brand:</span>
                            <span className="text-sm font-medium text-darkgray">
                                {brands.name}
                            </span>
                        </div>
                    )}


                    {/* Stock Status */}
                    <div className="mb-2">
                        {stock !== null ? (
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                <span className={`text-sm ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {stock > 10 ? 'In Stock' : stock > 0 ? `Only ${stock} left` : 'Out of Stock'}
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500">Stock information not available</span>
                        )}
                    </div>

                </CardContent>
            </Link>

            {/* Actions Footer */}

                <CardFooter className="p-4 pt-0 flex flex-1 gap-2 ">
                    <Button
                        className="flex-1"
                        disabled={isOutOfStock}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="me-2 h-4 w-4" />
                        {isLoading ? 'Adding...' : (product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        asChild
                    >
                        <Link href={`/products/${id}`}>
                            View Details
                        </Link>
                    </Button>
                </CardFooter>


            {/* Ratings (Optional) */}
            <div className="absolute bottom-25 right-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">4.5</span>
                    <span className="text-xs text-gray-500">(128)</span>
                </div>
            </div>
        </Card>
    );
}