"use client";
import Notes from "@/components/Notes";
import Circle from "@/components/rechart-uis/Circle";
import ProgressCircle from "@/components/rechart-uis/ProgressCircile";
import React, { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";

import img from "@/../public/images/pexels-sulimansallehi-1704488.jpg";
import Image from "next/image";
import { Project } from "@/interfaces/Project";
import Link from "next/link";



function Page() {
  const [viewStats, setViewStats] = useState(false);
  const sampleData = [
    { name: "Hasan", value: 41 },
    { name: "Ismayil", value: 27 },
    { name: "Javid", value: 35 },
    { name: "Mehriban", value: 19 },
    { name: "Emin", value: 49 },
    { name: "Narmin", value: 23 },
    { name: "Tehran", value: 38 },
    { name: "Sabina", value: 46 },
    { name: "Elvin", value: 14 },
    { name: "Rufat", value: 50 },
    { name: "Agakhan", value: 29 },
    { name: "Gunel", value: 16 },
    { name: "Kamran", value: 44 },
    { name: "Aysel", value: 32 },
    { name: "Aziza", value: 21 },
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

  const allProjects: Project[] = [
    { id: 1, name: "Claradix Website", color: "bg-green-500" },
    { id: 2, name: "Neatman Website", color: "bg-red-600" },
    { id: 3, name: "PPM Website", color: "bg-blue-500" },
    { id: 4, name: "Apex", color: "bg-purple-600" },
    { id: 5, name: "Tesla Dashboard", color: "bg-orange-500" },
    { id: 6, name: "Nike Store", color: "bg-pink-500" },
    { id: 7, name: "Spotify Clone", color: "bg-yellow-500" },
    { id: 8, name: "Netflix UI", color: "bg-indigo-600" },
    { id: 9, name: "Amazon Clone", color: "bg-teal-500" },
    { id: 10, name: "Google Maps", color: "bg-cyan-500" },
    { id: 11, name: "Instagram UI", color: "bg-rose-500" },
    { id: 12, name: "Twitter Clone", color: "bg-emerald-500" },
  ];

  const events = [
    { time: "9:30", title: "Israel morning meet" },
    { time: "9:30", title: "Israel morning meet" },
    { time: "9:30", title: "Israel morning meet" },
    { time: "9:30", title: "Israel morning meet" },
    { time: "9:30", title: "Israel morning meet" },
  ];

  const notes = [
    {
      image: img,
      username: "Hasan Aliyev",
      note: "Updated the header component with new responsive design. The mobile version looks much better now.",
      project: "Claradix Website",
      time: "2 minutes ago",
    },
    {
      image: img,
      username: "Mehriban Qadir",
      note: "Fixed the authentication bug that was preventing users from logging in. All tests are passing now.",
      project: "Tesla Dashboard",
      time: "15 minutes ago",
    },
    {
      image: img,
      username: "Javid Mammadov",
      note: "Added dark mode toggle functionality. Users can now switch between light and dark themes seamlessly.",
      project: "Nike Store",
      time: "32 minutes ago",
    },
    {
      image: img,
      username: "Narmin Hasanova",
      note: "Optimized database queries for the user dashboard. Load time reduced by 40%.",
      project: "PPM Website",
      time: "1 hour ago",
    },
    {
      image: img,
      username: "Emin Rzayev",
      note: "Implemented real-time notifications using WebSocket. Push notifications are working perfectly.",
      project: "Spotify Clone",
      time: "2 hours ago",
    },
    {
      image: img,
      username: "Sabina Ismayilova",
      note: "Completed the payment integration with Stripe API. All payment flows are now functional.",
      project: "Amazon Clone",
      time: "3 hours ago",
    },
    {
      image: img,
      username: "Kamran Huseynov",
      note: "Refactored the entire codebase to use TypeScript. Type safety is now enforced across all components.",
      project: "Netflix UI",
      time: "5 hours ago",
    },
    {
      image: img,
      username: "Aysel Ahmadova",
      note: "Added comprehensive unit tests for the user authentication module. Coverage increased to 95%.",
      project: "Instagram UI",
      time: "6 hours ago",
    },
  ];

  function formatDateWithSuffix(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const getDaySuffix = (day: number): string => {
      if (day >= 11 && day <= 13) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayWithSuffix = `${day}${getDaySuffix(day)}`;

    return `${dayWithSuffix}, ${month} ${year}`;
  }
  const today = formatDateWithSuffix(new Date());

  const displayedProjects = allProjects.slice(0, 8);
  return (
    <div className="flex h-full gap-5 overflow-y-scroll scrollbar pr-2">
      <div className="flex-[5.5] flex flex-col gap-5 h-full">
        <div className="flex-[0.5] bg-[#ffffff1a] px-5 rounded-2xl flex items-center justify-between text-white font-semibold">
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
                              : x.status === 'blocked' 
                                ? 'bg-red-500'
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
                              : x.status === 'blocked' 
                                ? 'text-red-400' 
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
                              : x.status === 'blocked' 
                                ? 'Blocked' 
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
        <div className="flex-1 px-5 py-4 bg-[#ffffff1a] flex-col rounded-2xl flex justify-center text-white font-semibold">
          <h2 className="text-white text-xl font-medium mb-3">
            Recently viewed projects
          </h2>
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            {displayedProjects.map((project) => (
              <div key={project.id} className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-md shrink-0 ${project.color}`}
                ></div>
                <span className="text-white text-xs font-normal">
                  {project.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-[1.5] bg-[#ffffff1a] px-2 rounded-2xl flex items-center justify-center text-white font-semibold">
          <Circle
            centerText="735"
            circleName="Team Overview"
            size="120x120"
            datas={sampleData}
          />
        </div>
      </div>
      <div className="flex-[4.5] flex flex-col gap-4 h-full">
        <div className="flex-[0.4] bg-[#ffffff1a] rounded-2xl p-3 text-white flex flex-col gap-2 h-full max-h-60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{today}</h2>
            <button className="text-sm text-white/70 hover:text-white transition">
              See calendar
            </button>
          </div>
          <div className="flex-1 scrollbar overflow-y-auto flex flex-col gap-2 pr-2">
            {events.map((event, index) => (
              <div
                key={index}
                className="relative bg-[#ffffff0d] p-2 pl-5 rounded-xl"
              >
                <div className="absolute left-[10px] top-3 h-10 w-1 bg-green-400 rounded-md" />
                <div className="flex items-center gap-1 text-white/70 text-sm mb-1">
                  <MdAccessTime size={16} />
                  <span>{event.time}</span>
                </div>
                <div className="text-white font-medium">{event.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[0.6] p-3 bg-[#ffffff1a] rounded-2xl flex justify-center text-white font-semibold">
          <Notes data={notes} />
        </div>
      </div>
    </div>
  );
}

export default Page;
