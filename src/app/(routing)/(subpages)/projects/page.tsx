"use client";
import React, { useRef } from 'react'
import { useEffect, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";
import { ProjectsResponse } from "@/interfaces/Tasks";
import { CreateProjectDialog } from '@/components/CreateProject';
import Link from 'next/link';
import Image from 'next/image';
import { useRoleStore } from '@/features/auth/model/role.store';
import { redirect } from 'next/navigation';
import img from "@/../public/images/avatar.svg";
import projectImg from "@/../public/images/template-project-logo.png";
import { formatDate } from '@/shared/lib/date/luxon';
import { User } from '@/components/TaskList';
import moreIcon from "@/shared/assets/icons/more.png";
import editIcon from "@/shared/assets/icons/edit-2.png";
import archiveIcon from "@/shared/assets/icons/archive.png";
import trashIcon from "@/shared/assets/icons/trash.png";



function Page() {
  const [openDropdownProjectId, setOpenDropdownProjectId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const role = useRoleStore((s) => s.role);
  if (role !== "admin" && role !== "super_admin") {
    redirect("/");
  }
  const [projects, setProjects] = useState<ProjectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[] | null>([]);
  
  const getProjects = async () => {
    await clxRequest
      .get<ProjectsResponse>("/projects?page=1&limit=1000")
      .then((res) => setProjects(res))
      .finally(() => setLoading(false));
    }

  const handleArchive = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to archive this project?")) return;
    if (!projectId) return;
    const accessToken = parseCookies().accessToken;
    try {
      await clxRequest.post("/archive", {
        type: "project",
        relationId: projectId,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      await getProjects();
      setOpenDropdownProjectId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to archive project");
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    if (!projectId) return;
    const accessToken = parseCookies().accessToken;
    try {
      await clxRequest.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      await getProjects();
      setOpenDropdownProjectId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  }

  const handleRename = async (projectId: string) => {
    const newTitle = window.prompt("Enter new project title:");
    if (!newTitle) return;
    if (!projectId) return;
    const accessToken = parseCookies().accessToken;
    try {
      await clxRequest.patch(`/projects/${projectId}`, {
        title: newTitle
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      await getProjects();
      setOpenDropdownProjectId(null);
    }
    catch (err) {
      console.error(err);
      alert("Failed to rename project");
    }
  }

  const getUsers = async () => {
    await clxRequest
      .get<{items: User[]}>("/users?page=1&limit=1000")
      .then((res) => setUsers(res.items))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getUsers();
    getProjects();
  }, []);

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex gap-4 mb-5">
        <button className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full shadow">
          Filter
        </button>
        <div className="flex items-center bg-white/10 px-4 py-2 rounded-full shadow w-80">
          <input
            className="bg-transparent outline-none text-white w-full"
            placeholder="Search"
          />
        </div>
        {role === "admin" || role === "super_admin" ? (
          <div className="ml-auto">
            <CreateProjectDialog
              onProjectCreated={getProjects}
              isCollapsed={false}
            />
          </div>
        ) : null}
      </div>
      <div className="scrollbar pr-2 overflow-x-scroll grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : projects?.items.length ? (
          projects.items.map((project) => (
            <div className="relative" key={project.id}>
              <div className="absolute top-4 right-4 flex flex-col items-end" ref={dropdownRef}>
                <button
                  className="text-white/70 cursor-pointer hover:bg-white/10 rounded-full p-1 transition z-40"
                  style={{ position: "relative" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenDropdownProjectId(
                      openDropdownProjectId === project.id ? null : project.id
                    );
                  }}
                  aria-label="Project tools"
                  type="button"
                >
                  <Image src={moreIcon} alt="More" width={24} height={24} />
                </button>
                {openDropdownProjectId === project.id && (
                  <div
                    className="z-30 bg-[#ffffff1a] rounded-2xl shadow-lg flex flex-col p-2 gap-2 min-w-[140px] backdrop-blur-md mt-2"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)", position: "absolute", top: "100%", right: 0 }}
                  >
                    <button className="flex items-center cursor-pointer gap-3 text-white/90 hover:bg-white/10 rounded-xl px-3 py-2 transition text-base font-medium" 
                      onClick={e => { e.preventDefault(); handleRename(project.id) }}
                    >
                      <Image src={editIcon} alt="Rename" width={24} height={24} />
                      Rename
                    </button>
                    <button
                      className="flex items-center gap-3 cursor-pointer text-white/90 hover:bg-white/10 rounded-xl px-3 py-2 transition text-base font-medium"
                      onClick={e => { e.preventDefault(); handleArchive(project.id) }}
                    >
                      <Image src={archiveIcon} alt="Archive" width={24} height={24} />
                      Archive
                    </button>
                    <button
                      className="flex items-center gap-3 cursor-pointer text-white/90 hover:bg-white/10 rounded-xl px-3 py-2 transition text-base font-medium"
                      onClick={e => { e.preventDefault(); handleDelete(project.id) }}
                    >
                      <Image src={trashIcon} alt="Delete" width={24} height={24} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <Link
                href={`/projects/${project.title}`}
                className="relative cursor-pointer rounded-2xl bg-white/10 hover:bg-white/15 transition-colors shadow-lg p-6 flex flex-col items-center text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 overflow-hidden">
                  {project.projectAvatarUrl ? (
                    <Image
                      src={project.projectAvatarUrl}
                      alt={`${project.title} logo`}
                      width={64}
                      height={64}
                    />
                  ) : (
                    <Image
                      src={projectImg}
                      alt="project logo"
                      width={28}
                      height={28}
                    />
                  )}
                </div>

                <div className="mb-1 text-white text-lg font-semibold">
                  {project.title}
                </div>
                <div className="mb-3 text-white/70 text-xs">
                  Start date: {formatDate(project.createdAt, "dd LLL yyyy")}
                </div>
                <p className="text-white/80 text-sm leading-relaxed line-clamp-4 mb-5">
                  {project.description || "No description"}
                </p>

                <div className="mt-auto w-full flex items-center justify-center gap-2">
                  {/* Assigned users avatars */}
                  <div className="flex -space-x-2">
                    {users &&
                    Array.isArray(project.assignedTo) &&
                    project.assignedTo.length > 0 ? (
                      <>
                        {project.assignedTo.length > 2 ? (
                          <>
                            {project.assignedTo.slice(0, 2).map((userId) => {
                              let user: User | undefined = undefined;
                              if (Array.isArray(users)) {
                                user = users.find(
                                  (u) => u.id === Number(userId)
                                );
                              }
                              return (
                                <div
                                  title={
                                    user
                                      ? `${user.firstName} ${user.lastName}`
                                      : "Deleted user"
                                  }
                                  key={String(userId)}
                                  className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center overflow-hidden"
                                >
                                  <Image
                                    width={100}
                                    height={100}
                                    src={user?.avatarUrl || img}
                                    alt="User Avatar"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              );
                            })}
                            <div
                              title={
                                Array.isArray(users)
                                  ? project.assignedTo
                                      .slice(2)
                                      .map((userId) => {
                                        const user = users.find(
                                          (u) => u.id === Number(userId)
                                        );
                                        return user
                                          ? `${user.lastName?.[0] || ""}.${user.firstName || ""}`
                                          : "Deleted user";
                                      })
                                      .join(", ")
                                  : ""
                              }
                              className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                            >
                              +{project.assignedTo.length - 2}
                            </div>
                          </>
                        ) : (
                          project.assignedTo.map((user) => {
                            return (
                              <div
                                title={
                                  user
                                    ? `${user.firstName} ${user.lastName}`
                                    : "Deleted user"
                                }
                                key={String(user.id)}
                                className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center overflow-hidden"
                              >
                                <Image
                                  width={100}
                                  height={100}
                                  src={user?.avatarUrl || img}
                                  alt="User Avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            );
                          })
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-white/70">
                        0 member assigned
                      </span>
                    )}
                  </div>
                  {project.archived ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                      Archived
                    </span>
                  ) : null}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-white">No projects found.</div>
        )}
      </div>
    </div>
  );
}

export default Page;