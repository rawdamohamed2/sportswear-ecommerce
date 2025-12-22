
import React from 'react'
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductDetails from "@/components/products/ProductDetails";


const Page = () => {

    return (
        <section className=" min-h-screen ">
            <div className="container mx-auto px-4 py-8 margin-up">
                <ProductDetails/>
                {/* Related Products */}
                <div className="mt-16">
                    <RelatedProducts />
                </div>
            </div>
        </section>
    )
}
export default Page
