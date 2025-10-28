import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiPlus } from "react-icons/fi";
import { parseCookies } from "nookies";
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
// User type for assignees
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
import Image from "next/image";
import img from "@/../public/images/avatar.svg";
import FileUpload from "./FileUpload";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  assignedTo: z.array(z.string()).optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export function CreateProjectDialog({
  isCollapsed,
  triggerStyle,
  onProjectCreated,
}: {
  triggerStyle?: boolean;
  isCollapsed: boolean;
  onProjectCreated?: () => void;
}) {

  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [projectAvatar, setProjectAvatar] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      assignedTo: [],
    },
  });

  const assignedTo = watch("assignedTo");

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
    const current = assignedTo ?? [];
    if (!current.includes(userId)) {
      setValue("assignedTo", [...current, userId]);
    }
  }
  function removeUser(userId: string) {
    const current = assignedTo ?? [];
    setValue(
      "assignedTo",
      current.filter((id) => id !== userId)
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

  const onSubmit = async (formValues: CreateProjectFormData) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      if (!accessToken) {
        throw new Error("Access token not found in cookies.");
      }
      const dueDateISO = formValues.dueDate
        ? new Date(formValues.dueDate).toISOString()
        : "";
      const assignedToNumbers = (formValues.assignedTo || []).map((id) => Number(id));
      const payload = {
        title: formValues.title,
        description: formValues.description || "",
        dueDate: dueDateISO,
        assignedTo: assignedToNumbers,
      };
      // If projectAvatar is present, use FormData, else send JSON
      if (projectAvatar) {
        const formData = new FormData();
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("dueDate", payload.dueDate);
        formData.append("assignedTo", JSON.stringify(payload.assignedTo));
        formData.append("projectAvatar", projectAvatar);
        await clxRequest.postForm("/projects", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        await clxRequest.post("/projects", payload, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
      onProjectCreated?.();
      setIsOpen(false);
      reset();
      setProjectAvatar(null);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerStyle ? (
          <button
            className={`flex items-center gap-2 text-[#00C951] font-medium hover:underline ${isCollapsed ? "justify-center" : ""}`}
          >
            <span className="bg-[#00C9512a] rounded-full p-1">
              <FiPlus size={18} color="#7ed957" />
            </span>
            {!isCollapsed && "Create new project"}
          </button>
        ) : (
          <button className="bg-[#00C951] hover:bg-[#00c20a] rounded-3xl text-white px-4 py-2 font-semibold text-sm transition">
            Create new project
          </button>
        )}
      </DialogTrigger>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-white text-lg font-medium">
              Create project
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit((formValues) => onSubmit(formValues))}
            className="space-y-4"
          >
            {/* Title */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Title</label>
              <input
                {...register("title")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white resize-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
              />
              {errors.dueDate && (
                <p className="text-red-400 text-sm">{errors.dueDate.message}</p>
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
                    {(assignedTo ?? []).length === 0 && (
                      <span className="text-gray-400 text-xs">
                        Select assignees...
                      </span>
                    )}
                    {(assignedTo ?? []).map((selectedId) => {
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
                            alt={
                              user
                                ? `${user.firstName} ${user.lastName}`
                                : "Deleted user"
                            }
                            width={20}
                            height={20}
                            style={{ borderRadius: "50%" }}
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
                          className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-green-100 ${(assignedTo ?? []).includes(String(user.id)) ? "bg-green-200" : ""}`}
                          onClick={() => addUser(String(user.id))}
                        >
                          <Image
                            src={user.avatarUrl ? user.avatarUrl : img}
                            alt={
                              user
                                ? `${user.firstName} ${user.lastName}`
                                : "Deleted user"
                            }
                            width={24}
                            height={24}
                            style={{ borderRadius: "50%" }}
                          />
                          <span className="text-sm text-black">
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : "Deleted user"}
                          </span>
                          {(assignedTo ?? []).includes(String(user.id)) && (
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
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Project Avatar
          </label>
            <FileUpload
              acceptedFileTypes="image/*,.pdf,.doc,.docx"
              maxFiles={1}
              fieldType="poor"
              onFilesSelected={(files: FileList) => {
                setProjectAvatar(files && files.length > 0 ? files[0] : null);
              }}
            />
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
