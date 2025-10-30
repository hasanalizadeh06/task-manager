"use client";
import BoardTasks from "@/components/BoardTasks";
import CompleteDialog from "@/components/CompleteDialog";
import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { Sprint } from "@/interfaces/Sprints";
import CreateTask from "@/components/CreateTask";
import Image from "next/image";
import sortIcon from "@/shared/assets/icons/sort.png";
import status from "@/shared/assets/icons/status.png";
import arrowSquareRight from "@/shared/assets/icons/arrow-square-right.png";
import archiveIcon from "@/shared/assets/icons/archive.png";
import trashIcon from "@/shared/assets/icons/redtrash.png";
import { parseCookies } from "nookies";
import { Project } from "@/interfaces/Tasks";

interface Statuses {
  id: string;
  name: string;
  systemKey?: string;
  description: string;
  deleteable: boolean;
}

function Page() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<Sprint>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [openFunction, setOpenFunction] = useState("")
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  function refreshSprints() {
    clxRequest
      .get<{ items: Sprint[] }>("/sprints?page=1&limit=1000")
      .then((data) => {
      setSprints(data.items);
      if (selectedSprint) {
        const updatedSelectedSprint = data.items.find(sprint => sprint.id === selectedSprint.id);
        setSelectedSprint(updatedSelectedSprint);
      }
      })
      .catch(() => {});

  }
  function fetchStatuses() {
    clxRequest
    .get<Statuses[]>("/tasks/statuses/all")
    .then((data) => setStatuses(data.map(status => status.name)))
    .catch(() => {});
  }

  useEffect(() => {
    fetchStatuses();
    refreshSprints();
  }, []);

  useEffect(() => {
    if (openFunction === "delete") {
      if (!confirm("Are you sure you want to delete the selected tasks? This action cannot be undone.")) return setOpenFunction("");
      const {accessToken} = parseCookies()
      clxRequest
        .post("/tasks/bulk-delete", { taskIds: selectedTasks }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(() => {
          setRefreshFlag((prev) => !prev);
          setOpenFunction("");
          setSelectMode(false);
          setSelectedTasks([]);
        })
        .catch((error) => {
          console.error("Error deleting tasks:", error);
        });

      setSelectMode(false);
      setSelectedTasks([]);
    } else if (openFunction === "archive") {
      if (!confirm("Are you sure you want to archive the selected tasks?")) return setOpenFunction("");
      const {accessToken} = parseCookies()
      clxRequest
        .post("/archive/bulk", { type:"task", relationId: selectedTasks }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(() => {
          setRefreshFlag((prev) => !prev);
          setOpenFunction("");
          setSelectMode(false);
          setSelectedTasks([]);
        })
        .catch((error) => {
          console.error("Error archiving tasks:", error);
        });
      setSelectMode(false);
      setSelectedTasks([]);
    }
  }, [openFunction]);

  const handleMoveTasks = (targetProjectId: string, targetProjectName: string) => {
    if (!confirm(`Are you sure you want to move the selected tasks to project "${targetProjectName}"?`)) return setOpenFunction("");
    const {accessToken} = parseCookies()
    clxRequest
      .patch("/tasks/bulk-update-project", { taskIds: selectedTasks, projectId: targetProjectId }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(() => {
        setRefreshFlag((prev) => !prev);
        setOpenFunction("");
        setSelectMode(false);
        setSelectedTasks([]);
      })
      .catch((error) => {
        console.error("Error moving tasks:", error);
      });
  }

  const handleChangeStatus = (newStatus: string) => {
    if (!confirm(`Are you sure you want to change the status of the selected tasks to "${newStatus}"?`)) return setOpenFunction("");
    const {accessToken} = parseCookies()
    clxRequest
      .patch("/tasks/bulk-update-status", { taskIds: selectedTasks, status: newStatus }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(() => {
        setRefreshFlag((prev) => !prev);
        setOpenFunction("");
        setSelectMode(false);
        setSelectedTasks([]);
      })
      .catch((error) => {
        console.error("Error changing task status:", error);
      });
  }


  return (
    <div className="flex flex-col min-h-0 gap-5 grow">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#ffffff1a] px-3 py-2 rounded-2xl">
            <span className="text-sm text-white/80">Sprint</span>
            <div className="relative">
              <button
                className="text-sm text-white/90 font-medium flex items-center gap-1"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {selectedSprint?.name || "Select Sprint"}
                <FaChevronDown size={16} color="#fff" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-[#222] rounded shadow-lg z-10">
                  {sprints.map((sprint) => (
                    <button
                      key={sprint.id}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333]"
                      onClick={() => {
                        setSelectedSprint(sprint);
                        setDropdownOpen(false);
                      }}
                    >
                      {sprint.name}
                    </button>
                  ))}
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#333]"
                    onClick={() => {
                      setSelectedSprint(undefined);
                      setDropdownOpen(false);
                    }}
                  >
                    All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#ffffff1a] text-white/80 px-3 py-2 rounded-2xl text-sm">
            <Image src={sortIcon} alt="Sort" width={16} height={16} />
            Filter
          </button>
          <CreateTask
            id="test"
            addingSprint={selectedSprint}
            projectName={undefined}
            isBoardPage={true}
            dialogTitle="Add new task to Board"
          />
          {selectedSprint && (
            <CompleteDialog
              sprints={sprints}
              onComplete={() => {refreshSprints(); setRefreshFlag((prev) => !prev);}}
              sprint={selectedSprint}
            />
          )}
        </div>
      </div>
      <div className="flex grow gap-6 scrollbar h-full overflow-auto">
        <BoardTasks 
          isBoardPage={true} 
          sprint={selectedSprint}
          selectMode={selectMode}
          selectedTasks={selectedTasks}
          setSelectMode={setSelectMode}
          setSelectedTasks={setSelectedTasks}
          refreshFlagForSelected={refreshFlag}
          setProjects={setProjects}
        />
      </div>
      {selectMode && (
        <div className="rounded-2xl h-16 bg-white/10 shadow border-white/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <span className="text-white">
              {selectedTasks.length} {selectedTasks.length === 1 ? 'task' : 'tasks'} selected
            </span>
            <button
              onClick={() => {
                setSelectMode(false);
                setSelectedTasks([]);
              }}
              className="text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                className="flex items-center gap-1 text-white py-3 rounded-lg cursor-pointer transition-colors text-base font-semibold"
                title="Change Status"
                onClick={() => setOpenFunction(openFunction === "status" ? "" : "status")}
                >
                <Image src={status} alt="Sort" width={24} height={24} className="inline"/>
                Change Status
              </button>
              {openFunction === "status" && (
                <div className="absolute bottom-15 left-0 bg-[#ffffff1a] rounded shadow-lg z-10 p-4 w-48 backdrop-blur-lg">
                  <input
                    type="text"
                    placeholder="Search status..."
                    className="w-full mb-2 px-3 py-2 rounded bg-[#ffffff1a] text-white text-sm outline-none"
                    onChange={e => {
                      const value = e.target.value.toLowerCase();
                        setFilteredStatuses(() =>
                        value == ""
                          ? statuses
                          : statuses.filter(status => status.toLowerCase().includes(value))
                        );
                      }}
                      />
                  <div className="max-h-40 overflow-y-auto scrollbar">
                    {filteredStatuses.length != 0 ?
                    filteredStatuses.map((statusOption) => (
                      <button
                        key={statusOption}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff1a]"
                        onClick={() => {
                          handleChangeStatus(statusOption);
                        }}
                      >
                        {statusOption}
                      </button>
                    ))
                    : statuses.map((statusOption) => (
                      <button
                        key={statusOption}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff1a]"
                        onClick={() => {
                          handleChangeStatus(statusOption);
                        }}
                      >
                        {statusOption}
                      </button>
                    ))
                  }
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-1 text-white py-3 rounded-lg cursor-pointer transition-colors text-base font-semibold"
                title="Move"
                onClick={() => setOpenFunction(openFunction === "move" ? "" : "move")}
                >
                <Image src={arrowSquareRight} alt="Sort" width={24} height={24} className="inline"/>
                Move
              </button>
              {openFunction === "move" && (
                <div className="absolute bottom-15 left-0 bg-[#ffffff1a] rounded shadow-lg z-10 p-4 w-64 backdrop-blur-lg">
                  <input
                    type="text"
                    placeholder="Search project..."
                    className="w-full mb-2 px-3 py-2 rounded bg-[#ffffff1a] text-white text-sm outline-none"
                    onChange={e => {
                      const value = e.target.value.toLowerCase();
                        setFilteredProjects(() =>
                        value == ""
                          ? projects
                          : projects.filter(project => project.title.toLowerCase().includes(value))
                        );
                      }}
                    />
                  <div className="max-h-40 overflow-y-auto scrollbar">
                    {filteredProjects.length != 0 ? filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff1a]"
                        onClick={() => {
                          handleMoveTasks(project.id, project.title);
                        }}
                      >
                        {project.title}
                      </button>
                    ))
                    : projects.map((project) => (
                      <button
                        key={project.id}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff1a]"
                        onClick={() => {
                          handleMoveTasks(project.id, project.title);
                        }}
                      >
                        {project.title}
                      </button>
                    ))
                  }
                  </div>
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-1 text-white py-3 rounded-lg cursor-pointer transition-colors text-base font-semibold"
              title="Archive"
              onClick={() => setOpenFunction("archive")}
            >
              <Image src={archiveIcon} alt="Sort" width={24} height={24} className="inline"/>                            
              Archive
            </button>
            <button
              className="flex items-center text-[#DF1811] gap-1 py-3 rounded-lg cursor-pointer transition-colors text-base font-semibold"
              title="Delete"
              onClick={() => setOpenFunction("delete")}
            >
              <Image src={trashIcon} alt="Sort" width={24} height={24} className="inline"/>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;


