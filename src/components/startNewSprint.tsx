"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseCookies } from "nookies";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  goal: z.string().optional(),
});

type SprintFormData = z.infer<typeof sprintSchema>;

export default function StartNewSprintDialog({
  onSprintCreated,
}: {
  onSprintCreated?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      goal: "",
    },
  });

  const onSubmit = async (data: SprintFormData) => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      await clxRequest.post("/sprints", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onSprintCreated?.();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#00C951] hover:bg-[#00c20a] rounded-3xl text-white px-4 py-2 font-semibold text-sm transition">
          Start new
        </button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[500px] p-0">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-white text-lg font-medium">
              Start new sprint
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Sprint name
              </label>
              <input
                {...register("name")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
                placeholder="Sprint name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Start date
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                End date
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
              />
              {errors.endDate && (
                <p className="text-red-400 text-sm">{errors.endDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Goal</label>
              <input
                {...register("goal")}
                className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white"
                placeholder="Sprint goal"
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
            disabled={isSubmitting || loading}
            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
          >
            {isSubmitting || loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
