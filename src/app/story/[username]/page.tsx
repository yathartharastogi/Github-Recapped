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
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  Share2,
  X
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

const getLevelLabel = (lvl: number) => {
  const labels = ["Explorer", "Builder", "Creator", "Architect", "Veteran"];
  return labels[Math.min(4, Math.max(0, lvl - 1))];
};

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

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [data, setData] = useState<DeveloperStats & { storyText: string; cached: boolean; createdAt: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareImgUrl, setShareImgUrl] = useState<string>("");
  const [generatingCard, setGeneratingCard] = useState(false);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  };

  const generateShareCard = async () => {
    if (!data) return;
    setGeneratingCard(true);
    setShareImgUrl("");
    
    try {
      const { user, contributions, habits, archetype, level } = data;
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get 2D context");

      // Load avatar with CORS
      const avatarImg = new Image();
      avatarImg.crossOrigin = "anonymous";
      
      const loadImage = (img: HTMLImageElement, src: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });
      };
      
      const loadedImg = await loadImage(avatarImg, user.avatarUrl);
      
      // 1. Draw Background
      ctx.fillStyle = "#0B0F19";
      ctx.fillRect(0, 0, 1200, 630);

      // 2. Draw Cyber Grid
      ctx.strokeStyle = "rgba(99, 102, 241, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < 1200; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 630);
        ctx.stroke();
      }
      for (let y = 0; y < 630; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1200, y);
        ctx.stroke();
      }

      // 3. Draw Background Radial Glows
      let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 600);
      grad.addColorStop(0, "rgba(99, 102, 241, 0.15)");
      grad.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 600, 0, Math.PI * 2);
      ctx.fill();

      grad = ctx.createRadialGradient(1200, 630, 0, 1200, 630, 600);
      grad.addColorStop(0, "rgba(236, 72, 153, 0.12)");
      grad.addColorStop(1, "rgba(236, 72, 153, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(1200, 630, 600, 0, Math.PI * 2);
      ctx.fill();

      // 4. Draw Inner Rounded Border
      const borderGrad = ctx.createLinearGradient(24, 24, 1176, 606);
      borderGrad.addColorStop(0, "rgba(99, 102, 241, 0.3)");
      borderGrad.addColorStop(0.5, "rgba(236, 72, 153, 0.1)");
      borderGrad.addColorStop(1, "rgba(6, 182, 212, 0.2)");
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(24, 24, 1152, 582, 24);
      ctx.stroke();

      // 5. Tier Setup
      let tierColor = "#6366f1"; // default Explorer
      let tierGlowColor = "rgba(99, 102, 241, 0.4)";
      switch (level) {
        case 5:
          tierColor = "#f59e0b"; // Veteran (Gold/Amber)
          tierGlowColor = "rgba(245, 158, 11, 0.4)";
          break;
        case 4:
          tierColor = "#d946ef"; // Architect (Fuchsia)
          tierGlowColor = "rgba(217, 70, 239, 0.4)";
          break;
        case 3:
          tierColor = "#06b6d4"; // Creator (Cyan)
          tierGlowColor = "rgba(6, 182, 212, 0.4)";
          break;
        case 2:
          tierColor = "#10b981"; // Builder (Emerald)
          tierGlowColor = "rgba(16, 185, 129, 0.4)";
          break;
      }

      // Radial glow behind avatar
      const avatarGlow = ctx.createRadialGradient(180, 160, 0, 180, 160, 120);
      avatarGlow.addColorStop(0, tierGlowColor.replace("0.4", "0.15"));
      avatarGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = avatarGlow;
      ctx.beginPath();
      ctx.arc(180, 160, 120, 0, Math.PI * 2);
      ctx.fill();

      // Draw Avatar glowing outer ring
      ctx.save();
      ctx.shadowColor = tierColor;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = tierColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(180, 160, 78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw Avatar inner border line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(180, 160, 73, 0, Math.PI * 2);
      ctx.stroke();

      // Draw avatar image with clip path or fallback
      if (loadedImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(180, 160, 70, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(loadedImg, 110, 90, 140, 140);
        ctx.restore();
      } else {
        // Fallback initials gradient
        ctx.save();
        const avGrad = ctx.createLinearGradient(110, 90, 250, 230);
        avGrad.addColorStop(0, "#4f46e5");
        avGrad.addColorStop(1, "#06b6d4");
        ctx.fillStyle = avGrad;
        ctx.beginPath();
        ctx.arc(180, 160, 70, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 48px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const initials = user.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : user.username.slice(0, 2).toUpperCase();
        ctx.fillText(initials, 180, 160);
        ctx.restore();
      }

      // 6. Profile Metadata Layout
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px Inter, system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(user.name, 60, 290);

      ctx.fillStyle = "#A78BFA";
      ctx.font = "600 20px 'JetBrains Mono', monospace";
      ctx.fillText("@" + user.username, 60, 325);

      // Level / Tier Pill
      const pillX = 60;
      const pillY = 345;
      const pillText = `LEVEL ${level} • ${getLevelLabel(level).toUpperCase()} TIER`;
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      const textWidth = ctx.measureText(pillText).width;
      const pillW = textWidth + 28;
      const pillH = 32;
      
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 6);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fill();
      ctx.strokeStyle = tierColor + "55"; // 33% opacity
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = tierColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(pillText, pillX + 14, pillY + pillH / 2);

      // Bio Text (text-wrapped)
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "15px Inter, system-ui, sans-serif";
      ctx.textBaseline = "top";
      const bioText = user.bio || "No biography provided. Developer wrapped story generator.";
      wrapText(ctx, bioText, 60, 400, 420, 22);

      // Followers, Repos, Years Stats
      ctx.fillStyle = "#6B7280";
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(`Followers: ${user.followers}  •  Repos: ${user.publicRepos}  •  Age: ${user.accountAgeYears}y`, 60, 520);

      // 7. Right Column 2x2 Panels
      const boxes = [
        { label: "TOTAL CONTRIBUTIONS", val: contributions.total.toLocaleString(), color: "#8B5CF6" },
        { label: "STARS EARNED", val: contributions.starsEarned.toLocaleString(), color: "#F59E0B" },
        { label: "ACTIVE REPOSITORIES", val: contributions.activeReposCount.toString(), color: "#06B6D4" },
        { label: "LONGEST STREAK", val: `${habits.streaks.longest} Days`, color: "#EC4899" }
      ];

      const boxW = 265;
      const boxH = 110;
      const col1X = 540;
      const col2X = 825;
      const row1Y = 80;
      const row2Y = 210;

      const coords = [
        { x: col1X, y: row1Y },
        { x: col2X, y: row1Y },
        { x: col1X, y: row2Y },
        { x: col2X, y: row2Y }
      ];

      boxes.forEach((box, idx) => {
        const { x, y } = coords[idx];
        // Draw box background
        ctx.beginPath();
        ctx.roundRect(x, y, boxW, boxH, 12);
        ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
        ctx.fill();
        
        // Premium Linear Gradient Border matching specific indicator color
        const boxGrad = ctx.createLinearGradient(x, y, x + boxW, y + boxH);
        boxGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
        boxGrad.addColorStop(1, box.color + "33"); // 20% opacity matching dot color
        ctx.strokeStyle = boxGrad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glowing dot
        ctx.fillStyle = box.color;
        ctx.beginPath();
        ctx.arc(x + boxW - 20, y + 22, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = "#9CA3AF";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(box.label, x + 20, y + 20);

        // Value
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 36px Inter, system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(box.val, x + 20, y + 84);
      });

      // 8. Archetype Banner
      const abX = 540;
      const abY = 340;
      const abW = 550;
      const abH = 160;

      ctx.beginPath();
      ctx.roundRect(abX, abY, abW, abH, 16);
      ctx.fillStyle = "rgba(99, 102, 241, 0.03)";
      ctx.fill();
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.stroke();

      // Left glowing accent bar
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(abX + 2, abY + 16);
      ctx.lineTo(abX + 2, abY + abH - 16);
      ctx.stroke();
      ctx.lineWidth = 1; // reset

      // Archetype Badge title
      ctx.fillStyle = "#A78BFA";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.textBaseline = "top";
      ctx.fillText("ACTIVITY ARCHETYPE", abX + 24, abY + 22);

      // Archetype Name
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px Inter, system-ui, sans-serif";
      ctx.fillText(archetype.name, abX + 24, abY + 44);

      // Archetype Label Badge
      const nameW = ctx.measureText(archetype.name).width;
      const badgeX = abX + 24 + nameW + 15;
      const badgeY = abY + 47;
      const badgeW = 90;
      const badgeH = 18;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
      ctx.fillStyle = "rgba(139, 92, 246, 0.2)";
      ctx.fill();
      
      ctx.fillStyle = "#C084FC";
      ctx.font = "bold 8px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(archetype.label.toUpperCase(), badgeX + badgeW / 2, badgeY + badgeH / 2);
      ctx.textAlign = "left"; // reset

      // Archetype Description
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "13px Inter, system-ui, sans-serif";
      ctx.textBaseline = "top";
      wrapText(ctx, archetype.description, abX + 24, abY + 84, 500, 18);

      // 9. Watermark Footer
      // Logo shape
      const logoX = 60;
      const logoY = 575;
      ctx.save();
      // Concentric circles
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(logoX, logoY, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(logoX, logoY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText("GitHub Recapped", logoX + 18, logoY - 8);

      ctx.fillStyle = "#4B5563";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("github-recapped.vercel.app", logoX + 18, logoY + 8);

      // Right stamp
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText("Created by @yathartharastogi", 1090, logoY - 8);

      ctx.fillStyle = "#4B5563";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("2026 Developer Wrapped", 1090, logoY + 8);

      const url = canvas.toDataURL("image/png");
      setShareImgUrl(url);
    } catch (e) {
      console.error("Failed to generate share card", e);
    } finally {
      setGeneratingCard(false);
    }
  };


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

    const interval = setInterval(function() {
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
            <Button variant="outline" size="sm" onClick={() => { setIsShareModalOpen(true); generateShareCard(); }} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 font-mono text-[10px] tracking-wider font-bold border-neutral-200 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-primary/30 transition-all duration-300 rounded-lg py-4">
              <Share2 className="h-3.5 w-3.5 text-neutral-400 dark:text-primary" />
              <span>SHARE CARD</span>
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

      {/* Share Modal overlay */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/75 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl p-6 relative z-10 shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden"
            >
              {/* Background glowing blob */}
              <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-pink-500/10 blur-[80px] pointer-events-none" />

              <div className="flex justify-between items-center pb-4 border-b border-white/5 select-none relative z-10">
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-indigo-400" />
                    <span>Developer Wrapped Share Card</span>
                  </h2>
                  <p className="text-xs text-neutral-400">Preview and download your personalized high-resolution story card.</p>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-white/[0.02] text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="py-6 flex flex-col items-center justify-center min-h-[300px] relative z-10">
                {generatingCard || !shareImgUrl ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-xs text-neutral-400 font-mono">COMPILED SCORECARD GRAPHICS...</p>
                  </div>
                ) : (
                  <div className="w-full relative group rounded-xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shareImgUrl}
                      alt="Developer Share Card"
                      className="w-full h-auto object-contain select-none"
                    />
                    <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none select-none">
                      <span className="px-3 py-1.5 rounded-lg bg-neutral-900/90 text-xs font-medium text-white border border-white/10 backdrop-blur-sm">
                        Right click or hold to copy/save image directly
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 select-none relative z-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsShareModalOpen(false)}
                  className="rounded-lg py-4 px-5 text-xs font-mono font-bold border-neutral-800 hover:border-neutral-700 text-white"
                >
                  CLOSE
                </Button>
                <Button
                  disabled={generatingCard || !shareImgUrl}
                  onClick={() => {
                    if (!shareImgUrl) return;
                    const link = document.createElement("a");
                    link.download = `${user.username}-wrapped-card.png`;
                    link.href = shareImgUrl;
                    link.click();
                  }}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-650 hover:opacity-95 text-white shadow-lg py-4 px-6 text-xs font-mono font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>DOWNLOAD PNG</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
