import { useEffect, useState } from "react";

export function useAnimationTime(enabled: boolean = true) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      setTime(timestamp / 1000);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [enabled]);

  return time;
}
