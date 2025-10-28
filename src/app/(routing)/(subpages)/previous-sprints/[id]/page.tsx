"use client";
import StartNewSprintDialog from "@/components/startNewSprint";
import TaskList from "@/components/TaskList";
import { Sprint, SprintsResponse } from "@/interfaces/Sprints";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import filter from "@/shared/assets/icons/sort.png";
import emptyTickCircle from "@/shared/assets/icons/emptytickcircle.png";
import greenTick from "@/shared/assets/icons/greentick.png";

function Page() {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState<'startDate' | 'priority' | 'dueDate' | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const fetchSprint = async () => {
      try {
      const response = await clxRequest.get<SprintsResponse>("/sprints?page=1&limit=1000");
      const sprintsArray: Sprint[] = response.items || [];
      const foundSprint = sprintsArray.find((s) => 
        pathname.replaceAll("%20"," ").includes(s.name)
      );
      setSprint(foundSprint || null);
      } catch (error) {
      console.error("Error fetching sprints:", error);
      }
    };

    fetchSprint();
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-0 gap-5">
      <div className="flex items-center justify-between">
        {sprint ? 
          <span>
            {`${new Date(sprint.createdAt).toLocaleString("en-US", { month: "long", day: "numeric" })} - ${new Date(sprint.endDate).toLocaleString("en-US", { month: "long", day: "numeric" })}`}
          </span>
        :
          <span>Loading...</span>
        }
        <div className="flex gap-4">
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
                    setFilterType(filterType === 'startDate' ? null : 'startDate');
                    setFilterDropdownOpen(false);
                  }}
                  className="w-full flex items-center text-left px-3 py-2 rounded hover:bg-white/20"
                >
                  <div className="flex items-center flex-1">
                    <Image
                      src={filterType === 'startDate' ? greenTick : emptyTickCircle}
                      alt="Start Date sort"
                      width={20}
                      height={20}
                      className="mr-3"
                    />
                    <span style={filterType === 'startDate' ? { color: '#7CFC00', fontWeight: 600 } : { color: 'white' }}>
                      By Start Date
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setFilterType(filterType === 'priority' ? null : 'priority');
                    setFilterDropdownOpen(false);
                  }}
                  className="w-full flex items-center text-left px-3 py-2 rounded hover:bg-white/20"
                >
                  <div className="flex items-center flex-1">
                    <Image
                      src={filterType === 'priority' ? greenTick : emptyTickCircle}
                      alt="Priority sort"
                      width={20}
                      height={20}
                      className="mr-3"
                    />
                    <span style={filterType === 'priority' ? { color: '#7CFC00', fontWeight: 600 } : { color: 'white' }}>
                      By Priority
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setFilterType(filterType === 'dueDate' ? null : 'dueDate');
                    setFilterDropdownOpen(false);
                  }}
                  className="w-full flex items-center text-left px-3 py-2 rounded hover:bg-white/20"
                >
                  <div className="flex items-center flex-1">
                    <Image
                      src={filterType === 'dueDate' ? greenTick : emptyTickCircle}
                      alt="Due Date sort"
                      width={20}
                      height={20}
                      className="mr-3"
                    />
                    <span style={filterType === 'dueDate' ? { color: '#7CFC00', fontWeight: 600 } : { color: 'white' }}>
                      By Due Date
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
          <StartNewSprintDialog/>
        </div>
      </div>
      {sprint ?
        <div className="px-2 scrollbar overflow-x-scroll">
          <TaskList 
            addable={false} 
            tasks={sprint.tasks.sort((a, b) => {
              switch (filterType) {
                case 'startDate':
                  return new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime();
                case 'priority':
                  const priorityOrder = { critical:4, high: 3, medium: 2, low: 1 };
                  type PriorityKey = keyof typeof priorityOrder;
                  const getPriorityValue = (priority?: string) => priorityOrder[(priority?.toLowerCase() as PriorityKey) || 'low'];
                  return getPriorityValue(b.priority) - getPriorityValue(a.priority);
                case 'dueDate':
                  return new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime();
                default:
                  return 0;
              }
            })} 
          />
        </div>
        :
        <div>Loading...</div>
      }
    </div>
  );
}

export default Page;
