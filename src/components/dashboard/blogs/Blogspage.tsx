'use client'
import React, {useEffect, useState} from 'react'
import {BlogService} from '@/lib/services/blog'
import {toast} from "sonner";
import {Blog} from '@/types'
import {BlogTable} from '@/components/dashboard/blogs/BlogTable';
import {BlogForm} from '@/components/dashboard/blogs/BlogForm';
import {
    Plus,
    Download,
    RefreshCw,
    Search,
    FileText
} from 'lucide-react';
import Loader from "@/components/Loader";

const mockBlogs: Blog[] = [
    {
        id: '',
        author_id: '6150f80d-974e-489a-bb00-90582b7d10e3',
        title: 'The Carbon Fiber Revolution in Running Shoes',
        body: 'Running shoes have transformed with carbon fiber plates...',
        image_url: 'https://example.com/images/running-shoes.jpg',
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-15T09:30:00Z',
        tags: ['running', 'shoes', 'technology', 'innovation'],
    },
    // Add more mock blogs...
];


type BlogFormData = {
    id?: string;
    author_id: string;
    title: string;
    body: string | null;
    image_url: string;
    tags: string[];
}
const Blogspage = () => {
    const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [Relod, setRelod] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const blogs  = await BlogService.getAllBlogs();
            setBlogs(blogs);
            // setFilteredOrders(blogs);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [Relod]);

    const handleCreateBlog =  () => {
        setEditingBlog(undefined);
        setShowBlogForm(true);
    };

    const handleSearchBlog = async (searchTerm:string) => {
        try {
            const blogs  = await BlogService.SearchBlogByTitle(searchTerm);
            typeof blogs == 'string'
                ?toast(blogs)
                :setBlogs(blogs);

            setSearchTerm('');
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error( error?.message || 'Something went wrong');
            } else {
                toast.error(  'Something went wrong');
            }
        }
    };

    const handleEditBlog = (blog: Blog) => {
        setEditingBlog(blog);
        setShowBlogForm(true);
    };

    const handleDeleteBlog = async (id: string) => {
        const error  = await BlogService.DeleteBlog(id);
        console.log(error);
        toast.error(error);
        setRelod(!Relod);
    };

    const handleViewBlog = (blog: Blog) => {
        window.open(`/blog/${blog.id}`, '_blank');
    };

    const handleSubmitBlog = async (formData: BlogFormData) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (editingBlog) {
                // Update existing blog
                const ExitingBlog: BlogFormData = {
                    ...formData,
                };
                const blog  = await BlogService.UpdateBlog(formData?.id?formData.id:'',ExitingBlog);
                if(typeof(blog)=="string"){
                    setError(`Error creating blog: ${blog}`);
                }
                toast('the blog updated successfully');
            }
            else {
                const newBlog: BlogFormData = {
                    ...formData,
                };
                const blog  = await BlogService.createBlog(newBlog);
                if(typeof(blog)=="string"){
                    setError(`Error creating blog: ${blog}`);
                }
                toast('the blog added successfully');
            }
            setRelod(!Relod);
            setShowBlogForm(false);
            setEditingBlog(undefined);
        } catch (error) {
            console.error('Error saving blog:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };
    const handleReset = async () => {
        fetchBlogs();
    };

    if(isLoading)return <Loader/>;
    if(!blogs)return <section className="margin-up container mx-auto px-4 py-10 text-darkgray flex justify-center items-center min-h-screen">
        <p className="text-center text-darkgray text-2xl font-bold py-20">There is no blogs</p>
    </section>

    return (
        <section>
            <div className="margin-up flex-1 overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 text-darkgray">
                        <div>
                            <h1 className="text-3xl font-bold text-darkgray">
                                   Blog Management
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Manage your blog content, analyze performance, and engage with readers
                            </p>
                        </div>

                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <button
                                onClick={refreshData}
                                disabled={isLoading}
                                className="flex items-center px-4 py-2 bg-primaryHover rounded-lg hover:bg-primaryHover/90 text-font disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={handleCreateBlog}
                                className="flex items-center px-4 py-2 bg-primary rounded-lg hover:bg-primary/90  text-font"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Blog
                            </button>
                        </div>
                    </div>

                    {/* Search  */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search blogs by title, content, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-darkgray focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <button onClick={()=>{handleSearchBlog(searchTerm)}}  className={`bg-primary px-6 py-2 rounded-lg hover:bg-primary/90`}>Search</button>
                            <button onClick={()=>{handleReset()}}  className={`border-2 border-primaryHover px-6 py-2 rounded-lg text-primaryHover hover:bg-primaryHover/20 hover:border-primaryHover/20 `}>Reset</button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                All ({blogs.length})
                            </button>
                        </div>
                    </div>


                    {/* Blog Table */}

                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {blogs.length} of {blogs.length} blogs
                        </div>
                        <BlogTable
                            blogs={blogs}
                            onEdit={handleEditBlog}
                            onDelete={handleDeleteBlog}
                            onView={handleViewBlog}
                        />
                    </>


                    {/* Empty State */}
                    { blogs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FileText className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                No blogs found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first blog post'}
                            </p>
                            <button
                                onClick={handleCreateBlog}
                                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Blog
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {showBlogForm && (
                <BlogForm
                    blog={editingBlog}
                    onSubmit={handleSubmitBlog}
                    onCancel={() => {
                      setShowBlogForm(false);
                        setEditingBlog(undefined);
                    }}
                     isSubmitting={isLoading}
                 />
             )}
        </section>
    )
}
export default Blogspage
