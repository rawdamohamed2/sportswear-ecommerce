"use client"

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { LuUser } from "react-icons/lu";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { useStore } from '@/lib/store/store';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {useCartStore} from '@/lib/store/CartStore';
import {useEffect, useState} from "react";
export default function Navbar() {

    const user = useStore((s) => s.user);
    const token = useStore((s) => s.token);
    const CurrentUser = useStore((s) => s.CurrentUser);
    const { signOut } = useStore();
    const { clearGuestCart , logout} = useCartStore();
    const { getCartCount,cart } = useCartStore();
    const [count ,setCount ] = useState(0);

    useEffect(() => {
        // Defer state update to next tick
        const timer = setTimeout(() => {
            const count = getCartCount();
            setCount(count);
        }, 0);

        // Cleanup function
        return () => clearTimeout(timer);
    }, [cart]);

    const handleSignOut =async ()=>{
        await signOut();
        logout();
        clearGuestCart();
    }

    return (
        <nav className="fixed top-0 w-full bg-darkgray dark:bg-black shadow-md z-50">
            <div className="container flex items-center justify-between py-4">

                <Link href="/" className="text-3xl text-font logo ps-3 sm:p-0">SPORTSW</Link>

                <div className="hidden md:flex gap-6">
                    <Link href="/" className="navlink text-sm">Home</Link>
                    <Link href="/products" className="navlink text-sm">Products</Link>
                    <Link href="/aboutus" className="navlink text-sm">About Us</Link>
                    <Link href="/blog" className="navlink text-sm">Blog</Link>
                    <Link href="/contactus" className="navlink text-sm">Contact</Link>
                </div>

                <div className="hidden md:flex gap-4">
                    <Link href={`/cart`} className="text-3xl relative">
                        <div className={`absolute top-[-6] right-[-6] bg-primary text-font text-md px-2 py-0 rounded-full z-50`}>
                            {
                                cart?.items?.length?<p className={`text-sm font-bold`}>{count}</p>:''
                            }
                        </div>
                        <LiaShoppingCartSolid className="icon" />
                    </Link>

                    {token ? (
                        <>
                            <Link href={`/profile/${user?.id}`} className="text-2xl">
                                <LuUser className="icon" />
                            </Link>
                            {
                                CurrentUser?.role=='admin'?<Link
                                    href={`/admin`}
                                    className="text-md bg-primary px-2 m-auto pb-1 text-center rounded-3xl hover:bg-primary/80 hover:text-darkgray"
                                >
                                    Dashboard
                                </Link>:''
                            }
                            <button
                                onClick={handleSignOut}
                                className="text-md bg-primary px-2 m-auto pb-1 text-center rounded-3xl hover:bg-primary/80 hover:text-darkgray"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-md bg-primary px-2 py-1 rounded-3xl hover:bg-primary/80 hover:text-darkgray">
                                Login
                            </Link>
                            <Link href="/auth/signup" className="text-md bg-primary px-2 py-1 rounded-3xl hover:bg-primary/80 hover:text-darkgray">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                <div className="md:hidden flex">
                    <Sheet>
                        <SheetTrigger className="p-2">
                            <Menu />
                        </SheetTrigger>

                        <SheetContent side="right" className="bg-background border-0 transition-transform duration-300 ease-out">
                            <SheetHeader>
                                <SheetTitle className="text-3xl text-primary text-center py-4 logo">SPORTSW</SheetTitle>
                            </SheetHeader>

                            <div className="text-black font-bold flex flex-col gap-4 py-5 px-4">
                                <Link href="/" className="navlink text-sm">Home</Link>
                                <Separator />
                                <Link href="/products" className="navlink text-sm">Products</Link>
                                <Separator />
                                <Link href="/aboutus" className="navlink text-sm">About Us</Link>
                                <Separator />
                                <Link href="/blog" className="navlink text-sm">Blog</Link>
                                <Separator />
                                <Link href="/contactus" className="navlink text-sm">Contact</Link>

                                <div className="flex gap-4 pt-5">
                                    <Link href={`/cart`} className="text-3xl relative">
                                        <div className={`absolute top-[-6] right-[-6] bg-primary text-font text-md px-2 py-0 rounded-full z-50`}>
                                            {
                                                cart?.items?.length?<p className={`text-sm font-bold`}>{count}</p>:''
                                            }
                                        </div>
                                        <LiaShoppingCartSolid className="icon" />
                                    </Link>
                                    {token ? (
                                        <div className="flex flex-col items-center gap-4 ">
                                            <div className={`flex justify-between gap-1`}>
                                                <Link href={`/profile/${user?.id}`} className="text-2xl">
                                                    <LuUser className="icon" />
                                                </Link>
                                                {
                                                    CurrentUser?.role=='admin'?<Link
                                                        href={`/admin`}
                                                        className="text-md bg-primary px-2 m-auto pb-1 text-center rounded-3xl hover:bg-primary/80 hover:text-darkgray"
                                                    >
                                                        Dashboard
                                                    </Link>:''
                                                }
                                            </div>
                                            <button
                                                onClick={signOut}
                                                className="text-md bg-primary px-2 m-auto pb-1 text-center rounded-3xl hover:bg-primary/80 hover:text-darkgray"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="text-md bg-primary px-2 py-1 rounded-3xl hover:bg-primary/80 hover:text-darkgray">
                                                Login
                                            </Link>
                                            <Link href="/auth/signup" className="text-md bg-primary px-2 py-1 rounded-3xl hover:bg-primary/80 hover:text-darkgray">
                                                Sign up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </nav>
    )
}
