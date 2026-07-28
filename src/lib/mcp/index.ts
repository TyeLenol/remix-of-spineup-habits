import { defineMcp } from "@lovable.dev/mcp-js";
import aboutSpineup from "./tools/about-spineup";
import listExercises from "./tools/list-exercises";
import getExercise from "./tools/get-exercise";
import getProgressRules from "./tools/get-progress-rules";

export default defineMcp({
  name: "spineup-mcp",
  title: "SpineUp",
  version: "0.1.0",
  instructions:
    "Reference tools for SpineUp, a scoliosis habit-tracking app. Use `about_spineup` for context, `list_exercises` and `get_exercise` for the rehabilitation routine, and `get_progress_rules` for XP and level maths. No personal user data is exposed — check-ins stay on the user's device.",
  tools: [aboutSpineup, listExercises, getExercise, getProgressRules],
});
