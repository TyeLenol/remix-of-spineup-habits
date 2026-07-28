import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { EXERCISES } from "@/lib/exercises";

export default defineTool({
  name: "get_exercise",
  title: "Get exercise details",
  description:
    "Get the full step-by-step instructions and posture cue for one SpineUp rehabilitation exercise, by id or name.",
  inputSchema: {
    exercise: z
      .string()
      .min(1)
      .describe("Exercise id (e.g. 'cat-cow') or part of its name."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ exercise }) => {
    const q = exercise.trim().toLowerCase();
    const match =
      EXERCISES.find((e) => e.id === q) ??
      EXERCISES.find((e) => e.name.toLowerCase().includes(q)) ??
      EXERCISES.find((e) => e.id.includes(q));

    if (!match) {
      return {
        content: [
          {
            type: "text" as const,
            text: `No exercise matched "${exercise}". Known ids: ${EXERCISES.map((e) => e.id).join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    const text = [
      `${match.name} (${match.id})`,
      `Target: ${match.target} — ${match.xp} XP`,
      "Steps:",
      ...match.steps.map((s, i) => `  ${i + 1}. ${s}`),
      `Cue: ${match.cue}`,
    ].join("\n");

    return { content: [{ type: "text" as const, text }], structuredContent: { exercise: match } };
  },
});
