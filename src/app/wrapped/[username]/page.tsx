"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DeveloperStats } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Terminal, Flame, Code2, Award, ArrowLeft, ArrowRight, X } from "lucide-react";

export default function WrappedPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [data, setData] = useState<DeveloperStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!username) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/story?username=${username}`);
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  const slides = data ? [
    {
      type: "intro",
      icon: Terminal,
      label: "YEAR WRAPPED",
      title: `@${data.user.username}'s Story`,
      subtitle: "Let's take a look at your software footprint over the past year.",
      details: `${data.contributions.total} total contributions compiled. Your code represents a unique story of consistency and building.`,
      bgGradient: "from-indigo-600 via-violet-600 to-purple-800",
      accentGlow: "bg-indigo-500/20"
    },
    {
      type: "project",
      icon: Code2,
      label: "FLAGSHIP CODEBASE",
      title: data.projects.bestProject.name,
      subtitle: "Your strongest project release by stargazers and commit volumes.",
      details: `${data.projects.bestProject.description || "A public repository."} Developed in ${data.projects.bestProject.language} with a calculated activity score of ${data.projects.bestProject.activityScore}%.`,
      bgGradient: "from-cyan-600 via-teal-600 to-emerald-800",
      accentGlow: "bg-cyan-500/20"
    },
    {
      type: "habits",
      icon: Terminal,
      label: "CODING RHYTHM",
      title: data.wrapped.mostActiveMonth,
      subtitle: "Your most active contribution month of the year.",
      details: `${data.habits.dayAnalysis.insights}`,
      bgGradient: "from-amber-500 via-orange-650 to-pink-700",
      accentGlow: "bg-orange-500/20"
    },
    {
      type: "streak",
      icon: Flame,
      label: "UNSTOPPABLE FREQUENCY",
      title: `${data.wrapped.longestStreak} Days`,
      subtitle: "Your longest consecutive daily contribution streak.",
      details: `With a calculated developer consistency score of ${data.contributions.consistencyScore}% (${data.contributions.consistencyLabel}). You've shown exceptional tenacity.`,
      bgGradient: "from-pink-600 via-fuchsia-600 to-rose-800",
      accentGlow: "bg-rose-500/20"
    },
    {
      type: "archetype",
      icon: Award,
      label: "CHARACTER PROFILE",
      title: data.archetype.name,
      subtitle: `Calculated Archetype: ${data.archetype.label}`,
      details: data.archetype.description,
      bgGradient: "from-purple-600 via-indigo-600 to-blue-800",
      accentGlow: "bg-yellow-500/10"
    }
  ] : [];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-full flex flex-col bg-background text-foreground bg-grid-pattern items-center justify-center">
        <div className="max-w-md w-full p-6 space-y-6">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || slides.length === 0) {
    return (
      <div className="min-h-full flex flex-col bg-background text-foreground items-center justify-center p-6 text-center">
        <p className="text-sm text-neutral-500 mb-4 font-mono">Could not compile Wrapped slides.</p>
        <Button onClick={() => router.push(`/story/${username}`)} className="rounded-lg">Return to Dashboard</Button>
      </div>
    );
  }

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-full flex flex-col bg-neutral-950 text-white transition-all duration-500 relative select-none overflow-hidden h-screen">
      
      {/* Slideshow Top Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex gap-1.5 w-full max-w-xs pr-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentSlide ? "bg-white" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => router.push(`/story/${username}`)}
          className="text-white/60 hover:text-white hover:scale-110 transition-all cursor-pointer p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Cinematic animated mesh backgrounds matching active slide */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[160px] opacity-40 transition-all duration-1000 animate-float-slow ${slide.accentGlow}`} />
        <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] opacity-30 transition-all duration-1000 animate-float-medium ${slide.accentGlow}`} />
      </div>

      {/* Main slide presentation container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04, y: -15 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="max-w-2xl w-full text-center space-y-10"
          >
            {/* Animated Icon Ring */}
            <div className="flex justify-center select-none">
              <div className="relative p-[1px] rounded-full bg-gradient-to-r from-white/20 via-white/10 to-transparent">
                <div className="h-16 w-16 rounded-full border border-white/15 flex items-center justify-center bg-black/40 backdrop-blur-xl text-white shadow-xl">
                  <Icon className="h-6 w-6 text-white animate-pulse-glow" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-xs tracking-[0.25em] text-white/50 uppercase font-black">
                {slide.label}
              </span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white font-mono leading-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent px-4">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base text-white/60 font-sans max-w-md mx-auto leading-relaxed px-4">
                {slide.subtitle}
              </p>
            </div>

            {/* Glassmorphic Slide Detail Card */}
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-transparent max-w-lg mx-auto shadow-2xl">
              <div className="p-6 md:p-8 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/5">
                <p className="text-xs md:text-sm font-sans leading-relaxed text-white/80 font-medium">
                  {slide.details}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Controls Bar */}
      <div className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full border-t border-white/5 bg-black/40 backdrop-blur-lg z-40 select-none">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 font-mono text-xs font-bold border-white/10 hover:border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-lg py-4 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK</span>
        </Button>
        <span className="font-mono text-xs text-white/40 font-bold">
          {currentSlide + 1} / {slides.length}
        </span>
        {currentSlide === slides.length - 1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/story/${username}`)}
            className="flex items-center gap-1.5 font-mono text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-650 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:opacity-95 border-0 rounded-lg py-4 cursor-pointer"
          >
            <span>DASHBOARD</span>
            <Sparkles className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="flex items-center gap-1.5 font-mono text-xs font-bold border-white/10 hover:border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-lg py-4 transition-all cursor-pointer"
          >
            <span>NEXT</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
