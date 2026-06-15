"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface HourPoint {
  hour: number;
  commits: number;
}

interface ActiveHoursChartProps {
  data: HourPoint[];
}

export function ActiveHoursChart({ data }: ActiveHoursChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  const chartData = data.map((d) => ({
    ...d,
    label: formatHour(d.hour),
  }));

  if (!mounted) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="h-64 w-full text-[10px] font-mono">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-glow-cyan)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(147, 51, 234, 0.03)" />
          <XAxis
            dataKey="label"
            tickFormatter={(value, index) => {
              // Only label every 3 hours to avoid cramming
              return index % 3 === 0 ? value : "";
            }}
            tickLine={false}
            axisLine={false}
            stroke="var(--color-muted-foreground)"
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="var(--color-muted-foreground)"
            dx={-5}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="p-3 bg-card/90 backdrop-blur-md border border-indigo-500/20 dark:border-white/10 rounded-lg shadow-xl text-xs font-mono">
                    <div className="text-neutral-400 dark:text-neutral-500">{item.label}</div>
                    <div className="font-bold text-neutral-800 dark:text-neutral-200 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>{item.commits} Commits</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="commits"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
