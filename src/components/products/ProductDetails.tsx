'use client'
import React, {useEffect} from 'react'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Star } from 'lucide-react';
import Image from "next/image";
import { useState } from 'react';
import {useParams} from "next/navigation";
import {ProductService} from '@/lib/services/products';
import {brand, Category, Product} from "@/types";
import {toast} from "sonner";
import Loader from "@/components/Loader";
import {useCartStore} from "@/lib/store/CartStore";
import {useStore} from "@/lib/store/store";

const ProductDetails = () => {

    const {id} = useParams();
    const tid:string =typeof id == "string"? id : '';
    const [isLoading ,setisLoading] = useState(false);
    const [product, setProduct] = useState<Product>();
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);
    const { addToCart, addToGuestCart } = useCartStore();
    const [relod ,setrelod]=useState(false);
    const CurrentUser = useStore((s) => s.CurrentUser);
    const { updateQuantity} = useCartStore();
    let { guestCart }= useCartStore();
    const cart=useCartStore((s) => s.cart);
    const currentUser = useStore((s) => s.CurrentUser);
    let items = currentUser?.id ? cart?.items || [] : guestCart;
    items = items?items:[];
    const item = items.find(item => item.product_id == id);


    const fetchProduct = async () => {
        setisLoading(true);
        try {
            const product:Product = await ProductService.getProductById(tid);
            setProduct(product);

        } catch (error) {
            toast.error(`Failed to load product  ${error}`);
        } finally {
            setisLoading(false);
        }
    };
    const handleAddToCart = async () => {
        setisLoading(true);
        const userId = CurrentUser?.id;
        const productId = tid;
        const quantity = 1;
        try {
            if (userId) {
                await addToCart(userId, productId,quantity);
                toast.success('Added to cart!');
                setrelod(!relod);
            } else {
                const Guesproduct = product as Product;
                addToGuestCart(Guesproduct, 1);
                toast.success('Added to cart!');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error( error?.message || 'Failed to add to cart');
            } else {
                toast.error(  'Failed to add to cart');
            }

        } finally {
            setisLoading(false);
        }
    };

    const handleQuantityChange = async (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        if (currentUser?.id) {
            await updateQuantity(itemId, quantity);
            setrelod(!relod);

        } else {
            guestCart = guestCart?guestCart:[];
            const item = guestCart.find(i => i.id === itemId);
            if (item) {
                await updateQuantity(item.id, quantity);
            }
        }
    };
    const quantity =item?.quantity?item?.quantity:1;

    useEffect(() => {

    }, [relod]);

    useEffect(() => {
        fetchProduct();
    }, []);

    if(isLoading) return <Loader/>
    if(!product) return <section className={`margin-up flex justify-center items-center`}>
        <p className={`text-darkgray font-bold text-4xl text-center`}>The product is not Available</p>
    </section>

    return (
        <section className={`grid lg:grid-cols-2 gap-12 bg-card/95 rounded-lg p-5`}>

            {/* Product Images */}
            <div className="space-y-4">
                <div className="bg-gray-200 rounded-xl shadow-sm">
                    <Image
                        src={product?.image_url}
                        unoptimized
                        loader={({ src }) => src}
                        className={`transition-all duration-500 rounded-xl ${
                            imgLoading ? "opacity-0" : "opacity-100"
                        }`}
                        onLoadingComplete={() => setImgLoading(false)}
                        onError={() => {
                            setImgError(true);
                            setImgLoading(false);
                        }}
                        alt={'image alt'}
                        width={700}
                        height={400}
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
                <div className={`text-darkgray`}>
                    <h1 className="text-3xl font-bold mb-2">
                        {product?.name}
                    </h1>
                    <div className="flex items-center gap-2 text-xl font-semibold ">
                        $224.90
                        <span className="text-sm text-gray-500 line-through">${product?.price?product?.price:'900'}</span>
                        <span className="text-sm font-medium text-primary bg-white px-2 py-1 rounded">
                            {product?.discount}% OFF
                        </span>
                    </div>
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">4.8 (128 reviews)</span>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-4 text-Fsecondary">
                    <p >
                        {product?.description}
                    </p>
                    <p className=" text-sm">
                        Perfect for athletic activities or casual wear, this sweatshirt combines fashion with
                        functionality. Made from high-quality materials, it offers excellent performance for
                        all your activities.
                    </p>
                </div>

                <Separator />

                {/* Categories & brands */}
                {
                    product.categories?<>
                    <div className="space-y-4">
                        <div className="flex items-center text-darkgray">
                            <h3 className="font-semibold">Categories</h3>
                        </div>
                        <div className="flex gap-2 text-darkgray">
                            {product.categories?.map((category:Category) => (
                                <button
                                    key={category.id}
                                    className="p-2 border bg-darkgray text-font  border-mutedgray/80 rounded-lg hover:border-mutedgray transition-colors font-medium"
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator />
                </>:""
                }

                {
                    product.brands?<>
                        <div className="space-y-4">
                            <div className="flex items-center text-darkgray">
                                <h3 className="font-semibold">Brand:</h3>
                            </div>
                            <div className="flex gap-2 text-darkgray">
                                <button
                                    key={product.brands.id}
                                    className="p-2 border bg-darkgray text-font border-mutedgray/80 rounded-lg hover:border-mutedgray transition-colors font-medium"
                                >
                                    {product.brands.name}
                                </button>

                            </div>

                        </div>

                        <Separator />
                    </>:''
                }
                {/* Material Info */}
                <div className="space-y-3 text-darkgray">
                    <h3 className="font-semibold">Material & Care</h3>
                    <div className="bg-white/20 p-4 rounded-lg">
                        <p className="text-sm text-Fsecondary">
                            <span className="font-medium">50% organic cotton, 50% recycled polyester fleece</span>
                        </p>
                        <p className="text-sm text-Fsecondary mt-1">
                            Machine wash cold, tumble dry low. Do not bleach.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex items-center  border border-gray-300 rounded-lg">
                            <button className="px-4 py-3 text-darkgray hover:bg-gray-200 rounded-s-lg cursor-pointer"
                                    onClick={() => handleQuantityChange(item?.id?item?.id:'', quantity - 1)}
                                    disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-6 py-3 text-darkgray ">{quantity}</span>
                            <button className="px-4 py-3 text-darkgray hover:bg-gray-200 rounded-e-lg cursor-pointer"
                                    value={quantity}
                                    onClick={() => handleQuantityChange(item?.id?item?.id:'', quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <Button className="flex-1 bg-primary hover:bg-primary/80 cursor-pointer" onClick={handleAddToCart}>
                            <ShoppingBag className="sm:w-4 h-4 ms-2" />
                            Add to Cart
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    )
}
export default ProductDetails
