"use client";

import Link from "next/link";
import { useTheme } from "./theme-provider";
import { Sun, Moon, GitFork } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group hover:opacity-95 transition-opacity">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 dark:bg-primary/15 border border-indigo-500/20 dark:border-primary/20 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-300">
            <GitFork className="h-4 w-4 text-indigo-600 dark:text-primary animate-pulse-glow" />
          </div>
          <span className="font-mono text-xs tracking-widest font-bold uppercase text-neutral-800 dark:text-neutral-100 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            Activity Story
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link
            href="/compare"
            className="text-xs font-bold font-mono text-muted-foreground hover:text-foreground hover:shadow-[0_0_8px_rgba(139,92,246,0.15)] transition-all duration-200 uppercase tracking-wider"
          >
            Compare
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 px-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-border transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-neutral-600" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
