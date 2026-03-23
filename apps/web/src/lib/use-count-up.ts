import { useEffect, useRef, useState } from "react";

/**
 * Animated counter that eases from 0 to target over `duration` ms.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
export function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const startValue = prevTarget.current;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;

      setValue(Math.round(current));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}
