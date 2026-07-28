import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DAILY_XP_GOAL, EXERCISES } from "@/lib/exercises";

const XP_PER_LEVEL = 400;

export default defineTool({
  name: "get_progress_rules",
  title: "Explain XP and level rules",
  description:
    "Explain SpineUp's gamification rules (daily XP goal, XP per level) and optionally compute the level and progress for a given total XP.",
  inputSchema: {
    totalXp: z
      .number()
      .int()
      .min(0)
      .nullable()
      .describe("Optional total XP to convert into a level and progress percentage."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ totalXp }) => {
    const maxDaily = EXERCISES.reduce((sum, e) => sum + e.xp, 0);
    const lines = [
      `Daily XP goal: ${DAILY_XP_GOAL} XP.`,
      `Completing the full 8-exercise routine earns ${maxDaily} XP.`,
      `Each level takes ${XP_PER_LEVEL} XP.`,
    ];

    let computed: Record<string, number> | undefined;
    if (typeof totalXp === "number") {
      const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
      const into = totalXp % XP_PER_LEVEL;
      computed = {
        totalXp,
        level,
        xpIntoLevel: into,
        xpToNextLevel: XP_PER_LEVEL - into,
        progressPercent: Math.round((into / XP_PER_LEVEL) * 100),
      };
      lines.push(
        `${totalXp} XP = level ${level}, ${into}/${XP_PER_LEVEL} into the level (${computed.progressPercent}%).`,
      );
    }

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
      structuredContent: { dailyXpGoal: DAILY_XP_GOAL, xpPerLevel: XP_PER_LEVEL, fullRoutineXp: maxDaily, computed },
    };
  },
});
