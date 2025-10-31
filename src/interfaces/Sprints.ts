import { Task } from "./Tasks";

export interface Sprint {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  goal: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assignedTo: string[];
  tasks: Task[];
  assignees: string[];
  storyPoints?: { done: number; total: number };
}

export interface SprintsResponse {
  items: Sprint[];
  total: number;
  page: number;
  limit: number;
}
