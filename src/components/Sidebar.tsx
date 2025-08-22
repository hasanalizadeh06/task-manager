"use client";
import React, { useEffect, useState } from "react";

import "@/shared/assets/css/global.css";
import project_logo from "@/../public/images/template-project-logo.png";

import { ProjectsResponse } from "@/interfaces/Tasks";
import { CreateProjectDialog } from "./CreateProject";
import { NavMenuItem } from "@/interfaces/Nav";
import { usePathname } from "next/navigation";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import img from "@/shared/assets/icons/briefcase.png"
import img1 from "@/shared/assets/icons/task.png"
import img2 from "@/shared/assets/icons/menu-board.png"
import img3 from "@/shared/assets/icons/archive.png"
import img4 from "@/shared/assets/icons/element-2.png"
import img5 from "@/shared/assets/icons/profile-2user.png"
import { useRoleStore } from "@/features/auth/model/role.store";

// import { MdOutlineSpaceDashboard } from "react-icons/md";
// import { LuCalendarDays } from "react-icons/lu";
import { GoSidebarCollapse } from "react-icons/go";
import { ProjectItem } from "@/interfaces/Project";
import SidebarMenuItem from "./SidebarMenuItem";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [latestProjects, setLatestProjects] = useState<ProjectItem[]>([]);
  const role = useRoleStore((state) => state.role);
  const menuItems: NavMenuItem[] = React.useMemo(
    () => [
      // {
      //   label: "Dashboard",
      //   icon: <MdOutlineSpaceDashboard size={20} />,
      //   href: "/dashboard",
      //   active: true,
      // },
      {
        label: "Users",
        icon: (
          <Image
            src={img5}
            alt="Users"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        ),
        adminOnly: true,
        href: "/users",
      },
      {
        label: "Projects",
        icon: (
          <Image
            src={img}
            alt="Projects"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        ),
        href: "/projects",
        subItemsOnlyForUsers: true,
        subItems: projects,
      },
      {
        label: "Backlog",
        icon: (
          <Image
            src={img1}
            alt="Backlog"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        ),
        href: "/backlog",
      },
      {
        label: "Board",
        icon: (
          <Image
            src={img2}
            alt="Board"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        ),
        href: "/board",
      },
      {
        label: "Archive",
        icon: (
          <Image
            src={img3}
            alt="Archive"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        ),
        href: "/archive",
      },
      // {
      //   label: "Calendar",
      //   icon: <LuCalendarDays size={20} />,
      //   href: "/calendar",
      // },
      {
        label: "Previous sprints",
        icon: (
          <Image
            src={img4}
            alt="Previous Sprints"
            width={20}
            height={20}
            style={{ display: "inline-block" }}
          />
        ),
        href: "/previous-sprints",
      },
    ],
    [projects]
  );

  const getNavProjects = () => {
    clxRequest
      .get<ProjectsResponse>("/projects?limit=1000&page=1")
      .then((data) => {
        const allProjects = data.items.map((project) => ({
          id: project.id,
          label: project.title,
          icon: (
            <span className="bg-black rounded-full flex items-center justify-center w-6 h-6">
              <Image
                src={project_logo}
                alt={project.title}
                layout="intrinsic"
                title={project.title}
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </span>
          ),
          href: "/projects/" + project.title,
        }));
        setProjects(allProjects.slice(0, 5));
        setLatestProjects(allProjects.slice(5));
      })
      .catch(() => {});
  };
  useEffect(() => {
    getNavProjects();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.altKey || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
      const flatMenu = menuItems.map((item) => item.href);
      const currentIdx = flatMenu.findIndex((href) => pathname === href);
      if (currentIdx === -1) return;
      let nextIdx = currentIdx;
      if (e.key === "ArrowUp") {
        nextIdx = (currentIdx - 1 + flatMenu.length) % flatMenu.length;
      } else if (e.key === "ArrowDown") {
        nextIdx = (currentIdx + 1) % flatMenu.length;
      }
      if (nextIdx !== currentIdx) {
        router.push(flatMenu[nextIdx]);
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname, router, menuItems]);

  return (
    <div
      className={`bg-[#ffffff1a] h-full overflow-hidden shadow rounded-2xl flex flex-col justify-between${isCollapsed ? " py-4" : " p-6 w-[300px]"}`}
    >
      <div>
        <div
          className={`flex items-center${isCollapsed ? " justify-center mb-4" : " justify-between mb-8"}`}
        >
          {isCollapsed ? (
            <></>
          ) : (
            <span className="text-white text-2xl font-semibold">Logo</span>
          )}
          <button
            className="text-gray-300 cursor-pointer hover:text-white"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
            }}
          >
            <GoSidebarCollapse size={22} />
          </button>
        </div>
        <span
          className="block w-full h-[1px] rounded-full mb-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(111, 207, 47, 0.6) 0%, #ABFF74 50%, rgba(111, 207, 47, 0.6) 100%)",
          }}
        ></span>
        {/* Menu */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem
                key={item.label}
                item={item}
                isCollapsed={isCollapsed}
                pathname={pathname}
              />
              // <li
              //   key={item.label}
              //   onMouseEnter={() => setIsOpenDropdown(true)}
              //   onMouseLeave={() => setIsOpenDropdown(false)}
              //   className="relative"
              // >
              //   {item.subItems ? (
              //     <>
              //       <button
              //         type="button"
              //         className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm w-full text-left transition ${
              //           item.subItems.some((sub) =>
              //             pathname.startsWith("/" + sub.href.split("/")[1])
              //           )
              //             ? isOpenDropdown
              //               ? "rounded-b-none bg-[#6AC42F]"
              //               : "bg-[#6AC42F] text-white"
              //             : isOpenDropdown
              //               ? "rounded-b-none bg-[#6AC42F] text-white"
              //               : "text-white/80 hover:bg-white/10"
              //         }`}
              //       >
              //         <Link
              //           href={item.href}
              //           className="flex items-center gap-3 w-full"
              //         >
              //           {item.icon}
              //           {isCollapsed ? "" : item.label}
              //         </Link>
              //         {isCollapsed ? (
              //           <></>
              //         ) : (
              //           <IoIosArrowUp
              //             onClick={() => setIsOpenDropdown((open) => !open)}
              //             className={`ml-auto cursor-pointer transition-transform ${
              //               isOpenDropdown ? "rotate-180" : ""
              //             }`}
              //             size={22}
              //           />
              //         )}
              //       </button>
              //       {isOpenDropdown && (
              //         <div className={`rounded-b-lg p-2 bg-[#6AC42F]`}>
              //           <ul className="max-h-44 flex flex-col gap-1 overflow-y-auto scrollbar-white pr-2">
              //             {item.subItems.map((sub) => (
              //               <li key={sub.href}>
              //                 <Link
              //                   href={sub.href}
              //                   className={`flex items-center gap-3 px-3 py-2 mx-3 rounded-lg font-medium text-sm transition ${
              //                     pathname.startsWith(sub.href)
              //                       ? "shadow-md text-white bg-[#77D638]"
              //                       : "text-white/90 hover:bg-white/10"
              //                   }`}
              //                 >
              //                   {sub.icon}
              //                   {sub.label}
              //                 </Link>
              //               </li>
              //             ))}
              //           </ul>
              //         </div>
              //       )}
              //     </>
              //   ) : (
              //     <Link
              //       href={item.href}
              //       className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition ${
              //         pathname === item.href
              //           ? "bg-[#6AC42F] text-white"
              //           : "text-white/80 hover:bg-white/10"
              //       }`}
              //     >
              //       {item.icon}
              //       {isCollapsed ? "" : item.label}
              //     </Link>
              //   )}
              // </li>
            ))}
          </ul>
        </nav>
        {/* Latest Projects */}
        <div className={isCollapsed ? "mt-5" : "mt-10"}>
          <div className="flex h-auto items-center justify-between mb-3">
            {isCollapsed ? (
              <span
                className="block w-full h-[1px] rounded-full mb-5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(111, 207, 47, 0.6) 0%, #ABFF74 50%, rgba(111, 207, 47, 0.6) 100%)",
                }}
              ></span>
            ) : (
              <>
                <span className="text-white font-semibold text-sm">
                  Latest projects
                </span>
                <Link
                  href="/projects"
                  className="text-xs text-white/60 hover:underline"
                >
                  See more
                </Link>
              </>
            )}
          </div>
          <ul
            className={`space-y-2 scrollbar overflow-y-auto${isCollapsed ? " max-h-45" : " max-h-30"}`}
          >
            {latestProjects.map((proj, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-2 text-white/90 text-sm${isCollapsed ? " justify-center" : ""}`}
              >
                <Link
                  href={proj.href}
                  className={`flex items-center gap-2 w-full${isCollapsed ? " justify-center" : ""}`}
                >
                  {proj.icon}
                  {isCollapsed ? "" : proj.label}
                </Link>
              </li>
            ))}
            {role === "admin" || role === "super_admin" ? (
            <li className={`flex${isCollapsed ? " justify-center" : ""}`}>
              <CreateProjectDialog
                triggerStyle={true}
                onProjectCreated={getNavProjects}
                  isCollapsed={isCollapsed}
                />
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
