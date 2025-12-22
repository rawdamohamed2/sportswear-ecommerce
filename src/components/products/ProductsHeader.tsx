import React from 'react'

import {Product} from '@/types';

import { Separator } from "@/components/ui/separator";
const ProductsHeader = ({products}:{products:Product[]}) => {
    return (
        <div className={`py-6 flex flex-col gap-4 px-2 sm:px-0`}>

            <div className={`flex sm:flex-row flex-col sm:justify-between justify-center gap-y-3`}>
                <h1 className={`text-darkgray font-bold text-4xl`}>Products</h1>

                <p className={`text-Fsecondary sm:text-start text-center font-medium text-sm`}>
                    showing 1-{products.length} of {products.length} products
                </p>

            </div>

            <Separator className={`bg-mutedgray my-2`}/>

        </div>
    )
}
export default ProductsHeader
