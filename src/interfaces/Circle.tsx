interface DataItem {
  name: string;
  value: number;
  color?: string; // Optional now!
}

export interface CircleProps {
  circleName: string;
  datas: DataItem[];
  taskLength?: number; // Optional, default to 0 if not provided
  size?: "sm" | "md" | "lg" | `${number}x${number}`;
}


export interface ProgressCircleProps {
  percentage?: number;
  size?: number;
  setViewStats?: void;
}