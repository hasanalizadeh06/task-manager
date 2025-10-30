"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaChevronDown } from "react-icons/fa";
import { Sprint } from "@/interfaces/Sprints";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import Image from "next/image";
import tickCircles from "@/shared/assets/icons/tick-circles.png";
import closeCircles from "@/shared/assets/icons/close-circles.png";
import { parseCookies } from "nookies";

type CompleteDialogProps = {
  sprint: Sprint;
  onComplete?: () => void;
  sprints: Sprint[];
};

function CompleteDialog({ sprint, sprints, onComplete }: CompleteDialogProps) {
  async function handleComplete() {
    const {accessToken} = parseCookies()
    setIsSubmitting(true);
    try {
      await clxRequest.patch(
        `/sprints/${sprint.id}/complete`,
        { newSprintId: sprints.find(s => s.name === selectedSprint)?.id },
        {
          headers: {
        Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onComplete?.();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to complete sprint");
    } finally {
      setIsSubmitting(false);
    }
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<string | undefined>();

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={`bg-[#00C951] hover:bg-[#00c20a] rounded-2xl text-white px-4 py-2 font-semibold text-sm transition ${sprint.status === "Done" ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={sprint.status === "Done"}
        >
          {sprint.status === "Done" ? "Sprint Completed" : `Complate ${sprint.name}`}
        </button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-white text-lg font-medium">
              Complate {sprint.name}
            </DialogTitle>
          </DialogHeader>

          <div>
            <p className="text-base font-medium mb-2 text-white">
              This sprint contains
            </p>
            <ul className="mb-6 ml-4 text-gray-200 text-sm">
              <li className="flex items-center gap-2">
                <Image
                  src={tickCircles}
                  alt="Completed"
                  width={16}
                  height={16}
                />
                {sprint.tasks.filter((task) => task.status === "Done").length}{" "}
                completed issues
              </li>
              <li className="flex items-center gap-2">
                <Image src={closeCircles} alt="Open" width={16} height={16} />
                {
                  sprint.tasks.filter((task) => task.status !== "Done").length
                }{" "}
                open issues
              </li>
            </ul>
            <div className="mb-2 text-white font-medium text-base">
              Move open issues to
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="w-full bg-[#3a4347] border border-[#4d555a] rounded-xl px-4 py-3 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent shadow"
              >
                <span>{selectedSprint || "Select sprint"}</span>
                <FaChevronDown className="w-5 h-5 text-gray-300" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#3a4347] border border-[#4d555a] rounded-xl shadow-lg z-50">
                  {sprints.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedSprint(option.name);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-[#4a5458] first:rounded-t-xl last:rounded-b-xl"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
            onClick={handleComplete}
            disabled={isSubmitting}
            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
          >
            {isSubmitting ? "Completing" : "Complete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CompleteDialog;
