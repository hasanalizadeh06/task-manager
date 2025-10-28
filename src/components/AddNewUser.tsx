"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaEyeSlash, FaPlus } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";
import { useRoleStore } from "@/features/auth/model/role.store";

const userSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    positionId: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role is required"),
});


type UserFormData = z.infer<typeof userSchema>;
type Position = { id: string; name: string; description: string };

export default function AddNewUser({ onUserAdded }: { onUserAdded?: () => void }) {
    const role = useRoleStore((state) => state.role);
    const [isOpen, setIsOpen] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            email: "",
            positionId: "",
            password: "",
            role: "user",
        },
    });

    const onSubmit = async (data: UserFormData) => {
        try {
            const cookies = parseCookies();
            const accessToken = cookies.accessToken;
            if (!accessToken) throw new Error("Access token not found.");
            const [firstName, ...rest] = data.fullName.trim().split(" ");
            const lastName = rest.join(" ");
            const payload = {
                firstName,
                lastName,
                role: data.role,
                email: data.email,
                positionId: data.positionId,
                password: data.password,
            };
            await clxRequest.post("/auth/register", payload);
            onUserAdded?.();
            setIsOpen(false);
            reset();
        } catch (error) {
            alert("Failed to add user");
            console.error(error);
        }
    };

    // Fetch positions when dialog opens
    useEffect(() => {
        if (!isOpen) return;
        clxRequest
            .get<Position[]>("/positions/all", {
            })
            .then((res) => setPositions(Array.isArray(res) ? res : []))
            .catch(() => setPositions([]));
    }, [isOpen]);

    const handleCancel = () => {
        setIsOpen(false);
        reset();
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="bg-[#00C951] flex gap-2 items-center hover:bg-[#00c20a] rounded-3xl text-white px-4 py-2 font-semibold text-sm transition">
            <FaPlus />
            Add new user
          </button>
        </DialogTrigger>
        <DialogOverlay className="bg-black/20" />
        <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
          <div className="p-6">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-white text-lg font-medium">
                Add New User
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Position
                </label>
                <select
                  {...register("positionId")}
                  className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
                >
                  <option value="" className="text-black">
                    Select position
                  </option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id} className="text-black">
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.positionId && (
                  <p className="text-red-400 text-sm">
                    {errors.positionId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Role</label>
                <select
                  {...register("role")}
                  className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
                >
                  <option value="user" className="text-black">
                    User
                  </option>
                  <option
                    disabled={role != "super_admin"}
                    value="admin"
                    className="text-black"
                  >
                    Admin
                  </option>
                </select>
                {role !== "super_admin" && (
                    <div className="text-xs text-gray-400 mt-1">
                      Only super admin can change role to admin
                    </div>
                )}
                {errors.role && (
                  <p className="text-red-400 text-sm">{errors.role.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Temporary Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => {
                        const generated = Math.random().toString(36).slice(-8);
                        reset((prev) => ({ ...prev, password: generated }));
                      }}
                      className="bg-[#00C951] hover:bg-[#00c20a] text-[12px] rounded-xl font-semibold"
                    >
                      Generate
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="bg-[#00C951] hover:bg-[#00c20a] text-xs rounded-xl flex items-center justify-center px-2 py-1 font-semibold"
                      onMouseDown={() => setShowPassword(true)}
                      onMouseUp={() => setShowPassword(false)}
                      onMouseLeave={() => setShowPassword(false)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
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
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

