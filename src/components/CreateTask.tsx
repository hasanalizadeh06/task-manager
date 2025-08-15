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
import TaskList from "./TaskList";
import { Task } from "@/interfaces/Tasks";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sprint, SprintsResponse } from "@/interfaces/Sprints";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Zod schema for task creation
const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  sprint: z.string().min(1, "Sprint is required"),
  assignedTo: z.array(z.string()).min(1, "At least one assignee is required"),
  timeEstimate: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Time estimate is required")
  ),
  actualTime: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Actual time is required")
  ),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

function CreateTask({
  name,
  id,
}: {
  name: string | undefined;
  id: string | undefined;
}) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const handleAddTag = (tag: string) => {
    if (tag && !allTags.includes(tag)) {
      setAllTags([...allTags, tag]);
      setTagInput("");
    }
  };
  const handleRemoveTag = (idx: number) => {
    setAllTags(allTags.filter((_, i) => i !== idx));
  };
  const tasks: Task[] = [
    {
      id: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
      name: "Main page",
      assignedTo: ["Hasan"],
      startDate: "2025-07-14T06:40:17.522Z",
      priority: "Medium",
      dueDate: "2025-07-14T06:40:17.522Z",
      description: "Claradix main page",
      status: "To Do",
      tags: ["string"],
      images: [],
      progress: 0,
      estimatedTime: null,
      actualTime: 0,
      createdAt: "2025-07-14T06:41:20.838Z",
      updatedAt: "2025-07-14T06:41:20.838Z",
      projectId: "c8c619a5-45f2-468a-9992-52abd1dde412",
      sprintId: null,
      subtasks: [
        {
          id: "888185f2-f0e9-45ab-a984-665130f7de51",
          title: "Main logo",
          description: "string",
          status: "To Do",
          priority: "Medium",
          assignedTo: "string",
          estimatedTime: 0,
          actualTime: 0,
          dueDate: "2025-07-14T06:41:52.113Z",
          order: 0,
          createdAt: "2025-07-14T06:42:05.163Z",
          updatedAt: "2025-07-14T06:42:05.163Z",
          taskId: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
        },
      ],
      project: {
        id: "c8c619a5-45f2-468a-9992-52abd1dde412",
        title: "Claradix",
        description: "Test",
        customerId: "cea72c15-232f-48a1-ba8b-9d5de5989b8d",
      },
      sprint: null,
    },
    {
      id: "f18565fe-f123-4ec8-8024-c09150ddfsada5a7",
      name: "Main page",
      assignedTo: ["Hasan"],
      startDate: "2025-07-14T06:40:17.522Z",
      priority: "Medium",
      dueDate: "2025-07-14T06:40:17.522Z",
      description: "Claradix main page",
      status: "To Do",
      tags: ["string"],
      images: [],
      progress: 0,
      estimatedTime: null,
      actualTime: 0,
      createdAt: "2025-07-14T06:41:20.838Z",
      updatedAt: "2025-07-14T06:41:20.838Z",
      projectId: "c8c619a5-45f2-468a-9992-52abd1dde412",
      sprintId: null,
      subtasks: [
        {
          id: "888185f2-f0e9-45ab-a984-665130f7de51",
          title: "Main logo",
          description: "string",
          status: "To Do",
          priority: "Medium",
          assignedTo: "string",
          estimatedTime: 0,
          actualTime: 0,
          dueDate: "2025-07-14T06:41:52.113Z",
          order: 0,
          createdAt: "2025-07-14T06:42:05.163Z",
          updatedAt: "2025-07-14T06:42:05.163Z",
          taskId: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
        },
      ],
      project: {
        id: "c8c619a5-45f2-468a-9992-52abd1dde412",
        title: "Claradix",
        description: "Test",
        customerId: "cea72c15-232f-48a1-ba8b-9d5de5989b8d",
      },
      sprint: null,
    },
  ];
  const [sprints, setSprints] = useState<Sprint[]>([]);
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await clxRequest.get<SprintsResponse>(
          "sprints?page=1&limit=1000"
        );
        setSprints(response.items || []);
      } catch (error) {
        console.error("Error fetching sprints:", error);
      }
    };
    fetchSprints();
  }, []);

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
  function addUser(userId: string) {
    if (!assignedTo.includes(userId)) {
      setValue("assignedTo", [...assignedTo, userId]);
    }
  }
  function removeUser(userId: string) {
    setValue(
      "assignedTo",
      assignedTo.filter((id) => id !== userId)
    );
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await clxRequest.get<{ items: User[] }>(
          "users?page=1&limit=1000"
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
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: name || "",
      status: "",
      priority: "",
      startDate: "",
      dueDate: "",
      sprint: "",
      assignedTo: [],
      timeEstimate: "",
      description: "",
      actualTime: "",
      tags: allTags,
    },
  });

  // For multiselect
  const assignedTo = watch("assignedTo");

  // Submit handler
  // Zustand store
  const { addTask, triggerRefresh } = useTaskStore();

  const onSubmit = async (data: z.infer<typeof createTaskSchema>) => {
    try {
      // Map payload keys to backend requirements
      const payload = {
        ...data,
        description,
        projectId: id,
        estimatedTime: data.timeEstimate,
        actualTime: data.actualTime,
        tags: allTags,
        sprintId: data.sprint,
      };
      // Remove old keys
      delete payload.timeEstimate;
      delete payload.sprint;
      setAllTags([]); // Clear tags after submission
      const { accessToken } = parseCookies();
      const response: Task = await clxRequest.post("tasks", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response && response.id) {
        addTask(response);
        triggerRefresh();
      }
      setIsOpen(false);
      reset();
        } catch (error: any) {
      if (error?.response?.data?.errors) {
        // If backend returns validation errors, set them in form
        Object.entries(error.response.data.errors).forEach(
          ([field, message]) => {
            setError(field as any, {
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
                Add task to {name}
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
                      defaultValue={name}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Project */}
                  {/* 
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project
                    </label>
                    <select
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("project")}
                    >
                      <option value="">Select project</option>
                      <option value="Claradix">Claradix</option>
                    </select>
                    {errors.project && (
                      <p className="text-red-400 text-sm">{errors.project.message}</p>
                    )}
                  </div>
                  */}

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
                        <option value="To Do" className="text-black">
                          To Do
                        </option>
                        <option value="In Progress" className="text-black">
                          In Progress
                        </option>
                        <option value="Cancelled" className="text-black">
                          Canceled
                        </option>
                        <option value="Testing" className="text-black">
                          Testing
                        </option>
                        <option value="Done" className="text-black">
                          Done
                        </option>
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
                      Sprint
                    </label>
                    <select
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 focus:ring-2 focus:ring-green-500"
                      {...register("sprint")}
                    >
                      <option value="" className="text-black">
                        Select sprint
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
                    {errors.sprint && (
                      <p className="text-red-400 text-sm">
                        {errors.sprint.message}
                      </p>
                    )}
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
                              (u) => String(u.id) === selectedId
                            );
                            if (!user) return null;
                            return (
                              <div
                                key={user.id}
                                className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded"
                              >
                                <Image
                                  src={user.avatarUrl ? user.avatarUrl : img}
                                  alt={user.firstName + " " + user.lastName}
                                  width={20}
                                  height={20}
                                  style={{ borderRadius: "50%" }}
                                />
                                <span className="text-xs text-white">
                                  {user.firstName} {user.lastName}
                                </span>
                                <button
                                  type="button"
                                  className="ml-1 text-red-400 hover:text-red-600 text-2xl"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeUser(String(user.id));
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
                                className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-green-100 ${assignedTo.includes(String(user.id)) ? "bg-green-200" : ""}`}
                                onClick={() => addUser(String(user.id))}
                              >
                                <Image
                                  src={user.avatarUrl ? user.avatarUrl : img}
                                  alt={user.firstName + " " + user.lastName}
                                  width={24}
                                  height={24}
                                  style={{ borderRadius: "50%" }}
                                />
                                <span className="text-sm text-black">
                                  {user.firstName} {user.lastName}
                                </span>
                                {assignedTo.includes(String(user.id)) && (
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

                  {/* Time estimate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time estimate
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("timeEstimate", { valueAsNumber: true })}
                      min={1}
                    />
                    {errors.timeEstimate && (
                      <p className="text-red-400 text-sm">
                        {errors.timeEstimate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle Column - Description & Attachments */}
                <div className="flex-1 space-y-4">
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
                  <div>
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
                </div>

                {/* Right Column - Activity */}
                <div className="w-80 bg-white/10 flex flex-col rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Activity</h3>
                  </div>

                  <div className="space-y-4 overflow-y-auto flex-1">
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No activity yet</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type to add your comment"
                      className="flex-1 rounded-lg bg-white/10 border-0 py-2 px-3 text-white text-sm focus:ring-2 focus:ring-green-500"
                    />
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg">
                      <BsFillSendFill />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtasks Section - Now inside scrollable area */}
              <div className="w-full flex gap-5 flex-col">
                <h3 className="text-lg font-medium text-white">Subtasks</h3>
                <div className="flex gap-5 w-full flex-col">
                  <TaskList addable={true} tasks={tasks} />
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
