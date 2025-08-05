// import { create } from 'zustand';
//
// interface UIState {
//   sidebarOpen: boolean;
//   toggleSidebar: () => void;
//   setSidebar: (open: boolean) => void;
// }
//
// export const useUIStore = create<UIState>((set) => ({
//   sidebarOpen: false,
//   toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
//   setSidebar: (open) => set({ sidebarOpen: open }),
// }));

// Persist issue
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
//
// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       token: '',
//       setToken: (token: string) => set({ token }),
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// );

//Usage

// 'use client';
//
// import { useUIStore } from '@/shared/model/store/ui.store';
//
// export const SidebarToggle = () => {
//   const sidebarOpen = useUIStore((state) => state.sidebarOpen);
//   const toggleSidebar = useUIStore((state) => state.toggleSidebar);
//
//   return (
//     <button onClick={toggleSidebar}>
//       {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
//       </button>
//   );
// };
