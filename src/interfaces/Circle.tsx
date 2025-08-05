interface DataItem {
  name: string;
  value: number;
  color?: string; // Optional now!
}

export interface CircleProps {
  centerText: string;
  circleName: string;
  datas: DataItem[];
  size?: "sm" | "md" | "lg" | `${number}x${number}`;
}


export interface ProgressCircleProps {
  percentage?: number;
  size?: number;
  setViewStats?: void;
}