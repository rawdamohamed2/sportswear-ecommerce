'use client'
import React, {useEffect, useState} from 'react';

import ProductCard from "@/components/products/ProductCard";

import {Brand, brand, Category, Product} from '@/types';
import ProductsHeader from "@/components/products/ProductsHeader";

import PaginationProducts from "@/components/products/PaginationProducts";
import {ProductService} from "@/lib/services/products";
import {toast} from "sonner";
import Loader from "@/components/Loader";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTrigger} from "@/components/ui/sheet";
import {Settings2, X} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";


const Page =  () => {
    const [categories, setCategories] = useState<Category[]>();
    const [brands, setBrands] = useState<brand[]>();
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFilter = (filter: string,checked: boolean | "indeterminate") => {
        setSelectedBrands((prev) =>
            checked
                ? [...prev, filter]
                : prev.filter((b) => b !== filter)
        );
    };

    const handleCategories = (Category: string,checked: boolean | "indeterminate") => {
        setSelectedCategories((prev) =>
            checked
                ? [...prev, Category]
                : prev.filter((b) => b !== Category)
        );
    };

    const getCategories  = async () => {
        setIsLoading(true);
        try {
            const result = await  ProductService.getAllCategories();
            const categories = result as Category[];
            setCategories(categories);
            const brands = await ProductService.getAllBrands();
            const brand = brands as brand[];
            setBrands(brand);
        }
        catch (error) {
            if (error instanceof Error) {
                toast(error.message);
            } else {
                toast('Something went wrong');
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    const getFilteredProducts= async ()=>{
        try {
            const products = await ProductService.getFilteredProducts(
                selectedBrands,
                selectedCategories
            );
            setProducts(products);
            console.log(products)
        } catch (error) {
            toast("Failed to filter products");
        }
    };

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
        getCategories();
    }, []);
    useEffect(() => {
        if (selectedBrands.length === 0 && selectedCategories.length === 0) return;
        getFilteredProducts();
    }, [selectedBrands, selectedCategories]);

    if(isLoading) return <Loader/>;
    if (!products) return <Loader/>;
    return (
        <section className="container mx-auto text-darkgray margin-up">
            {error?<div className={`bg-red-200 p-2 rounded-xl`}>{error}</div>:''}

            <aside className={`font-bold`}>
                <Sheet>
                    <SheetTrigger className={`flex flex-col absolute sm:top-50 top-4/12 sm:left-1 left-0 bg-primary text-font z-20`}>
                        <span className={`p-2 active:bg-darkgray hover:bg-darkgray`}><Settings2 className={`mx-auto`}/></span>
                    </SheetTrigger>
                    <SheetContent className={`transition-all duration-200 overflow-auto`}>
                        <h1 className={`logo text-3xl p-2 text-center text-primary`}>SPORTSW</h1>
                        <SheetHeader className={`py-0 my-0`}>
                            <div>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1" className={`text-darkgray py-0 my-0`}>
                                        <AccordionTrigger>Categories</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className={`list flex flex-col gap-4`}>
                                                {
                                                    categories?.map((category:Category)=>{
                                                        return  <li key={category.id} className={`flex items-center space-x-2`}>
                                                            <Checkbox id={category.id}
                                                                      value={category.name}
                                                                      className={`checkbox`}
                                                                      checked={selectedCategories.includes(category.name)}
                                                                      onCheckedChange={(checked) =>
                                                                          handleCategories(category.name, checked)
                                                                      }
                                                            />
                                                            <Label htmlFor={category.id}>{category.name}</Label>
                                                        </li>
                                                    })
                                                }

                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </SheetHeader>
                        <SheetHeader className={`py-0 my-0`}>
                            <div>
                                <Accordion type="single" collapsible className={`py-0 my-0`}>
                                    <AccordionItem value="item-1" className={`text-darkgray`}>
                                        <AccordionTrigger>Brands</AccordionTrigger>
                                        <AccordionContent>
                                            <ul className={`list flex flex-col gap-4`}>
                                                {brands?.map((brand:Brand)=>{
                                                    return <li key={brand.id} className={`flex items-center space-x-2`}>
                                                        <Checkbox id={brand.id}
                                                                  checked={selectedBrands.includes(brand.name)}
                                                                  onCheckedChange={(checked) =>
                                                                      handleFilter(brand.name, checked)
                                                                  } value={brand.name} className={`checkbox`}
                                                        />
                                                        <Label htmlFor={brand.id}>{brand.name}</Label>
                                                    </li>
                                                })}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </SheetHeader>
                        <SheetHeader className={`py-0 my-0`}>
                            <SheetDescription>
                                <button onClick={fetchProducts} className={`flex gap-2 text-darkgray hover:text-primary text-md font-semibold border-b border-darkgray hover:border-primary cursor-pointer`}>
                                    <X className={`w-[20px]`}/>CLEAR ALL FILTER
                                </button>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </aside>

            <ProductsHeader products={products}/>

            <div className="my-5 grid grid-cols-1 md:grid-cols-4 gap-6 px-2 sm:px-0">
                {products.map((product:Product,index:number) => {
                    return <ProductCard key={index} product={product} />;
                })}
            </div>
            <PaginationProducts/>
        </section>

)
}
export default Page;
