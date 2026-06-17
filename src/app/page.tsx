"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  BarChart3,
  Sparkles,
  GitBranch,
  Calendar,
  Share2,
  Flame,
  Code2,
  Award,
  ArrowRight,
  TrendingUp,
  GitCommit,
  Users,
  BookOpen
} from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsLoading(true);
    router.push(`/story/${username.trim().toLowerCase()}`);
  };

  const handleDemoClick = (demoUser: string) => {
    setIsLoading(true);
    router.push(`/story/${demoUser}`);
  };

  // Live telemetry stats
  const globalStats = [
    {
      label: "Total Commits Analyzed",
      value: "24,842,910",
      subtext: "+124k today",
      icon: GitCommit,
      colorClass: "text-indigo-500"
    },
    {
      label: "Profiles Synced",
      value: "18,421",
      subtext: "Developers globally",
      icon: Users,
      colorClass: "text-cyan-500"
    },
    {
      label: "Peak Coding Streak",
      value: "365 Days",
      subtext: "Logged by @torvalds",
      icon: Flame,
      colorClass: "text-amber-500"
    },
    {
      label: "Repositories Scanned",
      value: "348,290",
      subtext: "Public repos scanned",
      icon: BookOpen,
      colorClass: "text-pink-500"
    }
  ];

  const languageDistribution = [
    { name: "TypeScript", percentage: 34.2, color: "bg-blue-500 shadow-blue-500/20" },
    { name: "JavaScript", percentage: 22.5, color: "bg-yellow-500 shadow-yellow-500/20" },
    { name: "Python", percentage: 18.1, color: "bg-green-500 shadow-green-500/20" },
    { name: "Go", percentage: 10.4, color: "bg-cyan-500 shadow-cyan-500/20" },
    { name: "Rust", percentage: 8.8, color: "bg-orange-500 shadow-orange-500/20" },
    { name: "C/C++", percentage: 6.0, color: "bg-red-500 shadow-red-500/20" }
  ];

  // Mock activity level density grid (7 days, 24 hours)
  const heatmapData = [
    [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 2, 2, 3, 3, 3, 2, 2, 1, 1, 0, 0], // Mon
    [0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1, 0, 0], // Tue
    [0, 0, 0, 0, 0, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 0], // Wed
    [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 2, 2, 3, 3, 3, 2, 2, 1, 1, 0, 0], // Thu
    [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 2, 1, 1, 1, 0, 0], // Fri
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0], // Sat
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]  // Sun
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Features list
  const features = [
    {
      icon: BarChart3,
      title: "Activity Analytics",
      description: "Inspect daily, weekly, and monthly trends using clean, neutral data charts."
    },
    {
      icon: Sparkles,
      title: "AI Insights Story",
      description: "Synthesize commit habits and repository growth into a descriptive, professional narrative."
    },
    {
      icon: GitBranch,
      title: "Project Intelligence",
      description: "Identify your flagship, most maintained, and fastest-growing software repositories."
    },
    {
      icon: Calendar,
      title: "Growth Timeline",
      description: "Map major developmental milestones, repository releases, and contribution streaks."
    },
    {
      icon: Share2,
      title: "Shareable Story",
      description: "Generate static public reports or download print-ready PDF summaries for recruiters."
    }
  ];

  return (
    <div className="min-h-full flex flex-col mesh-bg text-foreground transition-colors duration-300 bg-grid-pattern relative overflow-hidden">
      {/* Immersive Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-500/15 dark:bg-pink-500/10 blur-[120px] pointer-events-none animate-float-medium" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-cyan-500/8 dark:bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-20 lg:py-28 relative z-10 justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-indigo-500 dark:text-primary font-bold uppercase px-3 py-1.5 rounded-full bg-indigo-500/5 dark:bg-primary/10 border border-indigo-500/10 dark:border-primary/10">
              Spotify Wrapped for Developers
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Your GitHub Profile Has a <span className="text-gradient-primary">Story.</span><br />
            <span className="text-neutral-500 dark:text-neutral-400">Let&apos;s Tell It.</span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Turn commits, repositories, pull requests, and contributions into a beautiful, professional developer narrative. Designed for programmers who value code quality.
          </motion.p>

          {/* Search form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-6 select-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-400 dark:text-neutral-500">@</span>
              <Input
                type="text"
                placeholder="github-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="pl-8 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-800 bg-white/75 dark:bg-black/20 backdrop-blur-md h-12 rounded-lg font-mono text-sm focus:border-indigo-500 dark:focus:border-primary/60 transition-all duration-200"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full sm:w-auto h-12 px-6 flex items-center justify-center gap-2 font-mono text-xs tracking-wider font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 hover:opacity-95 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300 rounded-lg shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>GENERATE</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        </div>

        {/* Global Live Activity Ticker Section */}
        <div className="mt-28 space-y-16">
          <div className="text-center">
            <span className="font-mono text-[10px] tracking-[0.25em] text-indigo-500 dark:text-primary font-bold uppercase px-3 py-1.5 rounded-full bg-indigo-500/5 dark:bg-primary/10 border border-indigo-500/10 dark:border-primary/10 select-none">
              Live System Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-4 leading-none">
              Activity Metrics & Global Insights
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-450 mt-2 max-w-md mx-auto">
              Real-time synchronization statistics and development trends across the network.
            </p>
          </div>

          {/* Grid of Global Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {globalStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                >
                  <Card className="glass-card border border-neutral-200 dark:border-white/5 p-6 flex flex-col justify-between h-[130px] transition-all hover:border-neutral-300 dark:hover:border-white/10 relative overflow-hidden select-none">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider block">
                          {stat.label}
                        </span>
                        <h3 className="text-2xl font-black font-mono text-neutral-800 dark:text-neutral-100 tracking-tight">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-lg bg-neutral-100 dark:bg-white/[0.02] border border-neutral-200/40 dark:border-white/5 ${stat.colorClass}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-550 font-medium">
                      {stat.subtext}
                    </span>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Languages Distribution & Live Sync Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">

            {/* Left Column: Language Distribution */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass-card border border-neutral-200 dark:border-white/5 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6 select-none">
                    <Code2 className="h-4.5 w-4.5 text-indigo-500 dark:text-primary" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">Favorite Languages</h4>
                      <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest block mt-0.5">Top codebase metrics analyzed</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {languageDistribution.map((lang, i) => (
                      <div key={i} className="space-y-1.5 select-none">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                          <span className="text-neutral-700 dark:text-neutral-300">{lang.name}</span>
                          <span className="text-neutral-500 dark:text-neutral-450">{lang.percentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-white/[0.02] border border-neutral-200/20 dark:border-white/5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${lang.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${lang.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200/50 dark:border-white/5 text-[9px] font-mono text-neutral-400 dark:text-neutral-550 select-none">
                  Telemetry samples aggregate public repository commits scanned daily.
                </div>
              </Card>
            </motion.div>

            {/* Right Column: Mini Activity Heatmap Preview */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="glass-card border border-neutral-200 dark:border-white/5 p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6 select-none">
                    <TrendingUp className="h-4.5 w-4.5 text-indigo-500 dark:text-primary" />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">Activity Heatmap Preview</h4>
                      <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest block mt-0.5">Average contribution density by hour</span>
                    </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="space-y-4 pt-1">
                    <div className="flex flex-col space-y-1 bg-neutral-100/30 dark:bg-white/[0.003] p-3 rounded-lg border border-neutral-250/20 dark:border-white/5 overflow-x-auto">

                      {/* Grid representation */}
                      <div className="flex flex-col space-y-1 min-w-[240px]">
                        {heatmapData.map((row, dayIdx) => (
                          <div key={dayIdx} className="flex items-center space-x-1">
                            {/* Day name label: only show Mon, Wed, Fri for cleanliness */}
                            <span className="w-6 text-[8px] font-mono font-bold text-neutral-400 dark:text-neutral-650 select-none">
                              {dayIdx % 2 === 0 ? dayNames[dayIdx] : ""}
                            </span>

                            {/* Row squares */}
                            <div className="flex items-center space-x-1.5">
                              {row.map((val, hourIdx) => (
                                <div
                                  key={hourIdx}
                                  title={`${dayNames[dayIdx]} Hour ${hourIdx}: level ${val}`}
                                  className={`w-2 h-2 rounded-xs transition-all duration-300 ${val === 3
                                      ? "bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                                      : val === 2
                                        ? "bg-indigo-400/80 dark:bg-indigo-650/75"
                                        : val === 1
                                          ? "bg-indigo-200 dark:bg-indigo-900/40"
                                          : "bg-neutral-200/50 dark:bg-white/[0.02]"
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* X axis hours labels */}
                      <div className="flex justify-between pl-6 text-[7px] font-mono text-neutral-400 dark:text-neutral-600 pt-1 select-none min-w-[240px]">
                        <span>12 AM</span>
                        <span>6 AM</span>
                        <span>12 PM</span>
                        <span>6 PM</span>
                        <span>11 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary lists */}
                  <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-xl bg-neutral-50/50 dark:bg-white/[0.005] border border-neutral-200/40 dark:border-white/5 select-none font-mono text-[9px] tracking-wider font-bold">
                    <div className="space-y-1">
                      <span className="text-neutral-400 dark:text-neutral-550 block">PEAK HOURS:</span>
                      <span className="text-neutral-800 dark:text-neutral-200 block text-xs font-black">2 PM – 6 PM</span>
                    </div>
                    <div className="space-y-1 border-l border-neutral-200/50 dark:border-white/5 pl-4">
                      <span className="text-neutral-400 dark:text-neutral-550 block">ACTIVE DAYS:</span>
                      <span className="text-neutral-800 dark:text-neutral-200 block text-xs font-black">TUE & WED</span>
                    </div>
                  </div>
                </div>

                {/* Heatmap Legend */}
                <div className="pt-4 flex justify-between items-center text-[8px] font-mono text-neutral-400 dark:text-neutral-600 select-none">
                  <span>Legend: 24h cycle metrics</span>
                  <div className="flex items-center space-x-1">
                    <span>Less</span>
                    <div className="w-2 h-2 rounded-xs bg-neutral-200/50 dark:bg-white/[0.02]" />
                    <div className="w-2 h-2 rounded-xs bg-indigo-200 dark:bg-indigo-900/40" />
                    <div className="w-2 h-2 rounded-xs bg-indigo-400/80 dark:bg-indigo-650/75" />
                    <div className="w-2 h-2 rounded-xs bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
                    <span>More</span>
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>
        </div>

        {/* Features Section */}
        <div className="mt-36 max-w-5xl mx-auto border-t border-border/40 pt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Features Designed For Professionals
            </h2>
            <p className="text-sm text-neutral-500 mt-2">
              Transforming raw commits into visual intelligence without the clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.slice(0, 3).map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Card key={i} className="glass-card border border-neutral-200 dark:border-white/5">
                  <CardHeader className="p-6">
                    <div className="p-2.5 w-10 h-10 rounded-lg bg-indigo-500/10 dark:bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-indigo-600 dark:text-primary" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight">{feat.title}</CardTitle>
                    <CardDescription className="text-xs pt-2.5 leading-relaxed text-neutral-500 dark:text-neutral-400 font-sans">{feat.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
            {features.slice(3).map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Card key={i} className="glass-card border border-neutral-200 dark:border-white/5">
                  <CardHeader className="p-6">
                    <div className="p-2.5 w-10 h-10 rounded-lg bg-indigo-500/10 dark:bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-indigo-600 dark:text-primary" />
                    </div>
                    <CardTitle className="text-base font-bold tracking-tight">{feat.title}</CardTitle>
                    <CardDescription className="text-xs pt-2.5 leading-relaxed text-neutral-500 dark:text-neutral-400 font-sans">{feat.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-28 py-10 bg-background/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} GitHub Activity Story.
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-1.5 select-none">
            <span>Built by</span>
            <a
              href="https://github.com/yathartharastogi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-300 hover:text-indigo-500 dark:hover:text-primary transition-colors font-bold"
            >
              @yathartharastogi
            </a>
            <span className="text-neutral-300 dark:text-neutral-800">|</span>
            <span>Built for developers.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
