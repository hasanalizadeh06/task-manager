"use client";
import ProgressCircle from "@/components/rechart-uis/ProgressCircile";
import emptyTickCircle from "@/shared/assets/icons/emptytickcircle.png";
import greenTick from "@/shared/assets/icons/greentick.png";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import img from "@/../public/images/avatar.svg";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import CreateEpicDialog from "@/components/CreateEpic";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { useRoleStore } from "@/features/auth/model/role.store";
import icon from "@/shared/assets/icons/more.png";
import icon1 from "@/shared/assets/icons/tick-circle.png";
import icon2 from "@/shared/assets/icons/status.png";
import icon3 from "@/shared/assets/icons/flag.png";
import icon4 from "@/shared/assets/icons/calendar.png";
import icon5 from "@/shared/assets/icons/cup.png";
import icon6 from "@/shared/assets/icons/task.png";
import icon7 from "@/shared/assets/icons/task-square.png";
import tasks from "@/shared/assets/icons/task.png";
import edit_2 from "@/shared/assets/icons/edit-2.png";
import archive from "@/shared/assets/icons/archive.png";
import trash from "@/shared/assets/icons/trash.png";
import { CreateTaskForEpicDialog } from "@/components/CreateTaskForEpic";
import CreateTask from "@/components/CreateTask";
import { TasksResponse, Project } from "@/interfaces/Tasks";
import { Sprint  } from "@/interfaces/Sprints";
import { parseCookies } from "nookies";
import { MoveSprint } from "@/components/MoveSprint";

function Page() {
  const role = useRoleStore((state) => state.role);
  const [showEpicTools, setShowEpicTools] = useState("");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState<'project' | 'latest' | 'earliest' | null>(null);
  const [viewStats, setViewStats] = useState(false);
  const [showEpics, setShowEpics] = useState(false);
  // Task shape used across this component
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
    images: unknown[];
    progress: number;
    estimatedTime: number | null;
    actualTime: number;
    createdAt: string;
    updatedAt: string;
    projectId?: string | null;
    epicId?: string | null;
    sprintId?: string | null;
  };

  // Response returned by /sprints/current/projects
  type SprintProjectsResponse = {
    percent: number;
    sprint: {
      id: string;
      name: string;
      description: string | null;
      status: string;
      priority: string;
      startDate: string;
      endDate: string;
      archived: boolean;
      goal: string;
      progress: number;
      createdAt: string;
      updatedAt: string;
      projectId: string | null;
      assignedTo: string[] | null;
      tasks: TaskItem[];
    };
    projects: {
      name: string;
      status: string;
      assignedTo: number[];
    }[];
  };

  const [sprintData, setSprintData] = useState<SprintProjectsResponse | null>(null);

  useEffect(() => {
    async function fetchSprintData() {
      try {
        const data = await clxRequest.get<SprintProjectsResponse>("/sprints/current/projects");
        setSprintData(data);
      } catch (error) {
        console.error("Failed to fetch sprint data:", error);
      }
    }
    fetchSprintData();
  }, []);

  type EpicItem = {
    id: string;
    name: string;
    goal?: string;
    status?: string;
    priority?: string;
    endDate: string;
    progress?: number;
    storyPoints?: number;
  project: { title?: string; id?: string; description?: string; ownerUserId?: string | null; archived?: boolean; createdAt?: string; projectAvatarUrl?: string | null; assignedTo?: Array<number | string> };
    description?: string | null;
    startDate?: string | null;
    archived?: boolean;
    createdAt?: string;
    updatedAt?: string;
    projectId?: string;
    tasks?: TaskItem[];
  };
  const [epics, setEpics] = useState<EpicItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  type User = {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    position?: {
      id: string;
      description: string;
      name: string;
    };
  };
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await clxRequest.get<{ items: User[] }>("/users?page=1&limit=1000");
        setUsers(data.items || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }
    fetchUsers();
  }, []);
  async function fetchEpics() {
    try {
      const data = await clxRequest.get<{ items: EpicItem[] }>("/epic?page=1&limit=1000");
      setEpics(data.items || []);
    } catch (error) {
      console.error("Error fetching epics:", error);
    }
  }
  async function fetchProjects() {
    try {
      const data = await clxRequest.get<{ items: Project[] }>("/projects?page=1&limit=1000");
      setProjects(data.items || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  async function fetchSprints() {
    try {
      const data = await clxRequest.get<{ items: Sprint[] }>("/sprints?page=1&limit=1000");
      setSprints(data.items || []);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  }

  async function handleArchiveEpic(epic: EpicItem) {
    if (window.confirm(`Are you sure you want to archive '${epic.name}'?`)) {
      const { accessToken } = parseCookies();
      try {
        await clxRequest.post(`/archive`, { relationId: epic.id, type: 'epic' }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fetchEpics();
        setShowEpicTools("");
      } catch (error) {
        alert("Archive failed" + error);
        console.error("Archive failed" + error);
      }
    }
  }

  async function handleArchiveTask(task: TaskItem) {
    if (window.confirm(`Are you sure you want to archive '${task.name}'?`)) {
      const { accessToken } = parseCookies();
      try {
        await clxRequest.post(`/archive`, { relationId: task.id, type: 'task' }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fetchTasks();
        setShowEpicTools("");
      } catch (error) {
        alert("Archive failed" + error);
        console.error("Archive failed" + error);
      }
    }
  }


  async function handleRenameEpic(epic: EpicItem) {
    const newName = prompt("Enter new name for epic:", epic.name);
    if (newName && newName !== epic.name) {
      try {
        await clxRequest.patch(`/epic/${epic.id}`, { name: newName });
        fetchEpics();
        setShowEpicTools("");
      } catch (error) {
        alert("Rename failed" + error);
        console.error("Rename failed" + error);
      }
    }
  }

  async function handleRenameTask(task: TaskItem) {
    const newName = prompt("Enter new name for task:", task.name);
    if (newName && newName !== task.name) {
      try {
        await clxRequest.patch(`/tasks/${task.id}`, { name: newName });
        fetchTasks();
        setShowEpicTools("");
      } catch (error) {
        alert("Rename failed" + error);
        console.error("Rename failed" + error);
      }
    }
  }

  async function handleDeleteEpic(epic: EpicItem) {
    if (window.confirm(`Are you sure you want to delete '${epic.name}'?`)) {
      try {
        await clxRequest.delete(`/epic/${epic.id}`);
        setEpics((prev) => prev.filter((e) => e.id !== epic.id));
        setShowEpicTools("");
      } catch (error) {
        alert("Delete failed" + error);
        console.error("Delete failed" + error);
      }
    }
  }

  async function handleDeleteTask(task: TaskItem) {
    if (window.confirm(`Are you sure you want to delete '${task.name}'?`)) {
      try {
        await clxRequest.delete(`/tasks/${task.id}`);
        setBacklogTasks((prev) => prev.filter((e) => e.id !== task.id));
        setShowEpicTools("");
      } catch (error) {
        alert("Delete failed" + error);
        console.error("Delete failed" + error);
      }
    }
  }

  const findName = (id: string, type: string) => {
    if (type === "project") {
      const project = projects.find((p) => p.id === id);
      return project ? project.title : "Unknown Project";
    } else if (type === "epic") {
      const epic = epics.find((e) => e.id === id);
      return epic ? epic.name : "Unknown Epic";
    } else if (type === "sprint") {
      const sprint = sprints.find((s) => s.id === id);
      return sprint ? sprint.name : "Unknown Sprint";
    }
  }

  // fetchEpics / fetchProjects / fetchSprints are stable in this component
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEpics();
    fetchProjects();
    fetchSprints();
  }, []);

  

  const [backlogTasks, setBacklogTasks] = useState<TaskItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

    async function fetchTasks() {
      try {
        const data = await clxRequest.get<TasksResponse>("/tasks?page=1&limit=1000");
        setBacklogTasks(data.items || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }
  useEffect(() => {
    fetchTasks();
  }, []);

  // Sorting and search logic for tasks
  let sortedTasks = [...backlogTasks];
  if (filterType === 'project') {
    sortedTasks = sortedTasks.sort((a, b) => {
      const hasProjA = !!a.projectId;
      const hasProjB = !!b.projectId;
      if (hasProjA && !hasProjB) return -1;
      if (!hasProjA && hasProjB) return 1;
      // Both have or both don't have project
      const projA = hasProjA ? findName(a.projectId!, 'project') ?? '' : '';
      const projB = hasProjB ? findName(b.projectId!, 'project') ?? '' : '';
      return projA.localeCompare(projB);
    });
  } else if (filterType === 'latest') {
    sortedTasks = sortedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (filterType === 'earliest') {
    sortedTasks = sortedTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  // Filter by search query (min 3 chars) - search all related fields
  if (searchQuery.trim().length >= 3) {
    const query = searchQuery.toLowerCase();
    sortedTasks = sortedTasks.filter(task => {
      const nameMatch = task.name.toLowerCase().includes(query);
      const descMatch = task.description && task.description.toLowerCase().includes(query);
      const projectMatch = task.projectId && findName(task.projectId, 'project')?.toLowerCase().includes(query);
      const sprintMatch = task.sprintId && findName(task.sprintId, 'sprint')?.toLowerCase().includes(query);
      const epicMatch = task.epicId && findName(task.epicId, 'epic')?.toLowerCase().includes(query);
      return nameMatch || descMatch || projectMatch || sprintMatch || epicMatch;
    });
  }

  return (
    <div className="flex justify-between h-full scrollbar overflow-y-auto gap-5 pr-2">
      <div className="flex flex-col gap-5 flex-1">
        <div className="bg-[#ffffff1a] px-5 rounded-2xl flex items-center justify-between text-white font-semibold">
          <div className="shrink-0 flex">
            <ProgressCircle percentage={sprintData?.percent || 0} size={60} />
          </div>
          <div className="flex-1 flex flex-col m-4">
            <Link href={`/previous-sprints/${sprintData?.sprint?.name || ""}`}>
              <h3 className="text-white text-lg font-semibold mb-1">
                {sprintData?.sprint?.name || "Current sprint statistics"}
              </h3>
            </Link>
            <p className="text-gray-300 text-sm font-normal leading-relaxed">
              {sprintData?.sprint?.description || "No description available"}
            </p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={() => setViewStats(!viewStats)}
              className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 p-2"
            >
              <CiMenuKebab size={20} />
            </button>
          </div>
        </div>
        {viewStats ? (
          sprintData?.projects.map((project, index) => (
            <div
              key={index}
              className="bg-[#ffffff1a] flex items-center justify-between p-4 rounded-2xl"
            >
              <div className="text-white font-medium">{project.name}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {project.assignedTo.slice(0, 2).map((userId, userIndex) => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <Image
                        key={userIndex}
                        src={user?.avatarUrl || img}
                        width={40}
                        height={40}
                        alt="User Profile Photo"
                        className="rounded-full size-10 object-cover border-2 border-white shrink-0"
                        style={{ marginLeft: userIndex > 0 ? "-8px" : "0" }}
                      />
                    );
                  })}
                  {project.assignedTo.length > 2 && (
                    <div
                      className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                      style={{ marginLeft: "-8px" }}
                    >
                      +{project.assignedTo.length - 2}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">Status:</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        project.status === "Done"
                          ? "bg-green-500"
                          : project.status === "In Progress"
                            ? "bg-blue-500"
                            : project.status === "Test"
                              ? "bg-yellow-500"
                              : project.status === "Blocked"
                                ? "bg-red-500"
                                : "bg-gray-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        project.status === "Done"
                          ? "text-green-400"
                          : project.status === "In Progress"
                            ? "text-blue-400"
                            : project.status === "Test"
                              ? "text-yellow-400"
                              : project.status === "Blocked"
                                ? "text-red-400"
                                : "text-gray-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
        <div className="p-5 rounded-2xl flex flex-col gap-5 justify-between text-white bg-[#ffffff1a]">
          <div className="flex justify-between w-full items-center">
            <span className="font-semibold">Backlog</span>
            <button
              className="text-[#00c951] font-semibold cursor-pointer"
              onClick={() => {
                setShowEpics(!showEpics);
              }}
            >
              {showEpics ? "Hide" : "Show"} Epics
            </button>
          </div>
          <div className="flex gap-4 relative">
            <button
              className="flex items-center gap-2 text-white bg-white/10 cursor-pointer px-4 py-2 rounded-full shadow"
              onClick={() => setFilterDropdownOpen((open) => !open)}
            >
              <FaBars />
              Filter
            </button>
            {filterDropdownOpen && (
              <div className="absolute left-0 top-12 z-20 bg-white/10 rounded-xl shadow-lg p-2 min-w-[150px] flex flex-col gap-2 backdrop-blur">
                <button
                  className={`w-full flex cursor-pointer items-center text-left px-3 py-2 rounded hover:bg-white/20 text-white`}
                  onClick={() => {
                    if (filterType === 'project') {
                      setFilterType(null);
                    } else {
                      setFilterType('project');
                    }
                    setFilterDropdownOpen(false);
                  }}
                >
                  <Image
                    src={filterType === 'project' ? greenTick : emptyTickCircle}
                    alt="Project sort"
                    width={20}
                    height={20}
                    style={{ marginRight: 10 }}
                  />
                  <span style={filterType === 'project' ? { color: '#7CFC00', fontWeight: 600 } : {}}>By Project</span>
                </button>
                <button
                  className={`w-full flex cursor-pointer items-center text-left px-3 py-2 rounded hover:bg-white/20 text-white`}
                  onClick={() => {
                    if (filterType === 'latest') {
                      setFilterType(null);
                    } else {
                      setFilterType('latest');
                    }
                    setFilterDropdownOpen(false);
                  }}
                >
                  <Image
                    src={filterType === 'latest' ? greenTick : emptyTickCircle}
                    alt="Latest sort"
                    width={20}
                    height={20}
                    style={{ marginRight: 10 }}
                  />
                  <span style={filterType === 'latest' ? { color: '#7CFC00', fontWeight: 600 } : {}}>Latest</span>
                </button>
                <button
                  className={`w-full flex items-center cursor-pointer text-left px-3 py-2 rounded hover:bg-white/20 text-white`}
                  onClick={() => {
                    if (filterType === 'earliest') {
                      setFilterType(null);
                    } else {
                      setFilterType('earliest');
                    }
                    setFilterDropdownOpen(false);
                  }}
                >
                  <Image
                    src={filterType === 'earliest' ? greenTick : emptyTickCircle}
                    alt="Earliest sort"
                    width={20}
                    height={20}
                    style={{ marginRight: 10 }}
                  />
                  <span style={filterType === 'earliest' ? { color: '#7CFC00', fontWeight: 600 } : {}}>Earliest</span>
                </button>
              </div>
            )}
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full shadow w-80">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                className="bg-transparent outline-none text-white w-full"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="justify-end ml-auto">
              <CreateTask
                dialogTitle="Add new task to Backlog"
                addingSprint={undefined}
                projectName={undefined}
                id={undefined}
              />
            </div>
          </div>
          {/* Grouped rendering by filterType */}
          {filterType === 'project' ? (
            (() => {
              // Group tasks by project name (assigned and unassigned)
              const groups: { [key: string]: typeof sortedTasks } = {};
              sortedTasks.forEach(task => {
                let projectName = 'Unassigned';
                if (task.projectId) {
                  const name = findName(task.projectId, 'project');
                  projectName = typeof name === 'string' ? name : 'Unassigned';
                }
                if (!groups[projectName]) groups[projectName] = [];
                groups[projectName].push(task);
              });
              return Object.entries(groups).map(([project, tasks]) => (
                <div key={project}>
                  <div className="bg-[#ffffff1a] px-3 py-2 rounded-2xl">
                    <div className="text-[#8DFD43] mb-2 py-2">
                      {project}
                    </div>
                    <div className="flex flex-col gap-3">
                      {tasks.map(task => (
                        <div key={task.id} className="bg-white/10 flex justify-between items-center gap-2 w-full rounded-2xl p-5">
                          <div className={`flex w-full ${showEpics ? "flex-col" : "flex-row items-center"} gap-2 justify-between`}>
                            <div className="">{task.name}</div>
                            <div className={`flex items-center gap-2${showEpics ? " flex-row-reverse" : ""}`}>
                              <div className={`${showEpics ? "mr-auto" : "ml-auto"} flex items-center gap-3`}>
                                {task.epicId && (
                                  <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                                    <div className="font-semibold">Epic: </div>
                                    {findName(task.epicId, "epic")}
                                  </div>
                                )}
                                {task.projectId && (
                                  <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                                    <div className="font-semibold">Project: </div>
                                    {findName(task.projectId, "project")}
                                  </div>
                                )}
                                {task.sprintId && (
                                  <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                                    <div className="font-semibold">Sprint: </div>
                                    {findName(task.sprintId, "sprint")}
                                  </div>
                                )}
                              </div>
                              <div className="flex -space-x-2">
                                {task.assignedTo && task.assignedTo.length > 2 ? (
                                  <>
                                    {task.assignedTo.slice(0, 2).map((userId, index) => {
                                      const user = users.find(u => u.id === Number(userId));
                                      return (
                                        <div
                                          title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                          key={index}
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
                                    <div
                                      title={task.assignedTo.slice(2).map(userId => {
                                        const user = users.find(u => u.id === Number(userId));
                                        return user ? `${user.lastName[0]}.${user.firstName}` : "Deleted user";
                                      }).join(", ")}
                                      className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                                    >
                                      +{task.assignedTo.length - 2}
                                    </div>
                                  </>
                                ) : (
                                  (task.assignedTo || []).map(userId => {
                                    const user = users.find(u => u.id === Number(userId));
                                    return (
                                      <div
                                        title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
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
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => setShowEpicTools(task.id === showEpicTools ? "" : task.id)}>
                              <Image src={icon} alt="More" width={20} height={20} />
                            </button>
                            {showEpicTools === task.id && (
                              <div className="absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 shadow-lg z-10" style={{boxShadow: "0px 4px 10px 0px #0000001A", backdropFilter: 'blur(20px)'}}>
                                <MoveSprint taskId={task.id} onMoved={fetchTasks}/>
                                <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleRenameTask(task) }}>
                                  <Image src={edit_2} alt="Rename" width={20} height={20} />
                                  Rename
                                </button>
                                {(role === "admin" || role === "super_admin") && (
                                  <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleArchiveTask(task) }}>
                                    <Image src={archive} alt="Archive" width={20} height={20} />
                                    Archive
                                  </button>
                                )}
                                <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleDeleteTask(task) }}>
                                  <Image src={trash} alt="Delete" width={20} height={20} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ));
            })()
          ) : filterType === 'latest' || filterType === 'earliest' ? (
            (() => {
              // Group tasks by date (YYYY-MM-DD)
              const groups: { [key: string]: typeof sortedTasks } = {};
              sortedTasks.forEach(task => {
                const date = new Date(task.createdAt).toLocaleDateString();
                if (!groups[date]) groups[date] = [];
                groups[date].push(task);
              });
              return Object.entries(groups).map(([date, tasks]) => (
                <div key={date}>
                  <div className="bg-[#ffffff1a] px-3 py-2 rounded-2xl">
                    <div className="text-[#8DFD43] mb-2 py-2">
                      {date}
                    </div>
                    <div className="flex flex-col gap-3">
                      {tasks.map(task => (
                        <div key={task.id} className="bg-white/10 flex justify-between items-center gap-2 w-full rounded-2xl p-5">
                          <div className={`flex w-full ${showEpics ? "flex-col" : "flex-row items-center"} gap-2 justify-between`}>
                            <div className="">{task.name}</div>
                            <div className={`flex items-center gap-2${showEpics ? " flex-row-reverse" : ""}`}>
                              <div className={`${showEpics ? "mr-auto" : "ml-auto"} flex items-center gap-3`}>
                                {task.epicId && (
                                  <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                                    <div className="font-semibold">Epic: </div>
                                    {findName(task.epicId, "epic")}
                                  </div>
                                )}
                                {task.projectId && (
                                  <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                                    <div className="font-semibold">Project: </div>
                                    {findName(task.projectId, "project")}
                                  </div>
                                )}
                                {task.sprintId && (
                                  <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                                    <div className="font-semibold">Sprint: </div>
                                    {findName(task.sprintId, "sprint")}
                                  </div>
                                )}
                              </div>
                              <div className="flex -space-x-2">
                                {task.assignedTo && task.assignedTo.length > 2 ? (
                                  <>
                                    {task.assignedTo.slice(0, 2).map((userId, index) => {
                                      const user = users.find(u => u.id === Number(userId));
                                      return (
                                        <div
                                          title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                          key={index}
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
                                    <div
                                      title={task.assignedTo.slice(2).map(userId => {
                                        const user = users.find(u => u.id === Number(userId));
                                        return user ? `${user.lastName[0]}.${user.firstName}` : "Deleted user";
                                      }).join(", ")}
                                      className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                                    >
                                      +{task.assignedTo.length - 2}
                                    </div>
                                  </>
                                ) : (
                                  (task.assignedTo || []).map(userId => {
                                    const user = users.find(u => u.id === Number(userId));
                                    return (
                                      <div
                                        title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
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
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => setShowEpicTools(task.id === showEpicTools ? "" : task.id)}>
                              <Image src={icon} alt="More" width={20} height={20} />
                            </button>
                            {showEpicTools === task.id && (
                              <div className="absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 shadow-lg z-10" style={{boxShadow: "0px 4px 10px 0px #0000001A", backdropFilter: 'blur(20px)'}}>
                                <MoveSprint taskId={task.id} onMoved={fetchTasks}/>
                                <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleRenameTask(task) }}>
                                  <Image src={edit_2} alt="Rename" width={20} height={20} />
                                  Rename
                                </button>
                                <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleArchiveTask(task) }}>
                                  <Image src={archive} alt="Archive" width={20} height={20} />
                                  Archive
                                </button>
                                <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleDeleteTask(task) }}>
                                  <Image src={trash} alt="Delete" width={20} height={20} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ));
            })()
          ) : (
            // Default: not grouped
            sortedTasks.map((task) => (
              <div key={task.id}
                className={`bg-white/10 flex justify-between items-center gap-2 w-full rounded-2xl p-5`}
              >
                <div className={`flex w-full ${showEpics ? "flex-col" : "flex-row items-center"} gap-2 justify-between`}>
                  <div className="">{task.name}</div>
                  <div className={`flex items-center gap-2${showEpics ? " flex-row-reverse" : ""}`}>
                    <div className={`${showEpics ? "mr-auto" : "ml-auto"} flex items-center gap-3`}>
                      {task.epicId && (
                        <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                          <div className="font-semibold">Epic: </div>
                          {findName(task.epicId, "epic")}
                        </div>
                      )}
                      {task.projectId && (
                        <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                          <div className="font-semibold">Project: </div>
                          {findName(task.projectId, "project")}
                        </div>
                      )}
                      {task.sprintId && (
                        <div className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}>
                          <div className="font-semibold">Sprint: </div>
                          {findName(task.sprintId, "sprint")}
                        </div>
                      )}
                    </div>
                    <div className="flex -space-x-2">
                      {task.assignedTo && task.assignedTo.length > 2 ? (
                        <>
                          {task.assignedTo.slice(0, 2).map((userId, index) => {
                            const user = users.find(u => u.id === Number(userId));
                            return (
                              <div
                                title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                key={index}
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
                          <div
                            title={task.assignedTo.slice(2).map(userId => {
                              const user = users.find(u => u.id === Number(userId));
                              return user ? `${user.lastName[0]}.${user.firstName}` : "Deleted user";
                            }).join(", ")}
                            className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                          >
                            +{task.assignedTo.length - 2}
                          </div>
                        </>
                      ) : (
                        (task.assignedTo || []).map(userId => {
                          const user = users.find(u => u.id === Number(userId));
                          return (
                            <div
                              title={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
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
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => setShowEpicTools(task.id === showEpicTools ? "" : task.id)}>
                    <Image src={icon} alt="More" width={20} height={20} />
                  </button>
                  {showEpicTools === task.id && (
                    <div className="absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 shadow-lg z-10" style={{boxShadow: "0px 4px 10px 0px #0000001A", backdropFilter: 'blur(20px)'}}>
                      <MoveSprint taskId={task.id} onMoved={fetchTasks}/>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleRenameTask(task) }}>
                        <Image src={edit_2} alt="Rename" width={20} height={20} />
                        Rename
                      </button>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleArchiveTask(task) }}>
                        <Image src={archive} alt="Archive" width={20} height={20} />
                        Archive
                      </button>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => { handleDeleteTask(task) }}>
                        <Image src={trash} alt="Delete" width={20} height={20} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showEpics && (
        <div className="bg-[#ffffff1a] flex-1 p-5 rounded-2xl flex flex-col gap-5 items-start justify-start text-white font-semibold min-h-fit">
          <div className="flex flex-row justify-between items-center text-xl w-full gap-5">
            Epics
            {role == "admin" || role == "super_admin" && <CreateEpicDialog onEpicCreated={fetchEpics}/>}
          </div>
          <div className="flex flex-col gap-5 w-full">
            {epics.map((epic) => (
              <div
                key={epic.id}
                className="bg-[#ffffff1a] p-4 px-5 rounded-2xl w-full flex flex-col gap-2"
              >
                <div className="flex items-center relative justify-between w-full mb-2">
                  <div className="text-lg font-semibold">{epic.name}</div>
                  <Image src={icon} onClick={() => showEpicTools == epic.id ? setShowEpicTools("") : setShowEpicTools(epic.id)} alt="More" width={20} height={20} className="inline-block cursor-pointer" />
                  {showEpicTools == epic.id && (
                    <div className="absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 shadow-lg" style={{boxShadow: "0px 4px 10px 0px #0000001A", backdropFilter: 'blur(20px)'}}>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight">
                        <Image
                          src={tasks}
                          alt="Add Task"
                          width={20}
                          height={20}
                        />
                        <CreateTaskForEpicDialog epicId={epic.id} onTaskCreated={fetchEpics} />
                      </button>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => handleRenameEpic(epic)}>
                        <Image
                          src={edit_2}
                          alt="Rename"
                          width={20}
                          height={20}
                        />
                        Rename
                      </button>
                      {role == "admin" || role == "super_admin" && <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => handleArchiveEpic(epic)}>
                        <Image
                          src={archive}
                          alt="Add Task"
                          width={20}
                          height={20}
                        />
                        Archive
                      </button>}
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => handleDeleteEpic(epic)}>
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
                <div className="flex items-center gap-2">
                  <Image
                    src={icon1}
                    alt="Tick Circle"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Goal:</span>
                  <span>
                    {epic.goal}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon2}
                    alt="Status"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Status:</span>
                  <span className="font-medium">
                    {epic.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon3}
                    alt="Priority"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Priority:</span>
                  <span>
                    {epic.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon4}
                    alt="Due Date"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Due Date:</span>
                  <span>{new Date(epic.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon5}
                    alt="Progress"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Current progress:</span>
                  <span>{epic.progress ?? 0}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon6}
                    alt="Project"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Project:</span>
                  <span>{epic.project.title || "Not assigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon7}
                    alt="Stories"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Stories:</span>
                  <span>{epic.storyPoints}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
