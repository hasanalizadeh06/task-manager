import React from "react";
import { FiPlus } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { Task } from "@/interfaces/Tasks";

type TaskListProps = {
  tasks: Task[];
  addable: boolean;
};

function TaskList({ tasks, addable }: TaskListProps) {
  return (
    <div>
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {/* Header */}
          <div
            className={`grid gap-4 p-4 bg-[#ffffff1a] items-center rounded-2xl text-gray-300 text-sm font-medium ${
              addable
                ? "grid-cols-[3fr_1fr_1fr_1fr_1fr_.1fr]"
                : "grid-cols-[3fr_1fr_1fr_1fr_1fr]"
            }`}
          >
            <div>Task name</div>
            <div>Assignee</div>
            <div>Start date</div>
            <div>Priority</div>
            <div>Due date</div>
            {addable && <FiPlus/>}
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`grid items-center gap-4 rounded-2xl bg-[#ffffff1a] py-4 px-3 ${
                  addable
                    ? "grid-cols-[3fr_1fr_1fr_1fr_1fr_.1fr]"
                    : "grid-cols-[3fr_1fr_1fr_1fr_1fr]"
                }`}
              >
                <div>{task.name}</div>
                {task.assignedTo.slice(0, 3).map((name, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-white bg-pink-400 text-[10px] text-white flex items-center justify-center font-semibold"
                  >
                    {name[0]}
                  </div>
                ))}
                <div>{new Date(task.startDate).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  })}
                </div>
                <div>{task.priority}</div>
                <div>
                  {new Date(task.dueDate).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  })}
                </div>
                {addable && <IoTrashOutline/>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-[#ffffff1a] rounded-2xl flex flex-col items-center justify-center">
          <MdErrorOutline size={150} />
          <div className="text-3xl font-semibold text-gray-300 mt-5">
            Have not any task
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
