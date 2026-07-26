import { motion } from "motion/react";

export type SpryPose = "idle" | "charging" | "dragging" | "excited" | "waving";

type Props = {
  pose?: SpryPose;
  size?: number;
  className?: string;
};

export function Spry({ pose = "idle", size = 220, className }: Props) {
  const armFlap = pose === "excited";
  const squish = pose === "charging" ? 0.94 : pose === "excited" ? 1.05 : 1;
  const eyeSquint = pose === "charging" || pose === "excited";

  return (
    <motion.svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      animate={{
        scaleY: squish,
        scaleX: 2 - squish,
        rotate: pose === "dragging" ? [-2, 2, -2] : 0,
      }}
      transition={{ duration: pose === "dragging" ? 0.8 : 0.35, repeat: pose === "dragging" ? Infinity : 0 }}
      style={{ transformOrigin: "50% 70%" }}
      aria-hidden
    >
      {/* shadow */}
      <ellipse cx="100" cy="178" rx="52" ry="7" fill="oklch(0 0 0 / 0.18)" />
      {/* back arm */}
      <motion.ellipse
        cx="42"
        cy="118"
        rx="18"
        ry="14"
        fill="var(--sage-ink)"
        animate={armFlap ? { y: [0, -8, 0] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <motion.ellipse
        cx="158"
        cy="118"
        rx="18"
        ry="14"
        fill="var(--sage-ink)"
        animate={armFlap ? { y: [0, -8, 0] } : {}}
        transition={{ duration: 0.3, repeat: Infinity, delay: 0.15 }}
      />
      {/* body */}
      <ellipse cx="100" cy="110" rx="70" ry="68" fill="var(--sage)" />
      {/* body highlight */}
      <ellipse cx="76" cy="88" rx="24" ry="16" fill="oklch(1 0 0 / 0.25)" />
      {/* cheeks */}
      <ellipse cx="58" cy="128" rx="12" ry="8" fill="oklch(0.68 0.20 32 / 0.35)" />
      <ellipse cx="142" cy="128" rx="12" ry="8" fill="oklch(0.68 0.20 32 / 0.35)" />
      {/* eyes */}
      <motion.g
        animate={eyeSquint ? { scaleY: 0.6 } : { scaleY: [1, 1, 0.1, 1] }}
        transition={
          eyeSquint
            ? { duration: 0.2 }
            : { duration: 4, times: [0, 0.92, 0.96, 1], repeat: Infinity }
        }
        style={{ transformOrigin: "100px 108px" }}
      >
        <ellipse cx="80" cy="108" rx="6" ry="12" fill="var(--warm-ink)" />
        <ellipse cx="120" cy="108" rx="6" ry="12" fill="var(--warm-ink)" />
      </motion.g>
    </motion.svg>
  );
}