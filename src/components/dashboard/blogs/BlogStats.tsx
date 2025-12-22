// import React from 'react';
// import { BlogStats as BlogStatsType } from '@/types';
// import {
//     FileText,
//     Eye,
//     Heart,
//     TrendingUp,
//     Calendar,
//     Users,
//     BarChart3
// } from 'lucide-react';
//
// interface BlogStatsProps {
//     stats: BlogStatsType;
// }
//
// export const BlogStats: React.FC<BlogStatsProps> = ({ stats }) => {
//     const statCards = [
//         {
//             title: 'Total Posts',
//             value: stats.total,
//             icon: FileText,
//             color: 'bg-blue-500',
//             textColor: 'text-blue-600',
//             bgColor: 'bg-blue-50'
//         },
//         {
//             title: 'Published',
//             value: stats.published,
//             icon: FileText,
//             color: 'bg-green-500',
//             textColor: 'text-green-600',
//             bgColor: 'bg-green-50'
//         },
//         {
//             title: 'Drafts',
//             value: stats.drafts,
//             icon: FileText,
//             color: 'bg-yellow-500',
//             textColor: 'text-yellow-600',
//             bgColor: 'bg-yellow-50'
//         },
//         {
//             title: 'Total Views',
//             value: stats.totalViews.toLocaleString(),
//             icon: Eye,
//             color: 'bg-purple-500',
//             textColor: 'text-purple-600',
//             bgColor: 'bg-purple-50'
//         },
//         {
//             title: 'Total Likes',
//             value: stats.totalLikes.toLocaleString(),
//             icon: Heart,
//             color: 'bg-pink-500',
//             textColor: 'text-pink-600',
//             bgColor: 'bg-pink-50'
//         },
//         {
//             title: 'Engagement Rate',
//             value: `${((stats.totalLikes / Math.max(stats.totalViews, 1)) * 100).toFixed(1)}%`,
//             icon: TrendingUp,
//             color: 'bg-indigo-500',
//             textColor: 'text-indigo-600',
//             bgColor: 'bg-indigo-50'
//         }
//     ];
//
//     return (
//         <div className="mb-8">
//             <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                     <BarChart3 className="w-6 h-6 mr-2" />
//                     Blog Analytics
//                 </h2>
//                 <div className="text-sm text-gray-500 flex items-center">
//                     <Calendar className="w-4 h-4 mr-1" />
//                     Last 30 days
//                 </div>
//             </div>
//
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//                 {statCards.map((stat, index) => (
//                     <div
//                         key={index}
//                         className={`${stat.bgColor} rounded-lg p-6 shadow-sm border`}
//                     >
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                                 <p className={`text-2xl font-bold ${stat.textColor} mt-2`}>
//                                     {stat.value}
//                                 </p>
//                             </div>
//                             <div className={`${stat.color} p-3 rounded-full`}>
//                                 <stat.icon className="w-6 h-6 text-white" />
//                             </div>
//                         </div>
//                         <div className="mt-4">
//                             <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
//                                 <div
//                                     className={`h-full ${stat.color} rounded-full`}
//                                     style={{ width: '75%' }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//
//             {/* Recent Posts */}
//             <div className="mt-8 bg-white rounded-lg shadow p-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     <Users className="w-5 h-5 mr-2" />
//                     Recent Activity
//                 </h3>
//                 <div className="space-y-4">
//                     {stats.recentPosts.slice(0, 5).map((post) => (
//                         <div
//                             key={post.id}
//                             className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
//                         >
//                             <div className="flex items-center">
//                                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
//                   <span className="text-blue-600 font-semibold">
//                     {post.icon_name || '📝'}
//                   </span>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-medium text-gray-900">{post.title}</h4>
//                                     <p className="text-sm text-gray-500">
//                                         {new Date(post.created_at).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center space-x-4">
//                                 <div className="flex items-center text-sm text-gray-500">
//                                     <Eye className="w-4 h-4 mr-1" />
//                                     {post.views || 0}
//                                 </div>
//                                 <div className="flex items-center text-sm text-gray-500">
//                                     <Heart className="w-4 h-4 mr-1" />
//                                     {post.likes || 0}
//                                 </div>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                     post.status === 'published'
//                                         ? 'bg-green-100 text-green-800'
//                                         : 'bg-yellow-100 text-yellow-800'
//                                 }`}>
//                   {post.status}
//                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };