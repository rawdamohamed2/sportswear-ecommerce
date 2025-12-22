import { supabase } from '../supabase/supabase';
import {Blog, BlogFormData} from '@/types';
import {toast} from "sonner";
export class BlogService {
    static async getAllBlogs() {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select(`
                  *,
                  users (*)`
            );
        if(error) toast(error.message) ;
        const formattedProducts: Blog[] = (blogs ?? []).map((blog) => ({
            ...blog,
        }));

        return formattedProducts;
    };

    static async getBlogbyId(id: string) {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select(`
                  *,
                  users (*)`
            )
            .eq('id', id)
            .single();
        if(error) return error.message;
        return blogs;
    };

    static async getBlogStats() {
        const { count: totalBlogs } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true });

        // Get new users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: newBlogsThisMonth } = await supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfMonth.toISOString());

        return {
            total: totalBlogs || 0,
            newThisMonth: newBlogsThisMonth || 0
        };
    };

    static async createBlog(blog: BlogFormData) {
        const { data, error } = await supabase
            .from('blogs')
            .insert([
                {
                    title: blog.title,
                    body: blog.body,
                    image_url: blog.image_url,
                    tags: blog.tags,
                    author_id: blog.author_id
                },
            ])
            .select();
        if(error) return error.message;
        return data;
    };
    static async UpdateBlog(id: string, blog: BlogFormData) {
        const { data, error } = await supabase
            .from('blogs')
            .update({
                title: blog.title,
                body: blog.body,
                image_url: blog.image_url,
                tags: blog.tags,
                author_id: blog.author_id
            })
            .eq('id', id)
            .select();
        if(error) return error.message;
        return data;
    };
    static async DeleteBlog(id: string) {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id)
        if(error) return error.message;
        return 'the Blog deleted successfully.';
    };
    static async SearchBlogByTitle(title: string) {
        const { data: blogs, error } = await supabase
            .from('blogs')
            .select(`
                  *,
                  users (*)`
            )
            .ilike('title', `${title}%`);

        if(error) return error.message;
        return blogs as Blog[];
    };
}
