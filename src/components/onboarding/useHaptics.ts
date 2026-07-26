export function useHaptics() {
  return {
    tick: () => {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(10);
      }
    },
    success: () => {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([15, 40, 30]);
      }
    },
  };
}