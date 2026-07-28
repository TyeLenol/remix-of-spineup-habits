export interface Exercise {
  id: string;
  name: string;
  /** target duration, human readable */
  target: string;
  xp: number;
  steps: string[];
  cue: string;
}

/** Evidence-informed scoliosis rehabilitation routine (8 movements). */
export const EXERCISES: Exercise[] = [
  {
    id: "cat-cow",
    name: "Cat-cow mobilization",
    target: "90 seconds",
    xp: 15,
    steps: [
      "Start on hands and knees, wrists under shoulders.",
      "Inhale and let the belly drop as the chest opens.",
      "Exhale and round the spine one vertebra at a time.",
    ],
    cue: "Move from the breath, not the arms — the spine leads.",
  },
  {
    id: "side-plank",
    name: "Side-plank core hold",
    target: "30 seconds each side",
    xp: 20,
    steps: [
      "Lie on your side, elbow under the shoulder.",
      "Lift the hips until head, hips and heels line up.",
      "Hold, breathe, then lower with control.",
    ],
    cue: "Hold longer on your convex side if your clinician advised it.",
  },
  {
    id: "hamstring-wall",
    name: "Hamstring wall stretch",
    target: "60 seconds each leg",
    xp: 10,
    steps: [
      "Lie on your back beside a doorway.",
      "Rest one leg up the wall, the other flat along the floor.",
      "Keep the pelvis level and breathe into the stretch.",
    ],
    cue: "Stop at a gentle pull, never a sharp pinch behind the knee.",
  },
  {
    id: "thoracic-ext",
    name: "Thoracic extension",
    target: "8 slow repetitions",
    xp: 15,
    steps: [
      "Sit tall or lie over a rolled towel at mid-back.",
      "Lift the breastbone and open the upper back.",
      "Return slowly to neutral.",
    ],
    cue: "Extend from the ribs — don't hinge at the lower back.",
  },
  {
    id: "bird-dog",
    name: "Bird-dog core balance",
    target: "10 repetitions each side",
    xp: 20,
    steps: [
      "On hands and knees, brace the trunk lightly.",
      "Reach the opposite arm and leg out long.",
      "Pause, then swap sides without rocking the hips.",
    ],
    cue: "Imagine balancing a glass of water on your lower back.",
  },
  {
    id: "pelvic-bridge",
    name: "Pelvic tilt and bridge",
    target: "12 repetitions",
    xp: 15,
    steps: [
      "Lie on your back, knees bent, feet hip-width.",
      "Flatten the lower back, then peel the hips upward.",
      "Lower one vertebra at a time.",
    ],
    cue: "Drive through the heels and keep the ribs down.",
  },
  {
    id: "childs-pose",
    name: "Child's pose and side reach",
    target: "60 seconds each side",
    xp: 10,
    steps: [
      "Sit hips toward the heels, arms reaching forward.",
      "Walk both hands to one side to open the ribcage.",
      "Breathe into the stretched side, then swap.",
    ],
    cue: "Send the breath into the side you can feel opening.",
  },
  {
    id: "wall-angels",
    name: "Wall angels",
    target: "10 repetitions",
    xp: 15,
    steps: [
      "Stand with back, head and hips against a wall.",
      "Place arms in a goalpost shape touching the wall.",
      "Slide the arms up and down without losing contact.",
    ],
    cue: "Keep the lower back close to the wall the whole time.",
  },
];

export const DAILY_XP_GOAL = 60;
