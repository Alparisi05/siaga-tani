import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value, duration = 1500, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end)) return;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalDuration = duration;
    const startTime = performance.now();
    let animationFrameId;

    const updateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * end);

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}
