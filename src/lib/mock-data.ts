// High-fidelity mock developer statistics for GitHub Activity Story

export interface DeveloperStats {
  user: {
    avatarUrl: string;
    name: string;
    username: string;
    bio: string;
    followers: number;
    following: number;
    publicRepos: number;
    accountAgeYears: number;
    createdAt: string;
  };
  contributions: {
    total: number;
    activeReposCount: number;
    starsEarned: number;
    pullRequests: number;
    issuesOpened: number;
    daily: { date: string; count: number }[]; // 365 days of data
    trends: {
      last30Days: { date: string; count: number }[];
      last90Days: { date: string; count: number }[];
      lastYear: { date: string; count: number }[];
    };
    consistencyScore: number;
    consistencyLabel: string;
  };
  habits: {
    activeHours: { hour: number; commits: number }[];
    peakHoursText: string;
    dayAnalysis: {
      weekdayCount: number;
      weekendCount: number;
      mostActiveDay: string;
      insights: string;
    };
    streaks: {
      current: number;
      longest: number;
      average: number;
    };
  };
  projects: {
    bestProject: {
      name: string;
      description: string;
      stars: number;
      activityScore: number;
      language: string;
    };
    mostMaintained: {
      name: string;
      description: string;
      ageMonths: number;
      commitCount: number;
      language: string;
    };
    fastestGrowing: {
      name: string;
      description: string;
      recentCommits: number;
      growthRatePercent: number;
      language: string;
    };
    categories: { name: string; count: number; percent: number }[];
    list: {
      name: string;
      description: string;
      stars: number;
      forks: number;
      language: string;
      category: string;
      commitsCount: number;
    }[];
  };
  timeline: {
    date: string;
    title: string;
    description: string;
    type: "milestone" | "repo" | "contribution";
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    date: string;
  }[];
  archetype: {
    name: string;
    description: string;
    label: string;
  };
  level: number;
  wrapped: {
    topProject: string;
    mostActiveMonth: string;
    longestStreak: number;
    biggestAchievement: string;
    favoriteLanguage: string;
  };
}

// Helper to generate heatmap data
export function generateHeatmapData(totalCount: number, consistency: number): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  let current = new Date(oneYearAgo);
  const totalDays = 365;
  const avgPerDay = totalCount / (totalDays * (consistency / 100));

  while (current <= today) {
    const dateStr = current.toISOString().split("T")[0];
    const isWorkingDay = current.getDay() !== 0 && current.getDay() !== 6;
    
    // Consistency dictates how likely they commit on a day
    const commitChance = isWorkingDay ? (consistency * 0.9) : (consistency * 0.4);
    let count = 0;
    
    if (Math.random() * 100 < commitChance) {
      // commit count
      count = Math.floor(Math.random() * 6) + 1;
      if (Math.random() > 0.8) count += Math.floor(Math.random() * 8); // spike days
    }

    data.push({ date: dateStr, count });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

// Generate random mock stats for fallback / dynamic profiles
export function generateDynamicStats(username: string): DeveloperStats {
  const lowercaseUser = username.toLowerCase();
  const seed = lowercaseUser.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Custom random with seed
  const random = (offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const totalRepos = Math.floor(random(1) * 60) + 12;
  const totalContributions = Math.floor(random(2) * 2200) + 250;
  const stars = Math.floor(random(3) * 600) + 15;
  const prs = Math.floor(random(4) * 180) + 10;
  const issues = Math.floor(random(5) * 90) + 5;
  const consistencyScore = Math.floor(random(6) * 40) + 50; // 50 to 90
  
  let consistencyLabel = "Occasional Contributor";
  if (consistencyScore > 85) consistencyLabel = "Exceptional Consistency";
  else if (consistencyScore > 75) consistencyLabel = "Highly Consistent";
  else if (consistencyScore > 60) consistencyLabel = "Steady Contributor";

  // Generate heatmap
  const dailyHeatmap = generateHeatmapData(totalContributions, consistencyScore);

  // Generate trend views
  const last30Days = dailyHeatmap.slice(-30);
  const last90Days = dailyHeatmap.slice(-90);
  const lastYear: { date: string; count: number }[] = [];
  
  // Group daily by 3-day intervals for cleaner line chart
  for (let i = 0; i < dailyHeatmap.length; i += 3) {
    const chunk = dailyHeatmap.slice(i, i + 3);
    const sum = chunk.reduce((acc, curr) => acc + curr.count, 0);
    lastYear.push({ date: chunk[0].date, count: sum });
  }

  // Habits - hourly commit distribution
  const peakHour = Math.floor(random(7) * 8) + 14; // Peak between 2pm and 10pm
  const activeHours = Array.from({ length: 24 }, (_, hour) => {
    let weight = 2;
    if (hour >= 9 && hour <= 18) weight = 8; // working hours
    if (hour >= 20 && hour <= 23) weight = 12; // evening/night coder weight
    if (hour >= 0 && hour <= 4) weight = 4; // night owl
    
    // Apply user peak hour spike
    const distToPeak = Math.min(Math.abs(hour - peakHour), 24 - Math.abs(hour - peakHour));
    const spike = Math.max(0, 15 - distToPeak * 4);
    
    return {
      hour,
      commits: Math.floor((weight + spike) * (totalContributions / 200) * (random(hour) * 0.5 + 0.5)),
    };
  });

  const peakHoursText = peakHour > 18 || peakHour < 2 
    ? `Most activity occurs late in the evening between 8 PM and 1 AM.`
    : `Highly productive coding session observed during standard daytime hours between 10 AM and 4 PM.`;

  // Streak Analysis
  const longestStreak = Math.floor(random(8) * 45) + 7;
  const currentStreak = Math.floor(random(9) * Math.min(longestStreak, 14));
  const avgStreak = Math.floor(longestStreak * 0.4);

  // Repository Categories
  const languages = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "C++", "HTML/CSS"];
  const favLang = languages[Math.floor(random(10) * languages.length)];
  const secondLang = languages[(languages.indexOf(favLang) + 1) % languages.length];

  // Archetype
  const archetypes = [
    { name: "The Builder", description: "You write massive amounts of code, structure complex systems, and love seeing features ship.", label: "Highly Productive Maker" },
    { name: "The Problem Solver", description: "Your focus lies in algorithm optimizations, data structures, and rapid problem execution.", label: "Analytical Optimizer" },
    { name: "The Open Source Explorer", description: "You are constantly contributing to shared codebases, opening PRs, and reviewing issues.", label: "Collaborative Contributor" },
    { name: "The Consistent Coder", description: "A steady commit habit shows disciplined daily code cycles. You show up every single day.", label: "Dedicated Professional" },
    { name: "The Product Maker", description: "You design frontend applications, build beautiful interactive elements, and value developer experience.", label: "DX Advocate" }
  ];
  const archetypeIdx = Math.floor(random(11) * archetypes.length);
  const archetype = archetypes[archetypeIdx];

  // Level System
  let level = 1;
  if (totalContributions > 1500) level = 5;
  else if (totalContributions > 1000) level = 4;
  else if (totalContributions > 500) level = 3;
  else if (totalContributions > 150) level = 2;

  // Repos list
  const catNames = ["Web Development", "Backend", "Open Source", "Competitive Programming", "Mobile", "Miscellaneous"];
  const categories = catNames.map((name, i) => {
    const baseVal = 5 + (random(i) * 30);
    return { name, count: 0, percent: baseVal };
  });
  const sumPercent = categories.reduce((a, b) => a + b.percent, 0);
  categories.forEach(c => {
    c.percent = Math.round((c.percent / sumPercent) * 100);
    c.count = Math.max(1, Math.round((c.percent / 100) * totalRepos));
  });

  const bestProjectName = `${lowercaseUser}-core`;
  const bestProjectLanguage = favLang;

  const repoList = [
    { name: bestProjectName, description: `The flagship core framework for scalable workspace execution.`, stars: stars, forks: Math.floor(stars * 0.3), language: bestProjectLanguage, category: "Web Development", commitsCount: Math.floor(totalContributions * 0.2) },
    { name: `awesome-${favLang.toLowerCase()}`, description: `A curated checklist of high-performance libraries and templates.`, stars: Math.floor(stars * 0.4), forks: Math.floor(stars * 0.08), language: favLang, category: "Open Source", commitsCount: 15 },
    { name: `hack-algorithms`, description: `Solutions for competitive programming data structures and coding challenges.`, stars: Math.floor(stars * 0.1), forks: Math.floor(stars * 0.05), language: "C++", category: "Competitive Programming", commitsCount: Math.floor(totalContributions * 0.15) },
    { name: `${lowercaseUser}-api`, description: `Express backend service executing complex authentication and DB integrations.`, stars: Math.floor(stars * 0.15), forks: Math.floor(stars * 0.03), language: secondLang, category: "Backend", commitsCount: Math.floor(totalContributions * 0.25) },
  ];

  // Fill in achievements
  const achievements = [
    { id: "first_commit", title: "Genesis Commit", description: "Successfully pushed the first commit to register the developer footprint.", icon: "git-commit", unlocked: true, date: "Jan 12, 2023" },
    { id: "first_pr", title: "Open Source Gateway", description: "Created first pull request to a repository.", icon: "git-pull-request", unlocked: prs > 0, date: "Mar 19, 2023" },
    { id: "100_contrib", title: "Century Builder", description: "Crossed 100 contributions milestone.", icon: "award", unlocked: totalContributions >= 100, date: "May 22, 2023" },
    { id: "500_contrib", title: "Elite Architect", description: "Pushed past the 500 contributions ceiling.", icon: "shield-alert", unlocked: totalContributions >= 500, date: "Oct 09, 2024" },
    { id: "streak_champion", title: "Unstoppable Force", description: "Maintained a streak exceeding 14 days of contributions.", icon: "flame", unlocked: longestStreak >= 14, date: "Nov 30, 2024" },
    { id: "repo_builder", title: "Project Guru", description: "Maintained more than 10 active repositories.", icon: "folder-git2", unlocked: totalRepos >= 10, date: "Dec 15, 2024" },
  ];

  // Timeline
  const timeline = [
    { date: "Jan 2023", title: "First Commit Created", description: `Began the journey on GitHub with account initialization.`, type: "milestone" as const },
    { date: "Apr 2023", title: "Launched First Open Source Project", description: `Published '${repoList[1].name}' containing key development utility assets.`, type: "repo" as const },
    { date: "Oct 2023", title: "Core Framework Integration", description: `Started working on the highly maintained flagship '${bestProjectName}' system.`, type: "contribution" as const },
    { date: "Jun 2024", title: "Milestone: 500 Contributions", description: "Reached 500 total contributions across coding repositories.", type: "milestone" as const },
    { date: "Dec 2024", title: "Scaling API backend integrations", description: `Built high-performance API structures inside ${repoList[3].name} utilizing ${secondLang}.`, type: "repo" as const }
  ];

  // Calculate actual most active month based on contribution counts
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthCommitCounts: Record<number, number> = {};
  dailyHeatmap.forEach(day => {
    const dateParts = day.date.split("-");
    if (dateParts.length >= 2) {
      const monthIndex = parseInt(dateParts[1]) - 1; // Convert "01"-"12" to 0-11
      if (monthIndex >= 0 && monthIndex < 12) {
        monthCommitCounts[monthIndex] = (monthCommitCounts[monthIndex] || 0) + day.count;
      }
    }
  });

  let peakMonthIndex = -1;
  let peakMonthCommits = -1;
  for (let m = 0; m < 12; m++) {
    const commits = monthCommitCounts[m] || 0;
    if (commits > peakMonthCommits) {
      peakMonthCommits = commits;
      peakMonthIndex = m;
    }
  }

  const computedMostActiveMonth = peakMonthIndex !== -1 && peakMonthCommits > 0 
    ? monthNames[peakMonthIndex] 
    : "October";

  return {
    user: {
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`, // Premium placeholder
      name: username.charAt(0).toUpperCase() + username.slice(1),
      username,
      bio: `Software Engineer specializing in ${favLang} architectures, open-source building, and scalable interface design.`,
      followers: Math.floor(random(12) * 500) + 12,
      following: Math.floor(random(13) * 300) + 8,
      publicRepos: totalRepos,
      accountAgeYears: 3,
      createdAt: "2023-01-12",
    },
    contributions: {
      total: totalContributions,
      activeReposCount: Math.floor(totalRepos * 0.4),
      starsEarned: stars,
      pullRequests: prs,
      issuesOpened: issues,
      daily: dailyHeatmap,
      trends: {
        last30Days,
        last90Days,
        lastYear,
      },
      consistencyScore,
      consistencyLabel,
    },
    habits: {
      activeHours,
      peakHoursText,
      dayAnalysis: {
        weekdayCount: Math.round(totalContributions * 0.78),
        weekendCount: Math.round(totalContributions * 0.22),
        mostActiveDay: ["Wednesday", "Tuesday", "Thursday"][Math.floor(random(14) * 3)],
        insights: `A strong weekday coder (78% weekday vs 22% weekend), indicating a disciplined structure. Peak commits concentrate heavily on midweek sessions.`
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        average: avgStreak
      }
    },
    projects: {
      bestProject: {
        name: bestProjectName,
        description: `Flagship developer environment powering core dashboard calculations.`,
        stars: stars,
        activityScore: 89,
        language: bestProjectLanguage,
      },
      mostMaintained: {
        name: `${lowercaseUser}-api`,
        description: `Longest running services codebase handling database migrations.`,
        ageMonths: 18,
        commitCount: Math.floor(totalContributions * 0.25),
        language: secondLang,
      },
      fastestGrowing: {
        name: `awesome-${favLang.toLowerCase()}`,
        description: `High recent activity surge, expanding core template layouts.`,
        recentCommits: 32,
        growthRatePercent: 120,
        language: favLang,
      },
      categories,
      list: repoList,
    },
    timeline,
    achievements,
    archetype,
    level,
    wrapped: {
      topProject: bestProjectName,
      mostActiveMonth: computedMostActiveMonth,
      longestStreak: longestStreak,
      biggestAchievement: totalContributions >= 500 ? "500 Contributions Milestone" : "Unstoppable Streak Champion",
      favoriteLanguage: favLang
    }
  };
}

// Specialized Mock Profiles
export const MOCK_PROFILES: Record<string, DeveloperStats> = {
  yathartha: {
    user: {
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      name: "Yathartha",
      username: "yathartha",
      bio: "Full Stack Engineer | Passionate about developer tools, competitive programming, and crafting minimal SaaS dashboards.",
      followers: 1240,
      following: 340,
      publicRepos: 48,
      accountAgeYears: 4,
      createdAt: "2022-04-18"
    },
    contributions: {
      total: 1420,
      activeReposCount: 16,
      starsEarned: 890,
      pullRequests: 210,
      issuesOpened: 45,
      daily: generateHeatmapData(1420, 84), // 84% consistency
      trends: {
        last30Days: generateHeatmapData(1420, 84).slice(-30),
        last90Days: generateHeatmapData(1420, 84).slice(-90),
        lastYear: generateHeatmapData(1420, 84).slice(-365).filter((_, i) => i % 3 === 0)
      },
      consistencyScore: 84,
      consistencyLabel: "Highly Consistent"
    },
    habits: {
      activeHours: [
        { hour: 0, commits: 150 }, { hour: 1, commits: 90 }, { hour: 2, commits: 45 }, { hour: 3, commits: 10 },
        { hour: 4, commits: 0 }, { hour: 5, commits: 0 }, { hour: 6, commits: 0 }, { hour: 7, commits: 10 },
        { hour: 8, commits: 30 }, { hour: 9, commits: 60 }, { hour: 10, commits: 80 }, { hour: 11, commits: 95 },
        { hour: 12, commits: 70 }, { hour: 13, commits: 50 }, { hour: 14, commits: 90 }, { hour: 15, commits: 110 },
        { hour: 16, commits: 130 }, { hour: 17, commits: 120 }, { hour: 18, commits: 80 }, { hour: 19, commits: 90 },
        { hour: 20, commits: 140 }, { hour: 21, commits: 220 }, { hour: 22, commits: 250 }, { hour: 23, commits: 190 }
      ],
      peakHoursText: "Most activity occurs between 9 PM and 1 AM.",
      dayAnalysis: {
        weekdayCount: 1120,
        weekendCount: 300,
        mostActiveDay: "Wednesday",
        insights: "Highly active midweek coder, concentrating most of their building block releases on Tuesday nights and Wednesdays. Weekend work is kept light but steady."
      },
      streaks: {
        current: 18,
        longest: 42,
        average: 12
      }
    },
    projects: {
      bestProject: {
        name: "next-saas-template",
        description: "A production-ready Next.js boilerplate complete with authentication, multi-tenant billing, and custom landing page assets.",
        stars: 420,
        activityScore: 94,
        language: "TypeScript"
      },
      mostMaintained: {
        name: "algorithm-vault",
        description: "A comprehensive library compiling competitive programming graph architectures, dynamic programming solutions, and tree operations in C++.",
        ageMonths: 24,
        commitCount: 480,
        language: "C++"
      },
      fastestGrowing: {
        name: "github-activity-story",
        description: "Spotify Wrapped for Developers. Beautiful developer narratives, habits breakdowns, and card animations.",
        recentCommits: 88,
        growthRatePercent: 250,
        language: "TypeScript"
      },
      categories: [
        { name: "Web Development", count: 24, percent: 50 },
        { name: "Competitive Programming", count: 12, percent: 25 },
        { name: "Open Source", count: 6, percent: 12.5 },
        { name: "Backend", count: 4, percent: 8.3 },
        { name: "Mobile", count: 1, percent: 2.1 },
        { name: "Miscellaneous", count: 1, percent: 2.1 }
      ],
      list: [
        { name: "next-saas-template", description: "Production boilerplates for SaaS tools.", stars: 420, forks: 95, language: "TypeScript", category: "Web Development", commitsCount: 220 },
        { name: "algorithm-vault", description: "Algorithm solutions and data structures.", stars: 210, forks: 45, language: "C++", category: "Competitive Programming", commitsCount: 480 },
        { name: "github-activity-story", description: "Spotify Wrapped for Developers.", stars: 150, forks: 30, language: "TypeScript", category: "Web Development", commitsCount: 120 },
        { name: "mini-redis", description: "A simple lightweight Redis server built in Node.", stars: 85, forks: 12, language: "TypeScript", category: "Backend", commitsCount: 95 }
      ]
    },
    timeline: [
      { date: "Apr 2022", title: "GitHub Journey Begins", description: "Created GitHub account, pushing the first repositories.", type: "milestone" },
      { date: "Oct 2022", title: "Started Competitive Programming", description: "Created 'algorithm-vault' for cataloging algorithm strategies.", type: "repo" },
      { date: "Jun 2023", title: "First Open Source Pull Request", description: "Contributed critical accessibility upgrades to shadcn/ui framework.", type: "contribution" },
      { date: "Jan 2024", title: "Reached 500 Contributions", description: "Hit the 500 contributions milestone during a major product build session.", type: "milestone" },
      { date: "Nov 2024", title: "Launched Next SaaS Template", description: "Published a popular Next.js boilerplate, gaining substantial stars.", type: "repo" },
      { date: "Jan 2025", title: "Built First Full Stack Project", description: "Engineered scalable React architectures with complete dashboard UI details.", type: "milestone" },
      { date: "Jun 2025", title: "Milestone: 1000 Contributions", description: "Surpassed 1000 total contributions across the year cycle.", type: "milestone" }
    ],
    achievements: [
      { id: "first_commit", title: "Genesis Commit", description: "Pushed the first commit to register code on the network.", icon: "git-commit", unlocked: true, date: "Apr 18, 2022" },
      { id: "first_pr", title: "Open Source Gateway", description: "Created first pull request to a public repository.", icon: "git-pull-request", unlocked: true, date: "Jun 21, 2023" },
      { id: "100_contrib", title: "Century Builder", description: "Reached 100 total contributions.", icon: "award", unlocked: true, date: "Sep 09, 2022" },
      { id: "500_contrib", title: "Elite Architect", description: "Reached 500 contributions milestone.", icon: "shield-alert", unlocked: true, date: "Jan 14, 2024" },
      { id: "1000_contrib", title: "Millennium Builder", description: "Pushed past the 1,000 commits ceiling.", icon: "trophy", unlocked: true, date: "Jun 10, 2025" },
      { id: "streak_champion", title: "Consistency Champion", description: "Maintained a streak exceeding 30 consecutive days of coding.", icon: "flame", unlocked: true, date: "Feb 12, 2024" },
      { id: "repo_builder", title: "Repository Builder", description: "Maintained more than 40 public repositories.", icon: "folder-git2", unlocked: true, date: "Nov 15, 2024" }
    ],
    archetype: {
      name: "The Builder",
      description: "You are a pragmatic product architect. You write substantial frontend and backend code, enjoy launching real products, and value polished design features and clean layouts.",
      label: "Full-Stack Product Maker"
    },
    level: 4,
    wrapped: {
      topProject: "next-saas-template",
      mostActiveMonth: "October",
      longestStreak: 42,
      biggestAchievement: "1,000 Contributions Milestone",
      favoriteLanguage: "TypeScript"
    }
  },
  torvalds: {
    user: {
      avatarUrl: "https://avatars.githubusercontent.com/u/1024?v=4",
      name: "Linus Torvalds",
      username: "torvalds",
      bio: "Father of Linux and Git. Building open source infrastructure.",
      followers: 198000,
      following: 0,
      publicRepos: 7,
      accountAgeYears: 18,
      createdAt: "2008-01-01"
    },
    contributions: {
      total: 5800,
      activeReposCount: 2,
      starsEarned: 182000,
      pullRequests: 15,
      issuesOpened: 0,
      daily: generateHeatmapData(5800, 92), // 92% consistency
      trends: {
        last30Days: generateHeatmapData(5800, 92).slice(-30),
        last90Days: generateHeatmapData(5800, 92).slice(-90),
        lastYear: generateHeatmapData(5800, 92).slice(-365).filter((_, i) => i % 3 === 0)
      },
      consistencyScore: 92,
      consistencyLabel: "Exceptional Consistency"
    },
    habits: {
      activeHours: [
        { hour: 0, commits: 10 }, { hour: 1, commits: 5 }, { hour: 2, commits: 0 }, { hour: 3, commits: 0 },
        { hour: 4, commits: 0 }, { hour: 5, commits: 0 }, { hour: 6, commits: 5 }, { hour: 7, commits: 45 },
        { hour: 8, commits: 150 }, { hour: 9, commits: 320 }, { hour: 10, commits: 450 }, { hour: 11, commits: 520 },
        { hour: 12, commits: 340 }, { hour: 13, commits: 250 }, { hour: 14, commits: 380 }, { hour: 15, commits: 460 },
        { hour: 16, commits: 410 }, { hour: 17, commits: 290 }, { hour: 18, commits: 140 }, { hour: 19, commits: 90 },
        { hour: 20, commits: 70 }, { hour: 21, commits: 50 }, { hour: 22, commits: 40 }, { hour: 23, commits: 20 }
      ],
      peakHoursText: "Peak coding hours occur standard daytime between 9 AM and 4 PM.",
      dayAnalysis: {
        weekdayCount: 5200,
        weekendCount: 600,
        mostActiveDay: "Monday",
        insights: "Linus operates strictly on a weekday schedule (90% weekday commits), demonstrating a professional workflow. Work concentrates heavily on early in the week."
      },
      streaks: {
        current: 24,
        longest: 95,
        average: 28
      }
    },
    projects: {
      bestProject: {
        name: "linux",
        description: "Linux kernel source tree. Powering standard internet infrastructure worldwide.",
        stars: 172000,
        activityScore: 99,
        language: "C"
      },
      mostMaintained: {
        name: "linux",
        description: "Linux kernel source tree.",
        ageMonths: 216,
        commitCount: 4500,
        language: "C"
      },
      fastestGrowing: {
        name: "subsurface",
        description: "Subsurface divelog program.",
        recentCommits: 45,
        growthRatePercent: 12,
        language: "C"
      },
      categories: [
        { name: "Open Source", count: 5, percent: 71.4 },
        { name: "Backend", count: 2, percent: 28.6 },
        { name: "Web Development", count: 0, percent: 0 },
        { name: "Competitive Programming", count: 0, percent: 0 },
        { name: "Mobile", count: 0, percent: 0 },
        { name: "Miscellaneous", count: 0, percent: 0 }
      ],
      list: [
        { name: "linux", description: "Linux kernel source tree.", stars: 172000, forks: 52000, language: "C", category: "Open Source", commitsCount: 4500 },
        { name: "git", description: "Fast, scalable, distributed revision control system source code.", stars: 49000, forks: 24000, language: "C", category: "Open Source", commitsCount: 1200 },
        { name: "subsurface", description: "Divelog software.", stars: 1200, forks: 400, language: "C", category: "Backend", commitsCount: 100 }
      ]
    },
    timeline: [
      { date: "Oct 1991", title: "Initial Linux Release", description: "Linus released the Linux kernel to the world, changing server architecture history.", type: "milestone" },
      { date: "Apr 2005", title: "Git Created", description: "Built Git in less than two weeks to coordinate kernel development.", type: "milestone" },
      { date: "Jun 2011", title: "Pushed Kernel 3.0", description: "Modernized version releases and directory structure layouts.", type: "milestone" },
      { date: "Feb 2020", title: "5.0 Kernel Launch", description: "Expanded hardware compatibility layers across the infrastructure.", type: "milestone" }
    ],
    achievements: [
      { id: "first_commit", title: "Genesis Commit", description: "Wrote core architecture baseline.", icon: "git-commit", unlocked: true, date: "Jan 01, 2008" },
      { id: "first_pr", title: "Open Source Gateway", description: "Reviewed core kernel updates.", icon: "git-pull-request", unlocked: true, date: "Apr 05, 2008" },
      { id: "1000_contrib", title: "Legendary Veteran", description: "Surpassed 1000 contributions limit.", icon: "trophy", unlocked: true, date: "Dec 12, 2010" },
      { id: "streak_champion", title: "Consistent Titan", description: "Maintained standard commit frequency for decades.", icon: "flame", unlocked: true, date: "Jan 12, 2012" }
    ],
    archetype: {
      name: "The Problem Solver",
      description: "You are the ultimate problem solver. You construct foundational platforms and open-source infrastructure that the entire developer community builds on.",
      label: "Open Source Founding Pioneer"
    },
    level: 5,
    wrapped: {
      topProject: "linux",
      mostActiveMonth: "January",
      longestStreak: 95,
      biggestAchievement: "100,000+ Kernel Commits Integrator",
      favoriteLanguage: "C"
    }
  }
};
