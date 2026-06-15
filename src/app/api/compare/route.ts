import { NextRequest, NextResponse } from "next/server";
import { getGitHubStoryData } from "@/lib/github";
import { safeDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userA = searchParams.get("userA");
    const userB = searchParams.get("userB");

    if (!userA || !userB) {
      return NextResponse.json({ error: "Both userA and userB parameters are required" }, { status: 400 });
    }

    const nameA = userA.trim().toLowerCase();
    const nameB = userB.trim().toLowerCase();

    if (nameA === nameB) {
      return NextResponse.json({ error: "Please specify two different developers to compare" }, { status: 400 });
    }

    // Check DB cache first
    const cachedComp = await safeDb.getComparison(nameA, nameB);
    if (cachedComp) {
      return NextResponse.json(JSON.parse(cachedComp.data));
    }

    // Fetch stats for both developers (safe, handles offline/rate limits)
    const [statsA, statsB] = await Promise.all([
      getGitHubStoryData(nameA),
      getGitHubStoryData(nameB),
    ]);

    // Construct detailed comparisons
    const comparisonResult = {
      userA: {
        username: statsA.user.username,
        name: statsA.user.name,
        avatarUrl: statsA.user.avatarUrl,
        bio: statsA.user.bio,
        level: statsA.level,
        archetype: statsA.archetype.name,
        totalContributions: statsA.contributions.total,
        starsEarned: statsA.contributions.starsEarned,
        longestStreak: statsA.habits.streaks.longest,
        publicRepos: statsA.user.publicRepos,
        favoriteLanguage: statsA.wrapped.favoriteLanguage,
      },
      userB: {
        username: statsB.user.username,
        name: statsB.user.name,
        avatarUrl: statsB.user.avatarUrl,
        bio: statsB.user.bio,
        level: statsB.level,
        archetype: statsB.archetype.name,
        totalContributions: statsB.contributions.total,
        starsEarned: statsB.contributions.starsEarned,
        longestStreak: statsB.habits.streaks.longest,
        publicRepos: statsB.user.publicRepos,
        favoriteLanguage: statsB.wrapped.favoriteLanguage,
      },
      comparison: {
        contributionsDiff: statsA.contributions.total - statsB.contributions.total,
        starsDiff: statsA.contributions.starsEarned - statsB.contributions.starsEarned,
        streakDiff: statsA.habits.streaks.longest - statsB.habits.streaks.longest,
        reposDiff: statsA.user.publicRepos - statsB.user.publicRepos,
        levelDiff: statsA.level - statsB.level,
      }
    };

    // Save and cache to DB
    await safeDb.saveComparison(nameA, nameB, comparisonResult);

    return NextResponse.json(comparisonResult);

  } catch (error: any) {
    console.error("Comparison API error:", error);
    return NextResponse.json({ error: error.message || "Failed to compare profiles" }, { status: 500 });
  }
}
