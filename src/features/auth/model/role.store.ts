import { create } from "zustand";

type RoleState = {
  role: string;
  setRole: (role: string) => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  role: "",
  setRole: (role) => set({ role }),
}));