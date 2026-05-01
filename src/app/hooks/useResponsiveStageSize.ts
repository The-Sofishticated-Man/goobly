import { useEffect, useState } from "react";

interface Size {
  width: number;
  height: number;
}

interface Options {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidthRatio?: number;
  maxHeightRatio?: number;
}

const FALLBACK_WINDOW: Size = { width: 1024, height: 768 };

function getWindowSize(): Size {
  if (typeof window === "undefined") {
    return FALLBACK_WINDOW;
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

export function useResponsiveStageSize(options: Options = {}) {
  const {
    width,
    height,
    minWidth = 250,
    minHeight = 200,
    maxWidthRatio = 0.9,
    maxHeightRatio = 0.9,
  } = options;

  const resolvedWidth = width || 500;
  const resolvedHeight = height || 400;

  const [windowSize, setWindowSize] = useState<Size>(() => getWindowSize());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stageWidth = Math.min(
    resolvedWidth,
    Math.max(minWidth, windowSize.width * maxWidthRatio),
  );

  const stageHeight = Math.min(
    resolvedHeight,
    Math.max(minHeight, windowSize.height * maxHeightRatio),
  );

  return { stageWidth, stageHeight };
}
