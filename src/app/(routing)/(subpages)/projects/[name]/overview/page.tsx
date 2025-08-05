"use client";
import FileUpload from "@/components/FileUpload";
import Circle from "@/components/rechart-uis/Circle";
import React, { useEffect, useState } from "react";
import TaskList from "@/components/TaskList";
import { Project, ProjectsResponse, Task, TasksByStatus, UserTasksResponse } from "@/interfaces/Tasks";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { usePathname } from "next/navigation";

function Page() {
    const [tasks, setTasks] = useState<Task[]>([]);  
    const [project, setProject] = useState<Project | null>(null);
    const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await clxRequest.get<ProjectsResponse>("/projects");
                const projectsArray: Project[] = response.items || [];
                  const foundProject = projectsArray.find((p) => 
                      pathname.replaceAll("%20"," ").includes(p.title)
                  );
                setProject(foundProject || null);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        
        fetchProject();
    }, [pathname]);

    useEffect(() => {
        if (!project) return;
        clxRequest
            .get<TasksByStatus>(`/tasks/by-project?projectId=${project.id}`)
            .then((data) => {
                const allTasks = Object.values(data).flat();
                setTasks(allTasks);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
        clxRequest
            .get<UserTasksResponse>(`/dashboard/users-tasks?projectId=${project.id}`)
            .then((data) => {
                const chartData = data.items.map(item => ({
                    name: item.user.firstName,
                    value: item.statistics.totalTasks
                }));
                setStats(chartData);
            })
            .catch((error) => {
                console.error("Error fetching user tasks:", error);
            });
          }, [project]);

  return (
    <div className="min-h-full h-auto rounded-2xl flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="flex-1/2 rounded-2xl">
          <FileUpload
            onFilesSelected={(files) => console.log("Files selected:", files)}
            acceptedFileTypes="image/*,.pdf,.doc,.docx"
            maxFiles={5}
          />
        </div>
        <div className="flex-1/2 bg-[#ffffff1a] rounded-2xl p-5">
          <Circle
            centerText="735"
            datas={stats}
            size="110x110"
            circleName="Tasks by Assignee"
          />
        </div>
      </div>
      <div className="h-full">
        <TaskList addable={false} tasks={tasks}/>
      </div>
    </div>
  );
}

export default Page;
