'use client'
import React, { useState} from 'react';
import ProductCard from "@/components/products/ProductCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {Product} from "@/types";
import Loader from '@/components/Loader'
const NewArrivalProducts =({products}:{products:Product[]}) => {
    const [products1,setproducts1] =useState(products.slice(0,4));
    const [products2 , setproducts2] =useState(products.slice(4,8));

    if (!products1 && !products2 )return <Loader/>

    return (
        <Carousel className={`overflow-hidden`}>
            <CarouselContent>
                <CarouselItem>
                    <div className={`grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 py-5 px-2 sm:px-0`}>

                        {
                            products1.map((product:Product,index:number) => (
                                <ProductCard  key={index} product={product}/>
                            ))
                        }
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className={`grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 py-5 px-2 sm:px-0`}>
                        {
                            products2.map((product:Product,index:number) => (
                                <ProductCard key={index} product={product}/>
                            ))
                        }
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className={`bg-primary text-font hover:bg-transparent hover:shadow-md hover:shadow-primary/50 hover:text-darkgray`}/>
            <CarouselNext className={`bg-primary text-font hover:bg-transparent hover:shadow-md hover:shadow-primary/50 hover:text-darkgray`}/>
        </Carousel>
    )
}
export default NewArrivalProducts
