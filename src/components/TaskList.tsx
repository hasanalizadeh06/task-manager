"use client";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { IoTrashOutline } from "react-icons/io5";
import { Task } from "@/interfaces/Tasks";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import img from "@/../public/images/avatar.svg";
import Image from "next/image";

type TaskListProps = {
  tasks: Task[];
  addable: boolean;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
};

function TaskList({ tasks, addable }: TaskListProps) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await clxRequest.get<{
          items: {
            id: number;
            firstName: string;
            lastName: string;
            avatarUrl?: string | null;
          }[];
        }>("users?page=1&limit=1000");
        setUsers(data.items || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }
    fetchUsers();
  }, []);
  
  const userNameListener = (usersId: string[]) => {
    return usersId.map((userId) => {
      const user = users.find((u) => u.id === Number(userId));
      return user ? `${user.lastName[0]}.${user.firstName}` : "Unknown User";
    });
  };

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
            {addable && <FiPlus />}
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
                <div>
                  <div className="flex -space-x-2">
                    {task.assignedTo.length > 2 ? (
                      <>
                        {task.assignedTo.slice(0, 2).map((userId, index) => {
                          const user = users.find(
                            (u) => u.id === Number(userId)
                          );
                          return (
                            <div
                              title={user?.firstName + " " + user?.lastName}
                              key={index}
                              className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center overflow-hidden"
                            >
                              <Image
                                width={100}
                                height={100}
                                src={user?.avatarUrl || img}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                        <div
                         title={
                          userNameListener(task.assignedTo).slice(2).join(", ")
                         }
                         className="w-7 h-7 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                        >
                          +{task.assignedTo.length - 2}
                        </div>
                      </>
                    ) : (
                      task.assignedTo.map((userId) => {
                        const user = users.find(
                          (u) => u.id === Number(userId)
                        );
                        return (
                          <div
                            title={user?.firstName + " " + user?.lastName}
                            key={userId}
                            className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center overflow-hidden"
                          >
                            <Image
                              width={100}
                              height={100}
                              src={user?.avatarUrl || img}
                              alt="User Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                <div>
                  {new Date(task.startDate).toLocaleString("en-US", {
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
                {addable && <IoTrashOutline />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-[#ffffff1a] py-10 rounded-2xl flex flex-col items-center justify-center">
          <MdErrorOutline size={100} />
          <div className="text-3xl font-semibold text-gray-300 mt-5">
            Have not any task
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
