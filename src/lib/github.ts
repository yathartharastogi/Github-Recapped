import { DeveloperStats, MOCK_PROFILES, generateDynamicStats, generateHeatmapData } from "./mock-data";

async function fetchRealContributions(username: string): Promise<{
  daily: { date: string; count: number }[];
  total: number;
  longestStreak: number;
  currentStreak: number;
  averageStreak: number;
  consistencyScore: number;
}> {
  const res = await fetch(`https://github.com/users/${username.trim().toLowerCase()}/contributions`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch contributions HTML: ${res.status}`);
  }
  const html = await res.text();

  const tdTags = html.match(/<td\s+[^>]*data-date="[^"]*"[^>]*>/g) || [];
  const tds: { id: string; date: string; level: number }[] = [];

  for (const tag of tdTags) {
    const idMatch = tag.match(/id="([^"]+)"/);
    const dateMatch = tag.match(/data-date="([^"]+)"/);
    const levelMatch = tag.match(/data-level="([^"]+)"/);

    if (idMatch && dateMatch) {
      tds.push({
        id: idMatch[1],
        date: dateMatch[1],
        level: levelMatch ? parseInt(levelMatch[1]) : 0
      });
    }
  }

  const tooltipRegex = /<tool-tip[^>]+for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
  const tooltips: Record<string, number> = {};
  let match;
  while ((match = tooltipRegex.exec(html)) !== null) {
    const componentId = match[1];
    const text = match[2].trim();
    let count = 0;
    if (text.startsWith("No contributions")) {
      count = 0;
    } else {
      const numMatch = text.match(/^([0-9,]+)\s+contribution/i);
      if (numMatch) {
        count = parseInt(numMatch[1].replace(/,/g, ""));
      }
    }
    tooltips[componentId] = count;
  }

  const daily = tds.map(td => {
    const count = tooltips[td.id] !== undefined ? tooltips[td.id] : (td.level > 0 ? td.level : 0);
    return { date: td.date, count };
  }).sort((a, b) => a.date.localeCompare(b.date));

  if (daily.length === 0) {
    throw new Error("No daily contribution data parsed");
  }

  const total = daily.reduce((sum, d) => sum + d.count, 0);

  // Calculate streaks
  let longestStreak = 0;
  let tempStreak = 0;
  let streakCount = 0;
  let totalStreakSum = 0;

  daily.forEach((day) => {
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      if (tempStreak > 0) {
        streakCount++;
        totalStreakSum += tempStreak;
      }
      tempStreak = 0;
    }
  });
  if (tempStreak > 0) {
    streakCount++;
    totalStreakSum += tempStreak;
  }

  const averageStreak = streakCount > 0 ? Math.round(totalStreakSum / streakCount) : 0;

  // Current streak (checking backwards from the end)
  let currentStreak = 0;
  for (let i = daily.length - 1; i >= 0; i--) {
    if (daily[i].count > 0) {
      currentStreak++;
    } else {
      // Allow a 1-day grace period
      if (currentStreak === 0 && (daily.length - 1 - i) <= 1) {
        continue;
      }
      break;
    }
  }

  const activeDays = daily.filter(d => d.count > 0).length;
  const consistencyScore = Math.min(99, Math.max(5, Math.round((activeDays / 220) * 100)));

  return {
    daily,
    total,
    longestStreak,
    currentStreak,
    averageStreak,
    consistencyScore
  };
}

/**
 * Normalizes a GitHub username and retrieves their story statistics.
 * Integrates live GitHub REST API endpoints with robust error fallbacks.
 */
export async function getGitHubStoryData(username: string): Promise<DeveloperStats> {
  const normUser = username.trim().toLowerCase();
  
  // 1. Instantly return preloaded mocks for high-fidelity demos
  if (MOCK_PROFILES[normUser]) {
    // Return a clone to prevent mutation
    return JSON.parse(JSON.stringify(MOCK_PROFILES[normUser]));
  }

  // 2. Try fetching from public GitHub REST API
  try {
    // Set up request init with authentication token if present in environment
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`;
    }

    const userRes = await fetch(`https://api.github.com/users/${normUser}`, { headers, next: { revalidate: 3600 } });
    
    if (userRes.status === 404) {
      throw new Error("User not found");
    }

    if (!userRes.ok) {
      // Check if rate limited
      if (userRes.status === 403 || userRes.status === 429) {
        console.warn(`GitHub API Rate Limited. Falling back to dynamic mock generator for user: ${username}`);
      } else {
        console.warn(`GitHub API returned status ${userRes.status}. Falling back to dynamic generator.`);
      }
      return generateDynamicStats(username);
    }

    const userData = await userRes.json();

    // Fetch user's public repositories (up to 100)
    const reposRes = await fetch(`https://api.github.com/users/${normUser}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 } });
    let reposData = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // Process repositories to calculate totals and find best projects
    let totalStars = 0;
    const languageCounts: Record<string, number> = {};
    const repoList: {
      name: string;
      description: string;
      stars: number;
      forks: number;
      language: string;
      category: string;
      commitsCount: number;
    }[] = [];

    reposData.forEach((repo: {
      name: string;
      description?: string | null;
      stargazers_count: number;
      forks_count: number;
      language?: string | null;
      fork?: boolean;
    }) => {
      totalStars += repo.stargazers_count;
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
      
      // Determine project categories based on description, name, or tech
      let category = "Web Development";
      const nameLower = repo.name.toLowerCase();
      const descLower = (repo.description || "").toLowerCase();
      
      if (nameLower.includes("algorithm") || nameLower.includes("leet") || nameLower.includes("codeforces") || nameLower.includes("competitive")) {
        category = "Competitive Programming";
      } else if (nameLower.includes("api") || nameLower.includes("backend") || nameLower.includes("server") || nameLower.includes("db")) {
        category = "Backend";
      } else if (nameLower.includes("android") || nameLower.includes("ios") || nameLower.includes("flutter") || nameLower.includes("mobile") || nameLower.includes("react-native")) {
        category = "Mobile";
      } else if (repo.fork === true || nameLower.includes("contribute") || nameLower.includes("awesome")) {
        category = "Open Source";
      } else if (descLower.includes("template") || descLower.includes("config") || descLower.includes("dotfiles")) {
        category = "Miscellaneous";
      }

      repoList.push({
        name: repo.name,
        description: repo.description || "No description provided.",
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || "Markdown",
        category,
        commitsCount: Math.floor(Math.random() * 80) + 5, // Simulated commit counts per repo
      });
    });

    // Top programming languages
    const sortedLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
    
    const favoriteLanguage = sortedLanguages[0] || "TypeScript";

    // Reconstruct contribution metrics
    const publicRepos = userData.public_repos || repoList.length;
    const accountAge = Math.max(1, new Date().getFullYear() - new Date(userData.created_at).getFullYear());
    
    let totalContributions = 0;
    let consistencyScore = 0;
    let dailyHeatmap: { date: string; count: number }[] = [];
    let longestStreak = 0;
    let currentStreak = 0;
    let avgStreak = 0;

    try {
      const real = await fetchRealContributions(normUser);
      totalContributions = real.total;
      consistencyScore = real.consistencyScore;
      dailyHeatmap = real.daily;
      longestStreak = real.longestStreak;
      currentStreak = real.currentStreak;
      avgStreak = real.averageStreak;
      console.log(`Successfully parsed real GitHub contributions for user: ${username}. Total: ${totalContributions}`);
    } catch (err) {
      console.warn(`Failed to retrieve real contributions for ${username}, using simulation fallback:`, err);
      // Fallback: simulated values
      totalContributions = Math.max(80, (userData.followers * 3) + (publicRepos * 18) + Math.floor(Math.random() * 400));
      consistencyScore = Math.min(98, Math.max(45, Math.floor(65 + (publicRepos * 0.4) + (userData.followers > 100 ? 15 : 5))));
      dailyHeatmap = generateHeatmapData(totalContributions, consistencyScore);
      longestStreak = Math.floor(10 + (consistencyScore * 0.3) + (Math.random() * 10));
      currentStreak = Math.floor(Math.random() * Math.min(longestStreak, 7));
      avgStreak = Math.floor(longestStreak * 0.35);
    }

    let consistencyLabel = "Occasional Contributor";
    if (consistencyScore > 85) consistencyLabel = "Exceptional Consistency";
    else if (consistencyScore > 75) consistencyLabel = "Highly Consistent";
    else if (consistencyScore > 60) consistencyLabel = "Steady Contributor";

    const last30Days = dailyHeatmap.slice(-30);
    const last90Days = dailyHeatmap.slice(-90);
    
    const lastYear: { date: string; count: number }[] = [];
    for (let i = 0; i < dailyHeatmap.length; i += 3) {
      const chunk = dailyHeatmap.slice(i, i + 3);
      const sum = chunk.reduce((acc, curr) => acc + curr.count, 0);
      lastYear.push({ date: chunk[0].date, count: sum });
    }

    const prs = Math.max(0, Math.floor((publicRepos * 3.5) + (userData.followers * 0.1) + Math.floor(Math.random() * 20)));
    const issues = Math.max(0, Math.floor((publicRepos * 1.5) + Math.floor(Math.random() * 10)));

    // Active hours (simulated hourly peaks)
    const peakHour = Math.random() > 0.6 ? 21 : 11; // 9 PM or 11 AM peak
    const activeHours = Array.from({ length: 24 }, (_, hour) => {
      let weight = 2;
      if (hour >= 9 && hour <= 17) weight = 7;
      if (hour >= 20 && hour <= 23) weight = 10;
      const dist = Math.min(Math.abs(hour - peakHour), 24 - Math.abs(hour - peakHour));
      const spike = Math.max(0, 10 - dist * 3);
      return {
        hour,
        commits: Math.floor((weight + spike) * (totalContributions / 220) * (Math.random() * 0.4 + 0.6))
      };
    });

    const peakHoursText = peakHour === 21 
      ? `Most activity occurs late in the evening between 8 PM and midnight.`
      : `Highly productive coding session observed during standard daytime hours between 10 AM and 3 PM.`;

    // Timeline milestones
    const timeline: {
      date: string;
      title: string;
      description: string;
      type: "milestone" | "repo" | "contribution";
    }[] = [
      {
        date: new Date(userData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        title: "Joined GitHub Network",
        description: `Initialized the @${userData.login} account on GitHub.`,
        type: "milestone" as const
      }
    ];

    // Add repo creations to timeline
    const sortedByAge = [...reposData].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    if (sortedByAge.length > 0) {
      timeline.push({
        date: new Date(sortedByAge[0].created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        title: `Launched ${sortedByAge[0].name}`,
        description: sortedByAge[0].description || `Created early project repos using ${sortedByAge[0].language || "Markdown"}.`,
        type: "repo" as const
      });
    }

    if (sortedByAge.length > 1) {
      const midRepo = sortedByAge[Math.floor(sortedByAge.length / 2)];
      timeline.push({
        date: new Date(midRepo.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        title: `Engineered ${midRepo.name}`,
        description: midRepo.description || `Integrated features and modules under ${midRepo.language || "JS/TS"}.`,
        type: "repo" as const
      });
    }

    // Add contribution milestone
    timeline.push({
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      title: `Accumulated ${totalContributions} Contributions`,
      description: `Solidified code footprint with commits, code merges, and PR cycles.`,
      type: "milestone" as const
    });

    // Best projects matching
    const bestRepoObj = repoList.sort((a, b) => b.stars - a.stars)[0] || { name: `${normUser}-repo`, description: "A public software repo.", stars: 0, forks: 0, language: favoriteLanguage, category: "Web Development", commitsCount: 10 };
    const bestProject = {
      name: bestRepoObj.name,
      description: bestRepoObj.description,
      stars: bestRepoObj.stars,
      activityScore: Math.min(98, 40 + bestRepoObj.stars + (bestRepoObj.forks * 2)),
      language: bestRepoObj.language
    };

    const mostMaintainedObj = repoList.sort((a, b) => b.commitsCount - a.commitsCount)[0] || bestRepoObj;
    const mostMaintained = {
      name: mostMaintainedObj.name,
      description: mostMaintainedObj.description,
      ageMonths: accountAge * 12,
      commitCount: mostMaintainedObj.commitsCount * 3, // padded for maintainer representation
      language: mostMaintainedObj.language
    };

    const fastestGrowing = {
      name: repoList.sort((a, b) => b.forks - a.forks)[0]?.name || bestRepoObj.name,
      description: repoList.sort((a, b) => b.forks - a.forks)[0]?.description || bestRepoObj.description,
      recentCommits: Math.floor(Math.random() * 25) + 8,
      growthRatePercent: Math.floor(Math.random() * 150) + 50,
      language: repoList.sort((a, b) => b.forks - a.forks)[0]?.language || favoriteLanguage
    };

    // Category distribution percentiles
    const totalRepoListCount = repoList.length;
    const categoryDistribution = Object.entries(
      repoList.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, count]) => ({
      name,
      count: count as number,
      percent: Math.round(((count as number) / totalRepoListCount) * 100)
    }));

    // Archetype matching
    let archetypeIdx = 0; // Builder
    if (favoriteLanguage === "C++" || favoriteLanguage === "Python") archetypeIdx = 1; // Problem Solver
    if (userData.followers > 500) archetypeIdx = 2; // Open Source Explorer
    if (consistencyScore > 80) archetypeIdx = 3; // Consistent Coder
    if (favoriteLanguage === "TypeScript" || favoriteLanguage === "HTML/CSS") archetypeIdx = 4; // Product Maker

    const archetypes = [
      { name: "The Builder", description: "You are a developer focused on construction. You write massive amounts of code, structure complex systems, and love seeing features ship.", label: "Highly Productive Maker" },
      { name: "The Problem Solver", description: "Your focus lies in algorithm optimizations, data structures, and rapid problem execution.", label: "Analytical Optimizer" },
      { name: "The Open Source Explorer", description: "You are constantly contributing to shared codebases, opening PRs, and reviewing issues.", label: "Collaborative Contributor" },
      { name: "The Consistent Coder", description: "A steady commit habit shows disciplined daily code cycles. You show up every single day.", label: "Dedicated Professional" },
      { name: "The Product Maker", description: "You design frontend applications, build beautiful interactive elements, and value developer experience.", label: "DX Advocate" }
    ];
    const archetype = archetypes[archetypeIdx];

    // Achievements unlocked mapping
    const achievements = [
      { id: "first_commit", title: "Genesis Commit", description: "Successfully pushed the first commit to register the developer footprint.", icon: "git-commit", unlocked: true, date: new Date(userData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
      { id: "first_pr", title: "Open Source Gateway", description: "Created first pull request to a repository.", icon: "git-pull-request", unlocked: prs > 0, date: "Unlocked" },
      { id: "100_contrib", title: "Century Builder", description: "Crossed 100 contributions milestone.", icon: "award", unlocked: totalContributions >= 100, date: "Unlocked" },
      { id: "500_contrib", title: "Elite Architect", description: "Pushed past the 500 contributions ceiling.", icon: "shield-alert", unlocked: totalContributions >= 500, date: "Unlocked" },
      { id: "streak_champion", title: "Unstoppable Force", description: "Maintained a streak exceeding 14 days of contributions.", icon: "flame", unlocked: longestStreak >= 14, date: "Unlocked" },
      { id: "repo_builder", title: "Project Guru", description: "Maintained more than 10 active repositories.", icon: "folder-git2", unlocked: publicRepos >= 10, date: "Unlocked" },
    ];

    // Level
    let level = 1;
    if (totalContributions > 1500) level = 5;
    else if (totalContributions > 1000) level = 4;
    else if (totalContributions > 500) level = 3;
    else if (totalContributions > 150) level = 2;

    const wrapped = {
      topProject: bestProject.name,
      mostActiveMonth: ["October", "June", "November", "March"][Math.floor(Math.random() * 4)],
      longestStreak,
      biggestAchievement: totalContributions >= 500 ? "500 Contributions Milestone" : "Genesis Project Launch",
      favoriteLanguage
    };

    return {
      user: {
        avatarUrl: userData.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        name: userData.name || userData.login,
        username: userData.login,
        bio: userData.bio || "This developer has not provided a bio.",
        followers: userData.followers,
        following: userData.following,
        publicRepos,
        accountAgeYears: accountAge,
        createdAt: userData.created_at
      },
      contributions: {
        total: totalContributions,
        activeReposCount: Math.max(1, Math.round(publicRepos * 0.3)),
        starsEarned: totalStars,
        pullRequests: prs,
        issuesOpened: issues,
        daily: dailyHeatmap,
        trends: {
          last30Days,
          last90Days,
          lastYear
        },
        consistencyScore,
        consistencyLabel
      },
      habits: {
        activeHours,
        peakHoursText,
        dayAnalysis: {
          weekdayCount: Math.round(totalContributions * 0.76),
          weekendCount: Math.round(totalContributions * 0.24),
          mostActiveDay: "Tuesday",
          insights: `A strong weekday developer, with peak check-ins happening around Tuesday and Thursday. Active habits show steady work cycles.`
        },
        streaks: {
          current: currentStreak,
          longest: longestStreak,
          average: avgStreak
        }
      },
      projects: {
        bestProject,
        mostMaintained,
        fastestGrowing,
        categories: categoryDistribution,
        list: repoList.slice(0, 10) // clamp repo listing
      },
      timeline,
      achievements,
      archetype,
      level,
      wrapped
    };

  } catch (error) {
    console.error(`Error fetching GitHub data for ${username}:`, error);
    console.log(`Falling back to dynamic mock data generator for ${username}.`);
    return generateDynamicStats(username);
  }
}
