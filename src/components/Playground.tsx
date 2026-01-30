"use client";
import { ReflectionOfLightExperiment } from "@/modules/ReflectionOfLightExperiment";
import { useEffect, useRef } from "react";

export default function Playground({ module }: { module: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const experimentRef = useRef<ReflectionOfLightExperiment | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const experiment = new ReflectionOfLightExperiment(
      canvasRef.current,
      700,
      500,
      0xffffff
    );
    experimentRef.current = experiment;

    experiment.init().catch((err) => {
      // handle/log errors (don't crash the UI)
      console.error("Experiment init failed:", err);
    });

    return () => {
      experimentRef.current?.destroy();
      experimentRef.current = null;
    };
    // intentionally empty deps — canvasRef doesn't change
  }, []);

  return <canvas ref={canvasRef} />;
}
