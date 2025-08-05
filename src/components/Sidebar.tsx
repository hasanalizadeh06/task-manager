"use client";
import React, { useEffect, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineWorkOutline } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { HiOutlineClipboardList } from "react-icons/hi";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { LuCalendarDays } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiArrowDropDownFill } from "react-icons/ri";
import "@/shared/assets/css/global.css";

import project_logo from "@/../public/images/template-project-logo.png";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CreateProjectDialog } from "./CreateProject";
import { useRouter } from "next/navigation";
import { NavMenuItem } from "@/interfaces/Nav";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { ProjectsResponse } from "@/interfaces/Tasks";
import { ProjectItem } from "@/interfaces/Project";

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [latestProjects, setLatestProjects] = useState<ProjectItem[]>([]);
  const menuItems: NavMenuItem[] = React.useMemo(() => [
    {
      label: "Dashboard",
      icon: <MdOutlineSpaceDashboard size={20} />,
      href: "/dashboard",
      active: true,
    },
    {
      label: "Projects",
      icon: <MdOutlineWorkOutline size={20} />,
      href: "/projects",
      subItems: projects,
    },
    {
      label: "Backlog",
      icon: <FaListCheck size={20} />,
      href: "/backlog",
    },
    {
      label: "Board",
      icon: <HiOutlineClipboardList size={20} />,
      href: "/board",
    },
    {
      label: "Archive",
      icon: <HiOutlineArchiveBox size={20} />,
      href: "/archive",
    },
    {
      label: "Calendar",
      icon: <LuCalendarDays size={20} />,
      href: "/calendar",
    },
    {
      label: "Previous sprints",
      icon: <LuLayoutDashboard size={20} />,
      href: "/previous-sprints",
    },
  ], [projects]);

    const getNavProjects = () => {
    clxRequest
      .get<ProjectsResponse>("/projects")
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
    }
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

  useEffect(() => {
    setIsOpenDropdown(false);
  }, [pathname]);

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
            onClick={() => {setIsCollapsed(!isCollapsed); setIsOpenDropdown(false);}}
          >
            <GoSidebarCollapse size={22} />
          </button>
        </div>
        <span className="block w-full h-0.5 rounded-full bg-[#00C951] mb-5"></span>
        {/* Menu */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label} className="relative">
                {item.subItems ? (
                  <>
                    <button
                      type="button"
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm w-full text-left transition ${
                        item.subItems.some((sub) =>
                          pathname.startsWith("/" + sub.href.split("/")[1])
                        )
                          ? isOpenDropdown
                            ? "rounded-b-none bg-[#50af11]"
                            : "bg-[#00C951] text-white"
                          : isOpenDropdown
                            ? "rounded-b-none bg-white/10"
                            : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 w-full"
                      >
                        {item.icon}
                        {isCollapsed ? "" : item.label}
                      </Link>
                      {isCollapsed ? (
                        <></>
                      ) : (
                        <RiArrowDropDownFill
                          onClick={() => setIsOpenDropdown((open) => !open)}
                          className={`ml-auto cursor-pointer transition-transform ${
                            isOpenDropdown ? "rotate-180" : ""
                          }`}
                          size={22}
                        />
                      )}
                    </button>
                    {isOpenDropdown && (
                      <div
                        className={`rounded-b-lg p-2${
                          item.subItems.some((sub) =>
                            pathname.startsWith("/" + sub.href.split("/")[1])
                          )
                            ? " bg-[#50af11]"
                            : " bg-white/10"
                        }`}
                      >
                        <ul
                          className="max-h-44 overflow-y-auto scrollbar pr-2"
                        >
                          {item.subItems.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition ${
                                  pathname === sub.href
                                    ? "bg-lime-500 mx-3 text-white"
                                    : "text-white/90 hover:bg-lime-500/30"
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
                        ? "bg-[#00C951] text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    {isCollapsed ? "" : item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Latest Projects */}
        <div className={isCollapsed ? "mt-5" : "mt-10"}>
          <div className="flex items-center justify-between mb-3">
            {isCollapsed ? (
              <span className="block w-full h-0.5 rounded-full bg-[#00C951] mb-2"></span>
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
            <li className={`flex${isCollapsed ? " justify-center" : ""}`}>
              <CreateProjectDialog
                triggerStyle={true}
                onProjectCreated={getNavProjects}
                isCollapsed={isCollapsed}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
