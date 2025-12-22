"use client"
import React from 'react'
import Signup from '@/components/auth/Signup'
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
                token? <Loader/>:< Signup/>
            }
        </div>
    )
}
export default Page
