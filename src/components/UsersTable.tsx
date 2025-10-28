"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import filterIcon from "@/shared/assets/icons/sort.png";
import avatarFallback from "@/../public/images/avatar.svg";
import edit from "@/shared/assets/icons/edit-2.png";
import trash from "@/shared/assets/icons/trash.png";
import { parseCookies } from "nookies";
import EditUserDialog from "@/components/EditUserDialog";
import AddNewUserDialog from "./AddNewUser";

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
  assignedProjects: number;
};

export default function UsersTable() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<
    { id: string; name: string; description: string; color: string }[]
  >([]);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserItem | null>(null);

  const openEdit = (user: UserItem) => {
    setEditTarget(user);
    setIsEditOpen(true);
  };

  const fetchPositions = () => {
    const { accessToken } = parseCookies();
    clxRequest
      .get<{ id: string; name: string; description: string }[]>("/positions/all", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      })
      .then((res) => {
      const colorMap: Record<string, string> = {};
      const generateColors = (count: number) => {
        const allowedHueRanges = [
          [30, 90],   // orange, yellow, lime, green
          [90, 150],  // green, aqua
          [150, 180], // aqua, cyan
          [210, 270], // blue, magenta
          [270, 330], // magenta, pink
        ];
        const hues: number[] = [];
        const totalRange = allowedHueRanges.reduce((acc, [start, end]) => acc + (end - start), 0);
        for (let i = 0; i < count; i++) {
          const pos = (i / count) * totalRange;
          let acc = 0;
          for (const [start, end] of allowedHueRanges) {
        if (pos < acc + (end - start)) {
          hues.push(Math.round(start + (pos - acc)));
          break;
        }
        acc += (end - start);
          }
        }
        const colors: string[] = hues.map(hue => `hsl(${hue}, 70%, 55%)`);
        return colors;
      };
      const colors = generateColors(res.length);
      let colorIdx = 0;
      const positionsWithColor = (res || []).map((pos) => {
        if (!colorMap[pos.name]) {
        colorMap[pos.name] = colors[colorIdx % colors.length];
        colorIdx++;
        }
        return {
        ...pos,
        color: colorMap[pos.name],
        };
      });
      setPositions(positionsWithColor);
      })
      .catch(() => setPositions([]));
  }

  const refreshUsers = () => {
    clxRequest
      .get<{ items: UserItem[] }>("/users?page=1&limit=1000")
      .then((res) => setItems(res.items || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPositions();
    setLoading(true);
    clxRequest
      .get<{ items: UserItem[] }>("/users?page=1&limit=1000")
      .then((res) => setItems(res.items || []))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(userId);
    try {
      const { accessToken } = parseCookies();
      await clxRequest.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setItems(prevItems => prevItems.filter(item => item.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

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
          <AddNewUserDialog onUserAdded={refreshUsers} />
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
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src={u.avatarUrl || avatarFallback} alt="Avatar" width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div className="text-gray-200">{u.firstName} {u.lastName}</div>
              </div>
              <div className="text-gray-300">{u.email}</div>
              <div>
                <span
                  className="px-3 py-1 rounded-full text-xs bg-[#ffffff1a] capitalize"
                  style={{
                  color:
                    positions.find((p) => p.id === u.position?.id)?.color ||
                    "#fff",
                  }}
                >
                  {u.position?.name || "No Position"}
                </span>
              </div>
              <div className="text-gray-300">
                {u.assignedProjects}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className={`w-2 h-2 rounded-full ${u.isActive ? "bg-[#6AC42F]" : "bg-red-500"}`} />
                {u.isActive ? "Active" : "Inactive"}
              </div>
              <div className="text-gray-300">
                <button className="p-2 hover:bg-[#ffffff33] rounded-full" title="Edit user" onClick={() => openEdit(u)}>
                  <Image src={edit} alt="Edit" className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 hover:bg-[#ff000033] rounded-full" 
                  title="Delete user"
                  onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                  disabled={deleteLoading === u.id}
                >
                  <Image 
                    src={trash} 
                    alt="Delete" 
                    className={`w-4 h-4 ${deleteLoading === u.id ? 'opacity-50' : ''}`} 
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <EditUserDialog
        open={isEditOpen}
        user={editTarget}
        onOpenChange={(v) => {
          setIsEditOpen(v);
          if (!v) setEditTarget(null);
        }}
        onSaved={refreshUsers}
      />
    </div>
  );
}


