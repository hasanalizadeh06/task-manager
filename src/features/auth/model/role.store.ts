import { create } from "zustand";


type RoleState = {
  role: string;
  userId: number;
  setRole: (role: string) => void;
  setUserId: (userId: number) => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  role: "",
  userId: 0,
  setRole: (role) => set({ role }),
  setUserId: (userId) => set({ userId }),
}));