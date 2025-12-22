"use client"
import React from 'react'
import {Login} from '@/components/auth/Login'
import {useStore} from "@/lib/store/store";
import {redirect} from "next/navigation";
import Loader from "@/components/Loader";

const Page = () => {
    const token = useStore((s) => s.token);
    if(token){
        redirect('/');
    }
    return (
        <div className={`min-h-screen`}>
            {
                token? <Loader/>:<Login />
            }

        </div>
    )
}
export default Page
