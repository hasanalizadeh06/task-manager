"use client"
import CreateTask from '@/components/CreateTask';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaListCheck } from 'react-icons/fa6';
import { LuLayoutDashboard } from 'react-icons/lu';
import { RxDashboard } from 'react-icons/rx';



export default function Layout({ children }: { children: React.ReactNode }) {
    const actualPage = usePathname().split("/")[3] 
    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <div className="flex items-start gap-5">
                        <Link href="overview" className={`cursor-pointer flex justify-center items-center gap-1${actualPage === "overview" ? " border-b-2 pb-1" : ""}`}><RxDashboard size={16}/> Overview</Link>
                        <Link href="list" className={`cursor-pointer flex justify-center items-center gap-1${actualPage === "list" ? " border-b-2 pb-1" : ""}`}><FaListCheck size={16} /> List</Link>
                        <Link href="board" className={`cursor-pointer flex justify-center items-center gap-1${actualPage === "board" ? " border-b-2 pb-1" : ""}`}><LuLayoutDashboard size={16}/> Board</Link>
                    </div>
                    <CreateTask name='Project'/>
                </div>
            </div>
            <div className="overflow-y-scroll scrollbar pr-2 h-full">
                {children}
            </div>
        </>
    );
}