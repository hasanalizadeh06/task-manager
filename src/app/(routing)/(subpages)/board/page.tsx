"use client";
import BoardTasks from "@/components/BoardTasks";
import CompleteDialog from "@/components/CompleteDialog";
import React from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { Sprint } from "@/interfaces/Sprints";
import CreateTask from "@/components/CreateTask";

function Page() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    clxRequest
      .get<{ items: Sprint[] }>("/sprints?page=1&limit=1000")
      .then((data) => setSprints(data.items))
      .catch(() => {});
  }, []);
  return (
    <div className="flex flex-col min-h-0 gap-5 grow">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#ffffff1a] px-3 py-2 rounded-2xl">
            <span className="text-sm text-white/80">Sprint</span>
            <div className="relative">
              <button
                className="text-sm text-white/90 font-medium flex items-center gap-1"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {selectedSprint?.name || "Select Sprint"}
                <FaChevronDown size={16} color="#fff" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-[#222] rounded shadow-lg z-10">
                  {sprints.map((sprint) => (
                    <button
                      key={sprint.id}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333]"
                      onClick={() => {
                        setSelectedSprint(sprint);
                        setDropdownOpen(false);
                      }}
                    >
                      {sprint.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#ffffff1a] text-white/80 px-3 py-2 rounded-2xl text-sm">
            <FaPlus size={16} color="#fff" />
            Filter
          </button>
          <CreateTask id="test" name="test" />
          {selectedSprint && <CompleteDialog sprint={selectedSprint} />}
        </div>
      </div>
      <div className="flex grow gap-6 pr-2 scrollbar h-full overflow-auto pb-6">
        <BoardTasks sprint={selectedSprint} />
      </div>
    </div>
  );
}

export default Page;


