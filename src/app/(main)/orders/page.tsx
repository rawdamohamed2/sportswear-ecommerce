'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {useEffect, useState} from "react";
import {OrderService} from '@/lib/services/orders'
import {useStore} from "@/lib/store/store";
import {toast} from "sonner";
import Loader from "@/components/Loader";
import {format} from "date-fns";
import {Order} from '@/types'
import {redirect} from "next/navigation";
type OrderStatus = 'pending' | 'processing' | 'shipped'| 'delivered' | 'cancelled';
type FilterStatus = "all" | OrderStatus|'All';


const statusStyle: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-red-100 text-red-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
}



export default function OrdersPage() {

    const [statusFilter, setStatusFilter] = useState<FilterStatus>("all")
    const CurrentUser = useStore((s) => s.CurrentUser);
    const token = useStore((s) => s.token);
    let userid = CurrentUser?.id;
    const [isLoading, setIsLoading] = useState(false);
    const [Orders, setOrders] = useState<Order[]|string>();

    if(!token)redirect('/auth/login') ;

    const getUserOrders=async ()=>{
        setIsLoading(true);
        try {
            userid=userid?userid:"";
            const result = await OrderService.getUserOrders(userid);
            setOrders(result);
        }catch(error){
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        }finally {
            setIsLoading(false);
        }
    };

    const getOrdersFilter = async (filter:FilterStatus)=>{
        setStatusFilter(filter);
        if(filter=='all'||filter=='All'){
            getUserOrders();
            return;
        }
        setIsLoading(true);
        try {
            userid=userid?userid:"";
            const result = await OrderService.getFilteredOrders(userid,filter);
            setOrders(result);
        }catch(error){
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Something went wrong");
            }
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserOrders();
    },[CurrentUser]);

    if(isLoading)return <Loader/>;

    if(typeof Orders == "string"){
        toast(Orders);
        return <section className="margin-up container mx-auto px-4 py-10 text-darkgray flex justify-center items-center min-h-screen">
            <p className="text-center text-darkgray text-2xl font-bold py-20">Something is went wrong</p>
        </section>
    }
    return (
    <section className="margin-up container mx-auto px-4 py-10 text-darkgray">
        {/* Page Title */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground py-1">
                Track and manage your sportswear orders
            </p>
        </div>

        {/* Status Tabs */}
        <Tabs
            defaultValue={statusFilter}
            className="mb-8"
            onValueChange={(value) =>
                getOrdersFilter(value as FilterStatus)
            }
        >
            <TabsList className="grid w-full h-full gap-2 grid-cols-2 sm:grid-cols-5 sm:w-fit">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="grid gap-6 py-5">
            {Orders?.length === 0 ? (
                <div className="text-center text-darkgray text-2xl font-bold py-20">
                    No orders found for this status
                </div>
            ) : (
                Orders?.map((order:Order) => (
                    <Card key={order.id} className="rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    {order.id}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Order Date: {format(new Date(order?.created_at), 'MMM dd, yyyy')}
                                </p>
                            </div>

                            <Badge className={statusStyle[order.status]}>
                                {order.status}
                            </Badge>
                        </CardHeader>

                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-lg font-semibold">
                                Total:{" "}
                                <span className="text-primary">
                                    {order?.total_price} <span className={`text-black font-bold`}>EGP</span>
                                  </span>
                            </p>

                            <Link href={`./orders/${order.id}`}  className={`bg-primary hover:bg-primary/80 text-font py-2 px-3 rounded-lg`}>
                                View Order Details
                            </Link>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    </section>
    )
}
