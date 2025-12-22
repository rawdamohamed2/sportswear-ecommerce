import React from 'react';
import { Blog } from '@/types';
import {
    Edit,
    Trash2,
    Eye,
    Calendar,
    User,
    Tag,
} from 'lucide-react';

interface BlogTableProps {
    blogs: Blog[];
    onEdit: (blog: Blog) => void;
    onDelete: (id: string) => void;
    onView: (blog: Blog) => void;
}

export const BlogTable: React.FC<BlogTableProps> = ({
                                                        blogs,
                                                        onEdit,
                                                        onDelete,
                                                        onView
                                                    }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-semibold">
                                        📝
                                      </span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {blog.title}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {blog.body?blog.body:''.substring(0, 80)}...
                                    </div>
                                </div>
                            </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                {blog.author_id?blog.author_id:''.substring(0, 8)}...
                            </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(blog.created_at)}
                            </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                                {blog.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary"
                                    >
                                      <Tag className="w-3 h-3 mr-1" />
                                                        {tag}
                                    </span>
                                ))}
                                {blog.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                      +{blog.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onView(blog)}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                    title="View"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onEdit(blog)}
                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(blog.id)}
                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};