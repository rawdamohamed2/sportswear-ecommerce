"use client";

import {useEffect, useState} from 'react';
import { useRouter} from 'next/navigation';
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Activity,
    UserCheck,
    Book, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store/store';
import { UserService } from '@/lib/services/user';
import { ProductService } from '@/lib/services/products';
import { OrderService } from '@/lib/services/orders';
import { BlogService } from '@/lib/services/blog';
import Loader from '@/components/Loader';

export default function AdminDashboard() {
    const router = useRouter();
    const error = useStore((state) => state.error);
    const user = useStore((state) => state.user);
    const CurrentUser = useStore((s) => s.CurrentUser);
    const [loading, setLoading] = useState(false);


    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        blogs:0,
        revenue: 0,
        todaySales: 0,
        monthlySales: 0
    });

    const role = CurrentUser?.role;
    const loadStats = async () => {
        try {
            setLoading(true);

            const [userStats, productStats, orderStats,blogStats] = await Promise.all([
                UserService.getUserStats(),
                ProductService.getProductStats(),
                OrderService.getOrderStats(),
                BlogService.getBlogStats()
            ]);
            console.log(blogStats);
            setStats({
                users: userStats.total,
                products: productStats.total,
                orders: orderStats.totalOrders,
                blogs: blogStats.total,
                revenue: orderStats.monthlySales,
                todaySales: orderStats.todaySales,
                monthlySales: orderStats.monthlySales
            });
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (!role) {
        return <Loader />;
    }
    if (role !== "admin") {
        router.push('/');
        return null;
    }

    if (loading) {
        return (
            <Loader/>
        );
    }


    return (
        <section className="min-h-screen ">
            <div className="margin-up container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-darkgray">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.email}</p>
                </div>
                {error?<div className={`bg-red-300 p-2 my-3`}>{error}</div>:''}
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users}</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.blogs}</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products}</div>
                            <p className="text-xs text-muted-foreground">
                                +180.1% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.orders}</div>
                            <p className="text-xs text-muted-foreground">
                                +19% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>

                </div>

                {/* Tabs for different admin sections */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full h-full gap-2 grid-cols-2 sm:grid-cols-5 sm:w-fit">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="blogs">Blogs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Today&apos;s Sales</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold">${stats.todaySales.toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Sales today
                                            </p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-3xl font-bold">${stats.monthlySales.toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                This month&apos;s revenue
                                            </p>
                                        </div>
                                        <Activity className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => router.push('/admin/users')}>
                                    Manage Users
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="products">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => router.push('/admin/products')}>
                                    Manage Products
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => router.push('/admin/orders')}>
                                    Manage Orders
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="blogs">
                        <Card>
                            <CardHeader>
                                <CardTitle>Blog Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={() => router.push('/admin/blogs')}>
                                    Manage Blogs
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <div className="mt-8 ">
                    <h2 className="text-xl font-semibold mb-4 text-darkgray">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            className="h-auto py-6 bg-primary hover:bg-primary/90"
                            variant="outline"
                            onClick={() => router.push('/admin/products')}
                        >
                            <div className="flex flex-col items-center">
                                <Package className="h-8 w-8 mb-2" />
                                <span>Manage Product</span>
                            </div>
                        </Button>

                        <Button
                            className="h-auto py-6 bg-primary hover:bg-primary/90"
                            variant="outline"
                            onClick={() => router.push('/admin/orders')}
                        >
                            <div className="flex flex-col items-center">
                                <ShoppingCart className="h-8 w-8 mb-2" />
                                <span>View All Orders</span>
                            </div>
                        </Button>

                        <Button
                            className="h-auto py-6 bg-primary hover:bg-primary/90"
                            variant="outline"
                            onClick={() => router.push('/admin/users')}
                        >
                            <div className="flex flex-col items-center">
                                <UserCheck className="h-8 w-8 mb-2" />
                                <span>Manage Users</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}