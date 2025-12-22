"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ShoppingBag,
    LogOut,
} from "lucide-react";
import {useStore} from "@/lib/store/store";
import {useCartStore} from "@/lib/store/CartStore";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import {redirect} from "next/navigation";
import {UserService} from "@/lib/services/user";
import Loader from "@/components/Loader";
import Link from "next/link";
import {userData} from '@/types'



export default function ProfilePage() {

    const token = useStore((s) => s.token);
    const CurrentUser = useStore((s) => s.CurrentUser);
    const { signOut } = useStore();
    const { logout  } = useCartStore();
    const [IsLoading, setIsLoading] = useState(false);
    const [UserData, setUserData] = useState<userData>();
    if(!token){
        toast('you are not logged in!');
        redirect('/auth/login');
    }
    const getUserData  = async () => {
        setIsLoading(true);
        try {
            const userid=CurrentUser?.id?CurrentUser?.id:'';
            const result= await  UserService.getUserbyId(userid);
            const user= await  UserService.getUserOrders(userid);
            const userd = user as userData;
            setUserData(userd);
        }
        catch (error) {
            if (error instanceof Error) {
                toast(error.message);
            } else {
                toast('Something went wrong');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getUserData();
    },[])
    console.log(UserData);
    if(IsLoading)return <Loader/>;
    if (!UserData)return <div className={`text-4xl text-center margin-up font-bold text-darkgray`}>No user data found </div>;

    return (
        <section className="margin-up min-h-screen text-darkgray bg-gradient-to-b from-background to-muted/30 py-14">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        My Profile
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        Manage your personal information, track orders, and update your account.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left – User Card */}
                    <Card className="md:col-span-1 shadow-lg border-muted/40">
                        <CardContent className="p-8 text-center space-y-6">

                            {/* Avatar */}
                            <div className="relative mx-auto w-fit">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/60 blur-sm opacity-60" />
                                <Avatar className="relative h-28 w-28 border-4 border-background">
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback className="text-2xl font-bold bg-primary text-white">
                                        {UserData.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* User Info */}
                            <div>
                                <h2 className="text-2xl font-semibold">{UserData.name}</h2>
                                <p className="text-sm text-muted-foreground">{UserData.email}</p>
                            </div>

                            <Badge className="px-4 py-1 text-sm">
                                {UserData.role} Member
                            </Badge>

                            {/* Actions */}
                            <div className="space-y-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={()=>{
                                        logout();
                                        signOut();
                                    }}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right – Details */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Personal Info */}
                        <Card className="shadow-md">
                            <CardContent className="p-8 space-y-6">
                                <h3 className="text-xl font-semibold border-b pb-3">
                                    Personal Information
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-sm text-muted-foreground">Full Name</label>
                                        <Input value={UserData.name} disabled />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm text-muted-foreground">Email</label>
                                        <Input value={UserData.email} disabled />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm text-muted-foreground">Phone</label>
                                        <Input value={UserData.phone} disabled />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm text-muted-foreground">Address</label>
                                        <Input value="Cairo, Egypt" disabled />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <div className="grid sm:grid-cols-3 gap-6">

                            <Card className="hover:shadow-lg transition">
                                <CardContent className="p-6 text-center space-y-3">
                                    <ShoppingBag className="mx-auto text-primary" />
                                    <p className="text-3xl font-bold">
                                        {UserData.orders.length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Total Orders
                                    </p>
                                    <Link
                                        href="/orders"
                                        className="inline-block text-primary text-sm font-medium hover:underline"
                                    >
                                        View orders →
                                    </Link>
                                </CardContent>
                            </Card>



                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
