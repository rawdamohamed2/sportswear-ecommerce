'use client'
import React, {useEffect, useLayoutEffect, useState} from 'react';
import { useStore } from '@/lib/store/store';
import Loader from "@/components/Loader";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { setCurrentUser } = useStore();
    const error = useStore((state) => state.error);
    const user = useStore((s) => s.user);
    console.log()

    useEffect(() => {
        if (user?.email) {
            setCurrentUser(user.email);
        }

    }, [user?.email, user]);

    return (
        <>
            {children}
        </>
    );
}

export default Layout;
