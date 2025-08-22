"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import filterIcon from "@/shared/assets/icons/sort.png";
import avatarFallback from "@/../public/images/avatar.svg";

export type UserItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
  lastLoginDate?: string | null;
  createdAt: string;
  position: {
    id: string;
    description: string;
    name: string;
  };
};

export default function UsersTable() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    clxRequest
      .get<{ items: UserItem[] }>("users?page=1&limit=1000")
      .then((res) => setItems(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.position?.name || "").toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  return (
    <div className="flex flex-col gap-3 overflow-y-scroll scrollbar pr-2">
      <div className="flex items-center justify-between">
        <div className="w-[320px] h-9 rounded-full bg-[#ffffff1a] flex items-center px-3 text-sm text-gray-300">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none w-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 bg-[#ffffff1a] flex items-center gap-2 rounded-full text-sm text-gray-300">
            <Image src={filterIcon} alt="Filter" />
            Filter
          </button>
          <button className="h-9 px-4 bg-[#6AC42F] flex items-center gap-2 rounded-full text-sm text-white">
            Add new user
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 bg-[#ffffff1a] items-center rounded-2xl text-gray-300 text-sm font-medium grid-cols-[2fr_2fr_2fr_1.5fr_2fr]">
        <div>Name</div>
        <div>Email</div>
        <div>Position</div>
        <div>Projects assigned</div>
        <div>Status</div>
      </div>

      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="w-full h-[80px] bg-[#ffffff1a] rounded-2xl flex items-center justify-center text-gray-300">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="w-full h-[80px] bg-[#ffffff1a] rounded-2xl flex items-center justify-center text-gray-300">No users</div>
        ) : (
          filtered.map((u) => (
            <div
              key={u.id}
              className="grid items-center gap-4 rounded-2xl bg-[#ffffff1a] py-4 px-3 grid-cols-[2fr_2fr_2fr_1.5fr_1fr_1fr]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-green-400 overflow-hidden">
                  <Image src={u.avatarUrl || avatarFallback} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div className="text-gray-200">{u.firstName} {u.lastName}</div>
              </div>
              <div className="text-gray-300">{u.email}</div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs bg-[#ffffff1a] text-gray-200 capitalize">
                  {u.position?.name || "No Position"}
                </span>
              </div>
              <div className="text-gray-300">-</div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className={`w-2 h-2 rounded-full ${u.isActive ? "bg-[#6AC42F]" : "bg-red-500"}`} />
                {u.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


