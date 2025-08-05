"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Image from "next/image";
import { BsFillSendFill } from "react-icons/bs";
import "react-quill-new/dist/quill.snow.css";
import img from "@/../public/images/pexels-sulimansallehi-1704488.jpg";

import dynamic from "next/dynamic";
import TaskList from "./TaskList";
import { Task } from "@/interfaces/Tasks";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function CreateTask({ name }: { name: string }) {
      const tasks: Task[] = [
          {
            id: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
            name: "Main page",
            assignedTo: ["Hasan"],
            startDate: "2025-07-14T06:40:17.522Z",
            priority: "Medium",
            dueDate: "2025-07-14T06:40:17.522Z",
            description: "Claradix main page",
            status: "To Do",
            tags: ["string"],
            images: [],
            progress: 0,
            estimatedTime: null,
            actualTime: 0,
            createdAt: "2025-07-14T06:41:20.838Z",
            updatedAt: "2025-07-14T06:41:20.838Z",
            projectId: "c8c619a5-45f2-468a-9992-52abd1dde412",
            sprintId: null,
            subtasks: [
              {
                id: "888185f2-f0e9-45ab-a984-665130f7de51",
                title: "Main logo",
                description: "string",
                status: "To Do",
                priority: "Medium",
                assignedTo: "string",
                estimatedTime: 0,
                actualTime: 0,
                dueDate: "2025-07-14T06:41:52.113Z",
                order: 0,
                createdAt: "2025-07-14T06:42:05.163Z",
                updatedAt: "2025-07-14T06:42:05.163Z",
                taskId: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
              },
            ],
            project: {
              id: "c8c619a5-45f2-468a-9992-52abd1dde412",
              title: "Claradix",
              description: "Test",
              customerId: "cea72c15-232f-48a1-ba8b-9d5de5989b8d",
            },
            sprint: null,
          },
          {
            id: "f18565fe-f123-4ec8-8024-c09150ddfsada5a7",
            name: "Main page",
            assignedTo: ["Hasan"],
            startDate: "2025-07-14T06:40:17.522Z",
            priority: "Medium",
            dueDate: "2025-07-14T06:40:17.522Z",
            description: "Claradix main page",
            status: "To Do",
            tags: ["string"],
            images: [],
            progress: 0,
            estimatedTime: null,
            actualTime: 0,
            createdAt: "2025-07-14T06:41:20.838Z",
            updatedAt: "2025-07-14T06:41:20.838Z",
            projectId: "c8c619a5-45f2-468a-9992-52abd1dde412",
            sprintId: null,
            subtasks: [
              {
                id: "888185f2-f0e9-45ab-a984-665130f7de51",
                title: "Main logo",
                description: "string",
                status: "To Do",
                priority: "Medium",
                assignedTo: "string",
                estimatedTime: 0,
                actualTime: 0,
                dueDate: "2025-07-14T06:41:52.113Z",
                order: 0,
                createdAt: "2025-07-14T06:42:05.163Z",
                updatedAt: "2025-07-14T06:42:05.163Z",
                taskId: "f18565fe-f123-4ec8-8024-c09150ddf5a7",
              },
            ],
            project: {
              id: "c8c619a5-45f2-468a-9992-52abd1dde412",
              title: "Claradix",
              description: "Test",
              customerId: "cea72c15-232f-48a1-ba8b-9d5de5989b8d",
            },
            sprint: null,
          },
        ]

  const [formData, setFormData] = useState({
    project: "",
    status: "",
    priority: "",
    startDate: "",
    dueDate: "",
    sprint: "",
    assignee: "",
    timeEstimate: "",
    description: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
          <button className="bg-[#00C951] hover:bg-[#00c20a] rounded-3xl text-white px-4 py-2 font-semibold text-sm transition">
            Add new task
          </button>
      </DialogTrigger>
      <DialogOverlay className="bg-black/20" />
      <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[80vw] p-0 max-h-[90vh]">
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-4 border-b border-slate-600">
            <DialogTitle className="text-white text-lg font-medium flex gap-2 items-center justify-center">
              Add task to
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                  {name}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-scroll scrollbar mr-2 max-h-[70vh] p-6 pt-4">
            <div className="flex gap-6 min-h-[70vh]">
              {/* Left Column - Form Fields */}
              <div className="flex-1 space-y-4">
                {/* Project */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project
                  </label>
                  <select
                    className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                    value={formData.project}
                    onChange={(e) =>
                      handleInputChange("project", e.target.value)
                    }
                  >
                    <option value="Claradix">Claradix</option>
                  </select>
                </div>

                {/* Status & Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                    >
                      <option value="IN PROGRESS">IN PROGRESS</option>
                      <option value="TODO">TODO</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                      value={formData.priority}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Start date & Due date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                      />
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Due date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        value={formData.dueDate}
                        onChange={(e) =>
                          handleInputChange("dueDate", e.target.value)
                        }
                      />
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sprint */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sprint
                  </label>
                  <select
                    className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                    value={formData.sprint}
                    onChange={(e) =>
                      handleInputChange("sprint", e.target.value)
                    }
                  >
                    <option value="Sprint 1">Sprint 1</option>
                    <option value="Sprint 2">Sprint 2</option>
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assignees
                  </label>
                  <div className="flex items-center bg-white/10 rounded-lg p-3 gap-3">
                    <Image
                      src={img}
                      alt="Assignee"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-white">{formData.assignee}</span>
                  </div>
                </div>

                {/* Time estimate */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time estimate
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                    value={formData.timeEstimate}
                    onChange={(e) =>
                      handleInputChange("timeEstimate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Middle Column - Description & Attachments */}
              <div className="flex-1 space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <ReactQuill
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e)}
                  theme="snow"
                  placeholder="Description"
                  className="custom-quill-container"
                  modules={{
                    toolbar: [
                      [{ font: [] }],
                      ["bold", "italic"],
                      ["link"],
                      ["image"],
                    ],
                  }}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Attachment
                  </label>
                  <div className="bg-white/10 rounded-lg p-4 border-2 border-dashed border-slate-600 text-center">
                    <p className="text-sm text-gray-400">
                      Drop files to upload or{" "}
                      <button className="text-blue-400 hover:text-blue-300">
                        Browse
                      </button>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Relationships
                  </label>
                  <div className="space-y-2">
                    <select className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500">
                      <option>is blocked by</option>
                      <option>blocks</option>
                      <option>relates to</option>
                    </select>
                    <select className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500">
                      <option>Backend side</option>
                      <option>Frontend side</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ordinary project tag
                  </label>
                  <div className="space-y-2">
                    <select className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500">
                      <option>Ongoing projects</option>
                      <option>Completed projects</option>
                      <option>On hold</option>
                    </select>
                    <select className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500">
                      <option>Scopoly</option>
                      <option>Other projects</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column - Activity */}
              <div className="w-80 bg-white/10 flex flex-col rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Activity</h3>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1">
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No activity yet</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type to add your comment"
                    className="flex-1 rounded-lg bg-white/10 border-0 py-2 px-3 text-white text-sm focus:ring-2 focus:ring-green-500"
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg">
                    <BsFillSendFill />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtasks Section - Now inside scrollable area */}
            <div className="w-full flex gap-5 flex-col">
              <h3 className="text-lg font-medium text-white">Subtasks</h3>
              <div className="flex gap-5 w-full flex-col">
                  <TaskList addable={true} tasks={tasks}/>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons - Fixed */}
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-slate-600">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTask;
