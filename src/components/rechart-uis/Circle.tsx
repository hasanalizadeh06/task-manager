"use client";

import { CircleProps } from "@/interfaces/Circle";
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const namedSizeMap: Record<string, string> = {
  sm: "h-40 w-40", // 160x160
  md: "h-64 w-64", // 256x256
  lg: "h-80 w-80", // 320x320
};

// fallback color palette (for auto assignment)
const fallbackColors = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#f472b6",
  "#fcd34d",
  "#c084fc",
  "#fca5a5",
  "#86efac",
  "#7dd3fc",
  "#a5b4fc",
  "#67e8f9",
  "#99f6e4",
  "#bbf7d0",
  "#fecdd3",
];

// Utility: Parse custom size like "100x100"
function parseCustomSize(sizeStr: string) {
  const match = sizeStr.match(/^(\d+)x(\d+)$/);
  if (!match) return null;
  return {
    height: `${match[1]}px`,
    width: `${match[2]}px`,
  };
}

const Circle: React.FC<CircleProps> = ({
  circleName,
  datas,
  size = "md",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const processedData = datas.map((item, index) => ({
    ...item,
    color: item.color || fallbackColors[index % fallbackColors.length],
  }));

  const classSize = typeof size === "string" && namedSizeMap[size];
  const customSize = typeof size === "string" && parseCustomSize(size);

  return (
    <div className="rounded-2xl p-2 h-full text-white w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold">{circleName}</h2>
      <div className="flex flex-wrap items-center justify-center mt-4 gap-6">
        <div
          className={`relative mx-auto shrink-0 ${classSize || ""}`}
          style={customSize ? { ...customSize, position: "relative" } : {}}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              onMouseEnter={(data, index) => {
                if (typeof index === "number") {
                  setHoveredIndex(index);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Pie
                data={processedData}
                dataKey="value"
                innerRadius="75%"
                outerRadius="100%"
                paddingAngle={1}
                onMouseEnter={(data, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color!}
                    style={{
                      cursor: "pointer",
                      opacity:
                        hoveredIndex === null || hoveredIndex === index
                          ? 1
                          : 0.3,
                      transition: "opacity 0.2s ease",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold">
            <div className="text-center">
              <div className="transition-all duration-200">
                {hoveredIndex !== null
                  ? processedData[hoveredIndex].value
                  : datas.reduce((sum, item) => sum + item.value, 0)}
              </div>
              {hoveredIndex !== null && (
                <div className="text-xs font-normal text-gray-300 mt-1 transition-all duration-200">
                  {processedData[hoveredIndex].name}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 text-xs">
          {processedData.map((item, index) => (
            <div
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              key={index}
              className="flex items-center space-x-2 px-2 py-1.5 hover:bg-black/20 rounded-md
            duration-100"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Circle;
