"use client";

import { useState, useMemo } from "react";

interface ContributionDay {
  date: string;
  count: number;
}

interface HeatmapProps {
  data: ContributionDay[];
}

export function Heatmap({ data }: HeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  // Group data by weeks
  const weeks = useMemo(() => {
    const cols: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];
    
    // Sort chronologically
    const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

    // Pad first week if it doesn't start on Sunday
    if (sortedData.length > 0) {
      const firstDate = new Date(sortedData[0].date);
      const startDay = firstDate.getDay(); // 0 is Sunday
      for (let i = 0; i < startDay; i++) {
        // Place empty item placeholders
        currentWeek.push({ date: "", count: -1 });
      }
    }

    sortedData.forEach((day) => {
      if (currentWeek.length === 7) {
        cols.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      // pad end
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", count: -1 });
      }
      cols.push(currentWeek);
    }

    return cols;
  }, [data]);

  // Determine square color based on contribution counts (indigo-to-fuchsia electric scale)
  const getColorClass = (count: number) => {
    if (count === -1) return "bg-transparent opacity-0 pointer-events-none"; // placeholder
    if (count === 0) return "bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/40 dark:border-white/5";
    if (count <= 2) return "bg-indigo-200 dark:bg-indigo-950/60 border border-indigo-300/10 text-indigo-400";
    if (count <= 4) return "bg-indigo-400 dark:bg-indigo-800/80 border border-transparent";
    if (count <= 8) return "bg-violet-500 dark:bg-violet-600 border border-transparent";
    return "bg-pink-500 dark:bg-primary border border-transparent shadow-[0_0_8px_rgba(167,139,250,0.4)]"; // highest
  };

  // Generate month headers
  const monthLabels = useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let prevMonth = -1;

    weeks.forEach((week, colIndex) => {
      const activeDay = week.find((day) => day.date !== "");
      if (activeDay) {
        const date = new Date(activeDay.date);
        const month = date.getMonth();
        if (month !== prevMonth) {
          labels.push({
            text: date.toLocaleDateString("en-US", { month: "short" }),
            colIndex,
          });
          prevMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="w-full select-none">
      <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
        <div className="min-w-[700px] flex flex-col pt-2">
          {/* Month labels */}
          <div className="flex text-[10px] text-neutral-400 dark:text-neutral-500 font-mono h-4 relative mb-2">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="absolute font-semibold tracking-wider uppercase"
                style={{ left: `${label.colIndex * 13.5}px` }}
              >
                {label.text}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="flex gap-[3.5px]">
            {weeks.map((week, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[3.5px]">
                {week.map((day, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`w-2.5 h-2.5 rounded-[2px] transition-all duration-200 relative hover:scale-135 hover:z-20 hover:shadow-[0_0_10px_rgba(167,139,250,0.8)] cursor-pointer ${getColorClass(day.count)}`}
                    onMouseEnter={() => day.count !== -1 && setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip & Legend Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-4 pt-4 border-t border-border/40">
        <div className="h-6">
          {hoveredDay ? (
            <span className="text-neutral-800 dark:text-neutral-300 font-sans">
              <strong>{hoveredDay.count}</strong> contributions on {new Date(hoveredDay.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          ) : (
            <span>Hover squares to inspect contribution dates</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 sm:mt-0 font-bold uppercase text-[9px] tracking-wider">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[1.5px] bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200/40 dark:border-white/5" />
          <div className="w-2.5 h-2.5 rounded-[1.5px] bg-indigo-200 dark:bg-indigo-950/60 border border-indigo-300/10" />
          <div className="w-2.5 h-2.5 rounded-[1.5px] bg-indigo-400 dark:bg-indigo-800/80" />
          <div className="w-2.5 h-2.5 rounded-[1.5px] bg-violet-500 dark:bg-violet-600" />
          <div className="w-2.5 h-2.5 rounded-[1.5px] bg-pink-500 dark:bg-primary shadow-[0_0_8px_rgba(167,139,250,0.4)]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
