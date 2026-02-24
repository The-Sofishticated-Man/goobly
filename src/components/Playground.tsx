"use client";
import LaserPointer, {
  LASER_MULTIPLIER,
  LASER_BEAM_OFFSET,
} from "@/entities/LaserPointer";
import Mirror, { MIRROR_LENGTH, MIRROR_POSITION } from "@/entities/Mirror";
import { MIRROR_THICKNESS } from "@/app/configs/mirrorConfig";
import { Ray } from "@/lib/types";
import { raySegmentReflection } from "@/lib/physics";
import { Layer, Rect, Stage } from "react-konva";
import { useMemo, useState } from "react";
import { useImage } from "react-konva-utils";

const MIRROR_SEGMENT = {
  start: {
    x: MIRROR_POSITION.x - MIRROR_THICKNESS / 2,
    y: MIRROR_POSITION.y - MIRROR_LENGTH / 2,
  },
  end: {
    x: MIRROR_POSITION.x - MIRROR_THICKNESS / 2,
    y: MIRROR_POSITION.y + MIRROR_LENGTH / 2,
  },
};

export default function Playground({ module }: { module: string }) {
  const [laserPosition, setLaserPosition] = useState({ x: 200, y: 100 });
  const [laserRotation, setLaserRotation] = useState(10);
  const [debug, setDebug] = useState(false);
  const [image] = useImage("/laserPointer.svg");

  // Compute beam synchronously — no useEffect delay
  const beam = useMemo<Ray | null>(() => {
    if (!image) return null;
    const beamStartX = (image.width * LASER_MULTIPLIER) / 2 + LASER_BEAM_OFFSET;
    const rad = (laserRotation * Math.PI) / 180;
    return {
      origin: {
        x: laserPosition.x + beamStartX * Math.cos(rad),
        y: laserPosition.y + beamStartX * Math.sin(rad),
      },
      direction: { x: Math.cos(rad), y: Math.sin(rad) },
    };
  }, [laserPosition.x, laserPosition.y, laserRotation, image]);

  // Compute intersection synchronously — same render frame
  const hitDistance = useMemo(() => {
    if (!beam) return null;
    const reflection = raySegmentReflection(beam, MIRROR_SEGMENT);
    return reflection?.distance ?? null;
  }, [beam]);

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
          <Mirror beam={beam} hitDistance={hitDistance} debug={debug} />
          <LaserPointer
            position={laserPosition}
            rotation={laserRotation}
            hitDistance={hitDistance}
            onPositionChange={setLaserPosition}
            onRotationChange={setLaserRotation}
          />
        </Layer>
      </Stage>
    </>
  );
}
