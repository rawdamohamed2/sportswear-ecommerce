"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import BlogFeatureCard from "@/components/Home/BlogFeatureCard";
import { BlogService } from "@/lib/services/blog";
import Loader from "@/components/Loader";
import { Blog } from "@/types";

const bentoPositions = [
  "md:col-start-1 md:row-start-1 md:row-span-2",
  "md:col-start-2 md:row-start-1",
  "md:col-start-2 md:row-start-2",
  "md:col-start-3 md:row-start-1 md:row-span-2",
];

const BlogSection = () => {
  const { getAllBlogs } = BlogService;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getBlogs() {
      try {
        const results = await getAllBlogs();
        if (isMounted) setBlogs(results ?? []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getBlogs();
    return () => {
      isMounted = false;
    };
  }, [getAllBlogs]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center text-muted-foreground">
        Something went wrong while loading the articles; please try again later.
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="container mx-auto py-10 text-center text-muted-foreground">
        There are no blogs yet.
      </div>
    );
  }

  const featured = blogs.slice(0, 4);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-0 py-15">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-9">
        <h1 className="text-darkgray text-xl sm:text-2xl font-bold">
          Latest Updates
        </h1>
        <Link
          href="/blog"
          className="text-darkgray text-sm sm:text-md font-bold flex items-center gap-1.5 hover:text-primary transition-colors"
        >
          See All Articles <FaArrowRightLong className="mt-0.5 text-primary" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:grid-rows-[260px_260px]">
        {featured.map((blog, index) => (
          <BlogFeatureCard
            key={blog.id}
            post={blog}
            className={bentoPositions[index] ?? ""}
          />
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
