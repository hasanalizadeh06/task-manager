"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { Sprint, SprintsResponse } from '@/interfaces/Sprints';
import StartNewSprintDialog from '@/components/startNewSprint';
import Link from 'next/link';
import filter from "@/shared/assets/icons/sort.png"
import Image from 'next/image';
import emptyTickCircle from "@/shared/assets/icons/emptytickcircle.png";
import greenTick from "@/shared/assets/icons/greentick.png";

function Page() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState<'latest' | 'earliest' | 'progress' | null>(null);

  const fetchSprints = async () => {
    try {
      const res = await clxRequest.get<SprintsResponse>("/sprints?page=1&limit=1000");
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
  // Filtreleme fonksiyonu
  const getFilteredSprints = () => {
    const filteredSprints = [...sprints];
    
    switch (filterType) {
      case 'latest':
        return filteredSprints.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      case 'earliest':
        return filteredSprints.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case 'progress':
        return filteredSprints.sort((a, b) => 
          (b.progress || 0) - (a.progress || 0)
        );
      default:
        return filteredSprints;
    }
  };

  return (
    <div className='flex flex-col min-h-0'>
      <div className="flex justify-end gap-4 mb-5">
        <div className="relative">
          <button 
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full shadow hover:bg-white/20 transition-colors"
          >
            <Image src={filter} alt="Filter" width={16} height={16} />
            Filter
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 top-12 z-20 bg-white/10 rounded-xl shadow-lg p-2 min-w-[180px] flex flex-col gap-2 backdrop-blur">
              <button
                onClick={() => {
                  setFilterType(filterType === 'latest' ? null : 'latest');
                  setFilterDropdownOpen(false);
                }}
                className="w-full flex items-center text-left px-3 py-2 rounded hover:bg-white/20"
              >
                <div className="flex items-center flex-1">
                  <Image
                    src={filterType === 'latest' ? greenTick : emptyTickCircle}
                    alt="Latest sort"
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <span style={filterType === 'latest' ? { color: '#7CFC00', fontWeight: 600 } : { color: 'white' }}>
                    Latest First
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setFilterType(filterType === 'earliest' ? null : 'earliest');
                  setFilterDropdownOpen(false);
                }}
                className="w-full flex items-center text-left px-3 py-2 rounded hover:bg-white/20"
              >
                <div className="flex items-center flex-1">
                  <Image
                    src={filterType === 'earliest' ? greenTick : emptyTickCircle}
                    alt="Earlier sort"
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <span style={filterType === 'earliest' ? { color: '#7CFC00', fontWeight: 600 } : { color: 'white' }}>
                    Oldest First
                  </span>
                </div>
              </button>
              <button
                onClick={() => {
                  setFilterType(filterType === 'progress' ? null : 'progress');
                  setFilterDropdownOpen(false);
                }}
                className="w-full flex items-center text-left px-3 py-2 rounded hover:bg-white/20"
              >
                <div className="flex items-center flex-1">
                  <Image
                    src={filterType === 'progress' ? greenTick : emptyTickCircle}
                    alt="Progress sort"
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <span style={filterType === 'progress' ? { color: '#7CFC00', fontWeight: 600 } : { color: 'white' }}>
                    By Progress
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
        <StartNewSprintDialog onSprintCreated={fetchSprints}/>
      </div>
      <div className="scrollbar pr-2 overflow-x-scroll grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {getFilteredSprints().map((sprint) => (
          <Link
            href={`/previous-sprints/${sprint.name}`}
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
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Page