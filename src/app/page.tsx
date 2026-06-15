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
  TrendingUp
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

  // Demo profiles details
  const demoProfiles = [
    {
      name: "Yathartha Rastogi",
      username: "yathartha09",
      avatar: "https://github.com/yathartha09.png",
      level: 3,
      levelLabel: "Creator",
      contributions: "1,420",
      streak: "18 days",
      language: "TypeScript",
      archetype: "Highly Productive Builder",
      glowColor: "rgba(6, 182, 212, 0.25)",
      bgGradient: "from-cyan-500/10 to-indigo-500/10"
    },
    {
      name: "Linus Torvalds",
      username: "torvalds",
      avatar: "https://github.com/torvalds.png",
      level: 5,
      levelLabel: "Veteran",
      contributions: "5,800+",
      streak: "45 days",
      language: "C",
      archetype: "Flagship Maintainer",
      glowColor: "rgba(245, 158, 11, 0.25)",
      bgGradient: "from-yellow-500/10 to-red-500/10"
    },
    {
      name: "Evan You",
      username: "yyx990803",
      avatar: "https://github.com/yyx990803.png",
      level: 5,
      levelLabel: "Veteran",
      contributions: "4,200+",
      streak: "32 days",
      language: "JavaScript",
      archetype: "Ecosystem Architect",
      glowColor: "rgba(167, 139, 250, 0.25)",
      bgGradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      name: "Dan Abramov",
      username: "gaearon",
      avatar: "https://github.com/gaearon.png",
      level: 4,
      levelLabel: "Architect",
      contributions: "2,900+",
      streak: "22 days",
      language: "React/JS",
      archetype: "UI Specialist",
      glowColor: "rgba(236, 72, 153, 0.25)",
      bgGradient: "from-pink-500/10 to-rose-500/10"
    }
  ];

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
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none animate-float-medium" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

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
            <span className="text-neutral-400 dark:text-neutral-500">Let&apos;s Tell It.</span>
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
                className="pl-8 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-800 bg-white/40 dark:bg-black/20 backdrop-blur-md h-12 rounded-lg font-mono text-sm focus:border-indigo-500 dark:focus:border-primary/60 transition-all duration-200"
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

        {/* Demo Preview Cards (Collectible Profile Showcases) */}
        <div className="mt-28">
          <div className="text-center mb-12">
            <h2 className="font-mono text-xs tracking-[0.2em] text-neutral-600 dark:text-neutral-400 uppercase font-bold">
              Featured Developer Profiles
            </h2>
            <p className="text-xs text-neutral-500 mt-2">
              Select a card to explore their automatically compiled developer story dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {demoProfiles.map((profile, i) => {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  onClick={() => handleDemoClick(profile.username)}
                  className="cursor-pointer group relative h-[340px] flex flex-col"
                >
                  {/* Glowing background mesh reflection on hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95"
                    style={{ backgroundColor: profile.glowColor }}
                  />

                  {/* Card Main Body */}
                  <Card className="h-full relative z-10 glass-card border border-neutral-200 dark:border-white/5 overflow-hidden flex flex-col justify-between p-5 transition-all duration-300">
                    
                    {/* Top Section: User Avatar & Spinning Ring */}
                    <div className="flex flex-col items-center text-center space-y-3.5 select-none pt-2">
                      <div className="relative h-16 w-16">
                        <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr ${
                          profile.level === 5 
                            ? "from-yellow-400 to-red-500" 
                            : profile.level === 4 
                              ? "from-purple-500 to-pink-500" 
                              : "from-cyan-400 to-indigo-500"
                        } opacity-75 blur-[1.5px] animate-spin-slow group-hover:scale-110 transition-transform duration-300`} />
                        <img 
                          src={profile.avatar} 
                          alt={profile.name} 
                          className="h-16 w-16 rounded-full border border-background object-cover bg-neutral-900 relative z-10 shadow-md" 
                          onError={(e) => {
                            e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`;
                          }}
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-none group-hover:text-indigo-600 dark:group-hover:text-primary transition-colors">{profile.name}</h3>
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5 block">@{profile.username}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-mono tracking-widest font-black uppercase ${
                        profile.level === 5 
                          ? "text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-500/5" 
                          : profile.level === 4 
                            ? "text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5" 
                            : "text-cyan-600 dark:text-cyan-400 border-cyan-500/20 bg-cyan-500/5"
                      }`}>
                        LVL {profile.level} : {profile.levelLabel}
                      </span>
                    </div>

                    {/* Middle Section: Visual stats */}
                    <div className="grid grid-cols-3 gap-1 py-3.5 border-y border-neutral-200/50 dark:border-white/5 font-mono text-[9px] text-center select-none bg-neutral-100/30 dark:bg-white/[0.005] rounded-lg">
                      <div>
                        <span className="block text-neutral-400 dark:text-neutral-500 text-[8px] font-bold">COMMITS</span>
                        <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{profile.contributions}</span>
                      </div>
                      <div className="border-x border-neutral-200/50 dark:border-white/5">
                        <span className="block text-neutral-400 dark:text-neutral-500 text-[8px] font-bold">STREAK</span>
                        <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{profile.streak}</span>
                      </div>
                      <div>
                        <span className="block text-neutral-400 dark:text-neutral-500 text-[8px] font-bold">LANG</span>
                        <span className="font-extrabold text-neutral-800 dark:text-neutral-200 truncate block px-0.5">{profile.language}</span>
                      </div>
                    </div>

                    {/* Bottom Section: Archetype */}
                    <div className="pt-2 font-mono text-[8px] tracking-wider text-center select-none">
                      <span className="text-neutral-400 dark:text-neutral-500 uppercase block font-bold">Archetype</span>
                      <span className="font-black text-indigo-500 dark:text-primary uppercase group-hover:animate-pulse">{profile.archetype}</span>
                    </div>

                  </Card>
                </motion.div>
              );
            })}
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
          <div className="mt-3 sm:mt-0">
            Built for developers. Elegant premium design.
          </div>
        </div>
      </footer>
    </div>
  );
}
