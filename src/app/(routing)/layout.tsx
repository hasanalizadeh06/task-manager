"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showSidebar = pathname !== "/login" && pathname !== "/register";

  useEffect(() => {
    if (!showSidebar) {
      const cookies = parseCookies();
      if (cookies.accessToken) {
        router.replace("/");
      }
    }
  }, [showSidebar, router]);

  if (!showSidebar) {
    return <div className="min-h-screen bg-gradient-to-b from-[#101e23] to-[#2c4954] text-white">{children}</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-[#101e23] to-[#2c4954] text-white flex flex-col">
      <div className="dashboard-layout m-10 bg-[#ffffff1a] flex rounded-4xl p-6 gap-6 min-h-[calc(100vh-80px)]">
        <div className="h-full">
          <Sidebar />
        </div>
        <main className="h-full flex flex-col flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}