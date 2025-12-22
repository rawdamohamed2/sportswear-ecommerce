'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OrderStat, OrderStatus } from '@/types';
import {
    User,
    Package,
    DollarSign,
    Truck,
    MapPin,
    ShoppingBag,
} from 'lucide-react';
import { format } from 'date-fns';

interface OrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: OrderStat | null;
    onSave: (updatedOrder: OrderStat) => void;
}

export function OrderDialog({
                                open,
                                onOpenChange,
                                order,
                                onSave,
                            }: OrderDialogProps) {
    const [status, setStatus] = useState<OrderStatus>('pending');
    const [notes, setNotes] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    useEffect(() => {
        if (order) {
            setNotes('');
            setTrackingNumber('');
            setStatus(order?.status);
        } else {
            setStatus('pending');
            setNotes('');
            setTrackingNumber('');
        }
    }, [order]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'PPpp');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (order) {
            const updatedOrder = {
                ...order,
                status,
                notes,
                tracking_number: trackingNumber,
                updated_at: new Date().toISOString(),
            };
            onSave(updatedOrder);
        }
    };

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order #{order.id.slice(-8)} • {formatDate(order.created_at)}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4" />
                                    Customer Information
                                </Label>
                                <div className="space-y-2 p-3 bg-gray-50 rounded-md">
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
                                            <p className="text-xs text-gray-500">
                                                {order.user?.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm">
                                        Customer ID: <code className="text-xs">{order.user_id}</code>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4" />
                                    Payment Information
                                </Label>
                                <div className="space-y-2 p-3 bg-gray-50 rounded-md">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Method:</span>
                                        <Badge variant="outline">
                                            {order.payment_method.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total Amount:</span>
                                        <span className="font-semibold">
                                            {formatCurrency(order.total_price)}
                                        </span>
                                    </div>
                                    {order.payment_status && (
                                        <div className="flex justify-between">
                                            <span className="text-sm">Payment Status:</span>
                                            <Badge
                                                variant={
                                                    order.payment_status === 'paid'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {order.payment_status}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    Shipping Address
                                </Label>
                                {order.address ? (
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="text-sm text-darkgray">
                                            {order?.address}
                                        </p>
                                        {order.address.phone && (
                                            <p className="text-sm mt-1">
                                                Phone: {order.address.phone}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
                                        No address provided
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                                    <Truck className="h-4 w-4" />
                                    Shipping & Tracking
                                </Label>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Tracking number"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="border-gray-400"
                                    />
                                    {order.shipping_method && (
                                        <div className="text-sm p-2 bg-gray-50 rounded">
                                            Method: {order.shipping_method}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                            <ShoppingBag className="h-4 w-4" />
                            Order Items ({order.order_items?.length || 0})
                        </Label>
                        <div className="border rounded-md">
                            {order.order_items && order.order_items.length > 0 ? (
                                <div className="divide-y">
                                    {order.order_items.map((item, index) => (
                                        <div key={index} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={item.products?.image_url}
                                                        alt={item.products?.name}
                                                    />
                                                    <AvatarFallback>
                                                        <Package className="h-5 w-5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {item.products?.name || 'Product'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.quantity} × {formatCurrency(item.products?.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="font-semibold">
                                                {formatCurrency(item.products?.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No items in this order
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Status & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 ">
                            <div>
                                <Label htmlFor="status">Order Status</Label>
                                <Select value={status} onValueChange={(value: OrderStatus) => setStatus(value)}>
                                    <SelectTrigger className="border-gray-400 my-3">
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
                            </div>

                            <div>
                                <Label>Order Timeline</Label>
                                <div className="space-y-2 p-3 bg-gray-50 rounded-md my-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Created:</span>
                                        <span>{formatDate(order.created_at)}</span>
                                    </div>
                                    {order.updated_at && order.updated_at !== order.created_at && (
                                        <div className="flex justify-between text-sm">
                                            <span>Last Updated:</span>
                                            <span>{formatDate(order.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="notes">Order Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about this order..."
                                    className="min-h-[120px] border-gray-400 my-3"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Update Order
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}