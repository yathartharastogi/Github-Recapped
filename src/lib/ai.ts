import { DeveloperStats } from "./mock-data";

/**
 * Generates an engaging developer story narrative by analyzing their metrics.
 * Calls Gemini API if GEMINI_API_KEY is present, otherwise falls back to a high-quality local rule engine.
 */
export async function generateDeveloperStory(stats: DeveloperStats): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `
        You are a seasoned technical recruiter and talent developer. Write an engaging, insightful developer story narrative for a GitHub user named ${stats.user.name} (@${stats.user.username}).
        
        Analyze their metrics below and synthesize them into a professional, cohesive 2-3 paragraph story that reads like a premium talent profile. Do not list numbers in bullet points; write it as a flowing narrative. Focus on coding habits, growth, project choices, and strengths.
        
        Developer Profile:
        - Name: ${stats.user.name}
        - Bio: ${stats.user.bio}
        - Archetype: ${stats.archetype.name} (${stats.archetype.label})
        - Level: ${stats.level} (out of 5)
        - Total public contributions: ${stats.contributions.total} across ${stats.projects.list.length} repositories
        - Stars earned: ${stats.contributions.starsEarned}
        - Main programming languages: ${stats.wrapped.favoriteLanguage} (primary), ${stats.projects.mostMaintained.language} (secondary)
        - Coding schedule/habits: ${stats.habits.peakHoursText}
        - Consistency: ${stats.contributions.consistencyScore}% score (${stats.contributions.consistencyLabel})
        - Current/Longest Streaks: ${stats.habits.streaks.current} days / ${stats.habits.streaks.longest} days
        - Flagship Project: '${stats.projects.bestProject.name}' (${stats.projects.bestProject.description}) with ${stats.projects.bestProject.stars} stars.
        
        Maintain a tone that is:
        - Mature, professional, and clear.
        - Free from hype, buzzwords, or typical AI-isms like "testament to," "beacon," "delve," "realm."
        - Balanced and highly specific to their stats.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } else {
        console.warn(`Gemini API returned status ${response.status}. Falling back to rule engine.`);
      }
    } catch (e) {
      console.error("Failed to generate narrative with Gemini API, falling back:", e);
    }
  }

  // Fallback: Highly personalized and detailed rule-based narrative engine
  return buildLocalDeveloperStory(stats);
}

function buildLocalDeveloperStory(stats: DeveloperStats): string {
  const { name, username } = stats.user;
  const favLang = stats.wrapped.favoriteLanguage;
  const secondaryLang = stats.projects.mostMaintained.language;
  const bestProject = stats.projects.bestProject.name;
  const streak = stats.habits.streaks.longest;
  const total = stats.contributions.total;
  
  // Consistency narrative
  let consistencyText = "";
  if (stats.contributions.consistencyScore > 85) {
    consistencyText = `${name} demonstrates exceptional, disciplined consistency, maintaining active code loops with regular, daily contribution check-ins.`;
  } else if (stats.contributions.consistencyScore > 70) {
    consistencyText = `Showing steady, disciplined activity, ${name} has established a reliable coding rhythm over the past year.`;
  } else {
    consistencyText = `Focusing on targeted, event-driven development, ${name} contributes in focused spikes, building out features incrementally.`;
  }

  // Habits/schedule narrative
  let scheduleText = "";
  if (stats.habits.activeHours.find(h => h.hour >= 20 && h.hour <= 23 && h.commits > 100)) {
    scheduleText = `Activity patterns indicate a classic late-night focus, where uninterrupted evening sessions from 9 PM onwards allow deep focus and feature implementation.`;
  } else if (stats.habits.activeHours.find(h => h.hour >= 9 && h.hour <= 14 && h.commits > 100)) {
    scheduleText = `Development habits align with structured, daytime iterations, showing standard work hours productivity.`;
  } else {
    scheduleText = `Pushes are distributed evenly, showing flexible availability and an adaptable approach to task execution throughout the day.`;
  }

  // Archetype specific paragraphs
  let archetypeText = "";
  switch (stats.archetype.name) {
    case "The Builder":
      archetypeText = `As a Builder, ${name} shows a strong inclination for shipping features and compiling production-grade code. Their repository architecture is centered on utility and deployment. This is highlighted by '${bestProject}', a flagship project focusing heavily on scalable systems built using ${favLang}.`;
      break;
    case "The Problem Solver":
      archetypeText = `Characterized as a Problem Solver, ${name} prioritizes algorithmic elegance, logic structures, and optimization. Much of their repository history indicates a deep interest in mathematical or backend logic, solving complex performance constraints using languages like ${secondaryLang} and ${favLang}.`;
      break;
    case "The Open Source Explorer":
      archetypeText = `Operating as an Open Source Explorer, ${name} excels at collaborative engineering. They dedicate substantial effort to reviewing codebases, contributing upstream to other platforms, and maintaining public forks. This is supported by their high engagement in pull requests.`;
      break;
    case "The Consistent Coder":
      archetypeText = `Defined by persistence, ${name} has achieved an impressive streak of ${streak} consecutive coding days. They value small, steady improvements rather than bulk revisions, making them an excellent long-term maintainer who guarantees system stability.`;
      break;
    case "The Product Maker":
      archetypeText = `As a Product Maker, ${name} blends solid backend logic with visual, user-centric interfaces. They are passionate about developer experience (DX) and crafting interfaces that look minimal yet function beautifully, using libraries centered on ${favLang} and interactive web technologies.`;
      break;
    default:
      archetypeText = `${name} focuses on code quality, utilizing ${favLang} and ${secondaryLang} to build custom scripts and personal utilities.`;
  }

  // Level-based growth timeline summary
  let levelText = "";
  if (stats.level >= 4) {
    levelText = `With ${total} contributions, ${name} has climbed to Level ${stats.level} (Architect/Veteran status). This reflects a mature development profile characterized by substantial repository ownership and high stars indicators. Their timeline records multiple key milestones, indicating consistent personal growth and code quality.`;
  } else {
    levelText = `Accumulating ${total} contributions, ${name} is at Level ${stats.level} (Builder/Creator), showing active progression, steady project building, and a expanding tech footprint. They are well-positioned to continue scaling their framework intelligence.`;
  }

  return `Over the last year, ${consistencyText} ${scheduleText}

${archetypeText}

${levelText}`;
}
