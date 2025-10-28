import { StaticImageData } from "next/image";
import { User } from "./LoginResponse";

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  ownerUserId: number;
  createdAt: string;
  projectAvatarUrl: string | null;
  assignedTo: User[];
  archived: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  estimatedTime: number | null;
  actualTime: number;
  dueDate: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  taskId: string;
}

export interface TasksResponse {
    items: Task[];
    total: number;
    page: number;
    limit: number;
}

export interface UserTasksResponse {
    items: Array<{
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            avatarUrl: string | null;
            isActive: boolean;
            lastLoginDate: string | null;
            createdAt: string;
            position: {
                id: string;
                description: string;
                name: string;
            };
            assignedProjects: number;
        };
        tasks: Task[];
        statistics: {
            totalTasks: number;
            completedTasks: number;
            inProgressTasks: number;
            overdueTasks: number;
            completionRate: number;
        };
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ProjectsResponse {
    message: string;
    items: Project[];
    total: number;
    page: number;
    limit: number;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string[];
  startDate: string;
  dueDate: string;
  estimatedTime: number | null;
  actualTime: number;
  tags: string[];
  images: StaticImageData[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  sprintId: string | null;
  sprint: string | null;
  project: Project;
  epicId: string | null;
  subtasks: Subtask[];
}

export interface NewTaskForm {
  name: string;
  assigneeName: string;
  startDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
}

export type TasksByStatus = {
  "To Do": Task[];
  "In Progress": Task[];
  "Testing": Task[];
  "Cancelled": Task[];
  "Done": Task[];
};

