"use client";
import ProgressCircle from "@/components/rechart-uis/ProgressCircile";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import img from "@/../public/images/pexels-sulimansallehi-1704488.jpg";
import { FaSearch } from "react-icons/fa";
import { FaBars, FaPlus } from "react-icons/fa6";

function Page() {
  const [viewStats, setViewStats] = useState(false);
  const [showEpics, setShowEpics] = useState(false);
  const mockEpics = [
    {
      id: "epic-1",
      name: "User Authentication Module",
      goal: "Implement Auth2 login system",
      dueDate: "March 31",
      sprints: ["Sprint 1", "Sprint 2"],
      stories: 13,
      bugs: 2,
      priority: "High",
      progress: 60,
    },
    {
      id: "epic-2",
      name: "Payment Integration",
      goal: "Integrate Stripe payments",
      dueDate: "April 15",
      sprints: ["Sprint 2", "Sprint 3"],
      stories: 8,
      bugs: 1,
      priority: "High",
      progress: 40,
    },
    {
      id: "epic-3",
      name: "Reporting Dashboard",
      goal: "Build analytics dashboard",
      dueDate: "May 10",
      sprints: ["Sprint 3"],
      stories: 10,
      bugs: 0,
      priority: "High",
      progress: 20,
    },
  ];
  const spritStatus = [
    {
      name: "Claradix",
      users: [img, img, img, img, img, img],
      status: "done",
    },
    {
      name: "PPM",
      users: [img, img],
      status: "blocked",
    },
    {
      name: "Shanghai Cars",
      users: [img, img, img, img, img, img],
      status: "test",
    },
    {
      name: "Imprezza",
      users: [img, img, img, img, img, img, img],
      status: "toDo",
    },
    {
      name: "PIK",
      users: [img, img, img, img],
      status: "inProgress",
    },
  ];
  const mockTasks = [
    {
      id: "1",
      name: "Task 1",
      assignedTo: ["User 1", "User 2"],
      startDate: "2025-07-14T06:40:17.522Z",
      priority: "High",
      dueDate: "2025-07-14T06:40:17.522Z",
      description: "Description for Task 1",
      status: "To Do",
      tags: ["tag1", "tag2"],
      images: [],
      progress: 0,
      estimatedTime: null,
      actualTime: 0,
      createdAt: "2025-07-14T06:41:20.838Z",
      updatedAt: "2025-07-14T06:41:20.838Z",
    },
    {
      id: "2",
      name: "Task 2",
      assignedTo: ["User 3"],
      startDate: "2025-07-15T06:40:17.522Z",
      priority: "Medium",
      dueDate: "2025-07-15T06:40:17.522Z",
      description: "Description for Task 2",
      status: "In Progress",
      tags: ["tag3"],
      images: [],
      progress: 50,
      estimatedTime: 120,
      actualTime: 60,
      createdAt: "2025-07-15T06:41:20.838Z",
      updatedAt: "2025-07-15T06:41:20.838Z",
    },
    {
      id: "3",
      name: "Task 3",
      assignedTo: ["User 4", "User 5"],
      startDate: "2025-07-16T06:40:17.522Z",
      priority: "Low",
      dueDate: "2025-07-16T06:40:17.522Z",
      description: "Description for Task 3",
      status: "Testing",
      tags: ["tag4"],
      images: [],
      progress: 75,
      estimatedTime: 90,
      actualTime: 45,
      createdAt: "2025-07-16T06:41:20.838Z",
      updatedAt: "2025-07-16T06:41:20.838Z",
    },
  ];
  return (
    <div className="flex justify-between h-full scrollbar overflow-y-auto gap-5 pr-2">
      <div className="flex flex-col gap-5 flex-1">
        <div className="bg-[#ffffff1a] px-5 rounded-2xl flex items-center justify-between text-white font-semibold">
          <div className="shrink-0 flex">
            <ProgressCircle percentage={76} size={60} />
          </div>
          <div className="flex-1 flex flex-col m-4">
            <Link href="/dashboard/sprint">
              <h3 className="text-white text-lg font-semibold mb-1">
                Current sprint statistics
              </h3>
            </Link>
            <p className="text-gray-300 text-sm font-normal leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              onClick={() => setViewStats(!viewStats)}
              className="text-gray-400 hover:text-white cursor-pointer transition-colors duration-200 p-2"
            >
              <CiMenuKebab size={20} />
            </button>
          </div>
        </div>
        {viewStats ? (
          spritStatus.map((x, index) => (
            <div
              key={index}
              className="bg-[#ffffff1a] flex items-center justify-between p-4 rounded-2xl"
            >
              <div className="text-white font-medium">{x.name}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {x.users.slice(0, 2).map((user, userIndex) => (
                    <Image
                      key={userIndex}
                      src={user}
                      width={40}
                      height={40}
                      alt="User Profile Photo"
                      className="rounded-full size-10 object-cover border-2 border-white shrink-0"
                      style={{ marginLeft: userIndex > 0 ? "-8px" : "0" }}
                    />
                  ))}
                  {x.users.length > 2 && (
                    <div
                      className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                      style={{ marginLeft: "-8px" }}
                    >
                      +{x.users.length - 2}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 text-sm">Status:</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        x.status === "done"
                          ? "bg-green-500"
                          : x.status === "inProgress"
                            ? "bg-blue-500"
                            : x.status === "test"
                              ? "bg-yellow-500"
                              : x.status === "blocked"
                                ? "bg-red-500"
                                : "bg-gray-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        x.status === "done"
                          ? "text-green-400"
                          : x.status === "inProgress"
                            ? "text-blue-400"
                            : x.status === "test"
                              ? "text-yellow-400"
                              : x.status === "blocked"
                                ? "text-red-400"
                                : "text-gray-400"
                      }`}
                    >
                      {x.status === "done"
                        ? "Done"
                        : x.status === "inProgress"
                          ? "In Progress"
                          : x.status === "test"
                            ? "Test"
                            : x.status === "toDo"
                              ? "To Do"
                              : x.status === "blocked"
                                ? "Blocked"
                                : x.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
        <div className="p-5 rounded-2xl flex flex-col gap-5 justify-between text-white bg-[#ffffff1a]">
          <div className="flex justify-between w-full items-center">
            <span className="font-semibold">Backlog</span>
            <button
              className="text-[#00c951] font-semibold"
              onClick={() => {
                setShowEpics(!showEpics);
              }}
            >
              Show Epics
            </button>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full shadow">
              <FaBars />
              Filter
            </button>
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-full shadow w-80">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                className="bg-transparent outline-none text-white w-full"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex items-center bg-white/10 px-4 py-2 rounded-full shadow w-full">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              className="bg-transparent outline-none text-white w-full"
              placeholder="Type to create..."
            />
          </div>
          {mockTasks.map((task) => (
            <div key={task.id}
              className={`bg-white/10 flex justify-between items-center gap-2 w-full rounded-2xl p-5`}
            >
              <div
                className={`flex w-full ${showEpics ? "flex-col" : "flex-row items-center"} gap-2 justify-between`}
              >
                <div className="">Lorem ipsum dolor sit amet consectetur</div>
                <div
                  className={`flex items-center gap-2${showEpics ? " flex-row-reverse" : ""}`}
                >
                  <div
                    className={`${showEpics ? "mr-auto" : "ml-auto"} flex items-center gap-3`}
                  >
                    <div
                      className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}
                    >
                      <div className="font-semibold">Sprint: </div>
                      {task.name}
                    </div>
                    <div
                      className={`flex items-center gap-1${showEpics ? " text-[0.6rem]" : ""}`}
                    >
                      <div className="font-semibold">Epic: </div>
                      {task.description}
                    </div>
                  </div>
                  <Image
                    src={img}
                    width={40}
                    height={40}
                    alt="User Avatar"
                    className={`rounded-full ${showEpics ? "size-7" : "size-10"} object-cover border-2 border-white shrink-0`}
                  />
                </div>
              </div>
              <div
                className={`bg-[#00c951] text-nowrap px-4 py-2 rounded-3xl${showEpics ? " text-[0.7rem]" : ""}`}
              >
                Move to sprint
              </div>
            </div>
          ))}
        </div>
      </div>
      {showEpics && (
        <div className="bg-[#ffffff1a] flex-1 p-5 rounded-2xl flex flex-col gap-5 items-start justify-between text-white font-semibold min-h-fit">
          <div className="flex flex-row justify-between items-center w-full gap-5">
            Epics
            <div className="bg-[#00c951] flex justify-center items-center gap-2 px-3 py-1 rounded-2xl cursor-pointer">
              <FaPlus />
              Create new
            </div>
          </div>
          <div className="flex flex-col gap-5 w-full">
            {mockEpics.map((epic) => (
              <div
                key={epic.id}
                className="bg-[#ffffff1a] rounded-2xl p-5 flex flex-col gap-3 w-full"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-base">{epic.name}</span>
                  <div className="flex items-center gap-2">
                    {epic.priority === "High" && (
                      <span className="text-red-500">
                        {/* Flag icon */}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M4 2v16h2v-6h9l-2-4 2-4H6V2H4z" />
                        </svg>
                      </span>
                    )}
                    <span className="text-red-400 text-sm">
                      {epic.priority}
                    </span>
                  </div>
                </div>
                <div className="text-gray-200 text-sm">
                  {epic.progress}% complete
                </div>
                <div className="w-full h-2 rounded-full bg-gray-500/50 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${epic.progress}%`,
                      background: "#00c951",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div className="text-gray-200 text-sm mt-2">
                  <span className="font-semibold">Goal:</span> {epic.goal}
                </div>
                <div className="flex items-center gap-2 text-gray-200 text-sm">
                  {/* Calendar icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mr-1"
                  >
                    <path d="M6 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H8V2H6zm10 4v10H4V6h12z" />
                  </svg>
                  <span className="font-semibold">Due:</span> {epic.dueDate}
                </div>
                <div className="flex flex-wrap gap-4 text-gray-200 text-sm mt-2">
                  <span>
                    <span className="font-semibold">Sprints:</span>{" "}
                    {epic.sprints.join(", ")}
                  </span>
                  <span>
                    <span className="font-semibold">Stories:</span>{" "}
                    {epic.stories}
                  </span>
                  <span>
                    <span className="font-semibold">Bugs:</span> {epic.bugs}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
