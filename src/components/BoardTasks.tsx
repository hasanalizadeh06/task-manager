"use client";

import React, { useEffect, useState } from "react";
import { Project, ProjectsResponse, Task, TasksByStatus } from "@/interfaces/Tasks";
import {
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiEye,
  FiFlag,
  FiMessageCircle,
} from "react-icons/fi";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { usePathname } from "next/navigation";

const BoardTasks = () => {
      const pathname = usePathname();
      const [project, setProject] = useState<Project | null>(null);
      const [tasks, setTasks] = useState<TasksByStatus | null>(null);  
      const [allProjects, setAllProjects] = useState<Project[]>([]);
  
      useEffect(() => {
          const fetchProject = async () => {
              try {
                  const response = await clxRequest.get<ProjectsResponse>("/projects");
                  const projectsArray: Project[] = response.items || [];
                  const foundProject = projectsArray.find((p) => 
                      pathname.replaceAll("%20"," ").includes(p.title)
                  );
                  setAllProjects(projectsArray);
                  setProject(foundProject || null);
              } catch (error) {
                  console.error("Error fetching projects:", error);
              }
          };
          fetchProject();
      }, [pathname]);  

      useEffect(() => {
          clxRequest
              .get<TasksByStatus>(`/tasks/board`)
              .then((data) => {
                console.log("Fetched tasks:", data);
                if (project) {
                    // @ts-expect-error: TasksByStatus tipinde olmayan property'ler filtreleniyor
                    const filteredTasks: TasksByStatus = Object.fromEntries(
                      Object.entries(data).map(([status, tasksArr]) => [
                      status,
                      tasksArr.filter(
                        (task) => task.projectId === project.id
                      ),
                      ])
                    );
                    setTasks(filteredTasks);
                    console.log("Filtered tasks:", filteredTasks);
                } else {
                  const filteredTasks: TasksByStatus = data
                  setTasks(filteredTasks);
                  console.log("No project found, displaying all tasks:", filteredTasks);
                }
              })
              .catch((error) => {
                  console.error("Error fetching tasks:", error);
              });
        }, [project]);

  // const [newColumnTitle, setNewColumnTitle] = useState("");
  // const [showNewColumnInput, setShowNewColumnInput] = useState(false);
  const [openSubtaskTaskId, setOpenSubtaskTaskId] = useState<string | null>(null);

  // const getPriorityColor = (priority: Task["priority"]) => {
  //   switch (priority) {
  //     case "Low":
  //       return "text-green-400 bg-green-500";
  //     case "Medium":
  //       return "text-yellow-400 bg-yellow-500";
  //     case "High":
  //       return "text-orange-400 bg-orange-500";
  //     case "Critical":
  //       return "text-red-400 bg-red-500";
  //     default:
  //       return "text-gray-400 bg-gray-500";
  //   }
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderSubtasks = (task: Task) => {
    if (!task.subtasks || openSubtaskTaskId !== task.id) return null;

    return task.subtasks.map((subtask) => (
      <div
        key={subtask.id}
        className="mt-3 ml-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
      >
        <h4 className="text-white font-semibold text-sm mb-1">
          {subtask.title}
        </h4>
        <p className="text-white text-xs opacity-70 mb-2">
          {subtask.description}
        </p>
        <div className="flex items-center justify-between text-xs text-white opacity-80">
          <div className="flex items-center gap-1">
            <FiCalendar size={12} />
            {formatDate(subtask.dueDate)}
          </div>
          <div className="flex items-center gap-1">
            <FiFlag size={12} className="text-red-400" />
            {subtask.priority}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      {tasks &&
      Object.entries(tasks).map(([status, column]) => (
        <div
        key={status}
        className="flex-shrink-0 h-min w-80 bg-white/10 rounded-lg backdrop-blur-sm"
        >
        <div className="flex items-center justify-between p-4">
          <div className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
          {status}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {column.map((task) => (
          <div
            key={task.id}
            className="group bg-white/5 shadow-xl rounded-xl p-5 border border-white/20 hover:bg-opacity-20 transition-all duration-200"
          >
            <div className="inline-block px-3 py-1 mb-2 text-xs text-green-400 border border-green-400 rounded-full">
            {allProjects.find((p) => p.id === task.projectId)?.title || "Development"}
            </div>

            <h3 className="text-white text-base font-semibold mb-1">
            {task.name}
            </h3>
            <p className="text-white text-xs opacity-70 leading-snug line-clamp-2 mb-4">
            {task.description}
            </p>

            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center -space-x-2">
              {task.assignedTo?.slice(0, 3).map((name, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white bg-pink-400 text-[10px] text-white flex items-center justify-center font-semibold"
              >
                {name[0]}
              </div>
              ))}
              {task.assignedTo?.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-white bg-white/20 text-[10px] text-white flex items-center justify-center font-semibold">
                +{task.assignedTo.length - 3}
              </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-white text-xs opacity-60">
              <div className="flex items-center gap-1">
              <FiEye size={14} /> 7
              </div>
              <div className="flex items-center gap-1">
              <FiMessageCircle size={14} /> 18
              </div>
            </div>
            </div>

            <div className="flex items-center justify-between text-white text-xs mb-2">
            <div className="flex items-center gap-1">
              <FiCalendar size={12} /> Due: {formatDate(task.dueDate)}
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <FiFlag size={12} /> {task.priority}
            </div>
            </div>

            <div className="flex items-center justify-between text-white text-xs opacity-80">
            <div className="flex items-center gap-1">
              <FiClock size={12} />
              Time estimation:{" "}
              {task.estimatedTime ? `${task.estimatedTime}hr` : "N/A"}
            </div>

            <button
              className="flex items-center gap-1 hover:text-green-400 transition"
              onClick={() =>
              setOpenSubtaskTaskId(
                openSubtaskTaskId === task.id ? null : task.id
              )
              }
            >
              <FiChevronDown size={12} /> {task.subtasks?.length || 0} subtasks
            </button>
            </div>

            {renderSubtasks(task)}
          </div>
          ))}
          {/* Replace TaskDialog with your dialog component if needed */}
        </div>
        </div>
      ))}
    </>
  );
};

export default BoardTasks;
