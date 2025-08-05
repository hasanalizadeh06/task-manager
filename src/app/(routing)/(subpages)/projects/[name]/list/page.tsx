
"use client";
import React, { useEffect, useState } from 'react'
import TaskList from '@/components/TaskList'
import { Project, ProjectsResponse, Task, TasksByStatus} from '@/interfaces/Tasks'
import { usePathname } from 'next/navigation';
import { clxRequest } from '@/shared/lib/api/clxRequest';

function Page() {
    const [tasks, setTasks] = useState<Task[]>([]);  
    const [project, setProject] = useState<Project | null>(null);
    // const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
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
          }, [project]);
  return (
        <div className='h-full'>
            <TaskList addable={false} tasks={tasks}/>
        </div>
    )
}

export default Page