"use client";
import React, { useState } from "react";
import BoardTasks from "@/components/BoardTasks";

function Page() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-5 h-full  grow">
      <div className="flex grow gap-6 scrollbar h-full overflow-auto">
        <BoardTasks
          selectMode={selectMode}
          selectedTasks={selectedTasks}
          setSelectMode={setSelectMode}
          setSelectedTasks={setSelectedTasks}
          isBoardPage={false}
        />
      </div>
      {selectMode && (
        <div className="rounded-2xl h-16 bg-white/10 shadow backdrop-blur-md border-white/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="text-white">
              {selectedTasks.length}{" "}
              {selectedTasks.length === 1 ? "task" : "tasks"} selected
            </span>
            <button
              onClick={() => {
                setSelectMode(false);
                setSelectedTasks([]);
              }}
              className="text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-3">
            {/* Add action buttons here as needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
