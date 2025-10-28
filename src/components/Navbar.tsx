"use client";
import React, { useRef, useCallback } from "react";
import { IoMdSearch } from "react-icons/io";
import Breadcrumb from "./Breadcrumb";
import Image from "next/image";
import img from "@/../public/images/avatar.svg";
import { FaUser, FaMoon, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { User } from "@/interfaces/LoginResponse";
import { useEffect } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { destroyCookie, parseCookies } from "nookies";
import { AddProfilePhotoDialog } from "./AddProfilePhoto";
import { useRouter } from "next/navigation";
import img1 from"@/shared/assets/icons/notification.png"
import { useRoleStore } from "@/features/auth/model/role.store";

function Navbar() {
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const cookies = parseCookies();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profile, setProfile] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    avatarUrl: null,
    isActive: true,
    lastLoginDate: "",
    createdAt: "",
    updatedAt: "",
    position: {
      id: "",
      description: "",
      name: "",
    },
    assignedProjects: 0,
  });

  const handleLogout = async () => {
    destroyCookie(null, 'accessToken', {
      path: '/',
    });
    setProfile({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      avatarUrl: null,
      isActive: true,
      lastLoginDate: "",
      createdAt: "",
      updatedAt: "",
      position: {
        id: "",
        description: "",
        name: "",
      },
      assignedProjects: 0,
    });
    useRoleStore.getState().setRole("");
    useRoleStore.getState().setUserId(0);
    const accessToken = cookies.accessToken;
    if (accessToken) {
      clxRequest.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch((error) => {
        console.error("Logout error:", error);
      });
    }
    router.replace("/login");
  };

    const fetchProfile = useCallback(async () => {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      if (!accessToken) return;
      try {
        const data = await clxRequest.get<User>("/profile/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        useRoleStore.getState().setRole(data.role);
        useRoleStore.getState().setUserId(data.id);
        setProfile(data);
      } catch (error) {
        if (cookies.accessToken) {
          destroyCookie(null, 'accessToken', {
            path: '/',
          });
        }
        router.replace("/login");
        console.error(error);
      }
    }, [router]);
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="bg-[#ffffff1a] rounded-2xl text-white w-full px-6 py-[28px] flex justify-between items-center shadow">
      <Breadcrumb />
      <div className="flex items-center gap-6">
        <div className="relative w-64 hidden lg:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <IoMdSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#ffffff1a] text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        <button className="p-2 cursor-pointer rounded-full hover:bg-[#ffffff22]">
          <Image
            src={img1}
            alt="Notifications"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        </button>

        <div className="relative">
          <div
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center overflow-hidden"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <Image
              width={100}
              height={100}
              src={profile.avatarUrl || img}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {showProfileMenu && (
            <div
              ref={profileMenuRef}
              className="absolute right-0 mt-2 w-80 bg-white/1 backdrop-blur-lg rounded-2xl shadow-lg border p-6 z-50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="group w-14 h-14 rounded-full overflow-hidden relative cursor-pointer hover:bg-gray-700 transition-colors">
                  <Image
                    width={56}
                    height={56}
                    src={profile.avatarUrl || img}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                  <AddProfilePhotoDialog onPhotoChange={fetchProfile} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    {profile ? `${profile.firstName} ${profile.lastName}` : "Deleted user"}
                  </div>
                  <div className="text-sm text-white">{profile?.email || "No email"}</div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button className="flex items-center gap-3 text-white hover:text-green-400">
                  <FaUser />
                  Profile
                </button>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-3 text-white hover:text-green-400">
                    <FaMoon />
                    Dark mode
                  </button>
                  <label className="inline-flex items-center cursor-pointer relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-400 rounded-full peer peer-checked:bg-green-400 transition-all"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-4"></div>
                  </label>
                </div>
                <button
                  className="flex items-center gap-3 text-white hover:text-green-400"
                  onClick={handleLogout}
                >
                  <FaUsers />
                  Switch account
                </button>
                <button className="flex items-center gap-3 text-white hover:text-green-400">
                  <FaCog />
                  Settings
                </button>
                <button
                  className="flex items-center gap-3 text-white hover:text-green-400"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
