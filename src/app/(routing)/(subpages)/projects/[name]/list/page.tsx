
"use client";
import React, { useEffect, useState } from 'react'
import TaskList from '@/components/TaskList'
import { Project, ProjectsResponse, Task, TasksByStatus} from '@/interfaces/Tasks'
import { useTaskStore } from "@/features/task/task.store";
import { usePathname } from 'next/navigation';
import { clxRequest } from '@/shared/lib/api/clxRequest';

function Page() {
    const [tasks, setTasks] = useState<Task[]>([]);  
    const { refreshFlag, setTasks: setGlobalTasks } = useTaskStore();
    const [project, setProject] = useState<Project | null>(null);
    // const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await clxRequest.get<ProjectsResponse>("projects?page=1&limit=1000");
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
    }, [pathname, refreshFlag]);

    useEffect(() => {
        if (!project) return;
        clxRequest
            .get<TasksByStatus>(`/tasks/by-project?projectId=${project.id}`)
            .then((data) => {
                const allTasks = Object.values(data).flat();
                setTasks(allTasks);
                setGlobalTasks(allTasks);
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
          }, [project, refreshFlag, setGlobalTasks]);
  return (
        <div className='h-full'>
            <TaskList addable={false} tasks={tasks}/>
        </div>
    )
}

export default Page