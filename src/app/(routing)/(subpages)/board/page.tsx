import BoardTasks from "@/components/BoardTasks";
import CompleteDialog from "@/components/CompleteDialog";
import React from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa6";

function page() {
  return (
    <div className="flex flex-col min-h-0 gap-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#ffffff1a] px-3 py-2 rounded-2xl">
            <span className="text-sm text-white/80">Sprint</span>
            <button className="text-sm text-white/90 font-medium flex items-center gap-1">
              March 
              <FaChevronDown size={16} color="#fff" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#ffffff1a] text-white/80 px-3 py-2 rounded-2xl text-sm">
            <FaPlus size={16} color="#fff" />
            Filter
          </button>
          <button className="bg-[#00C951] hover:bg-[#00c20a] rounded-2xl text-white px-4 py-2 font-semibold text-sm transition">
            Create new task
          </button>
          <CompleteDialog />
          </div>
      </div>
      <div className="flex gap-6 pr-2 scrollbar h-full overflow-auto pb-6">
        <BoardTasks />
      </div>
    </div>
  );
}

export default page;
