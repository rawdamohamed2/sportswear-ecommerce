'use client'
import React, {useEffect, useState} from 'react'
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import BlogCard from "@/components/blog/BlogCard";
import {BlogService} from "@/lib/services/blog";
import Loader from "@/components/Loader";
import {Blog} from "@/types";
const Blogsection = () => {
    const {getAllBlogs} = BlogService;
    const [blogs , setBlogs] = useState<Blog[]>();


    useEffect(()=>{
        async function getBlogs() {
            const results = await getAllBlogs();
            setBlogs(results);
        }
        getBlogs();
    },[]);
    console.log(blogs);
    if(!blogs){
        return <Loader/>
    }


    return (
        <div className={`container mx-auto pt-5 mb-10 px-2 sm:px-0`}>
            <div className={`flex justify-between items-center w-full mt-4 mb-9`}>
                <h1 className={`text-darkgray text-2xl font-bold`}>Lastest Updates</h1>
                <Link href={'/blog'} className={`text-darkgray text-md font-bold flex items-center sm:gap-2 gap-0`}>
                    See All Articles <FaArrowRightLong className={`mt-1 text-primary`}/>
                </Link>
            </div>

            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                {blogs.slice(0,3).map((blog) => (
                    <BlogCard
                        key={blog.id}
                        post={blog}
                    />
                ))}
            </div>
        </div>
    )
}
export default Blogsection
