"use client";
import { useMemo, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useImage } from "react-konva-utils";
import LaserPointer from "@/entities/LaserPointer";
import ConvexMirror from "@/entities/ConvexMirror";
import WaveBeam from "@/entities/WaveBeam";
import {
  CONVEX_MIRROR_LENGTH,
  CONVEX_MIRROR_POSITION,
  CONVEX_MIRROR_RADIUS,
  CONVEX_MIRROR_THICKNESS,
} from "@/app/configs/convexMirrorConfig";
import { useAnimationTime } from "@/app/hooks/useAnimationTime";
import { useResponsiveStageSize } from "@/app/hooks/useResponsiveStageSize";
import { createLaserBeam } from "@/lib/laser";
import { rayCircleArcReflection } from "@/lib/physics";
import { Ray } from "@/lib/types";

const ARC_HALF_ANGLE = Math.asin(
  CONVEX_MIRROR_LENGTH / (2 * CONVEX_MIRROR_RADIUS),
);
const ARC_START_ANGLE = Math.PI - ARC_HALF_ANGLE;
const ARC_END_ANGLE = Math.PI + ARC_HALF_ANGLE;

const CONVEX_MIRROR_ARC = {
  center: {
    x:
      CONVEX_MIRROR_POSITION.x +
      (CONVEX_MIRROR_RADIUS - CONVEX_MIRROR_THICKNESS / 2),
    y: CONVEX_MIRROR_POSITION.y,
  },
  radius: CONVEX_MIRROR_RADIUS,
  startAngle: ARC_START_ANGLE,
  endAngle: ARC_END_ANGLE,
};

const INITIAL_LASER_ANGLE = -20;

export default function ConvexMirrorReflectionPlayground({
  module,
  width,
  height,
  showWave = true,
}: {
  module: string;
  width?: number;
  height?: number;
  showWave?: boolean;
}) {
  void module;

  const { stageWidth, stageHeight } = useResponsiveStageSize({
    width,
    height,
  });
  const time = useAnimationTime();

  const [laserPosition, setLaserPosition] = useState(() => ({
    x: stageWidth / 4, // Tucked the laser slightly further left
    y: stageHeight / 1.5,
  }));
  const [laserRotation, setLaserRotation] = useState(INITIAL_LASER_ANGLE);
  const [debug, setDebug] = useState(false);
  const [image] = useImage("/laserPointer.svg");

  const beam = useMemo<Ray | null>(() => {
    return createLaserBeam({
      image,
      position: laserPosition,
      rotation: laserRotation,
    });
  }, [image, laserPosition, laserRotation]);

  const reflection = useMemo(() => {
    if (!beam) return null;
    return rayCircleArcReflection(beam, CONVEX_MIRROR_ARC);
  }, [beam]);

  const hitDistance = reflection?.distance ?? null;

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <label className="text-xs sm:text-sm">
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
          />
          Debug Mode
        </label>
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Rect width={stageWidth} height={stageHeight} fill={"#262626"} />
            <ConvexMirror beam={beam} hitDistance={hitDistance} debug={debug} />
            <LaserPointer
              position={laserPosition}
              rotation={laserRotation}
              hitDistance={hitDistance}
              onPositionChange={setLaserPosition}
              onRotationChange={setLaserRotation}
            />

            {showWave && (
              <WaveBeam
                beam={beam}
                hitDistance={hitDistance}
                time={time}
                reflectedDirection={reflection?.reflected ?? null}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
}
