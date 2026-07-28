import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "about_spineup",
  title: "About SpineUp",
  description:
    "Describe what SpineUp is, its four sections, and how it stores data. Useful for orienting before calling other tools.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text" as const,
        text: [
          "SpineUp is a scoliosis habit-tracking and health-monitoring app.",
          "Sections: Today (daily check-in, rehabilitation routine, XP), My journey (Cobb angle and activity log), Community (peer support), Me (profile and milestone badges).",
          "Personal check-ins, XP and streaks are stored on the user's own device and are not available through this server — only the reference exercise library and gamification rules are.",
          "SpineUp is educational and does not replace clinical advice.",
        ].join("\n"),
      },
    ],
  }),
});
