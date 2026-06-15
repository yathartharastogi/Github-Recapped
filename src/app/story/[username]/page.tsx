"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heatmap } from "@/components/charts/heatmap";
import { TrendsChart } from "@/components/charts/trends-chart";
import { ActiveHoursChart } from "@/components/charts/active-hours-chart";
import { CategoriesChart } from "@/components/charts/categories-chart";
import { DeveloperStats } from "@/lib/mock-data";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import {
  Users,
  BookOpen,
  Calendar,
  GitCommit,
  Star,
  GitPullRequest,
  CheckCircle2,
  Clock,
  Code2,
  Flame,
  Award,
  Download,
  Copy,
  TrendingUp,
  FolderGit2,
  Shield,
  Sparkles,
  RefreshCw
} from "lucide-react";

const Linkedin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [data, setData] = useState<DeveloperStats & { storyText: string; cached: boolean; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Stagger animation states
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      const colors = ["#6366f1", "#a78bfa", "#ec4899", "#06b6d4"];
      
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors });
    }, 250);
  };

  const fetchStory = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/story?username=${username}${forceRefresh ? "&refresh=true" : ""}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch developer story");
      }
      
      const storyData = await res.json();
      setData(storyData);
      setTimeout(() => {
        triggerConfetti();
      }, 500);
    } catch (err: unknown) {
      console.error("Error fetching story:", err);
      setError((err as Error).message || "Failed to generate story data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      const timer = setTimeout(() => {
        fetchStory(false);
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleWrappedRedirect = () => {
    router.push(`/wrapped/${username}`);
  };

  const getLevelLabel = (lvl: number) => {
    const labels = ["Explorer", "Builder", "Creator", "Architect", "Veteran"];
    return labels[Math.min(4, Math.max(0, lvl - 1))];
  };

  // Tier color mapper for avatars and badges
  const getLevelColorClass = (lvl: number) => {
    switch (lvl) {
      case 5: return "from-yellow-400 via-amber-500 to-red-500 shadow-yellow-500/30"; // Veteran
      case 4: return "from-purple-500 via-fuchsia-500 to-pink-500 shadow-fuchsia-500/30"; // Architect
      case 3: return "from-cyan-400 via-blue-500 to-indigo-500 shadow-cyan-500/30"; // Creator
      case 2: return "from-emerald-400 to-teal-500 shadow-emerald-500/30"; // Builder
      default: return "from-indigo-400 to-violet-500 shadow-indigo-500/30"; // Explorer
    }
  };

  const getLevelBadgeText = (lvl: number) => {
    switch (lvl) {
      case 5: return "text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-500/5";
      case 4: return "text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5";
      case 3: return "text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      case 2: return "text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      default: return "text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/5";
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case "git-commit":
        return <GitCommit className="h-5 w-5" />;
      case "git-pull-request":
        return <GitPullRequest className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
      case "shield-alert":
        return <Shield className="h-5 w-5" />;
      case "flame":
        return <Flame className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex flex-col mesh-bg text-foreground bg-grid-pattern">
        <Navbar />
        <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-12">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/40">
            <div className="flex items-center space-x-5">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>

          {/* Core Metrics Grid Skeletons */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>

          {/* Heatmap Skeleton */}
          <Skeleton className="h-64 rounded-lg" />

          {/* Two Column Layout Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-full flex flex-col mesh-bg text-foreground bg-grid-pattern">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
          <div className="rounded-full bg-red-100 dark:bg-red-950/20 p-4 text-red-500 border border-red-500/10">
            <Shield className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Generation Failed</h1>
            <p className="text-sm text-muted-foreground">{error || "Something went wrong while communicating with GitHub API."}</p>
          </div>
          <div className="flex space-x-3 w-full select-none">
            <Button variant="outline" onClick={() => router.push("/")} className="flex-1 rounded-lg">
              Back to Home
            </Button>
            <Button onClick={() => fetchStory(true)} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-650 hover:opacity-95 text-white shadow-lg rounded-lg">
              Retry Sync
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { user, contributions, habits, projects, timeline, achievements, archetype, level, storyText } = data;

  return (
    <div className="min-h-full flex flex-col mesh-bg text-foreground bg-grid-pattern transition-colors duration-300 relative overflow-hidden" ref={dashboardRef}>
      {/* Background soft glowing blur blobs */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[600px] right-20 w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none animate-float-slow" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-10 pb-24 Print:p-0 relative z-10">
        
        {/* Section 1: Overview Header */}
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-border/40 relative Print:border-none"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start sm:items-center space-x-6">
            <div className="relative shrink-0 select-none">
              {/* Static Accent Ring */}
              <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr ${getLevelColorClass(level)} opacity-60 blur-[1px]`} />
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="h-20 w-20 rounded-full border-2 border-background object-cover bg-neutral-900 relative z-10 shadow-xl"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded font-mono text-[9px] font-semibold tracking-wider border ${getLevelBadgeText(level)}`}>
                  {getLevelLabel(level).toUpperCase()} TIER (LVL {level})
                </span>
              </div>
              <p className="text-xs text-indigo-500 dark:text-primary font-bold font-mono">@{user.username}</p>
              {user.bio && <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl font-sans leading-relaxed pt-0.5">{user.bio}</p>}
              
              <div className="flex items-center space-x-4 pt-1 text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> <b>{user.followers}</b> followers</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5"><BookOpen className="h-3 w-3" /> <b>{user.publicRepos}</b> repos</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> <b>{user.accountAgeYears}y</b> age</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 select-none Print:hidden shrink-0">
            <Button variant="outline" size="sm" onClick={() => fetchStory(true)} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider font-bold border-neutral-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-primary/30 transition-all duration-300 rounded-lg py-4">
              <RefreshCw className="h-3.5 w-3.5 text-neutral-400 dark:text-primary" />
              <span>SYNC LIVE</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleWrappedRedirect} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider font-bold border-indigo-500/20 dark:border-primary/20 bg-indigo-500/5 dark:bg-primary/10 text-indigo-600 dark:text-primary hover:bg-indigo-500/10 dark:hover:bg-primary/20 transition-all duration-300 rounded-lg py-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>WRAPPED</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/compare?userA=${user.username}`)} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider font-bold hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-300 rounded-lg py-4">
              <GitCommit className="h-3.5 w-3.5 text-neutral-400" />
              <span>COMPARE</span>
            </Button>
          </div>
        </motion.div>

        {/* Counter Summary Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[
            { label: "Total Contributions", val: contributions.total, icon: TrendingUp, glow: "rgba(99, 102, 241, 0.1)" },
            { label: "Active Repositories", val: contributions.activeReposCount, icon: FolderGit2, glow: "rgba(6, 182, 212, 0.1)" },
            { label: "Stars Earned", val: contributions.starsEarned, icon: Star, glow: "rgba(245, 158, 11, 0.1)" },
            { label: "Pull Requests", val: contributions.pullRequests, icon: GitPullRequest, glow: "rgba(236, 72, 153, 0.1)" },
            { label: "Issues Opened", val: contributions.issuesOpened, icon: Shield, glow: "rgba(16, 185, 129, 0.1)" },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="glass-card border border-neutral-200 dark:border-white/5 relative group overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${metric.glow}, transparent 60%)` }} />
                  <CardHeader className="p-4 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-bold">{metric.label}</span>
                      <Icon className="h-3.5 w-3.5 text-neutral-400 group-hover:text-foreground transition-colors duration-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-black tracking-tight font-mono text-neutral-800 dark:text-neutral-100">
                      <AnimatedCounter value={metric.val} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section 2: Contribution Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border border-neutral-200 dark:border-white/5 overflow-hidden">
            <CardHeader className="p-6 border-b border-border/40 pb-4 bg-neutral-50/20 dark:bg-white/[0.01]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Contribution Matrix & Trends</CardTitle>
                  <CardDescription className="text-xs">
                    Analysis of contribution densities and activity volumes over time.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 select-none">
                  <span className="font-mono text-[10px] tracking-wide font-black px-3 py-1.5 rounded-lg bg-indigo-500/10 dark:bg-primary/10 border border-indigo-500/20 dark:border-primary/20 text-indigo-600 dark:text-primary">
                    CONSISTENCY: {contributions.consistencyScore}/100 ({contributions.consistencyLabel.toUpperCase()})
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Heatmap Grid */}
              <div className="space-y-3">
                <span className="font-mono text-[9px] tracking-widest font-black text-neutral-400 dark:text-neutral-500 uppercase">Interactive Contribution Heatmap</span>
                <Heatmap data={contributions.daily} />
              </div>
              
              {/* Trends Graph */}
              <div className="grid grid-cols-1 pt-6 border-t border-border/40">
                <span className="font-mono text-[9px] tracking-widest font-black text-neutral-400 dark:text-neutral-500 uppercase mb-4">Contribution Volume Graph</span>
                <TrendsChart trends={contributions.trends} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 3: Coding Habits & Section 4: Project Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Coding Habits */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full glass-card border border-neutral-200 dark:border-white/5">
              <CardHeader className="bg-neutral-50/20 dark:bg-white/[0.01] border-b border-border/40 pb-4">
                <CardTitle className="text-xl font-bold tracking-tight">Coding Habits</CardTitle>
                <CardDescription className="text-xs">
                  Insights parsed from hourly push timings and commit schedules.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2.5">
                  <span className="font-mono text-[9px] tracking-widest font-black text-neutral-400 dark:text-neutral-500 uppercase">Commits by Hour (0-23)</span>
                  <ActiveHoursChart data={habits.activeHours} />
                </div>

                <div className="pt-4 border-t border-border/40 grid grid-cols-3 gap-3 font-mono text-center select-none">
                  <div className="p-3 bg-neutral-100/50 dark:bg-white/[0.02] rounded-lg border border-neutral-200/50 dark:border-white/5">
                    <span className="block text-[8px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-black">Current Streak</span>
                    <span className="block text-xl font-bold text-amber-500 dark:text-amber-400 mt-1 flex items-center justify-center gap-1">
                      <Flame className="h-4 w-4 shrink-0 fill-current animate-pulse-glow" />
                      <span><AnimatedCounter value={habits.streaks.current} />d</span>
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-100/50 dark:bg-white/[0.02] rounded-lg border border-neutral-200/50 dark:border-white/5">
                    <span className="block text-[8px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-black">Longest Streak</span>
                    <span className="block text-xl font-bold text-red-500 dark:text-red-400 mt-1 flex items-center justify-center gap-1">
                      <Flame className="h-4 w-4 shrink-0 fill-current" />
                      <span><AnimatedCounter value={habits.streaks.longest} />d</span>
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-100/50 dark:bg-white/[0.02] rounded-lg border border-neutral-200/50 dark:border-white/5">
                    <span className="block text-[8px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-black">Avg Streak</span>
                    <span className="block text-xl font-bold text-neutral-800 dark:text-neutral-100 mt-1">
                      <AnimatedCounter value={habits.streaks.average} />d
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-100/40 dark:bg-white/[0.01] text-xs leading-relaxed space-y-3">
                  <p className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Clock className="h-4 w-4 shrink-0 text-indigo-500 dark:text-primary mt-0.5" />
                    <span>{habits.peakHoursText}</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300 border-t border-neutral-200/50 dark:border-white/5 pt-3">
                    <Calendar className="h-4 w-4 shrink-0 text-cyan-500 dark:text-glow-cyan mt-0.5" />
                    <span>{habits.dayAnalysis.insights}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Intelligence */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full glass-card border border-neutral-200 dark:border-white/5">
              <CardHeader className="bg-neutral-50/20 dark:bg-white/[0.01] border-b border-border/40 pb-4">
                <CardTitle className="text-xl font-bold tracking-tight">Project Intelligence</CardTitle>
                <CardDescription className="text-xs">
                  Classification of repositories and analysis of codebases.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Donut chart */}
                <div className="space-y-2">
                  <span className="font-mono text-[9px] tracking-widest font-black text-neutral-400 dark:text-neutral-500 uppercase">Repository Category Distribution</span>
                  <CategoriesChart data={projects.categories} />
                </div>

                {/* Best Projects Highlights */}
                <div className="space-y-3 pt-5 border-t border-border/40">
                  <span className="font-mono text-[9px] tracking-widest font-black text-neutral-400 dark:text-neutral-500 uppercase block">Repository Intel Highlights</span>
                  <div className="space-y-2.5">
                    {[
                      { type: "Best Project", data: projects.bestProject, info: `${projects.bestProject.stars} stars • ${projects.bestProject.language}`, badgeColor: "text-amber-500 bg-amber-500/5 border-amber-500/10" },
                      { type: "Most Maintained", data: projects.mostMaintained, info: `${projects.mostMaintained.commitCount} commits • ${projects.mostMaintained.ageMonths}m active`, badgeColor: "text-indigo-500 bg-indigo-500/5 border-indigo-500/10" },
                      { type: "Fastest Growing", data: projects.fastestGrowing, info: `+${projects.fastestGrowing.recentCommits} commits • ${projects.fastestGrowing.growthRatePercent}% growth`, badgeColor: "text-pink-500 bg-pink-500/5 border-pink-500/10" }
                    ].map((h, i) => (
                      <div key={i} className="flex items-start justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-100/10 dark:bg-white/[0.005] hover:border-indigo-500/30 dark:hover:border-primary/30 transition-all duration-300 text-xs">
                        <div className="space-y-1">
                          <span className={`font-mono text-[8px] tracking-wider font-black uppercase px-2 py-0.5 rounded border ${h.badgeColor}`}>{h.type}</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 block pt-1.5">{h.data.name}</span>
                          <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-xs sm:max-w-sm font-sans pt-0.5">{h.data.description}</span>
                        </div>
                        <div className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap pt-8 text-right font-semibold">
                          {h.info}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Section 7: AI Story Generator */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-pink-500/15 shadow-[0_0_40px_rgba(139,92,246,0.1)]">
            <Card className="border-0 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xl rounded-2xl overflow-hidden relative">
              <div className="absolute right-6 top-6 text-indigo-500/10 dark:text-primary/10 pointer-events-none">
                <Sparkles className="h-32 w-32 animate-pulse-glow" />
              </div>
              <CardHeader className="border-b border-border/40 p-6 md:p-8 bg-neutral-50/30 dark:bg-white/[0.005]">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-primary/10">
                    <Sparkles className="h-4 w-4 text-indigo-600 dark:text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold tracking-tight">AI Developer Narrative</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  A custom synthesized story analyzing achievements, commit cycles, and code metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-sm md:text-[15px] font-sans leading-relaxed space-y-4 md:space-y-5">
                  {storyText.split("\n\n").map((para, i) => (
                    <p key={i} className="text-neutral-700 dark:text-neutral-300">{para}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Section 5: Growth Timeline & Section 8: Developer Archetype */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Growth Timeline */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full glass-card border border-neutral-200 dark:border-white/5">
              <CardHeader className="bg-neutral-50/20 dark:bg-white/[0.01] border-b border-border/40 pb-4">
                <CardTitle className="text-xl font-bold tracking-tight">Growth Timeline</CardTitle>
                <CardDescription className="text-xs">
                  Historical progression path structured from repository releases and milestones.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 relative pl-10">
                {/* Vertical timeline line */}
                <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-indigo-500/10 dark:bg-primary/15" />

                <motion.div 
                  className="space-y-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {timeline.map((item, idx) => (
                    <motion.div key={idx} className="relative group" variants={itemVariants}>
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-1.5 -translate-x-1/2 w-4.5 h-4.5 rounded-full border-4 border-background dark:border-neutral-900 bg-indigo-600 dark:bg-primary group-hover:scale-120 group-hover:shadow-[0_0_10px_rgba(139,92,246,0.6)] transition-all duration-300" />
                      
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-widest font-black text-neutral-500 dark:text-neutral-400 uppercase">{item.date}</span>
                        <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2.5">
                          <span>{item.title}</span>
                          <span className={`text-[8px] px-2 py-0.2 rounded font-mono border font-black ${
                            item.type === "milestone" 
                              ? "bg-indigo-500/5 border-indigo-500/10 text-indigo-500"
                              : "bg-cyan-500/5 border-cyan-500/10 text-cyan-500"
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed pt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Developer Archetype Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full glass-card border border-neutral-200 dark:border-white/5 flex flex-col justify-between overflow-hidden relative">
              <div>
                <CardHeader className="bg-neutral-50/20 dark:bg-white/[0.01] border-b border-border/40 pb-4">
                  <span className="font-mono text-[8px] tracking-widest font-black text-neutral-500 dark:text-neutral-400 uppercase block">Activity Profile</span>
                  <CardTitle className="text-xl font-bold tracking-tight">Coding Activity Profile</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Archetype Badge Illustration */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-neutral-50/50 dark:bg-white/[0.01] border border-neutral-200/50 dark:border-white/5 space-y-3.5 mt-2">
                    <div className="h-16 w-16 rounded-full border border-indigo-500/20 dark:border-primary/20 flex items-center justify-center bg-indigo-500/5 dark:bg-primary/10 text-indigo-600 dark:text-primary shadow-[0_0_15px_rgba(139,92,246,0.15)] animate-pulse-glow">
                      <Code2 className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold tracking-tight text-base text-neutral-800 dark:text-neutral-100">{archetype.name}</h4>
                      <span className="text-[9px] font-mono font-black text-indigo-500 dark:text-primary uppercase tracking-widest block mt-1">{archetype.label}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed text-center px-1">
                    {archetype.description}
                  </p>
                </CardContent>
              </div>

              <div className="p-5 border-t border-border/40 bg-neutral-50/30 dark:bg-white/[0.002] font-mono text-[9px] tracking-wider font-bold text-neutral-400 dark:text-neutral-500 select-none">
                <div className="flex justify-between items-center">
                  <span>METRIC ALIGNMENT</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-mono">TIER LEVEL {level} / 5</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Section 6: Achievements Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border border-neutral-200 dark:border-white/5">
            <CardHeader className="bg-neutral-50/20 dark:bg-white/[0.01] border-b border-border/40 pb-4">
              <CardTitle className="text-xl font-bold tracking-tight">Developer Milestones & Badges</CardTitle>
              <CardDescription className="text-xs">
                Unlockable badge cards determined by commits volume, pull requests, streaks, and repo count.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 select-none"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {achievements.map((badge) => (
                  <motion.div
                    key={badge.id}
                    variants={itemVariants}
                    className={`flex flex-col items-center justify-between p-4 rounded-xl border text-center transition-all duration-300 ${
                      badge.unlocked
                        ? "bg-card border-neutral-300 dark:border-white/10 text-foreground shadow-sm hover:border-indigo-500/30 dark:hover:border-primary/30"
                        : "bg-neutral-50/50 dark:bg-neutral-950/20 border-neutral-200/50 dark:border-white/5 opacity-30 select-none"
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-350 ${
                      badge.unlocked
                        ? "border-indigo-500/20 dark:border-primary/20 bg-indigo-500/5 dark:bg-primary/10 text-indigo-600 dark:text-primary shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                        : "border-neutral-200/50 dark:border-white/5 bg-background text-neutral-400"
                    }`}>
                      {getAchievementIcon(badge.icon)}
                    </div>
                    <div className="mt-3.5 space-y-1">
                      <h4 className="text-xs font-bold tracking-tight text-neutral-800 dark:text-neutral-200">{badge.title}</h4>
                      <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-sans leading-snug line-clamp-2 px-0.5">{badge.description}</p>
                    </div>
                    <div className="mt-3.5 font-mono text-[8px] tracking-wider font-bold text-neutral-400 dark:text-neutral-500 uppercase">
                      {badge.unlocked ? badge.date : "LOCKED"}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 9: Shareable Report */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="Print:hidden"
        >
          <Card className="border border-dashed border-indigo-500/30 dark:border-primary/30 bg-indigo-500/[0.01] dark:bg-primary/[0.005] rounded-2xl">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold tracking-tight">Share Your Developer Activity Story</h3>
                <p className="text-xs text-muted-foreground">
                  Export your compiled stats dashboard or invite others to inspect your developer Wrapped story.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto select-none">
                <Button variant="outline" size="sm" onClick={handleCopyLink} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-mono tracking-wider font-bold rounded-lg py-4">
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-bounce" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-neutral-400" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrintPdf} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-mono tracking-wider font-bold rounded-lg py-4">
                  <Download className="h-4 w-4 text-neutral-400" />
                  <span>EXPORT PDF</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const shareUrl = encodeURIComponent(window.location.href);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank");
                  }}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-mono tracking-wider font-bold bg-[#0a66c2] hover:bg-[#004182] text-white shadow-md rounded-lg py-4 cursor-pointer"
                >
                  <Linkedin className="h-4 w-4 fill-current" />
                  <span>LINKEDIN</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </main>
    </div>
  );
}
