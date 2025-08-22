"use client";
import ProgressCircle from "@/components/rechart-uis/ProgressCircile";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import img from "@/../public/images/pexels-sulimansallehi-1704488.jpg";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import CreateEpicDialog from "@/components/CreateEpic";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { useRoleStore } from "@/features/auth/model/role.store";
import icon from "@/shared/assets/icons/more.png";
import icon1 from "@/shared/assets/icons/tick-circle.png";
import icon2 from "@/shared/assets/icons/status.png";
import icon3 from "@/shared/assets/icons/flag.png";
import icon4 from "@/shared/assets/icons/calendar.png";
import icon5 from "@/shared/assets/icons/cup.png";
import icon6 from "@/shared/assets/icons/task.png";
import icon7 from "@/shared/assets/icons/task-square.png";
import tasks from "@/shared/assets/icons/task.png";
import edit_2 from "@/shared/assets/icons/edit-2.png";
import archive from "@/shared/assets/icons/archive.png";
import trash from "@/shared/assets/icons/trash.png";
import AddTasksToEpicDialog from "@/components/AddTasksToEpic";

function Page() {
  const role = useRoleStore((state) => state.role);
  const [showEpicTools, setShowEpicTools] = useState("");
  const [viewStats, setViewStats] = useState(false);
  const [showEpics, setShowEpics] = useState(false);
  type EpicItem = {
    id: string;
    name: string;
    goal?: string;
    status?: string;
    priority?: string;
    endDate: string;
    progress?: number;
    storyPoints?: number;
    project: { title?: string };
  };
  const [epics, setEpics] = useState<EpicItem[]>([]);
  async function fetchEpics() {
    try {
      const data = await clxRequest.get<{ items: EpicItem[] }>("/epic?page=1&limit=1000");
      setEpics(data.items || []);
      console.log("Fetched epics:", data.items);
    } catch (error) {
      console.error("Error fetching epics:", error);
    }
  }

  async function handleRenameEpic(epic: EpicItem) {
    const newName = prompt("Enter new name for epic:", epic.name);
    if (newName && newName !== epic.name) {
      try {
        await clxRequest.patch(`/epic/${epic.id}`, { name: newName });
        fetchEpics();
        setShowEpicTools("");
      } catch (error) {
        alert("Rename failed" + error);
        console.error("Rename failed" + error);
      }
    }
  }

  async function handleDeleteEpic(epic: EpicItem) {
    if (window.confirm(`Are you sure you want to delete '${epic.name}'?`)) {
      try {
        await clxRequest.delete(`/epic/${epic.id}`);
        setEpics((prev) => prev.filter((e) => e.id !== epic.id));
        setShowEpicTools("");
      } catch (error) {
        alert("Delete failed" + error);
        console.error("Delete failed" + error);
      }
    }
  }
  useEffect(() => {
    fetchEpics();
  }, []);
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
              {showEpics ? "Hide" : "Show"} Epics
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
        <div className="bg-[#ffffff1a] flex-1 p-5 rounded-2xl flex flex-col gap-5 items-start justify-start text-white font-semibold min-h-fit">
          <div className="flex flex-row justify-between items-center text-xl w-full gap-5">
            Epics
            {role == "admin" || role == "super_admin" && <CreateEpicDialog onEpicCreated={fetchEpics}/>}
          </div>
          <div className="flex flex-col gap-5 w-full">
            {epics.map((epic) => (
              <div
                key={epic.id}
                className="bg-[#ffffff1a] p-4 px-5 rounded-2xl w-full flex flex-col gap-2"
              >
                <div className="flex items-center relative justify-between w-full mb-2">
                  <div className="text-lg font-semibold">{epic.name}</div>
                  <Image src={icon} onClick={() => showEpicTools == epic.id ? setShowEpicTools("") : setShowEpicTools(epic.id)} alt="More" width={20} height={20} className="inline-block cursor-pointer" />
                  {showEpicTools == epic.id && (
                    <div className="absolute flex p-4 flex-col items-start right-0 top-10 bg-white/10 rounded-2xl gap-3 shadow-lg" style={{boxShadow: "0px 4px 10px 0px #0000001A", backdropFilter: 'blur(20px)'}}>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight">
                        <Image
                          src={tasks}
                          alt="Add Task"
                          width={20}
                          height={20}
                        />
                        <AddTasksToEpicDialog epicId={epic.id}/>
                      </button>
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => handleRenameEpic(epic)}>
                        <Image
                          src={edit_2}
                          alt="Rename"
                          width={20}
                          height={20}
                        />
                        Rename
                      </button>
                      {role == "admin" || role == "super_admin" && <button className="flex items-center gap-2 cursor-pointer font-extralight">
                        <Image
                          src={archive}
                          alt="Add Task"
                          width={20}
                          height={20}
                        />
                        Archive
                      </button>}
                      <button className="flex items-center gap-2 cursor-pointer font-extralight" onClick={() => handleDeleteEpic(epic)}>
                        <Image
                          src={trash}
                          alt="Delete"
                          width={20}
                          height={20}
                        />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon1}
                    alt="Tick Circle"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Goal:</span>
                  <span>
                    {epic.goal}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon2}
                    alt="Status"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Status:</span>
                  <span className="font-medium">
                    {epic.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon3}
                    alt="Priority"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Priority:</span>
                  <span>
                    {epic.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon4}
                    alt="Due Date"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Due Date:</span>
                  <span>{new Date(epic.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon5}
                    alt="Progress"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Current progress:</span>
                  <span>{epic.progress ?? 0}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon6}
                    alt="Project"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Project:</span>
                  <span>{epic.project.title || "Not assigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={icon7}
                    alt="Stories"
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>Stories:</span>
                  <span>{epic.storyPoints}</span>
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
