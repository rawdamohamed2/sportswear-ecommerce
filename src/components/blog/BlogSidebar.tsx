import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Tag, Filter } from 'lucide-react';
import {Blog, brand, Category, Product} from "@/types";
import {ProductService} from "@/lib/services/products";
import {toast} from "sonner";
import {useEffect, useState} from "react";

interface BlogSidebarProps {
    blogs:Blog[];
    blog :Blog|null;
}

export function BlogSidebar({ blogs , blog }: BlogSidebarProps) {
    const [categories, setCategories] = useState<Category[]>();
    const [brands, setBrands] = useState<brand[]>();
    const [isLoading, setIsLoading] = useState(false);

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
    useEffect(() => {
        getCategories();
    }, []);
    return (
        <div className="space-y-6">

            {/* Categories */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Categories
                    </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                    <div className="space-y-2">
                        {categories?.slice(0,10)?.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center  hover:bg-primary hover:text-font justify-between p-2 rounded-lg transition-colors"
                            >
                                <p
                                    className="hover:text-font "
                                >
                                    {category.name}
                                </p>
                            </div>
                        ))}
                        <Badge variant="secondary">{categories?.length}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Popular Tags
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <div className="flex flex-wrap gap-2 ">
                        {
                            blogs.length > 0? blogs.map((blog) => (
                                        blog.tags.slice(0,10).map((tag, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="rounded-full hover:bg-primary hover:text-font"
                                            >
                                                <p >
                                                    {tag}
                                                </p>
                                            </Button>
                                        ))
                                    ))
                                :blog?.tags.slice(0,10).map((tag, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="rounded-full hover:bg-primary hover:text-font"
                                    >
                                        <p >
                                            {tag}
                                        </p>
                                    </Button>
                                ))
                        }
                    </div>
                </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-white border-primary/20">
                <CardContent className="pt-6">
                    <div className="space-y-4 text-center">
                        <h3 className="font-bold text-lg">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">
                            Get the latest sportswear tips and exclusive offers
                        </p>
                        <div className="space-y-2">
                            <Input required placeholder="Your email" className="text-center border-mutedgray" />
                            <Button className="w-full" onClick={()=>{toast('Thank you to Subscribe us')}}>Subscribe</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}