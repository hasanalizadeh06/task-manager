"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img from "@/../public/images/avatar.svg";
import {
  Project,
  ProjectsResponse,
  Task,
  TasksByStatus,
} from "@/interfaces/Tasks";
import { useTaskStore } from "@/features/task/task.store";
import {
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiEye,
  FiFlag,
  FiMessageCircle,
} from "react-icons/fi";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { usePathname } from "next/navigation";
import circle from "@/shared/assets/icons/circle.png";
import { Sprint } from "@/interfaces/Sprints";
import { FaPlus } from "react-icons/fa";
// import { Status } from "@/interfaces/Statuses";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  position: {
    id: string;
    description: string;
    name: string;
  };
};

type BoardTasksProps = {
  sprint?: Sprint;
};

const BoardTasks = ({ sprint }: BoardTasksProps) => {
  // const [statuses, setStatuses] = useState<Status[]>([]);
  const pathname = usePathname();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TasksByStatus | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  // const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { refreshFlag } = useTaskStore();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await clxRequest.get<{
          items: {
            id: number;
            firstName: string;
            lastName: string;
            avatarUrl?: string | null;
            position: {
              id: string;
              description: string;
              name: string;
            };
          }[];
        }>("users?page=1&limit=1000");
        setUsers(data.items || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }
    fetchUsers();
    const fetchProject = async () => {
      try {
        const response = await clxRequest.get<ProjectsResponse>(
          "projects?page=1&limit=1000"
        );
        const projectsArray: Project[] = response.items || [];
        const foundProject = projectsArray.find((p) =>
          pathname.replaceAll("%20", " ").includes(p.title)
        );
        // setAllProjects(projectsArray);
        setProject(foundProject || null);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProject();
  }, [pathname, refreshFlag]);

  const { setTasks: setGlobalTasks } = useTaskStore();
  useEffect(() => {
    clxRequest
      .get<TasksByStatus>(`/tasks/board`)
      .then((data: TasksByStatus) => {
        let filteredTasks: TasksByStatus;
        if (project) {
          //@ts-expect-error - Object.fromEntries type inference issue with filtered array
          filteredTasks = Object.fromEntries(
            Object.entries(data).map(([status, tasksArr]) => [
              status,
              tasksArr.filter((task) => task.projectId === project.id),
            ])
          );
        } else if (sprint) {
          //@ts-expect-error - Object.fromEntries type inference issue with filtered array
          filteredTasks = Object.fromEntries(
            Object.entries(data).map(([status, tasksArr]) => [
              status,
              tasksArr.filter((task) => task.sprintId === sprint.id),
            ])
          );
        } else {
          filteredTasks = data;
        }
        setTasks(filteredTasks);
        // Tüm görevleri tek diziye çevirip store'a kaydet
        const allTasks = Object.values(filteredTasks).flat();
        setGlobalTasks(allTasks);
      })
      .catch(() => {});
  }, [project, refreshFlag, setGlobalTasks, sprint]);

  const [openSubtaskTaskId, setOpenSubtaskTaskId] = useState<string | null>(
    null
  );
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderSubtasks = (task: Task) => {
    if (!task.subtasks || openSubtaskTaskId !== task.id) return null;

    return task.subtasks.map((subtask) => (
      <div
        key={subtask.id}
        className="mt-3 ml-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
      >
        <h4 className="text-white font-semibold text-sm mb-1">
          {subtask.title}
        </h4>
        <p className="text-white text-xs opacity-70 mb-2">
          <span dangerouslySetInnerHTML={{ __html: subtask.description }} />
        </p>
        <div className="flex items-center justify-between text-xs text-white opacity-80">
          <div className="flex items-center gap-1">
            <FiCalendar size={12} />
            {formatDate(subtask.dueDate)}
          </div>
          <div className="flex items-center gap-1">
            <FiFlag size={12} className="text-red-400" />
            {subtask.priority}
          </div>
        </div>
      </div>
    ));
  };

  
  const createStatus = async () => {
    const title = newColumnTitle.trim();
    if (title) {
      try {
        await clxRequest.post("tasks/statuses", { name: title });
      } catch (error) {
        alert("Failed to add status to backend" + error);
        return;
      }
      setTasks((prev) => {
        const current = prev ?? {
          "To Do": [],
          "In Progress": [],
          "Testing": [],
          "Cancelled": [],
          "Done": [],
        };
        return {
          ...current,
          [title]: [],
        };
      });
      setNewColumnTitle("");
      setShowNewColumnInput(false);
    }
  };

  return (
    <div className="flex gap-5 w-full grow">
      {tasks &&
        Object.entries(tasks).map(([status, column]) => (
          <div
            key={status}
            className="flex-shrink-0 h-min w-80 bg-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-start gap-2 p-4">
              <div
                className={`px-3 py-1 text-white text-[14px] flex items-center font-semibold rounded-full ${
                  status === "To Do"
                    ? "bg-[#07A75F]"
                    : status === "In Progress"
                      ? "bg-[#4285F4]"
                      : status === "Testing"
                        ? "bg-[#B80CB2]"
                        : status === "Cancelled"
                          ? "bg-[#DF1811]"
                          : status === "Done"
                            ? "bg-[#6AC42F]"
                            : "bg-slate-500"
                }`}
              >
                <Image
                  src={circle}
                  alt={status}
                  width={16}
                  height={16}
                  className="inline-block mr-2"
                />
                {status}
              </div>
              <span
                className={`${
                  status === "To Do"
                    ? "bg-[#07A75F]"
                    : status === "In Progress"
                      ? "bg-[#4285F4]"
                      : status === "Testing"
                        ? "bg-[#B80CB2]"
                        : status === "Cancelled"
                          ? "bg-[#DF1811]"
                          : status === "Done"
                            ? "bg-[#6AC42F]"
                            : "bg-slate-500"
                } text-white px-2 text-[12px] py-0.5 rounded-full`}
              >
                {column.length}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {column.map((task) => (
                <div
                  key={task.id}
                  className="group bg-white/5 shadow-xl rounded-xl p-5 border border-white/20 hover:bg-opacity-20 transition-all duration-200"
                >
                  <h3 className="text-white text-base font-semibold mb-1">
                    {task.name}
                  </h3>
                  <p className="text-white text-xs opacity-70 leading-snug line-clamp-2 mb-4">
                    <span
                      dangerouslySetInnerHTML={{ __html: task.description }}
                    />
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center -space-x-2">
                      {task.assignedTo?.slice(0, 4).map((userId) => {
                        const user = users.find((u) => u.id === Number(userId));
                        return (
                          <div
                            title={
                              user
                                ? user.firstName + " " + user.lastName
                                : "Unknown User"
                            }
                            key={userId}
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
                      {task.assignedTo?.length > 4 && (
                        <div
                          title={task.assignedTo
                            .slice(4)
                            .map((userId) => {
                              const user = users.find(
                                (u) => u.id === Number(userId)
                              );
                              return user
                                ? `${user.lastName[0]}.${user.firstName}`
                                : "Unknown User";
                            })
                            .join(", ")}
                          className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                        >
                          +{task.assignedTo.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-white text-xs opacity-60">
                      <div className="flex items-center gap-1">
                        <FiEye size={14} /> 7
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMessageCircle size={14} /> 18
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-white text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} /> Due: {formatDate(task.dueDate)}
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        task.priority === "High"
                          ? "text-orange-400"
                          : task.priority === "Low"
                            ? "text-green-400"
                            : task.priority === "Medium"
                              ? "text-yellow-400"
                              : task.priority === "Critical"
                                ? "text-red-400"
                                : "text-blue-400"
                      }`}
                    >
                      <FiFlag size={12} /> {task.priority}
                    </div>
                  </div>

                  {/* tags */}

                  <div className="flex items-center text-sm gap-2 mb-3">
                    Tags:
                    {task.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="text-white bg-amber-400 py-[1px] px-1 rounded-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-white text-xs opacity-80">
                    <div className="flex items-center gap-1">
                      <FiClock size={12} />
                      Time estimation:{" "}
                      {task.estimatedTime ? `${task.estimatedTime}hr` : "N/A"}
                    </div>

                    <button
                      className="flex items-center gap-1 hover:text-green-400 transition"
                      onClick={() =>
                        setOpenSubtaskTaskId(
                          openSubtaskTaskId === task.id ? null : task.id
                        )
                      }
                    >
                      <FiChevronDown size={12} /> {task.subtasks?.length || 0}{" "}
                      subtasks
                    </button>
                  </div>

                  {renderSubtasks(task)}
                </div>
              ))}

              {/* Replace TaskDialog with your dialog component if needed */}
            </div>
          </div>
        ))}
      {showNewColumnInput ? (
        <div className="flex-shrink-0 h-min w-80 bg-white/10 rounded-lg backdrop-blur-sm p-4 flex flex-col gap-2">
          <input
            type="text"
            className="px-3 py-2 rounded bg-white/20 text-white outline-none"
            placeholder="Enter column name"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={createStatus}
            >
              Add
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              onClick={() => {
                setNewColumnTitle("");
                setShowNewColumnInput(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex-shrink-0 flex items-center justify-start gap-2 p-4 hover:bg-white/20 cursor-pointer h-min w-80 bg-white/10 rounded-lg backdrop-blur-sm"
          onClick={() => setShowNewColumnInput(true)}
        >
          <FaPlus /> Add another list
        </button>
      )}
    </div>
  );
};

export default BoardTasks;
