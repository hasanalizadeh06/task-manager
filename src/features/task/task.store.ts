import { create } from "zustand";
import { Task } from "@/interfaces/Tasks";

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  refreshFlag: false,
  triggerRefresh: () => set((state) => ({ refreshFlag: !state.refreshFlag })),
}));
