import { CalendarDays, Clock, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {  Blog} from '@/types/index';
import { format } from 'date-fns';

interface BlogCardProps {
    post: Blog;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Card className="pt-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <div className="relative h-60 w-full">
                <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    unoptimized
                    loader={({ src }) => src}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <CardHeader>
                <Link href={`/blog/${post.id}`}>
                    <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-muted-foreground line-clamp-2 mt-2">
                    {post?.users?.email}
                </p>
            </CardHeader>

            <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs p-2 text-darkgray ">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="border-t pt-4 flex flex-col gap-y-4 items-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.users?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-5" />
                        <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>updated at: {format(new Date(post.updated_at), 'MMM dd, yyyy')}</span>
                    </div>
                </div>
                <Button asChild variant="outline" className={` hover:bg-primary/90 bg-primary transition-all duration-150 text-font`}>
                    <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}