import { NextRequest, NextResponse } from "next/server";
import { getGitHubStoryData } from "@/lib/github";
import { generateDeveloperStory } from "@/lib/ai";
import { safeDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username query parameter is required" }, { status: 400 });
    }

    const normUsername = username.trim().toLowerCase();
    const refresh = searchParams.get("refresh") === "true";

    const headers = {
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    };

    // 1. Check if cached in DB (if not forcing a refresh)
    if (!refresh) {
      const cachedStory = await safeDb.getStory(normUsername);
      if (cachedStory) {
        try {
          const stats = JSON.parse(cachedStory.stats);
          return NextResponse.json({
            user: stats.user,
            contributions: stats.contributions,
            habits: stats.habits,
            projects: stats.projects,
            timeline: stats.timeline,
            achievements: stats.achievements,
            archetype: stats.archetype || { name: cachedStory.archetype, description: "Professional developer profile", label: cachedStory.archetype },
            level: cachedStory.level,
            storyText: cachedStory.storyText,
            wrapped: stats.wrapped || {
              topProject: stats.projects.bestProject.name,
              mostActiveMonth: "October",
              longestStreak: stats.habits.streaks.longest,
              biggestAchievement: "500 Contributions Milestone",
              favoriteLanguage: stats.projects.bestProject.language
            },
            cached: true,
            createdAt: cachedStory.createdAt
          }, { headers });
        } catch (err) {
          console.error("Failed to parse cached stats JSON, recalculating...", err);
        }
      }
    }

    // 2. Fetch fresh stats
    const stats = await getGitHubStoryData(username, refresh);

    // 3. Generate AI story narrative text
    const storyText = await generateDeveloperStory(stats);

    // 4. Save and cache to DB
    const saved = await safeDb.saveStory(normUsername, {
      name: stats.user.name,
      avatarUrl: stats.user.avatarUrl,
      bio: stats.user.bio,
      stats: stats,
      storyText: storyText,
      archetype: stats.archetype.name,
      level: stats.level
    });

    return NextResponse.json({
      ...stats,
      storyText,
      cached: false,
      createdAt: saved.createdAt
    }, { headers });

  } catch (error: any) {
    console.error("API error generating story:", error);
    return NextResponse.json({ error: error.message || "Failed to generate story" }, { status: 500 });
  }
}
