'use client'
import Image from 'next/image';
import { CalendarDays, Clock, Share2, Facebook, Twitter, Linkedin} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { format } from 'date-fns';
import Link from 'next/link';
import Loader from "@/components/Loader";
import {BlogService} from "@/lib/services/blog";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {Blog} from "@/types";



export default function Page() {
    const { slug } = useParams() as { slug: string };
    const { getBlogbyId } = BlogService;
    const [blog, setBlog] = useState<Blog | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const results = await getBlogbyId(slug);
                if (typeof results === "string") {
                    setError(results);
                } else {
                    setBlog(results);
                }
            } catch (err) {
                setError("Failed to fetch blog");
                console.error(err);
            }
        }

        fetchBlog();
    }, [slug]);

    if (error) return <div className={`min-h-screen flex justify-center items-center`}>
        <p>
            {error}
        </p>
    </div>;
    if (!blog) return <Loader />;

    console.log(blog);
    return (
        <section className="margin-up min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 py-12 text-darkgray">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Breadcrumb */}
                        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <span>/</span>
                            <Link href="/blog" className="hover:text-primary">Blog</Link>
                            <span>/</span>
                            <span className="text-foreground">{blog?.title}</span>
                        </nav>

                        {/* Article Header */}
                        <div className="mb-8">
                            {/*<Badge className="mb-4">{blog.category}</Badge>*/}
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">{blog?.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={''} />
                                        <AvatarFallback>{blog.users?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{blog.users?.name}</p>
                                        <p className="text-xs">{blog.users?.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{format(new Date(blog.created_at), 'MMMM dd, yyyy')}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Updated at: {format(new Date(blog.updated_at), 'MMMM dd, yyyy')}</span>
                                </div>
                            </div>

                            {/* Social Share */}
                            <div className="flex items-center justify-between  border-y">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className={`bg-primary hover:bg-primary/90` }>
                                        <Facebook className="h-4 w-4 font-bold " />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={`bg-primary hover:bg-primary/90` }>
                                        <Twitter className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={`bg-primary hover:bg-primary/90` }>
                                        <Linkedin className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={`bg-primary hover:bg-primary/90` }>
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="relative h-64 md:h-100 rounded-xl overflow-hidden mb-8">
                            <Image
                                src={blog.image_url}
                                alt={blog.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Article Content */}
                        <article className="prose prose-lg max-w-none mb-12">
                            <div dangerouslySetInnerHTML={{ __html: blog.body?blog.body:"" }} />
                        </article>

                        {/* Tags */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className={`bg-primaryHover text-font p-2`}>
                                        <Link href={`/blog/tag/${tag.toLowerCase()}`}>
                                            {tag}
                                        </Link>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator className="my-12" />

                        {/* Author Bio */}
                        <div className="bg-muted/40 rounded-xl md:p-6 p-4 mb-12 shadow-lg shadow-darkgray/50">
                            <div className="flex sm:flex-row flex-col items-start gap-4 w-full">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={''} />
                                    <AvatarFallback>{blog.users?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className={`w-full`}>
                                    <h3 className="md:text-xl text-lg font-bold mb-2">{blog.users?.email}</h3>
                                    <p className="text-muted-foreground mb-4">{blog.users?.role}</p>
                                    <p className="text-sm ">
                                        Expert in sportswear and athletic performance with over 10 years of experience
                                        helping athletes achieve their goals through proper gear selection and training.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <BlogSidebar
                            blogs={[]}
                            blog = {blog}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}


