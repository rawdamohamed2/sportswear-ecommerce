import { CalendarDays, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

interface FeaturedPostProps {
    post: BlogPost;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
    return (
        <Card className="overflow-hidden">
            <div className="md:flex">
                <div className="md:w-2/3 relative h-64 md:h-auto">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>

                <CardContent className="md:w-1/3 p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                        <Badge className="bg-primary hover:bg-primary">
                            Featured
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                            {post.category}
                        </Badge>

                        <Link href={`/blog/${post.slug}`}>
                            <h2 className="text-3xl font-bold hover:text-primary transition-colors mt-2">
                                {post.title}
                            </h2>
                        </Link>

                        <p className="text-muted-foreground line-clamp-3">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                    <Image
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">{post.author.name}</p>
                                    <p className="text-xs">{post.author.role}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{post.readTime} min read</span>
                            </div>
                        </div>

                        <Button asChild className="mt-4">
                            <Link href={`/blog/${post.slug}`}>Read Full Article</Link>
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}