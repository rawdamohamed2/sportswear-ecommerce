'use client'
import { BlogList } from '@/components/blog/BlogList';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { Separator } from '@/components/ui/separator';
import {BlogService} from '@/lib/services/blog';
import {useEffect, useState} from "react";
import Loader from "@/components/Loader";
import {Blog} from "@/types";

export default function Page() {

    const {getAllBlogs} = BlogService;
    const [blogs , setBlogs] = useState<Blog[]>();

    async function getBlogs() {
        const results:Blog[] = await getAllBlogs();
        setBlogs(results);
    }
    useEffect(()=>{
        getBlogs();
    },[]);

    if(blogs?.length === 0){
        return <Loader/>
    }

    return (
        <section className="margin-up min-h-screen bg-gradient-to-b from-background to-muted/20 text-darkgray">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Sportswear <span className="text-primary">Blog</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Expert tips, latest trends, and performance insights for athletes and fitness enthusiasts
                    </p>
                </div>


                <Separator className="my-12" />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Blog Posts */}
                    <div className="lg:col-span-3 col-span-1">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
                            <p className="text-muted-foreground">
                                Stay updated with the latest in sportswear technology, training tips, and fitness trends.
                            </p>
                        </div>

                        <BlogList posts={blogs?blogs:[]} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <BlogSidebar
                            blogs={blogs?blogs:[]}
                            blog={null}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
