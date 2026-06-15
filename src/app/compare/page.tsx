"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GitCompare, Star, GitCommit, Flame, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface ComparisonData {
  userA: {
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    level: number;
    archetype: string;
    totalContributions: number;
    starsEarned: number;
    longestStreak: number;
    publicRepos: number;
    favoriteLanguage: string;
  };
  userB: {
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    level: number;
    archetype: string;
    totalContributions: number;
    starsEarned: number;
    longestStreak: number;
    publicRepos: number;
    favoriteLanguage: string;
  };
  comparison: {
    contributionsDiff: number;
    starsDiff: number;
    streakDiff: number;
    reposDiff: number;
    levelDiff: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15
    }
  }
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 14
    }
  }
};

export default function ComparePage() {
  const [userAInput, setUserAInput] = useState("");
  const [userBInput, setUserBInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ComparisonData | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAInput.trim() || !userBInput.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setData(null);

      const res = await fetch(`/api/compare?userA=${userAInput.trim()}&userB=${userBInput.trim()}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to compare developers");
      }

      const compData = await res.json();
      setData(compData);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || "Failed to load profiles comparison");
    } finally {
      setLoading(false);
    }
  };

  const getDiffSpan = (diff: number) => {
    if (diff > 0) return <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-mono">+{diff}</span>;
    if (diff < 0) return <span className="text-[10px] text-neutral-400 dark:text-neutral-600 px-2 py-0.5 rounded font-mono">{diff}</span>;
    return <span className="text-[10px] text-neutral-400 font-bold bg-neutral-100 dark:bg-white/5 px-2 py-0.5 rounded font-mono">EVEN</span>;
  };

  const getLevelLabel = (lvl: number) => {
    const labels = ["Explorer", "Builder", "Creator", "Architect", "Veteran"];
    return labels[Math.min(4, Math.max(0, lvl - 1))];
  };

  // Tier color mapper for avatars
  const getLevelColorClass = (lvl: number) => {
    switch (lvl) {
      case 5: return "from-yellow-400 via-amber-500 to-red-500";
      case 4: return "from-purple-500 via-fuchsia-500 to-pink-500";
      case 3: return "from-cyan-400 via-blue-500 to-indigo-500";
      case 2: return "from-emerald-400 to-teal-500";
      default: return "from-indigo-400 to-violet-500";
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

  return (
    <div className="min-h-full flex flex-col mesh-bg text-foreground bg-grid-pattern transition-colors duration-300 relative overflow-hidden">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-12 relative z-10">
        {/* Form Header */}
        <motion.div 
          className="text-center max-w-xl mx-auto space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center justify-center p-3 rounded-full border border-indigo-500/10 dark:border-primary/20 bg-indigo-500/5 dark:bg-primary/10 select-none shadow-[0_0_15px_rgba(139,92,246,0.15)]"
            variants={itemVariants}
          >
            <GitCompare className="h-5 w-5 text-indigo-600 dark:text-primary animate-pulse-glow" />
          </motion.div>
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-none"
            variants={itemVariants}
          >
            Compare Developers
          </motion.h1>
          <motion.p 
            className="text-sm text-neutral-500 font-sans leading-relaxed"
            variants={itemVariants}
          >
            Match two GitHub profiles side-by-side to compare codebase volumes, streaks, and architectural levels.
          </motion.p>

          <motion.form 
            onSubmit={handleCompare} 
            className="flex flex-col sm:flex-row gap-3.5 pt-4 select-none"
            variants={itemVariants}
          >
            <Input
              type="text"
              placeholder="Username A (e.g. yathartha)"
              value={userAInput}
              onChange={(e) => setUserAInput(e.target.value)}
              disabled={loading}
              className="text-neutral-800 dark:text-neutral-200 bg-white/40 dark:bg-black/20 border-neutral-200 dark:border-white/5 backdrop-blur-md rounded-lg h-11 focus:border-indigo-500/50"
            />
            <div className="flex items-center justify-center font-mono text-[10px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest px-1 shrink-0">VS</div>
            <Input
              type="text"
              placeholder="Username B (e.g. torvalds)"
              value={userBInput}
              onChange={(e) => setUserBInput(e.target.value)}
              disabled={loading}
              className="text-neutral-800 dark:text-neutral-200 bg-white/40 dark:bg-black/20 border-neutral-200 dark:border-white/5 backdrop-blur-md rounded-lg h-11 focus:border-indigo-500/50"
            />
            <Button type="submit" disabled={loading || !userAInput.trim() || !userBInput.trim()} className="h-11 px-6 rounded-lg font-mono text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-650 hover:opacity-95 text-white shadow-lg cursor-pointer shrink-0">
              {loading ? "Matching..." : "COMPARE"}
            </Button>
          </motion.form>
          
          {error && <p className="text-xs text-red-500 font-mono mt-2 font-bold">{error}</p>}
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Skeleton className="h-[480px] rounded-2xl" />
            <Skeleton className="h-[480px] rounded-2xl" />
          </div>
        )}

        {/* Comparison Displays */}
        {data && !loading && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto relative"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Holographic VS badge in center */}
            <motion.div 
              className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-[10px] font-black font-mono text-white shadow-2xl tracking-widest select-none"
              variants={itemVariants}
            >
              VS
            </motion.div>

            {/* Developer A Card */}
            <motion.div variants={cardVariants} className="h-full">
              <Card className="glass-card border border-neutral-200 dark:border-white/5 overflow-hidden group h-full">
              <CardHeader className="p-6 border-b border-border/40 bg-neutral-50/20 dark:bg-white/[0.005] flex flex-col items-center text-center">
                <div className="relative select-none">
                  <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${getLevelColorClass(data.userA.level)} opacity-60 blur-[1px]`} />
                  <img src={data.userA.avatarUrl} alt={data.userA.name} className="h-16 w-16 rounded-full border-2 border-background object-cover bg-neutral-900 relative z-10 shadow-lg" />
                </div>
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mt-4 leading-tight">{data.userA.name}</h3>
                <span className="text-xs font-mono text-indigo-500 dark:text-primary mt-1 font-bold">@{data.userA.username}</span>
                <span className={`mt-3 px-2.5 py-0.5 rounded font-mono text-[9px] font-semibold tracking-wider border ${getLevelBadgeText(data.userA.level)}`}>
                  {getLevelLabel(data.userA.level).toUpperCase()} TIER (LVL {data.userA.level})
                </span>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  {[
                    { label: "Total Contributions", val: data.userA.totalContributions, diff: data.comparison.contributionsDiff, icon: GitCommit, isWinner: data.comparison.contributionsDiff > 0 },
                    { label: "Stars Earned", val: data.userA.starsEarned, diff: data.comparison.starsDiff, icon: Star, isWinner: data.comparison.starsDiff > 0 },
                    { label: "Longest Streak", val: data.userA.longestStreak, diff: data.comparison.streakDiff, icon: Flame, isWinner: data.comparison.streakDiff > 0 },
                    { label: "Public Repositories", val: data.userA.publicRepos, diff: data.comparison.reposDiff, icon: BookOpen, isWinner: data.comparison.reposDiff > 0 },
                  ].map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                      <div key={i} className={`flex items-center justify-between text-xs py-2.5 border-b border-border/40 last:border-0 font-mono transition-all ${metric.isWinner ? "text-indigo-650 dark:text-primary-foreground" : ""}`}>
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`h-4 w-4 ${metric.isWinner ? "text-indigo-500 dark:text-primary animate-pulse" : "text-neutral-400"}`} />
                          <span className="text-neutral-600 dark:text-neutral-400 font-sans font-medium">{metric.label}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-right">
                          <span className={`font-bold ${metric.isWinner ? "text-neutral-900 dark:text-white" : "text-neutral-800 dark:text-neutral-200"}`}><AnimatedCounter value={metric.val} /></span>
                          {getDiffSpan(metric.diff)}
                          {metric.isWinner && <Trophy className="h-3.5 w-3.5 text-yellow-500 shrink-0 fill-current ml-1" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-neutral-100/50 dark:bg-white/[0.008] border border-neutral-200/50 dark:border-white/5 text-xs space-y-3.5 select-none">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400 font-mono font-bold tracking-wider text-[9px]">FAVORITE LANGUAGE:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-indigo-500/10 bg-indigo-500/5 text-indigo-600 dark:text-primary">{data.userA.favoriteLanguage}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/40 pt-3">
                    <span className="text-neutral-600 dark:text-neutral-400 font-mono font-bold tracking-wider text-[9px]">ACTIVITY PROFILE:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-right max-w-[170px] leading-tight">{data.userA.archetype}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Developer B Card */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="glass-card border border-neutral-200 dark:border-white/5 overflow-hidden group h-full">
              <CardHeader className="p-6 border-b border-border/40 bg-neutral-50/20 dark:bg-white/[0.005] flex flex-col items-center text-center">
                <div className="relative select-none">
                  <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${getLevelColorClass(data.userB.level)} opacity-60 blur-[1px]`} />
                  <img src={data.userB.avatarUrl} alt={data.userB.name} className="h-16 w-16 rounded-full border-2 border-background object-cover bg-neutral-900 relative z-10 shadow-lg" />
                </div>
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mt-4 leading-tight">{data.userB.name}</h3>
                <span className="text-xs font-mono text-indigo-500 dark:text-primary mt-1 font-bold">@{data.userB.username}</span>
                <span className={`mt-3 px-2.5 py-0.5 rounded font-mono text-[9px] font-semibold tracking-wider border ${getLevelBadgeText(data.userB.level)}`}>
                  {getLevelLabel(data.userB.level).toUpperCase()} TIER (LVL {data.userB.level})
                </span>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  {[
                    { label: "Total Contributions", val: data.userB.totalContributions, diff: -data.comparison.contributionsDiff, icon: GitCommit, isWinner: data.comparison.contributionsDiff < 0 },
                    { label: "Stars Earned", val: data.userB.starsEarned, diff: -data.comparison.starsDiff, icon: Star, isWinner: data.comparison.starsDiff < 0 },
                    { label: "Longest Streak", val: data.userB.longestStreak, diff: -data.comparison.streakDiff, icon: Flame, isWinner: data.comparison.streakDiff < 0 },
                    { label: "Public Repositories", val: data.userB.publicRepos, diff: -data.comparison.reposDiff, icon: BookOpen, isWinner: data.comparison.reposDiff < 0 },
                  ].map((metric, i) => {
                    const Icon = metric.icon;
                    return (
                      <div key={i} className={`flex items-center justify-between text-xs py-2.5 border-b border-border/40 last:border-0 font-mono transition-all ${metric.isWinner ? "text-indigo-650 dark:text-primary-foreground" : ""}`}>
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`h-4 w-4 ${metric.isWinner ? "text-indigo-500 dark:text-primary animate-pulse" : "text-neutral-400"}`} />
                          <span className="text-neutral-600 dark:text-neutral-400 font-sans font-medium">{metric.label}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-right">
                          <span className={`font-bold ${metric.isWinner ? "text-neutral-900 dark:text-white" : "text-neutral-800 dark:text-neutral-200"}`}><AnimatedCounter value={metric.val} /></span>
                          {getDiffSpan(metric.diff)}
                          {metric.isWinner && <Trophy className="h-3.5 w-3.5 text-yellow-500 shrink-0 fill-current ml-1" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-neutral-100/50 dark:bg-white/[0.008] border border-neutral-200/50 dark:border-white/5 text-xs space-y-3.5 select-none">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600 dark:text-neutral-400 font-mono font-bold tracking-wider text-[9px]">FAVORITE LANGUAGE:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded border border-indigo-500/10 bg-indigo-500/5 text-indigo-600 dark:text-primary">{data.userB.favoriteLanguage}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/40 pt-3">
                    <span className="text-neutral-600 dark:text-neutral-400 font-mono font-bold tracking-wider text-[9px]">ACTIVITY PROFILE:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-right max-w-[170px] leading-tight">{data.userB.archetype}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      </main>
    </div>
  );
}
