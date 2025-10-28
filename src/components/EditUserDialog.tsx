"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "@/components/ui/dialog";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";

export type Position = { id: string; name: string; description: string };

export type EditUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  position?: { id: string; name: string; description: string } | null;
  isActive?: boolean;
  role?: string;
};

type EditFormState = {
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  isActive: boolean;
};

type EditUserDialogProps = {
  open: boolean;
  user: EditUser | null;
  onOpenChange: (v: boolean) => void;
  onSaved?: () => void;
};

export default function EditUserDialog({ open, user, onOpenChange, onSaved }: EditUserDialogProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EditFormState>({
    firstName: "",
    lastName: "",
    email: "",
    position: undefined,
    isActive: true,
  });

  useEffect(() => {
    if (!open) return;
    const { accessToken } = parseCookies();
    clxRequest
      .get<Position[]>("/positions/all", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setPositions(Array.isArray(res) ? res : []))
      .catch(() => setPositions([]));
  }, [open]);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      position: user.position?.id,
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
  }, [user]);

  const handleField = (key: keyof EditFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFullNameField = (fullName: string) => {
    const parts = fullName.split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    setForm((prev) => ({
      ...prev,
      firstName,
      lastName,
    }));
  }

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    const { accessToken } = parseCookies();
    try {
      const payload: Record<string, string | boolean> = {};
      if (form.firstName && form.firstName !== user.firstName) payload.firstName = form.firstName;
      if (form.lastName && form.lastName !== user.lastName) payload.lastName = form.lastName;
      if (form.email && form.email !== user.email) payload.email = form.email;
      if (form.position && form.position !== user.position?.id) payload.position = form.position;
      if (user.role !== "super_admin" && form.isActive !== user.isActive) payload.isActive = form.isActive;

      if (Object.keys(payload).length === 0) {
        onOpenChange(false);
        return;
      }

      await clxRequest.patch(`/users/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      onSaved?.();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  const isSuperAdmin = user?.role === "super_admin";
  console.log(user?.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[500px] p-0">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-white text-lg font-medium">
              Edit user
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                value={
                  form.firstName + (form.lastName ? " " + form.lastName : "")
                }
                onChange={(e) => handleFullNameField(e.target.value)}
                placeholder={user?.firstName || "" + " " + user?.lastName || ""}
                className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleField("email", e.target.value)}
                placeholder={user?.email || ""}
                className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">
                Position
              </label>
              <select
                value={form.position || ""}
                onChange={(e) => handleField("position", e.target.value)}
                className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="" className="text-black">
                  Select position (optional)
                </option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id} className="text-black">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-300 mb-1">
                Active status
              </label>
              <select
                value={form.isActive ? "active" : "inactive"}
                onChange={(e) => {
                  if (!isSuperAdmin) {
                    handleField("isActive", e.target.value === "active");
                  }
                }}
                className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                disabled={isSuperAdmin}
              >
                <option className="text-black" value="active">Active</option>
                <option className="text-black" value="inactive">Inactive</option>
              </select>
              {isSuperAdmin && (
                <div className="text-xs text-gray-400 mt-1">
                  Super admin status cannot be changed
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="bg-gray-750 px-6 py-4 flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
