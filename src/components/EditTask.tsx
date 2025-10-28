"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTaskStore } from "@/features/task/task.store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import "react-quill-new/dist/quill.snow.css";

import dynamic from "next/dynamic";
import { Task } from "@/interfaces/Tasks";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Status } from "@/interfaces/Statuses";
import taskpng from "@/shared/assets/icons/task.png";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// UUID formatını kontrol eden yardımcı fonksiyon
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const editTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  sprint: z.string().optional(),
  assignedTo: z.array(z.number()).min(1, "At least one assignee is required"),
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
  projectId: z
    .string()
    .refine((val) => !val || uuidRegex.test(val), "Invalid project ID format")
    .optional()
    .transform((val) => val || undefined),
  epicId: z
    .string()
    .refine((val) => !val || uuidRegex.test(val), "Invalid epic ID format")
    .optional()
    .transform((val) => val || undefined),
});

type EditTaskProps = {
  task: Task;
  onClose?: () => void;
  onTaskUpdated?: () => void;
};

function EditTask({ task, onClose, onTaskUpdated,  }: EditTaskProps) {
  const [allTags] = useState<string[]>(task.tags || []);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
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

  // Form setup with initial values from task
    const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      name: task.name,
      status: task.status,
      priority: task.priority,
      startDate: new Date(task.startDate).toISOString().split("T")[0],
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
      sprint: task.sprintId || "",
      assignedTo: task.assignedTo?.map((name) => parseInt(name)) || [],
      timeEstimate: task.estimatedTime || 0,
      description: task.description || "",
      actualTime: task.actualTime || 0,
      tags: task.tags || [],
      projectId: task.projectId,
      epicId: task.epicId || undefined,
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const statusesRes = await clxRequest.get<Status[]>("/tasks/statuses/all");
        setStatuses(statusesRes || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [task.epicId]);




  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const { triggerRefresh } = useTaskStore();

  const onSubmit = async (data: z.infer<typeof editTaskSchema>) => {
    try {
      const {
        timeEstimate,
        sprint,
        projectId: formProjectId,
        epicId: formEpicId,
        ...restData
      } = data;

      const payload: {
        name: string;
        status: string;
        priority: string;
        startDate: string;
        dueDate: string;
        assignedTo: number[];
        description: string;
        estimatedTime: number;
        actualTime: number;
        tags: string[];
        projectId?: string;
        epicId?: string;
        sprintId?: string;
      } = {
        ...restData,
        description,
        estimatedTime: timeEstimate,
        actualTime: data.actualTime,
        tags: allTags,
      };

      // Project ID logic
      if (formProjectId === "test") {
        delete payload.projectId;
      } else if (formProjectId && formProjectId.trim()) {
        payload.projectId = formProjectId;
      }

      if (formEpicId && formEpicId.trim()) {
        payload.epicId = formEpicId;
      }

      if (sprint) {
        payload.sprintId = sprint;
      }

      const { accessToken } = parseCookies();
      await clxRequest.patch(`/tasks/${task.id}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      triggerRefresh();
      onTaskUpdated?.();
      handleClose();
    } catch (error: unknown) {
      const errorResponse = error as {
        response?: { data?: { errors?: Record<string, unknown> } };
      };
      if (errorResponse?.response?.data?.errors) {
        Object.entries(errorResponse.response.data.errors).forEach(
          ([field, message]) => {
            setError(field as keyof z.infer<typeof editTaskSchema>, {
              type: "manual",
              message: String(message),
            });
          }
        );
      } else {
        alert("Failed to update task");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
        className="flex items-center gap-2 cursor-pointer font-extralight"
        onClick={(e) => {
            e.stopPropagation();
        }}
        >
        <Image src={taskpng} alt="Delete" width={20} height={20} />
        Add subtask
        </button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/70" />
      <DialogContent className="bg-white-800/90 backdrop-blur-[2px] text-white border-lime-500 border-1 sm:max-w-[80vw] p-0 max-h-[90vh]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col h-full">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4 border-b border-slate-600">
              <DialogTitle className="text-white text-lg font-medium">
                Edit Task: {task.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-scroll scrollbar mr-2 max-h-[70vh] p-6 pt-4">
              <div className="flex gap-6 min-h-[70vh]">
                {/* Form fields - same as CreateTask but with initial values */}
                <div className="flex-1 space-y-4">
                  {/* Task Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Task Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

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
                        {statuses.map((status) => (
                          <option
                            key={status.id}
                            value={status.name}
                            className="text-black"
                          >
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 focus:ring-2 focus:ring-green-500"
                        {...register("priority")}
                      >
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
                    </div>
                  </div>

                  {/* Dates */}
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
                    </div>
                  </div>

                  {/* Other fields like Sprint, Assignees, etc. - similar to CreateTask */}
                  {/* ... */}
                </div>

                {/* Middle Column - Description & Time estimates */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time estimate
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("timeEstimate", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Actual time
                    </label>
                    <input
                      type="number"
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      {...register("actualTime", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <ReactQuill
                      value={description}
                      onChange={setDescription}
                      theme="snow"
                      className="custom-quill-container"
                      modules={{
                        toolbar: [[{ font: [] }], ["bold", "italic"], ["link"]],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-slate-600">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTask;
