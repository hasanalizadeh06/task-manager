"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaChevronDown } from "react-icons/fa";
import { Sprint } from "@/interfaces/Sprints";

type CompleteDialogProps = {
  sprint: Sprint;
};

function CompleteDialog({ sprint }: CompleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState("New sprint");
  const sprints = ["New sprint", "Backlog", "Another sprint"];

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className={`bg-[#00C951] hover:bg-[#00c20a] rounded-2xl text-white px-4 py-2 font-semibold text-sm transition`}>
          Complate {sprint.name}
        </button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
        <div className="p-6">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-white text-lg font-medium">
              Complate March
            </DialogTitle>
          </DialogHeader>

          <div>
            <p className="text-base font-medium mb-2 text-white">This sprint contains</p>
            <ul className="mb-6 ml-4 text-gray-200 text-sm list-disc">
              <li>7 completed issues</li>
              <li>1 open issues</li>
            </ul>
            <div className="mb-2 text-white font-medium text-base">Move open issues to</div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="w-full bg-[#3a4347] border border-[#4d555a] rounded-xl px-4 py-3 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent shadow"
              >
                <span>{selectedSprint}</span>
                <FaChevronDown className="w-5 h-5 text-gray-300" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#3a4347] border border-[#4d555a] rounded-xl shadow-lg z-50">
                  {sprints.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedSprint(option);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-[#4a5458] first:rounded-t-xl last:rounded-b-xl"
                    >
                      {option}
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
            onClick={() => setIsSubmitting(true)}
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
