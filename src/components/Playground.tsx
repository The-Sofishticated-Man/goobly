"use client";
import LaserPointer from "@/entities/LaserPointer";
import Mirror from "@/entities/Mirror";
import { Ray } from "@/lib/types";
import { Layer, Rect, Stage } from "react-konva";
import { useCallback, useState } from "react";

export default function Playground({ module }: { module: string }) {
  const [laserPosition, setLaserPosition] = useState({ x: 200, y: 100 });
  const [laserRotation, setLaserRotation] = useState(10);
  const [beam, setBeam] = useState<Ray | null>(null);
  const [debug, setDebug] = useState(false);

  const handleBeamChange = useCallback((b: Ray | null) => setBeam(b), []);

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
          />
          Debug Mode
        </label>
      </div>
      <Stage width={1800} height={800} background={"#f0f0f0"}>
        <Layer>
          <Rect width={1800} height={800} stroke={"#f0f0f0"} />
          <LaserPointer
            position={laserPosition}
            rotation={laserRotation}
            onPositionChange={setLaserPosition}
            onRotationChange={setLaserRotation}
            onBeamChange={handleBeamChange}
          />
          <Mirror beam={beam} debug={debug} />
        </Layer>
      </Stage>
    </>
  );
}
