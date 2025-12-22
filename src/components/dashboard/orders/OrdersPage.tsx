'use client';

import { useState, useEffect } from 'react';
import { OrdersTable } from '@/components/dashboard/orders/orders-table';
import { OrderDialog } from '@/components/dashboard/orders/order-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { OrderStat, OrderStatus,orderResponse } from '@/types';
import { OrderService } from '@/lib/services/orders';
import { Search, Filter,Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderStat[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderStat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderStat | null>(null);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
    });

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);

    // Apply filters whenever filters or orders change
    useEffect(() => {
        applyFilters();
    }, [searchTerm, statusFilter, dateFilter, orders]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const {orders}  = await OrderService.getAllOrders();
            setOrders(orders);
            setFilteredOrders(orders);
        } catch (error) {
            setError(`Error fetching orders: ${error}`);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const statsData = await OrderService.getOrderStats();
            setStats({
                total: statsData.totalOrders,
                pending: statsData.pendingOrders,
                processing: 0,
                shipped: 0,
                delivered: statsData.completedOrders,
                cancelled: 0,
                totalRevenue: statsData.monthlySales,
            });
        } catch (error) {
            setError(`Error fetching stats: ${error}`);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(term) ||
                order.user_id.toLowerCase().includes(term) ||
                order.order_items?.some(item =>
                    item.product_id?.includes(term)
                )
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Apply date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (dateFilter) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= startDate;
            });
        }

        setFilteredOrders(filtered);
    };

    const handleEditOrder = (order: OrderStat) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleViewOrder = (order: OrderStat) => {
        // Navigate to order details page or open details modal
        setError(`View order: ${order}`);
        toast.info(`Viewing order ${order.id}`);
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return;
        }

        try {
            await OrderService.cancelOrder(orderId);
            toast.success('Order cancelled successfully');
            fetchOrders();
            fetchStats();
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to cancel order');
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await OrderService.updateOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
            fetchStats();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleExportOrders = () => {
        // Implement export functionality
        toast.info('Export feature coming soon');
    };
    console.log(orders);
    if(!orders) return <section className={`flex justify-center margin-up`}>
        <p className={`text-4xl text-darkgray text-center font-bold`}>
            There are no orders.
        </p>
    </section>;
    return (
        <section className="margin-up container mx-auto p-6">
            {error?<div className={`my-3 p-3 rounded-xl`}>{error}</div>:''}
            <div className="flex flex-col space-y-6 ">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-darkgray">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground">
                            Manage and track customer orders
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={fetchOrders} variant="outline" className={`bg-primaryHover text-font hover:bg-primaryHover/90 hover:text-font`}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Orders
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-blue-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                All time orders
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-yellow-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.pending}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting processing
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Delivered
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-green-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.delivered}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Successfully delivered
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Revenue
                            </CardTitle>
                            <div className="h-4 w-4 rounded-full bg-purple-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                ${stats.totalRevenue.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6 sm:px-0 px-3">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search orders, products, or customer ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={dateFilter} onValueChange={setDateFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Date Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">Last 7 Days</SelectItem>
                                        <SelectItem value="month">Last 30 Days</SelectItem>
                                        <SelectItem value="year">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order List</CardTitle>
                        <CardDescription>
                            {filteredOrders.length} orders found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <OrdersTable
                                orders={filteredOrders}
                                onEdit={handleEditOrder}
                                onView={handleViewOrder}
                                onDelete={handleDeleteOrder}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Dialog for Edit */}
            <OrderDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                order={selectedOrder}
                onSave={async (updatedOrder) => {
                    try {
                        await OrderService.updateOrderStatus(
                            updatedOrder.id,
                            updatedOrder.status
                        );
                        toast.success('Order updated successfully');
                        fetchOrders();
                        fetchStats();
                        setIsDialogOpen(false);
                    } catch (error) {
                        console.error('Error updating order:', error);
                        toast.error('Failed to update order');
                    }
                }}
            />
        </section>
    );
}