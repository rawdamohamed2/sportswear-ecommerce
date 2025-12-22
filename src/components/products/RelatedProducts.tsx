'use client'

import React, {useEffect, useState} from "react";
import {ProductService} from "@/lib/services/products";
import {toast} from "sonner";
import {Product} from "@/types";
import Loader from "@/components/Loader";
import ProductCard from "@/components/products/ProductCard";


export default function RelatedProducts() {
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const products = await ProductService.getProducts();
            setProducts(products);
        } catch (error) {
            setError(`Error fetching orders: ${error}`);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    if(isLoading) return <Loader/>;
    if(!products) return <Loader/>;
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-darkgray">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {products.slice(0,3).map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
    );
}