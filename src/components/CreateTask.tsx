"use client";
import Image from "next/image";
import img from "@/../public/images/avatar.svg";
import React, { useState, useEffect } from "react";
import { useTaskStore } from "@/features/task/task.store";
interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  position: {
    id: string;
    description: string;
    name: string;
  };
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BsFillSendFill } from "react-icons/bs";
import "react-quill-new/dist/quill.snow.css";

import dynamic from "next/dynamic";
import { Task } from "@/interfaces/Tasks";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sprint, SprintsResponse } from "@/interfaces/Sprints";
import { Status } from "@/interfaces/Statuses";
import info from "@/shared/assets/icons/info-circle.png";
import SubtasksForm from "./SubtasksForm";
import type { Subtask } from "./SubtasksForm";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const createTaskSchema = () => z.object({
  name: z.string().min(1, "Task name is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  sprintId: z.string().optional(),
  assignedTo: z.array(z.number()).min(1, "At least one assignee is required"),
  estimatedTime: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Time estimate is required")
  ),
  actualTime: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Actual time is required")
  ),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  projectId: z.string()
    .refine(val => !val || uuidRegex.test(val), "Invalid project ID format")
    .optional(),
  epicId: z.string()
    .refine(val => !val || uuidRegex.test(val), "Invalid epic ID format")
    .optional()
});


type ParentType = "project" | "epic" | "none";

function CreateTask({
  projectName,
  addingSprint,
  isBoardPage,
  parentType = "none",
  parentId,
  dialogTitle
}: {
  addingSprint?: Sprint;
  projectName: string | undefined;
  id: string | undefined;
  isBoardPage?: boolean;
  parentType?: ParentType;
  parentId?: string;
  dialogTitle?: string;
}) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);
  const [epics, setEpics] = useState<{ id: string; name: string }[]>([]);
  // const [epicId, setEpicId] = useState<string | undefined>(parentType === "epic" ? parentId : undefined);
  // const [tagInput, setTagInput] = useState("");
  // const handleAddTag = (tag: string) => {
  //   if (tag && !allTags.includes(tag)) {
  //     setAllTags([...allTags, tag]);
  //     // setTagInput("");
  //   }
  // };
  // const handleRemoveTag = (idx: number) => {
  //   setAllTags(allTags.filter((_, i) => i !== idx));
  // };

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await clxRequest.get<SprintsResponse>(
          "/sprints?page=1&limit=1000"
        );
        setSprints(response.items || []);
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };
    fetchSprints();
    const fetchStatuses = async () => {
      try {
        const response = await clxRequest.get<Status[]>(
          "/tasks/statuses/all"
        );
        setStatuses(response || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
    if (isBoardPage || parentType === "project") {
      clxRequest.get<{ items: { id: string; title: string }[] }>("/projects?page=1&limit=1000")
        .then(res => setProjects(res.items || []))
        .catch(() => setProjects([]));
    }
    if (parentType === "epic") {
      clxRequest.get<{ items: { id: string; name: string }[] }>("/epics?page=1&limit=1000")
        .then(res => setEpics(res.items || []))
        .catch(() => setEpics([]));
    }
  }, [isBoardPage, parentType]);

  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);
  function addUser(userId: number) {
    if (!assignedTo.includes(userId)) {
      setValue("assignedTo", [...assignedTo, userId]);
    }
  }
  function removeUser(userId: number) {
    setValue(
      "assignedTo",
      assignedTo.filter((id) => id !== userId)
    );
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await clxRequest.get<{ items: User[] }>(
          "/users?page=1&limit=1000"
        );
        setUsers(response.items || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Form setup
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createTaskSchema()),
    defaultValues: {
      name: "",
      status: "",
      priority: "",
      startDate: "",
      dueDate: "",
      sprintId: addingSprint ? addingSprint.id : "",
      assignedTo: [],
      projectId:"",
      estimatedTime: "",
      description: "",
      actualTime: "",
      tags: allTags,
    },
  });

  const assignedTo = watch("assignedTo");
  const { addTask, triggerRefresh } = useTaskStore();
  const onSubmit = async (data: z.infer<ReturnType<typeof createTaskSchema>>) => {
    try {
      if (subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
          const s = subtasks[i];
          if (!s.title || !s.priority || !s.assignees || s.assignees.length === 0 || !s.startDate || !s.dueDate) {
            setSubtaskError(`Subtask #${i + 1} is missing required fields.`);
            return;
          }
        }
      }
      
      setSubtaskError("");
      setAllTags([]); 
      console.log(data)
      const { accessToken } = parseCookies();
      const response: Task = await clxRequest.post("/tasks", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response && response.id && subtasks.length > 0) {
        const subtasksWithTaskId = subtasks.map(subtask => ({
          ...subtask,
          taskId: response.id,
        }));
        clxRequest.post("/subtasks/bulk", {
          items: subtasksWithTaskId
        }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch((error) => {
          console.error("Error creating subtasks:", error);
        });
        if (activityList.length > 0) {
          const activities = activityList.map(activity => ({ message: activity.message }));
          try {
            clxRequest.post(`/activities/${response.id}/bulk`, {
              items: activities  
            }, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            setActivityList([]);
          } catch (error) {
            console.error("Error creating activities:", error);
          }
        }
        addTask(response);
        triggerRefresh();
      }
      setIsOpen(false);
      reset();
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { errors?: Record<string, unknown> } } };
      if (errorResponse?.response?.data?.errors) {
        Object.entries(errorResponse.response.data.errors).forEach(
          ([field, message]) => {
            setError(field as keyof z.infer<ReturnType<typeof createTaskSchema>>, {
              type: "manual",
              message: String(message),
            });
          }
        );
      } else {
        alert("Failed to create task");
      }
    }
  };

  // Compute dialog project name
  let dialogProjectName = projectName;
  if (parentType === "project") {
    dialogProjectName = projectName;
  } else if (isBoardPage) {
    const watchedProjectId = watch("projectId");
    const selectedProject = projects.find(p => p.id === watchedProjectId);
    if (selectedProject) {
      dialogProjectName = selectedProject.title;
    } else {
      dialogProjectName = undefined;
    }
  } else {
    dialogProjectName = undefined;
  }

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskError, setSubtaskError] = useState<string>("");
  const [activityInput, setActivityInput] = useState("");
  const [activityList, setActivityList] = useState<Array<{
    user: User;
    message: string;
    createdAt: Date;
  }>>([]);

    // Helper to format time ago
  function formatTimeAgo(date: Date) {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutes
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  function handleSendActivity() {
    if (!activityInput.trim()) return;
    const currentUser = users[0] || { id: 0, firstName: 'You', lastName: '', avatarUrl: img };
    setActivityList(prev => {
      const updated = [
        ...prev,
        {
          user: currentUser,
          message: activityInput,
          createdAt: new Date(),
        }
      ];
      return updated;
    });
    setActivityInput("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#00C951] hover:bg-[#00c20a] rounded-3xl text-white px-4 py-2 font-semibold text-sm transition">
          Add new task
        </button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/70" />
      <DialogContent className="bg-white-800/90 backdrop-blur-[2px] text-white border-lime-500 border-1 sm:max-w-[80vw] p-0 max-h-[90vh]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col h-full">
            {/* Header - Fixed */}
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4 border-b border-slate-600">
              <DialogTitle className="text-white text-lg font-medium flex gap-2 items-center justify-center">
                {dialogTitle
                  ? dialogTitle
                  : parentType === "project" && dialogProjectName
                  ? `Add new task to ${dialogProjectName}`
                  : isBoardPage
                  ? `Add new task${dialogProjectName ? ` to ${dialogProjectName}` : ""}`
                  : "Add new task"}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-scroll scrollbar mr-2 max-h-[70vh] p-6 pt-4">
              <div className="flex gap-6 min-h-[70vh]">
                {/* Left Column - Form Fields */}
                <div className="flex-1 space-y-4">
                  {/* Task Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Task Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Task Name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Project selectbox only if isBoardPage, optional */}
                  {isBoardPage && (
                    <div>
                      <label className="text-sm font-medium flex justify-start items-center text-gray-300 mb-2 relative">
                        <span className="relative group">
                          <Image
                            src={info}
                            alt="Info"
                            width={16}
                            height={16}
                            className="inline-block mr-1 align-middle cursor-pointer"
                          />
                          <span className="absolute z-[200] top-full left-0 mt-2 hidden group-hover:block bg-[#6AC42F] rounded-xl text-white px-4 py-2 text-xs w-max min-w-[220px] shadow-lg transition-opacity">
                            You can assign this task to a project (optional)
                          </span>
                        </span>
                        Project (optional)
                      </label>
                      <select
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        {...register("projectId")}
                        value={watch("projectId") || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setValue("projectId", value || undefined);
                        }}
                      >
                        <option value="" className="text-black">Select project (optional)</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id} className="text-black">
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Epic selectbox if parentType is epic */}
                  {parentType === "epic" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Epic</label>
                      <select
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        {...register("epicId")}
                        defaultValue={parentId || ""}
                      >
                        <option value="" className="text-black">Select epic</option>
                        {epics.map((epic) => (
                          <option key={epic.id} value={epic.id} className="text-black">
                            {epic.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Status & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 focus:ring-2 focus:ring-green-500"
                        {...register("status")}
                      >
                        <option value="" className="text-black">
                          Select status
                        </option>
                        {statuses && statuses.map((status) => (
                          <option
                            key={status.id}
                            value={status.name}
                            className="text-black"
                          >
                            {status.name}
                          </option>
                        ))}
                      </select>
                      {errors.status && (
                        <p className="text-red-400 text-sm">
                          {errors.status.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 focus:ring-2 focus:ring-green-500"
                        {...register("priority")}
                      >
                        <option value="" className="text-black">
                          Select priority
                        </option>
                        <option value="Low" className="text-black">
                          Low
                        </option>
                        <option value="Medium" className="text-black">
                          Medium
                        </option>
                        <option value="High" className="text-black">
                          High
                        </option>
                        <option value="Critical" className="text-black">
                          Critical
                        </option>
                      </select>
                      {errors.priority && (
                        <p className="text-red-400 text-sm">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Start date & Due date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        {...register("startDate")}
                      />
                      {errors.startDate && (
                        <p className="text-red-400 text-sm">
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Due date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        {...register("dueDate")}
                      />
                      {errors.dueDate && (
                        <p className="text-red-400 text-sm">
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sprint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sprint (optional)
                    </label>
                    <select
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 focus:ring-2 focus:ring-green-500"
                      {...register("sprintId")}
                    >
                      <option value="" className="text-black">
                        Select sprint (optional)
                      </option>
                      {sprints.map((sprint) => (
                        <option
                          key={sprint.id}
                          value={sprint.id}
                          className="text-black"
                        >
                          {sprint.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assignees (Multiselect with profile photos) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assignees
                    </label>
                    <div className="w-full rounded-lg bg-white/10 border-0 py-2 px-3">
                      <div ref={dropdownRef} className="relative">
                        {/* Selected users as chips */}
                        <div
                          className="flex flex-wrap gap-2 min-h-[40px] items-center cursor-pointer"
                          onClick={() => setDropdownOpen((v) => !v)}
                        >
                          {assignedTo.length === 0 && (
                            <span className="text-gray-400 text-xs">
                              Select assignees...
                            </span>
                          )}
                          {assignedTo.map((selectedId) => {
                            const user = users.find(
                              (u) => (u.id) === selectedId
                            );
                            if (!user) return null;
                            return (
                              <div
                                key={user.id}
                                className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded"
                              >
                                <Image
                                  src={user.avatarUrl ? user.avatarUrl : img}
                                  alt={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                  width={20}
                                  height={20}
                                  style={{ borderRadius: "50%" }}
                                />
                                <span className="text-xs text-white">
                                  {user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                </span>
                                <button
                                  type="button"
                                  className="ml-1 text-red-400 hover:text-red-600 text-2xl"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeUser(user.id);
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                            );
                          })}
                          <button
                            type="button"
                            className="text-gray-400 ml-auto hover:text-gray-200 text-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen((v) => !v);
                            }}
                          >
                            &#x25BC;
                          </button>
                        </div>
                        {/* Dropdown list */}
                        {dropdownOpen && (
                          <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto bg-white/90 rounded shadow-lg border border-gray-300">
                            {users.map((user) => (
                              <div
                                key={user.id}
                                className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-green-100 ${assignedTo.includes(user.id) ? "bg-green-200" : ""}`}
                                onClick={() => addUser(user.id)}
                              >
                                <Image
                                  src={user.avatarUrl ? user.avatarUrl : img}
                                  alt={user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                  width={24}
                                  height={24}
                                  style={{ borderRadius: "50%" }}
                                />
                                <span className="text-sm text-black">
                                  {user ? `${user.firstName} ${user.lastName}` : "Deleted user"}
                                </span>
                                {assignedTo.includes(user.id) && (
                                  <span className="ml-auto text-green-600 text-xs">
                                    Selected
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.assignedTo && (
                      <p className="text-red-400 text-sm">
                        {errors.assignedTo.message}
                      </p>
                    )}
                  </div>

                </div>

                {/* Middle Column - Description & Attachments */}
                <div className="flex-1 space-y-4">
                  {/* Time estimate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time estimate
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("estimatedTime", { valueAsNumber: true })}
                      min={1}
                    />
                    {errors.estimatedTime && (
                      <p className="text-red-400 text-sm">
                        {errors.estimatedTime.message}
                      </p>
                    )}
                  </div>
                  {/* Actual time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Actual time
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("actualTime", { valueAsNumber: true })}
                      min={1}
                    />
                    {errors.actualTime && (
                      <p className="text-red-400 text-sm">
                        {errors.actualTime.message}
                      </p>
                    )}
                  </div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <ReactQuill
                    value={description}
                    onChange={setDescription}
                    theme="snow"
                    placeholder="Description"
                    className="custom-quill-container"
                    modules={{
                      toolbar: [
                        [{ font: [] }],
                        ["bold", "italic"],
                        ["link"],
                      ],
                    }}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm">
                      {errors.description.message}
                    </p>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Attachment
                    </label>
                    <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-slate-600 text-center">
                      <p className="text-sm text-gray-400">
                        Drop files to upload or{" "}
                        <button className="text-blue-400 hover:text-blue-300">
                          Browse
                        </button>
                      </p>
                    </div>
                  </div>

                  {/* Task tags input */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="w-full rounded-lg bg-white/10 border-0 py-2 max-h-30 scrollbar overflow-y-auto px-3 flex flex-wrap gap-2 min-h-[40px] items-center">
                      {allTags &&
                        allTags.map((tag, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 bg-white/20 px-2 rounded"
                          >
                            <span className="text-xs text-white">{tag}</span>
                            <button
                              type="button"
                              className="ml-1 text-red-400 hover:text-red-600 text-2xl"
                              onClick={() => handleRemoveTag(idx)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      <input
                        type="text"
                        className="bg-transparent outline-none text-white text-xs flex-1 min-w-[80px]"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === " " && tagInput.trim()) {
                            e.preventDefault();
                            handleAddTag(tagInput.trim());
                          }
                        }}
                        placeholder="Type and press space..."
                      />
                    </div>
                  </div> */}
                </div>

                {/* Right Column - Activity */}
                <div className="w-80 bg-white/10 relative flex flex-col pr-2 rounded-lg">
                  <div className="flex items-center justify-between m-4">
                    <h3 className="text-lg font-medium text-white">Activity</h3>
                  </div>
                  <div className="overflow-y-auto flex-1 max-h-100 scrollbar pr-2">
                    {activityList.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">No activity yet</p>
                      </div>
                    )}
                    {activityList.map((item, idx) => (
                      <div key={idx} className="rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={item.user.avatarUrl || img}
                              alt={item.user.firstName + ' ' + item.user.lastName}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                            <span className="font-semibold text-white text-sm">{item.user.firstName} {item.user.lastName}</span>
                          </div>
                          <span className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                        </div>
                        <div className="text-white text-sm px-2 pt-1 pb-2 break-words">{item.message}</div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 w-full p-4 flex items-center gap-2">
                    <input
                      type="text"
                      value={activityInput}
                      onChange={e => setActivityInput(e.target.value)}
                      placeholder="Type to add your comment"
                      className="flex-1 rounded-lg bg-white/10 border-0 py-2 px-3 text-white text-sm focus:ring-2 focus:ring-green-500"
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSendActivity();
                      }}
                    />
                    <button
                      type="button"
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                      onClick={handleSendActivity}
                      disabled={!activityInput.trim()}
                    >
                      <BsFillSendFill />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtasks Section - Now inside scrollable area */}
              <div className="w-full flex gap-5 flex-col">
                <h3 className="text-lg font-medium text-white">Subtasks</h3>
                  {subtaskError && (
                    <div className="text-red-400 text-sm font-medium">{subtaskError}</div>
                  )}
                <div className="flex gap-5 w-full flex-col">
                  <SubtasksForm
                    addable
                    task={{
                      assignedTo: assignedTo.map(String),
                      startDate: watch("startDate"),
                      dueDate: watch("dueDate"),
                      priority: watch("priority"),
                    }}
                    users={users}
                    onChange={setSubtasks}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons - Fixed */}
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-slate-600">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTask;