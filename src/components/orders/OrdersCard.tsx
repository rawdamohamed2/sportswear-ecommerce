'use client'
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    CreditCard,
    MapPin,
    Calendar,
    ShoppingBag,
    User,
    Hash,
    Home,
    Phone,
    Tag,
    Box,
    FileText,
    ShoppingCart,
    Receipt,
    Globe, LucideIcon, XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from "next/image";
import { Order,OrderItem} from '@/types';


interface StatusConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
}
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered'|'cancelled';

const statusConfig: Record<OrderStatus,StatusConfig> = {
    pending: {
        label: 'Pending',
        icon: Clock,
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-200'
    },
    processing: {
        label: 'Processing',
        icon: Package,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-200'
    },
    shipped: {
        label: 'Shipped',
        icon: Truck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-200'
    },
    delivered: {
        label: 'Delivered',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200'
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-200',
    }
};

const OrdersCard = ({order}:{order:Order}) => {

    // Parse address
    const parseAddress = (address: string) => {
        const lines = address.split('\n');
        return {
            name: lines[0],
            street: lines[1],
            cityStateZip: lines[2],
            country: lines[3],
            phone: lines[4]?.replace('Phone: ', '')
        };
    };

    const address = parseAddress(order?.address);
    // Format functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            minimumFractionDigits: 2,
            currency: 'EGP'
        }).format(price);
    };

    const getPaymentMethodDisplay = (method: string) => {
        const methods: Record<string, string> = {
            'credit_card': 'Credit Card',
            'paypal': 'PayPal',
            'cash_on_delivery': 'Cash on Delivery',
            'bank_transfer': 'Bank Transfer'
        };
        return methods[method] || method.replace('_', ' ').toUpperCase();
    };

    const state = order.status as OrderStatus;
    const statusInfo = statusConfig[state] || statusConfig.pending;
    const StatusIcon = statusInfo.icon;
    const totalItems = order.order_items?.length;

    // Calculate subtotal
    let subtotal = order.order_items?.reduce((sum:number, item) => {
        return sum + (item.unit_price * item.quantity);
    }, 0);
    subtotal = subtotal?subtotal:0;
    const tax = order.total_price - subtotal;
    const items:OrderItem[] = order.order_items?order.order_items:[];


    return (
        <section className="margin-up min-h-screen py-8">
            <div className="container mx-auto md:px-4 px-0">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-gray-900">
                                                Order Details
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Hash className="h-3 w-3" />
                                                <span className="font-mono">{order.id.toUpperCase()}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge className={`${statusInfo.bgColor} ${statusInfo.color} px-4 py-2 text-sm font-semibold`}>
                                        <StatusIcon className="h-4 w-4 mr-2" />
                                        {statusInfo.label}
                                    </Badge>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {formatPrice(order.total_price)}
                                        </div>
                                        <div className="text-sm text-gray-600">Total Amount</div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="sm:p-6 p-2">
                            {/* Order Info Grid */}
                            <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mb-8">
                                {/* Order Information */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Order Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Order Date</p>
                                            <p className="font-medium">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Order Number</p>
                                            <p className="font-mono text-sm">{order.id.slice(0, 15)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Customer ID</p>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <p className="font-mono text-sm">{order.user_id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Information */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Payment Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Payment Method</p>
                                            <p className="font-medium">{getPaymentMethodDisplay(order.payment_method)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total Amount</p>
                                            <p className="font-bold">{formatPrice(order.total_price)}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Shipping Address */}
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Shipping Address
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <Home className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">{address.name}</p>
                                                    <p className="text-sm text-gray-600">{address.street}</p>
                                                    <p className="text-sm text-gray-600">{address.cityStateZip}</p>
                                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        {address.country}
                                                    </p>
                                                </div>
                                            </div>
                                            {address.phone && (
                                                <div className="flex items-center gap-2 pt-2 border-t">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-medium">{address.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Items */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Order Items ({totalItems})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {items.map((item:OrderItem, index:number) => (
                                            <div key={item.id} className="flex md:flex-row flex-col items-start gap-4 sm:p-4 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="h-20 w-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 border">
                                                    {item.products?.image_url ? (
                                                        <Image
                                                            src={item.products.image_url}
                                                            alt={item.products.name}
                                                            unoptimized
                                                            width={200}
                                                            height={200}
                                                            className="h-full w-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 py-2">
                                                                {item.products?.name || `Product ${index + 1}`}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline" className="text-xs">
                                                                    <Box className="h-3 w-3 mr-1" />
                                                                    Qty: {item.quantity}
                                                                </Badge>
                                                                {item.products?.discount && item.products.discount > 0 && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <Tag className="h-3 w-3 mr-1" />
                                                                        {item.products.discount}% OFF
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="sm:text-end text-center">
                                                            <div className="font-semibold text-gray-900 text-lg">
                                                                {
                                                                    item.products?.discount
                                                                    ? formatPrice(item.unit_price * (1 - item.products?.discount / 100) * item.quantity)
                                                                    : formatPrice(item.unit_price * item.quantity)
                                                                   }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    item.products?.discount
                                                                        ? `${formatPrice(item.unit_price * (1 - item.products?.discount / 100))} x ${item.quantity}`
                                                                        :` ${formatPrice(item.unit_price)} x ${item.quantity}`
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>

                                                    {item.products?.brands?<div key={item.products?.brands.id} className="mt-2">
                                                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                            {item.products?.brands.name}
                                                          </span>
                                                    </div>:""}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card className={`${statusInfo.borderColor} border-2`}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Receipt className="h-5 w-5" />
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                                            </div>
                                            <span className="font-medium">{formatPrice(subtotal)}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="text-green-600 font-medium">FREE</span>
                                        </div>

                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600">Tax</span>
                                            <span className="font-medium">{formatPrice(tax)}</span>
                                        </div>

                                        <Separator className="my-2" />

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {formatPrice(order.total_price)}
                                                </div>
                                                <div className="text-sm text-gray-500">EGP</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-50 border-t">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FileText className="h-4 w-4" />
                                        <span>Order #{order.id.slice(0, 8).toUpperCase()} • {formatDate(order.created_at)}</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </CardContent>
                    </Card>

                    {/* Timeline Card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Order Timeline
                            </CardTitle>
                            <CardDescription>Track your order progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                {/* Timeline steps */}
                                <div className="space-y-8 pl-10">
                                    {/* Order Placed */}
                                    <div className="relative">
                                        <div className="absolute -left-7 top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow"></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900">Order Placed</h4>
                                                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                                            <p className="text-sm text-gray-500 mt-1">Order #{order.id.slice(0, 8)} has been received</p>
                                        </div>
                                    </div>

                                    {/* Processing */}
                                    <div className={`relative ${order.status !== 'pending' ? 'opacity-100' : 'opacity-50'}`}>
                                        <div className={`absolute -left-7 top-0 w-6 h-6 rounded-full border-4 border-white shadow ${
                                            order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Processing</h4>
                                            <p className="text-sm text-gray-600">
                                                {order.status !== 'pending' ? 'In progress' : 'Awaiting processing'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Shipping */}
                                    <div className={`relative ${['shipped', 'delivered'].includes(order.status) ? 'opacity-100' : 'opacity-50'}`}>
                                        <div className={`absolute -left-7 top-0 w-6 h-6 rounded-full border-4 border-white shadow ${
                                            ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Shipping</h4>
                                            <p className="text-sm text-gray-600">
                                                {['shipped', 'delivered'].includes(order.status) ? 'Estimated soon' : 'Not yet shipped'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delivery */}
                                    <div className={`relative ${order.status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
                                        <div className={`absolute -left-7 top-0 w-6 h-6 rounded-full border-4 border-white shadow ${
                                            order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Delivery</h4>
                                            <p className="text-sm text-gray-600">
                                                {order.status === 'delivered' ? 'Delivered' : 'Estimated 5-7 business days'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
export default OrdersCard
