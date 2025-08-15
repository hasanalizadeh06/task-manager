"use client";
import Link from "next/link";
import React from "react";
import { IoIosArrowUp } from "react-icons/io";
import { NavMenuItem } from "@/interfaces/Nav";
interface SidebarMenuItemProps {
  item: NavMenuItem;
  isCollapsed: boolean;
  pathname: string;
}
export default function SidebarMenuItem({
  item,
  isCollapsed,
  pathname,
}: SidebarMenuItemProps) {
  const [isOpenDropdown, setIsOpenDropdown] = React.useState(false);
  return (
    <li
      key={item.label}
      onMouseEnter={() => setIsOpenDropdown(true)}
      onMouseLeave={() => setIsOpenDropdown(false)}
      className="relative"
    >
      {item.subItems ? (
        <>
          <button
            type="button"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm w-full text-left transition ${
              item.subItems.some((sub: NavMenuItem) =>
                pathname.startsWith("/" + sub.href.split("/")[1])
              )
                ? isOpenDropdown
                  ? "rounded-b-none bg-[#6AC42F]"
                  : "bg-[#6AC42F] text-white"
                : isOpenDropdown
                  ? "rounded-b-none bg-[#6AC42F] text-white"
                  : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Link href={item.href} className="flex items-center gap-3 w-full">
              {item.icon}
              {isCollapsed ? "" : item.label}
            </Link>
            {isCollapsed ? (
              <></>
            ) : (
              <IoIosArrowUp
                onClick={() => setIsOpenDropdown((open) => !open)}
                className={`ml-auto cursor-pointer transition-transform ${
                  isOpenDropdown ? "rotate-180" : ""
                }`}
                size={22}
              />
            )}
          </button>
          {isOpenDropdown && (
            <div className={`rounded-b-lg p-2 bg-[#6AC42F]`}>
              <ul className="max-h-44 flex flex-col gap-1 overflow-y-auto scrollbar-white pr-2">
                {item.subItems.map((sub: NavMenuItem) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      className={`flex items-center gap-3 px-3 py-2 mx-3 rounded-lg font-medium text-sm transition ${
                        pathname.startsWith(sub.href)
                          ? "shadow-md text-white bg-[#77D638]"
                          : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      {sub.icon}
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition ${
            pathname === item.href
              ? "bg-[#6AC42F] text-white"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          {item.icon}
          {isCollapsed ? "" : item.label}
        </Link>
      )}
    </li>
  );
}
