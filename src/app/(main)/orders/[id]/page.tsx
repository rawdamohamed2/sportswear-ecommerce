import React from 'react';
import OrdersCard from '@/components/orders/OrdersCard'
import {OrderService} from "@/lib/services/orders";
interface PageProps {
    params: Promise<{
        id: string;
    }>;
}
const Page =async ({ params }: PageProps) => {
    const { id } = await params;
    const {getOrderById} =OrderService;
    const order= await getOrderById(id);

    return (
        <OrdersCard order={order} />
    );
}
export default Page
