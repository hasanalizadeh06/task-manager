import { useEffect, useState } from "react";
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
import { CustomerResponse } from "@/interfaces/Customer";

const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  customerId: z.string().uuid("Customer is required"),
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
  const [customers, setCustomers] = useState<{ id: string; name: string }[]>(
    []
  );

  const {
    register,
    handleSubmit,
    // setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      customerId: "",
    },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await clxRequest.get<CustomerResponse[]>("/customers");
        const simplified = response.map((c) => ({
          id: c.id,
          name: c.name,
        }));
        setCustomers(simplified);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        throw new Error("Access token not found in cookies.");
      }

      const response = await clxRequest.post(
        "/projects",
        {
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          customerId: data.customerId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Project created:", response);
      onProjectCreated?.();
      setIsOpen(false);
      reset();
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Customer Select */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Customer
              </label>
              <select
                {...register("customerId")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
              >
                <option value="" disabled>
                  Select a customer
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-400 text-sm">
                  {errors.customerId.message}
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
