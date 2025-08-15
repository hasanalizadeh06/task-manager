"use client";
import CreateTask from "@/components/CreateTask";
import { Project, ProjectsResponse } from "@/interfaces/Tasks";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await clxRequest.get<ProjectsResponse>("projects?page=1&limit=1000");
        const projectsArray: Project[] = response.items || [];
        const foundProject = projectsArray.find((p) =>
          pathname.replaceAll("%20", " ").includes(p.title)
        );
        setProject(foundProject || null);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProject();
  }, [pathname]);

  const actualPage = usePathname().split("/")[3];
  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex items-start gap-5">
            <Link
              href="overview"
              className={`cursor-pointer flex justify-center items-center gap-1${actualPage === "overview" ? " border-b-2 pb-1" : ""}`}
            >
              <RxDashboard size={16} /> Overview
            </Link>
            <Link
              href="list"
              className={`cursor-pointer flex justify-center items-center gap-1${actualPage === "list" ? " border-b-2 pb-1" : ""}`}
            >
              <FaListCheck size={16} /> List
            </Link>
            <Link
              href="board"
              className={`cursor-pointer flex justify-center items-center gap-1${actualPage === "board" ? " border-b-2 pb-1" : ""}`}
            >
              <LuLayoutDashboard size={16} /> Board
            </Link>
          </div>
          <CreateTask id={project?.id} name={project?.title} />
        </div>
      </div>
      <div className="overflow-y-scroll scrollbar pr-2 h-full">{children}</div>
    </>
  );
}
