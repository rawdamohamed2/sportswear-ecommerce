import React, { useState, useEffect } from 'react';
import {Blog, User} from '@/types';
import {
    Save,
    X,
    Image,
    Tag as TagIcon,
    Upload,
    Link,
    Type,
    FileText,
} from 'lucide-react';
import {useStore} from "@/lib/store/store";

interface BlogFormProps {
    blog?: Blog;
    onSubmit: (data: BlogFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
type BlogFormData = {
    id?: string;
    author_id: string;
    title: string;
    body: string | null;
    image_url: string;
    tags: string[];
}
const LUCIDE_ICONS = [
    'file-text', 'image', 'video', 'music', 'code', 'book', 'newspaper',
    'megaphone', 'trending-up', 'users', 'target', 'award', 'star',
    'heart', 'thumbs-up', 'message-square', 'share-2', 'calendar',
    'clock', 'map-pin', 'globe', 'cpu', 'wifi', 'battery', 'shield'
];

export const BlogForm: React.FC<BlogFormProps> = ({
                                                      blog,
                                                      onSubmit,
                                                      onCancel,
                                                      isSubmitting = false
                                                  }) => {
    const CurrentUser = useStore((s) => s.CurrentUser);
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        body: '',
        image_url: '',
        tags: [],
        author_id: CurrentUser?.id?CurrentUser.id:"",
    });

    const [tagInput, setTagInput] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (blog) {
            setFormData({
                id: blog.id,
                title: blog.title,
                body: blog.body,
                image_url: blog.image_url,
                tags: blog.tags || [],
                author_id: blog.author_id,
            });
            setPreviewImage(blog.image_url);
        }
    }, [blog]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleImageUrlChange = (url: string) => {
        setFormData({ ...formData, image_url: url });
        setPreviewImage(url);
    };

    return (
        <div className="fixed inset-0 bg-darkgray/70 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className={`mb-8`}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <Type className="w-4 h-4 mr-2" />
                                Title
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border text-darkgray border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Enter blog title"
                            required
                        />
                    </div>


                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <Image className="w-4 h-4 me-2" />
                                Featured Image URL
                            </div>
                        </label>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => handleImageUrlChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 text-darkgray rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <div className="mt-1 text-sm text-gray-500">
                                    <Link className="w-4 h-4 inline mr-1" />
                                    Enter a valid image URL
                                </div>
                            </div>
                            <div className="w-32 h-32 border rounded-lg overflow-hidden bg-gray-100">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setPreviewImage('')}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                Content
                            </div>
                        </label>
                        <textarea
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            rows={12}
                            className="w-full px-3 py-2 border border-gray-300 text-darkgray rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm"
                            placeholder="Write your blog content here (HTML supported)"
                            required
                        />
                        <div className="mt-1 text-sm text-gray-500">
                            Supports HTML formatting. Character count: {formData.body?.length}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center">
                                <TagIcon className="w-4 h-4 mr-2" />
                                Tags
                            </div>
                        </label>
                        <div className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                className="flex-1 px-3 py-2 border text-darkgray border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Add a tag and press Enter"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/50 text-primary"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-primary hover:text-primary/90"
                                    >
                                        ×
                                    </button>
                            </span>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center pt-6 border-t">
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 border bg-primaryHover border-gray-300 rounded-md text-font hover:bg-primaryHover/80"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? 'Saving...' : blog ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};