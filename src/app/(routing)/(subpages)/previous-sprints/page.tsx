"use client"
import React from 'react'
import { FaBars, FaSearch } from 'react-icons/fa'
import { useEffect, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { Sprint, SprintsResponse } from '@/interfaces/Sprints';
import StartNewSprintDialog from '@/components/startNewSprint';

function Page() {

  const [sprints, setSprints] = useState<Sprint[]>([]);

  const fetchSprints = async () => {
    try {
      const res = await clxRequest.get<SprintsResponse>("sprints?page=1&limit=1000");
      setSprints(
        res.items.map((sprint) => ({
          ...sprint,
          storyPoints: sprint.storyPoints || { done: 0, total: 0 },
          tasks: sprint.tasks || [],
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);
  return (
    <div className='flex flex-col min-h-0'>
      <div className="flex gap-4 mb-5">
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
        <div className="ml-auto">
          <StartNewSprintDialog onSprintCreated={fetchSprints}/>
        </div>
      </div>
      <div className="scrollbar pr-2 overflow-x-scroll grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="bg-white/10 rounded-xl shadow-lg p-6 flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lime-400 text-lg">{sprint.name}</span>
              <span className="text-gray-200 text-sm">
                {new Date(sprint.startDate).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(sprint.endDate).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-white">Goal:</span>
              <span className="text-gray-300 text-sm">{sprint.goal}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-white">Progress:</span>
              <span className="text-gray-300 text-sm">{sprint.progress}%</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-white">Tasks:</span>
              <span className="text-gray-300 text-sm">
                {sprint.tasks.length}/20
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Story Points:</span>
              <span className="text-gray-300 text-sm">
                {(sprint.storyPoints?.done ?? 0)}/{(sprint.storyPoints?.total ?? 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page