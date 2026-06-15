"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendDataPoint {
  date: string;
  count: number;
}

interface TrendsChartProps {
  trends: {
    last30Days: TrendDataPoint[];
    last90Days: TrendDataPoint[];
    lastYear: TrendDataPoint[];
  };
}

export function TrendsChart({ trends }: TrendsChartProps) {
  const [timeframe, setTimeframe] = useState<"30" | "90" | "365">("30");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const data = (() => {
    switch (timeframe) {
      case "30":
        return trends.last30Days;
      case "90":
        return trends.last90Days;
      case "365":
        return trends.lastYear;
      default:
        return trends.last30Days;
    }
  })();

  const formatXAxis = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (timeframe === "30") {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return date.toLocaleDateString("en-US", { month: "short", year: timeframe === "365" ? "2-digit" : undefined });
    } catch {
      return dateStr;
    }
  };

  if (!mounted) {
    return <Skeleton className="h-72 w-full" />;
  }

  return (
    <div className="space-y-6">
      {/* Timeframe Controls */}
      <div className="flex items-center justify-end space-x-1.5 select-none">
        {(["30", "90", "365"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-3 py-1.5 font-mono text-[9px] tracking-wider rounded-lg border transition-all duration-300 cursor-pointer ${
              timeframe === t
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-primary dark:bg-primary/15 dark:border-primary/30 font-bold shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                : "border-neutral-200 dark:border-white/5 text-muted-foreground hover:border-neutral-400 dark:hover:border-neutral-700 bg-background/50"
            }`}
          >
            {t === "365" ? "1 YEAR" : `${t} DAYS`}
          </button>
        ))}
      </div>

      {/* Recharts Canvas */}
      <div className="h-72 w-full text-[10px] font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="trendsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(147, 51, 234, 0.05)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              tickLine={false}
              axisLine={false}
              stroke="var(--color-muted-foreground)"
              dy={10}
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
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="p-3 bg-card/90 backdrop-blur-md border border-indigo-500/20 dark:border-white/10 rounded-lg shadow-xl text-xs font-mono">
                      <div className="text-neutral-400 dark:text-neutral-500">
                        {new Date(dataPoint.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="font-bold text-indigo-600 dark:text-primary mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span>{dataPoint.count} Contributions</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#trendsGradient)"
              activeDot={{ r: 5, strokeWidth: 0, fill: "var(--color-primary)", className: "shadow-[0_0_10px_var(--color-primary)]" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
