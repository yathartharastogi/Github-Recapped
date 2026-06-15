"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
}

export function AnimatedCounter({ value }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 70,
  });

  useEffect(() => {
    motionValue.set(0);
    const controls = animate(motionValue, value, { duration: 2.0, ease: "easeOut" });
    return () => controls.stop();
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}
