import { PrismaClient } from "@prisma/client";

// Global cache for Prisma clients in development to prevent hot-reloading connections exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// A robust in-memory database fallback to ensure zero-crash operations if database is locked or read-only
class MemoryDbFallback {
  private stories = new Map<string, any>();
  private comparisons = new Map<string, any>();

  async getStory(username: string) {
    return this.stories.get(username.toLowerCase()) || null;
  }

  async saveStory(username: string, data: any) {
    const key = username.toLowerCase();
    const existing = this.stories.get(key) || {};
    const updated = {
      id: existing.id || Math.random().toString(36).substring(7),
      username: key,
      name: data.name,
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      stats: typeof data.stats === "string" ? data.stats : JSON.stringify(data.stats),
      storyText: data.storyText,
      archetype: data.archetype,
      level: data.level || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stories.set(key, updated);
    return updated;
  }

  async getComparison(userA: string, userB: string) {
    const key = [userA.toLowerCase(), userB.toLowerCase()].sort().join("_");
    return this.comparisons.get(key) || null;
  }

  async saveComparison(userA: string, userB: string, data: any) {
    const key = [userA.toLowerCase(), userB.toLowerCase()].sort().join("_");
    const record = {
      id: Math.random().toString(36).substring(7),
      userA: userA.toLowerCase(),
      userB: userB.toLowerCase(),
      data: typeof data === "string" ? data : JSON.stringify(data),
      createdAt: new Date(),
    };
    this.comparisons.set(key, record);
    return record;
  }
}

const memoryDbFallback = new MemoryDbFallback();

export const safeDb = {
  getStory: async (username: string) => {
    try {
      const story = await prisma.githubStory.findUnique({
        where: { username: username.toLowerCase() },
      });
      return story;
    } catch (error) {
      console.warn("Prisma Query Failed, falling back to In-Memory DB:", error);
      return memoryDbFallback.getStory(username);
    }
  },

  saveStory: async (username: string, data: {
    name?: string | null;
    avatarUrl: string;
    bio?: string | null;
    stats: any;
    storyText: string;
    archetype: string;
    level?: number;
  }) => {
    const statsStr = typeof data.stats === "string" ? data.stats : JSON.stringify(data.stats);
    try {
      const story = await prisma.githubStory.upsert({
        where: { username: username.toLowerCase() },
        update: {
          name: data.name,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          stats: statsStr,
          storyText: data.storyText,
          archetype: data.archetype,
          level: data.level || 1,
        },
        create: {
          username: username.toLowerCase(),
          name: data.name,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          stats: statsStr,
          storyText: data.storyText,
          archetype: data.archetype,
          level: data.level || 1,
        },
      });
      return story;
    } catch (error) {
      console.warn("Prisma Save Failed, falling back to In-Memory DB:", error);
      return memoryDbFallback.saveStory(username, data);
    }
  },

  getComparison: async (userA: string, userB: string) => {
    try {
      const sortedUsers = [userA.toLowerCase(), userB.toLowerCase()].sort();
      const comp = await prisma.comparison.findFirst({
        where: {
          userA: sortedUsers[0],
          userB: sortedUsers[1],
        },
      });
      return comp;
    } catch (error) {
      console.warn("Prisma Comparison Query Failed, falling back to In-Memory DB:", error);
      return memoryDbFallback.getComparison(userA, userB);
    }
  },

  saveComparison: async (userA: string, userB: string, data: any) => {
    try {
      const sortedUsers = [userA.toLowerCase(), userB.toLowerCase()].sort();
      const dataStr = typeof data === "string" ? data : JSON.stringify(data);
      
      // Look if exists
      const existing = await prisma.comparison.findFirst({
        where: {
          userA: sortedUsers[0],
          userB: sortedUsers[1],
        }
      });

      if (existing) {
        return await prisma.comparison.update({
          where: { id: existing.id },
          data: { data: dataStr }
        });
      }

      const comp = await prisma.comparison.create({
        data: {
          userA: sortedUsers[0],
          userB: sortedUsers[1],
          data: dataStr,
        },
      });
      return comp;
    } catch (error) {
      console.warn("Prisma Comparison Save Failed, falling back to In-Memory DB:", error);
      return memoryDbFallback.saveComparison(userA, userB, data);
    }
  }
};
