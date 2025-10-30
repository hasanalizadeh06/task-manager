"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import img from "@/../public/images/avatar.svg";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import more from "@/shared/assets/icons/more.png";
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
import edit_2 from "@/shared/assets/icons/edit-2.png";
import archive from "@/shared/assets/icons/archive.png";
import trash from "@/shared/assets/icons/trash.png";
import task_square from "@/shared/assets/icons/task-square.png";
import taskpng from "@/shared/assets/icons/task.png";
import { useRoleStore } from "@/features/auth/model/role.store";
import { parseCookies } from "nookies";
import EditTask from "./EditTask";

type Subtask = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
};

type TaskItem = {
  id: string;
  name: string;
  assignedTo: string[];
  startDate: string;
  priority: string;
  dueDate: string;
  description: string;
  status: string;
  tags: string[];
  images: StaticImageData[];
  progress: number;
  estimatedTime: number | null;
  actualTime: number;
  createdAt: string;
  updatedAt: string;
  projectId?: string | null;
  epicId?: string | null;
  sprintId?: string | null;
  subtasks?: Subtask[];
};

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
  selectMode: boolean;
  selectedTasks: string[];
  setSelectedTasks: (tasks: string[]) => void;
  setSelectMode: (mode: boolean) => void;
  isBoardPage?: boolean;
  refreshFlagForSelected?: boolean;
  setProjects?: (projects: Project[]) => void;
};

const BoardTasks = ({
  sprint,
  isBoardPage,
  selectMode,
  selectedTasks,
  setSelectMode,
  setSelectedTasks,
  refreshFlagForSelected,
  setProjects,
}: BoardTasksProps) => {
  const pathname = usePathname();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<TasksByStatus | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  const [openColumnDropdown, setOpenColumnDropdown] = useState<string | null>(
    null
  );
  const [openTaskDropdown, setOpenTaskDropdown] = useState<string | null>(null);
  const [openSubtask, setOpenSubtask] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { refreshFlag } = useTaskStore();
  const role = useRoleStore((s) => s.role);

  const [draggedTask, setDraggedTask] = useState<TaskItem | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    task: TaskItem,
    columnId: string
  ) => {
    setDraggedTask(task);
    setDraggedFrom(columnId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedTask || !draggedFrom || draggedFrom === targetColumnId) {
      setDraggedTask(null);
      setDraggedFrom(null);
      return;
    }

    try {
      // Backend'e status güncelleme isteği gönder
      await clxRequest.patch(`/tasks/${draggedTask.id}`, {
        status: targetColumnId,
      });

      // Başarılı olursa görevleri yeniden çek
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert("Failed to move task");
    }

    setDraggedTask(null);
    setDraggedFrom(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedFrom(null);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////               fetch & render project           ////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      }>("/users?page=1&limit=1000");
      setUsers(data.items || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }
  const fetchProject = useCallback(async () => {
    try {
      if (!pathname) return;

      const response = await clxRequest.get<ProjectsResponse>(
        "/projects?page=1&limit=1000"
      );
      const projectsArray: Project[] = response.items || [];
      if (setProjects) setProjects(projectsArray);
      const foundProject = projectsArray.find((p) =>
        pathname.replaceAll("%20", " ").includes(p.title)
      );
      setProject(foundProject || null);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, [pathname, setProjects]);
  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [pathname, refreshFlag, fetchProject]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////               fetch & render tasks             ////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const { setTasks: setGlobalTasks } = useTaskStore();
  function fetchTasks() {
    const { accessToken } = parseCookies();
    clxRequest
      .get<TasksByStatus>(`/tasks/board`, {
        authToken: accessToken
      })
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
        const allTasks = Object.values(filteredTasks).flat();
        setGlobalTasks(allTasks);
      })
      .catch(() => {});
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////               dropdown functions               ////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function handleRenameColumn(status: string) {
    const newName = prompt("Enter new name for column:", status);
    if (newName && newName !== status) {
      try {
        await clxRequest.patch(`/tasks/statuses/name`, {
          oldName: status,
          newName: newName,
        });
        fetchTasks();
        setOpenColumnDropdown("");
      } catch (error) {
        alert("Rename failed" + error);
        console.error("Rename failed" + error);
      }
    }
  }

  async function handleArchiveColumn(tasksInColumn: TaskItem[]) {
    const { accessToken } = parseCookies();
    clxRequest
      .post(
        "/archive/bulk",
        { type: "task", relationId: tasksInColumn.map((t) => t.id) },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        fetchTasks();
        setOpenColumnDropdown("");
      })
      .catch((error) => {
        alert("Failed to archive tasks in this column" + error);
        console.error("Failed to archive tasks in this column" + error);
      });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////             task dropdown functions            ////////////////////////////////////
  //////////////////////////////////                                                ////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function handleRenameTask(task: TaskItem) {
    const newName = prompt("Enter new name for task:", task.name);
    if (newName && newName !== task.name) {
      try {
        await clxRequest.patch(`/tasks/${task.id}`, { name: newName });
        fetchTasks();
        setOpenColumnDropdown("");
      } catch (error) {
        alert("Rename failed" + error);
        console.error("Rename failed" + error);
      }
    }
  }

  async function handleArchiveTask(task: TaskItem) {
    const { accessToken } = parseCookies();
    clxRequest
      .post(
        "/archive",
        { type: "task", relationId: task.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        fetchTasks();
        setOpenTaskDropdown("");
      })
      .catch((error) => {
        alert("Failed to archive task" + error);
        console.error("Failed to archive task" + error);
      });
  }

  async function handleDeleteTask(task: TaskItem) {
    const { accessToken } = parseCookies();
    if (!confirm("Are you sure you want to delete this task?")) return;
    clxRequest
      .delete(`/tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchTasks();
        setOpenTaskDropdown("");
      })
      .catch((error) => {
        alert("Failed to delete task" + error);
        console.error("Failed to delete task" + error);
      });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////                                                /////////////////////////////////////
  //////////////////////////////////           subtask dropdown functions           /////////////////////////////////////
  //////////////////////////////////                                                /////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async function handleRenameSubtask(subtask: Subtask) {
    const newName = prompt("Enter new name for subtask:", subtask.title);
    if (newName && newName !== subtask.title) {
      try {
        await clxRequest.patch(`/subtasks/${subtask.id}`, { title: newName });
        fetchTasks();
        setOpenSubtask(null);
      } catch (error) {
        alert("Rename failed" + error);
        console.error("Rename failed" + error);
      }
    }
  }

  async function handleArchiveSubtask(subtask: Subtask) {
    const { accessToken } = parseCookies();
    clxRequest
      .post(
        "/archive",
        { type: "subtask", relationId: subtask.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        fetchTasks();
        setOpenSubtask(null);
      })
      .catch((error) => {
        alert("Failed to archive subtask" + error);
        console.error("Failed to archive subtask" + error);
      });
  }

  async function handleDeleteSubtask(subtask: Subtask) {
    const { accessToken } = parseCookies();
    if (!confirm("Are you sure you want to delete this subtask?")) return;
    clxRequest
      .delete(`/subtasks/${subtask.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        fetchTasks();
        setOpenSubtask(null);
      })
      .catch((error) => {
        alert("Failed to delete subtask" + error);
        console.error("Failed to delete subtask" + error);
      });
  }

  useEffect(() => {
    fetchTasks();
    console.log("board tasks fetched: ", tasks);
  }, [project, refreshFlag, setGlobalTasks, sprint, refreshFlagForSelected]);

  const [openSubtaskTaskId, setOpenSubtaskTaskId] = useState<string | null>(
    null
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderSubtasks = (task: Task) => {
    if (!task.subtasks || openSubtaskTaskId !== task.id) return null;

    return task.subtasks.map((subtask) => (
      <div key={subtask.id} className="mt-3 ml-3 bg-white/10 rounded-xl p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">
              {subtask.title}
            </h4>
            <p className="text-white text-xs opacity-70 mb-2">
              <span dangerouslySetInnerHTML={{ __html: subtask.description }} />
            </p>
          </div>
          <div className="relative">
            <button
              className="p-1 rounded-4xl hover:bg-white/20 transition"
              title="More options"
              onClick={(e) => {
                e.stopPropagation();
                setOpenSubtask(openSubtask === subtask.id ? null : subtask.id);
              }}
            >
              <Image src={more} alt="More" width={20} height={20} />
            </button>
            {openSubtask === subtask.id && (
              <div className="absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl min-w-[150px] gap-3 z-20 shadow-lg backdrop-blur-sm">
                <button
                  className="flex items-center gap-2 cursor-pointer font-extralight"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameSubtask(subtask);
                  }}
                >
                  <Image src={edit_2} alt="Rename" width={20} height={20} />
                  Rename
                </button>
                {(role === "admin" || role === "super_admin") && (
                  <button
                    className="flex items-center gap-2 cursor-pointer font-extralight"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveSubtask(subtask);
                    }}
                  >
                    <Image src={archive} alt="Archive" width={20} height={20} />
                    Archive
                  </button>
                )}
                <button
                  className="flex items-center gap-2 cursor-pointer font-extralight"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSubtask(subtask);
                  }}
                >
                  <Image src={trash} alt="Delete" width={20} height={20} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
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
        await clxRequest.post("/tasks/statuses", { name: title });
      } catch (error) {
        alert("Failed to add status to backend" + error);
        return;
      }
      setTasks((prev) => {
        const current = prev ?? {
          "To Do": [],
          "In Progress": [],
          Testing: [],
          Cancelled: [],
          Done: [],
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
    <div className="relative flex gap-5 w-full grow">
      {tasks &&
        Object.entries(tasks).map(([status, column]) => (
          <div
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
            className="flex-shrink-0 h-min w-80 bg-white/10 rounded-lg"
          >
            <div className="flex items-center p-4">
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
                } text-white px-2 text-[12px] ml-1 py-0.5 rounded-full`}
              >
                {column.length}
              </span>
              <div className="flex-1" />
              <div className="relative">
                <button
                  className="p-1 rounded-4xl hover:bg-white/20 transition"
                  title="More options"
                  onClick={() =>
                    setOpenColumnDropdown(
                      openColumnDropdown === status ? null : status
                    )
                  }
                >
                  <Image src={more} alt="More" width={20} height={20} />
                </button>
                {openColumnDropdown === status && (
                  <div
                    className="absolute flex p-4 w-60 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 shadow-lg z-10"
                    style={{
                      boxShadow: "0px 4px 10px 0px #0000001A",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <button
                      className="flex items-center gap-2 cursor-pointer font-extralight"
                      onClick={() => {
                        handleRenameColumn(status);
                      }}
                    >
                      <Image src={edit_2} alt="Rename" width={20} height={20} />
                      Rename column
                    </button>
                    <button
                      className="flex items-center gap-2 cursor-pointer font-extralight"
                      onClick={() => {
                        setSelectMode(true);
                        const tasksInColumn = column.map((task) => task.id);
                        setSelectedTasks([
                          ...new Set([...selectedTasks, ...tasksInColumn]),
                        ]);
                        setOpenColumnDropdown(null);
                      }}
                    >
                      <Image
                        src={task_square}
                        alt="Select"
                        width={20}
                        height={20}
                      />
                      Select all
                    </button>
                    {(role === "admin" || role === "super_admin") && (
                      <button
                        className="flex items-center gap-2 cursor-pointer font-extralight"
                        onClick={() => {
                          handleArchiveColumn(column);
                        }}
                      >
                        <Image
                          src={archive}
                          alt="Archive"
                          width={20}
                          height={20}
                        />
                        Archive all in this group
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3">
              {column.map((task) => (
                <div
                  key={task.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, task, status)}
                  onDragEnd={handleDragEnd}
                  onClick={() => {
                    if (selectMode) {
                      if (selectedTasks.includes(task.id)) {
                        setSelectedTasks(
                          selectedTasks.filter((id) => id !== task.id)
                        );
                      } else {
                        setSelectedTasks([...selectedTasks, task.id]);
                      }
                    }
                  }}
                  className={`bg-white/5 shadow-xl rounded-xl p-5 border transition-all duration-200 cursor-move
                    ${
                      selectedTasks.includes(task.id)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/20 hover:bg-opacity-20"
                    }`}
                >
                  {isBoardPage && (
                    <div className="flex justify-between">
                      <h3 className="text-white text-base font-semibold mb-1">
                        {task?.project?.title ? (
                          task.project.title
                        ) : (
                          <span className="italic text-gray-400">
                            Not assigned any project
                          </span>
                        )}
                      </h3>
                      <div className="relative">
                        <button
                          className="p-1 rounded-4xl hover:bg-white/20 transition"
                          title="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenTaskDropdown(
                              openTaskDropdown === task.id ? null : task.id
                            );
                          }}
                        >
                          <Image src={more} alt="More" width={20} height={20} />
                        </button>
                        {openTaskDropdown === task.id && (
                          <div className="w-60 absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 z-20 shadow-lg backdrop-blur-sm">
                            <EditTask task={task} onTaskUpdated={fetchTasks} />
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectMode(true);
                                if (!selectedTasks.includes(task.id)) {
                                  setSelectedTasks([...selectedTasks, task.id]);
                                }
                              }}
                            >
                              <Image
                                src={task_square}
                                alt="Delete"
                                width={20}
                                height={20}
                              />
                              Select
                            </button>
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameTask(task);
                              }}
                            >
                              <Image
                                src={edit_2}
                                alt="Rename"
                                width={20}
                                height={20}
                              />
                              Rename
                            </button>
                            {(role === "admin" || role === "super_admin") && (
                              <button
                                className="flex items-center gap-2 cursor-pointer font-extralight"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveTask(task);
                                }}
                              >
                                <Image
                                  src={archive}
                                  alt="Archive"
                                  width={20}
                                  height={20}
                                />
                                Archive
                              </button>
                            )}
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task);
                              }}
                            >
                              <Image
                                src={trash}
                                alt="Delete"
                                width={20}
                                height={20}
                              />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <h3 className="text-white text-base font-semibold mb-1">
                      {task.name}
                    </h3>
                    {isBoardPage ? null : (
                      <div className="relative">
                        <button
                          className="p-1 rounded-4xl hover:bg-white/20 transition"
                          title="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenTaskDropdown(
                              openTaskDropdown === task.id ? null : task.id
                            );
                          }}
                        >
                          <Image src={more} alt="More" width={20} height={20} />
                        </button>
                        {openTaskDropdown === task.id && (
                          <div className="w-60 absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 z-20 shadow-lg backdrop-blur-sm">
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Image
                                src={taskpng}
                                alt="Delete"
                                width={20}
                                height={20}
                              />
                              Add subtask
                            </button>
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectMode(true);
                                if (!selectedTasks.includes(task.id)) {
                                  setSelectedTasks([...selectedTasks, task.id]);
                                }
                              }}
                            >
                              <Image
                                src={task_square}
                                alt="Delete"
                                width={20}
                                height={20}
                              />
                              Select
                            </button>
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRenameTask(task);
                              }}
                            >
                              <Image
                                src={edit_2}
                                alt="Rename"
                                width={20}
                                height={20}
                              />
                              Rename
                            </button>
                            {(role === "admin" || role === "super_admin") && (
                              <button
                                className="flex items-center gap-2 cursor-pointer font-extralight"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveTask(task);
                                }}
                              >
                                <Image
                                  src={archive}
                                  alt="Archive"
                                  width={20}
                                  height={20}
                                />
                                Archive
                              </button>
                            )}
                            <button
                              className="flex items-center gap-2 cursor-pointer font-extralight"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task);
                              }}
                            >
                              <Image
                                src={trash}
                                alt="Delete"
                                width={20}
                                height={20}
                              />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                                : "Deleted user"
                            }
                            key={userId}
                            className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
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
                                : "Deleted user";
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

                  {/* <div className="flex items-center text-sm gap-2 mb-3">
                    Tags:
                    {task.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="text-white bg-amber-400 py-[1px] px-1 rounded-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div> */}

                  <div className="flex items-center justify-between text-white text-xs opacity-80">
                    <div className="flex items-center gap-1">
                      <FiClock size={12} />
                      Time estimation:{" "}
                      {task.estimatedTime ? `${task.estimatedTime}hr` : "N/A"}
                    </div>

                    <button
                      className="flex items-center gap-1 hover:text-green-400 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenSubtaskTaskId(
                          openSubtaskTaskId === task.id ? null : task.id
                        );
                      }}
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
