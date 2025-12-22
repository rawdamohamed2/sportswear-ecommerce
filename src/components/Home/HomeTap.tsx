'use client'
import React, {useEffect, useState} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import NewArrivalProducts from "@/components/Home/NewArrivalProducts";
import {Product} from "@/types";
import {ProductService} from "@/lib/services/products";
import {toast} from "sonner";
import Loader from "@/components/Loader";
const HomeTap = () => {
    const [IsLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [featuredproducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newarrproducts, setNewarrivalProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const products = await ProductService.getProducts();
            setProducts(products);
            setFeaturedProducts(products.slice(0,10));
            setNewarrivalProducts(products.slice(10,20));
        } catch (error) {
            setError(`Error fetching orders: ${error}`);
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    if(IsLoading) return <Loader/>
    if(products && products.length < 0) return <Loader/>
    return (
        <div className={`container mx-auto py-6`}>
            <h1 className={`text-darkgray text-2xl font-bold pb-3`}>Products</h1>
            {error?<div className={`text-xl my-5`}></div>:''}
            <Tabs defaultValue="FeaturedProducts" className=" w-full text-darkgray" >
                <TabsList className={`bg-transparent`}>
                    <TabsTrigger value="FeaturedProducts" className={`text-darkgray text-lg font-semibold`}>Featured Products </TabsTrigger>
                    <TabsTrigger value="NewArrivals" className={`text-darkgray text-lg font-semibold`}>New Arrivals</TabsTrigger>
                </TabsList>
                <TabsContent value="FeaturedProducts">
                    <FeaturedProducts  products={featuredproducts}/>
                </TabsContent>
                <TabsContent value="NewArrivals">
                    <NewArrivalProducts products={newarrproducts}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default HomeTap
