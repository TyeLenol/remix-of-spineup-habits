import { defineTool } from "@lovable.dev/mcp-js";
import { EXERCISES } from "@/lib/exercises";

export default defineTool({
  name: "list_exercises",
  title: "List rehabilitation exercises",
  description:
    "List every scoliosis rehabilitation exercise in the SpineUp routine, with target duration and XP value.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = EXERCISES.map((e) => ({
      id: e.id,
      name: e.name,
      target: e.target,
      xp: e.xp,
    }));
    return {
      content: [
        {
          type: "text" as const,
          text: rows
            .map((r) => `${r.id} — ${r.name} (${r.target}, ${r.xp} XP)`)
            .join("\n"),
        },
      ],
      structuredContent: { exercises: rows },
    };
  },
});
