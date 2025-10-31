import { Task } from "./Tasks";

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}