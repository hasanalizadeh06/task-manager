import { ReactNode } from "react";

export interface Project {
  id: number;
  name: string;
  color: string;
}

export interface ProjectItem {
  id: string | number;
  label: string;
  icon: ReactNode;
  href: string;
}

