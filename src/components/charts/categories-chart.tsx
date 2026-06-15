"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryPoint {
  name: string;
  count: number;
  percent: number;
}

interface CategoriesChartProps {
  data: CategoryPoint[];
}

export function CategoriesChart({ data }: CategoriesChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Filter out categories with 0 percent to keep chart clean
  const filteredData = data.filter(d => d.percent > 0);

  // Modern vibrant theme palette matching our premium layout
  const colors = [
    "var(--color-primary)",      // Purple
    "var(--color-glow-cyan)",    // Cyan
    "var(--color-glow-pink)",    // Pink
    "var(--color-glow-emerald)", // Emerald
    "var(--color-glow-amber)",   // Amber
    "var(--color-muted-foreground)", // Muted Gray
  ];

  if (!mounted) {
    return <Skeleton className="h-56 w-full" />;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 select-none">
      {/* Recharts Pie Canvas */}
      <div className="h-44 w-44 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-3 bg-card/90 backdrop-blur-md border border-indigo-500/20 dark:border-white/10 rounded-lg shadow-xl text-xs font-mono">
                      <div className="font-bold text-neutral-800 dark:text-neutral-200">
                        {item.name}
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 mt-1">
                        {item.count} Repositories ({item.percent}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={70}
              paddingAngle={4}
              dataKey="percent"
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  className="cursor-pointer outline-none hover:opacity-90 transition-opacity"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black tracking-tighter text-neutral-800 dark:text-neutral-100 font-mono">
            {filteredData.reduce((acc, curr) => acc + curr.count, 0)}
          </span>
          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-widest font-bold">
            Total Repos
          </span>
        </div>
      </div>

      {/* Custom Legend layout to avoid chart clutter */}
      <div className="flex-1 space-y-2.5 w-full">
        {filteredData.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between text-xs font-mono border-b border-neutral-100 dark:border-white/5 pb-2 last:border-0 last:pb-0">
            <div className="flex items-center space-x-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: colors[index % colors.length], boxShadow: `0 0 6px ${colors[index % colors.length]}` }}
              />
              <span className="text-neutral-700 dark:text-neutral-300 font-sans font-medium">{entry.name}</span>
            </div>
            <div className="text-neutral-400 flex items-center space-x-2 font-bold">
              <span className="text-neutral-800 dark:text-neutral-200">{entry.count}</span>
              <span className="text-[10px] text-neutral-400 font-normal">({entry.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
