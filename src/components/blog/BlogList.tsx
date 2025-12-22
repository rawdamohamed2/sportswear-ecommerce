import  BlogCard  from './BlogCard';
import { Blog } from '@/types/index';

interface BlogListProps {
    posts: Blog[];
}

export function BlogList({ posts }: BlogListProps) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No articles found</h3>
                <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filter to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
}