'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OrderStat, OrderItemStat, OrderStatus } from '@/types/index';
import {
    MoreVertical,
    Eye,
    Edit,
    Truck,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    User,
    ShoppingBag,
    DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';

interface OrdersTableProps {
    orders: OrderStat[];
    onEdit: (order: OrderStat) => void;
    onView: (order: OrderStat) => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function OrdersTable({
                                orders,
                                onEdit,
                                onView,
                                onDelete,
                                onUpdateStatus,
                            }: OrdersTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    };

    const getStatusBadge = (status: OrderStatus) => {
        const statusConfig = {
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: Clock,
            },
            processing: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-200',
                icon: Package,
            },
            shipped: {
                bg: 'bg-purple-100',
                text: 'text-purple-800',
                border: 'border-purple-200',
                icon: Truck,
            },
            delivered: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: CheckCircle,
            },
            cancelled: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: XCircle,
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge
                variant="outline"
                className={`${config.bg} ${config.text} ${config.border} border-transparent`}
            >
                <Icon className="h-3 w-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getOrderItemsPreview = (items: OrderItemStat[] | null) => {
        if (!items || items.length === 0) return 'No items';

        if (items.length === 1) {
            return `${items[0].quantity}x ${items[0].product?.name || 'Product'}`;
        }

        return `${items.length} items`;
    };

    const getPaymentMethodBadge = (method: string) => {
        return (
            <Badge variant="outline" className="text-xs">
                {method.toUpperCase()}
            </Badge>
        );
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <ShoppingBag className="h-12 w-12 text-gray-300" />
                                    <p className="text-lg font-medium">No orders found</p>
                                    <p className="text-sm">No orders match your filters</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help">
                                                    #{order.id.slice(-8)}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{order.id}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-blue-50 text-blue-600">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {order.user?.name || 'Customer'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.user?.email || order.user_id?.slice(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="text-sm">
                                        {getOrderItemsPreview(order.order_items?order.order_items:[])}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="font-semibold">
                                        {formatCurrency(order.total_price)}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    {getPaymentMethodBadge(order.payment_method)}
                                </TableCell>

                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value: OrderStatus) =>
                                            onUpdateStatus(order.id, value)
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-[130px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>

                                <TableCell>
                                    <div className="text-sm">
                                        {formatDate(order.created_at)}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => onView(order)}
                                                className="cursor-pointer"
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => onEdit(order)}
                                                className="cursor-pointer"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Order
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onDelete(order.id)}
                                                className="cursor-pointer text-red-600"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" />
                                                Cancel Order
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}