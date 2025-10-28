"use client";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";

export type Subtask = {
  id: string;
  title: string;
  assignees: number[];
  startDate: string;
  dueDate: string;
  priority: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  position?: {
    id: string;
    description: string;
    name: string;
  };
};

type SubtasksFormProps = {
  addable?: boolean;
  task: {
    assignedTo: (string | number)[];
    startDate: string;
    dueDate: string;
    priority: string;
  };
  users: User[];
  onChange?: (subtasks: Subtask[]) => void;
};



import img from "@/../public/images/avatar.svg";
import Image from "next/image";

function SubtasksForm({ addable = false, task, users, onChange }: SubtasksFormProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [dropdownOpenIdx, setDropdownOpenIdx] = useState<number | null>(null);

  const handleAddRow = () => {
    setSubtasks((prev) => {
      const updated = [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: "",
          assignees: task.assignedTo.length > 0 ? [Number(task.assignedTo[0])] : [],
          startDate: task.startDate,
          dueDate: task.dueDate,
          priority: task.priority,
        },
      ];
      if (onChange) {
        onChange(updated);
      }
      return updated;
    });
  };

  const handleChange = (idx: number, field: keyof Subtask, value: string | number[]) => {
    setSubtasks((prev) => {
      const updated = prev.map((subtask, i) => {
        if (i !== idx) return subtask;
        if (field === "assignees" && Array.isArray(value)) {
          return { ...subtask, assignees: value };
        }
        return { ...subtask, [field]: value };
      });
      if (onChange) {
        onChange(updated);
      }
      return updated;
    });
  };

  const handleRemove = (idx: number) => {
    setSubtasks((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (onChange) {
        onChange(updated);
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header */}
      <div className={`grid gap-4 p-4 bg-[#ffffff1a] items-center rounded-2xl text-gray-300 text-sm font-medium ${addable ? "grid-cols-[3fr_1fr_1fr_1fr_1fr_.1fr]" : "grid-cols-[3fr_1fr_1fr_1fr_1fr]"}`}>
        <div>Subtask name</div>
        <div>Assignee</div>
        <div>Start date</div>
        <div>Priority</div>
        <div>Due date</div>
        {addable && <button type="button" onClick={handleAddRow}><FiPlus /></button>}
      </div>
      {/* Subtask List */}
      <div className="flex flex-col gap-2.5">
        {subtasks.map((subtask, idx) => (
          <div key={idx} className={`grid items-center gap-4 rounded-2xl bg-[#ffffff1a] py-4 px-3 ${addable ? "grid-cols-[3fr_1fr_1fr_1fr_1fr_.1fr]" : "grid-cols-[3fr_1fr_1fr_1fr_1fr]"}`}>
            <input
              className="bg-transparent border-b border-gray-400 text-white px-2 py-1 outline-none"
              placeholder="Subtask name"
              value={subtask.title}
              onChange={e => handleChange(idx, "title", e.target.value)}
            />
            <div className="relative w-full">
              <button
                className="flex items-center bg-white/20 px-2 py-1 rounded w-full min-w-0 relative h-10"
                type="button"
                onClick={() => {
                  setDropdownOpenIdx(idx === dropdownOpenIdx ? null : idx);
                }}
              >
                <div className="flex items-center gap-1 w-full">
                  {subtask.assignees && subtask.assignees.length > 0 ? (
                    <div className="flex -space-x-1">
                      {subtask.assignees.slice(0, 5).map(aid => {
                        const user = users.find(u => u.id === aid);
                        if (!user) return null;
                        return (
                          <Image
                            key={aid}
                            src={user.avatarUrl || img}
                            alt={user.firstName + ' ' + user.lastName}
                            width={20}
                            height={20}
                            style={{ borderRadius: "50%", border: "2px solid #fff", background: "#eee" }}
                          />
                        );
                      })}
                      {subtask.assignees.length > 5 && (
                        <div
                          className="w-5 h-5 rounded-full border-2 border-white bg-gray-400 text-[10px] text-white flex items-center justify-center font-semibold"
                          title={subtask.assignees.slice(5).map(aid => {
                            const user = users.find(u => u.id === aid);
                            return user ? `${user.firstName} ${user.lastName}` : "Deleted user";
                          }).join(", ")}
                        >
                          +{subtask.assignees.length - 5}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Select assignees</span>
                  )}
                </div>
                <span className="text-white ml-auto absolute right-2 pointer-events-none">&#x25BC;</span>
              </button>
              {dropdownOpenIdx === idx && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white/90 rounded shadow-lg border border-gray-300">
                  {task.assignedTo.map(uid => {
                    const user = users.find(u => u.id === Number(uid));
                    if (!user) return null;
                    const isSelected = subtask.assignees.includes(user.id);
                    return (
                      <div
                        key={uid}
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-green-100 ${isSelected ? "bg-green-200" : ""}`}
                        onClick={() => {
                          let newAssignees;
                          if (isSelected) {
                            newAssignees = subtask.assignees.filter(aid => aid !== user.id);
                          } else {
                            newAssignees = [...subtask.assignees, user.id];
                          }
                          handleChange(idx, "assignees", newAssignees);
                        }}
                      >
                        <Image
                          src={user.avatarUrl || img}
                          alt={user.firstName + ' ' + user.lastName}
                          width={24}
                          height={24}
                          style={{ borderRadius: "50%" }}
                        />
                        <span className="text-sm text-black">{user.firstName} {user.lastName}</span>
                        {isSelected && (
                          <span className="ml-auto text-green-600 text-xs">Selected</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <input
              type="date"
              className="bg-transparent border-b border-gray-400 text-white px-2 py-1 outline-none"
              value={subtask.startDate}
              onChange={e => handleChange(idx, "startDate", e.target.value)}
            />
            <select
              className="bg-transparent border-b border-gray-400 text-white px-2 py-1 outline-none"
              value={subtask.priority}
              onChange={e => handleChange(idx, "priority", e.target.value)}
            >
            <option value="" disabled defaultChecked className="text-black">
                Select priority
            </option>
            <option value="Low" className="text-black">
                Low
            </option>
            <option value="Medium" className="text-black">
                Medium
            </option>
            <option value="High" className="text-black">
                High
            </option>
            <option value="Critical" className="text-black">
                Critical
            </option>
            </select>
            <input
              type="date"
              className="bg-transparent border-b border-gray-400 text-white px-2 py-1 outline-none"
              value={subtask.dueDate}
              onChange={e => handleChange(idx, "dueDate", e.target.value)}
            />
            {addable && <button type="button" onClick={() => handleRemove(idx)}><IoTrashOutline /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubtasksForm;