import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import Image from "next/image";
import defaultAvatar from "@/../public/images/avatar.svg"; // fallback image
import { parseCookies } from "nookies";

interface CreatedTaskResponse {
  name: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string[];
  startDate: string;
  dueDate: string;
  estimatedTime: number;
  actualTime: number;
  tags: string[];
  images: {
    id: string;
    url: string;
    type: string;
  }[];
  projectId: string;
  sprintId: string | null;
  id: string;
  archived: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

type Status = {
  id: string;
  name: string;
};

interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  position?: {
    id: string;
    description: string;
    name: string;
  };
}

type CreateTaskFormData = {
  name: string;
  assignedTo: string[];
  status: string;
  priority: string;
  startDate: string;
};

export function CreateTaskForEpicDialog({
  onTaskCreated,
  epicId,
}: {
  epicId: string;
  triggerStyle?: boolean;
  onTaskCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>([]);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await clxRequest.get<{ items: User[] }>(
          "/users?page=1&limit=1000"
        );
        setUsers(response.items || []);
      } catch (error) {
        console.error(error)
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  // Static status options
  const staticStatuses: Status[] = [
    { id: "static-todo", name: "To Do" },
    { id: "static-inprogress", name: "In Progress" },
    { id: "static-cancelled", name: "Cancelled" },
    { id: "static-testing", name: "Testing" },
    { id: "static-done", name: "Done" },
  ];

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await clxRequest.get<Status[]>("/tasks/statuses/all");
        // Merge static and fetched, avoiding duplicates by name
        const merged = [...staticStatuses];
        response?.forEach((dbStatus) => {
          if (
            !merged.some(
              (s) => s.name.toLowerCase() === dbStatus.name.toLowerCase()
            )
          ) {
            merged.push(dbStatus);
          }
        });
        setStatuses(merged);
      } catch (error) {
        console.error("Error fetching statuses:", error);
        setStatuses(staticStatuses);
      }
    };
    fetchStatuses();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Task name is required"),
        assignedTo: z
          .array(z.string())
          .min(1, "At least one assignee is required"),
        status: z.string().min(1, "Status is required"),
        priority: z.string().min(1, "Priority is required"),
        startDate: z.string().min(1, "Start date is required"),
      })
    ),
    defaultValues: {
      name: "",
      assignedTo: [],
      status: "",
      priority: "",
      startDate: "",
    },
  });

  const selectedAssignedTo = watch("assignedTo") || [];

  function addUser(userId: string) {
    const current = selectedAssignedTo ?? [];
    if (!current.includes(userId)) {
      setValue("assignedTo", [...current, userId]);
    }
  }
  function removeUser(userId: string) {
    const current = selectedAssignedTo ?? [];
    setValue(
      "assignedTo",
      current.filter((id: string) => id !== userId)
    );
  }

  const onSubmit = async (formValues: CreateTaskFormData) => {
    try {
      const payload = {
        name: formValues.name,
        assignedTo: formValues.assignedTo,
        status: formValues.status,
        priority: formValues.priority,
        startDate: formValues.startDate,
      };
      const { accessToken } = parseCookies();
      const response = await clxRequest.post<CreatedTaskResponse>("/tasks", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const createdTaskId = response?.id;
      if (createdTaskId) {
        await clxRequest.patch(`/epic/${epicId}`, {
          taskIds: [createdTaskId],
        }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      onTaskCreated?.();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error(error);
      alert(`Failed to create epic task: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span>Add task</span>
      </DialogTrigger>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-white text-lg font-medium">
              Add new task
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Task name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Task name
              </label>
              <input
                {...register("name")}
                className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                placeholder="Task name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
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
                    {(selectedAssignedTo ?? []).length === 0 && (
                      <span className="text-gray-400 text-xs">
                        Select assignees...
                      </span>
                    )}
                    {(selectedAssignedTo ?? []).map((selectedId: string) => {
                      const user = users.find(
                        (u) => String(u.id) === selectedId
                      );
                      if (!user) return null;
                      return (
                        <div
                          key={user.id}
                          className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded"
                        >
                          {/* Replace with your Image import if needed */}
                          <Image
                            src={
                              user.avatarUrl ? user.avatarUrl : defaultAvatar
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="text-xs text-white">
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : "Deleted user"}
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
                    <span
                      role="button"
                      tabIndex={0}
                      className="text-gray-400 ml-auto hover:text-gray-200 text-lg cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen((v) => !v);
                      }}
                    >
                      &#x25BC;
                    </span>
                  </div>
                  {/* Dropdown list */}
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto bg-white/90 rounded shadow-lg border border-gray-300">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-green-100 ${(selectedAssignedTo ?? []).includes(String(user.id)) ? "bg-green-200" : ""}`}
                          onClick={() => addUser(String(user.id))}
                        >
                          {/* Replace with your Image import if needed */}
                          <Image
                            src={
                              user.avatarUrl ? user.avatarUrl : defaultAvatar
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="text-sm text-black">
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : "Deleted user"}
                          </span>
                          {(selectedAssignedTo ?? []).includes(
                            String(user.id)
                          ) && (
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

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="" className="text-black">
                    Select status
                  </option>
                  {statuses?.map((status) => (
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
                <label className="block text-sm text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
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

            {/* Start date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Start date
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>
          </form>
        </div>
        <DialogFooter className="bg-gray-750 px-6 py-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
