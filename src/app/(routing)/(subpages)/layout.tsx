"use client";
import Navbar from '@/components/Navbar';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import nookies from 'nookies';

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const accessToken = nookies.get(null).accessToken;
        if (!accessToken) {
            router.replace('/login');
        }
    }, [pathname, router]);
    return (
        <div className='w-full h-full flex flex-col gap-5'>
            <Navbar />
            {children}
        </div>
    );
}