"use client";
import { useMemo, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useImage } from "react-konva-utils";
import LaserPointer from "@/entities/LaserPointer";
import ConcaveMirror from "@/entities/ConcaveMirror";
import { LASER_INITIAL_ANGLE } from "@/app/configs/laserPointerConfig";
import {
  CONCAVE_MIRROR_LENGTH,
  CONCAVE_MIRROR_POSITION,
  CONCAVE_MIRROR_RADIUS,
  CONCAVE_MIRROR_THICKNESS,
} from "@/app/configs/concaveMirrorConfig";
import { useResponsiveStageSize } from "@/app/hooks/useResponsiveStageSize";
import { createLaserBeam } from "@/lib/laser";
import { rayCircleArcReflection } from "@/lib/physics";
import { Ray } from "@/lib/types";

// --- Arc geometry ---
// For a concave mirror, the center of curvature sits BEHIND the reflective
// surface (to the LEFT, toward the incoming light), so the normals point inward.
const ARC_HALF_ANGLE = Math.asin(
  CONCAVE_MIRROR_LENGTH / (2 * CONCAVE_MIRROR_RADIUS),
);
const ARC_START_ANGLE = -ARC_HALF_ANGLE; // right-side arc, not left
const ARC_END_ANGLE = ARC_HALF_ANGLE;

// The center of curvature is offset LEFT from the mirror face,
// placing it on the same side as the incoming laser.
const CONCAVE_MIRROR_ARC = {
  center: {
    x:
      CONCAVE_MIRROR_POSITION.x -
      CONCAVE_MIRROR_RADIUS +
      CONCAVE_MIRROR_THICKNESS / 2,
    y: CONCAVE_MIRROR_POSITION.y,
  },
  radius: CONCAVE_MIRROR_RADIUS,
  startAngle: ARC_START_ANGLE,
  endAngle: ARC_END_ANGLE,
};

// Focal point is at R/2 in front of the mirror surface
const FOCAL_POINT = {
  x:
    CONCAVE_MIRROR_POSITION.x -
    CONCAVE_MIRROR_RADIUS / 2 +
    CONCAVE_MIRROR_THICKNESS / 2,
  y: CONCAVE_MIRROR_POSITION.y,
};

export default function ConcaveMirrorReflectionPlayground({
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
  void showWave;

  const { stageWidth, stageHeight } = useResponsiveStageSize({
    width,
    height,
  });

  const [laserPosition, setLaserPosition] = useState(() => ({
    x: stageWidth / 4,
    y: stageHeight / 2,
  }));
  const [laserRotation, setLaserRotation] = useState(LASER_INITIAL_ANGLE);
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
    return rayCircleArcReflection(beam, CONCAVE_MIRROR_ARC);
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
            {/* Pass focalPoint so ConcaveMirror can render the F marker */}
            <ConcaveMirror
              beam={beam}
              hitDistance={hitDistance}
              debug={debug}
              focalPoint={FOCAL_POINT}
            />
            <LaserPointer
              position={laserPosition}
              rotation={laserRotation}
              rotatable={false}
              hitDistance={hitDistance}
              onPositionChange={setLaserPosition}
              onRotationChange={setLaserRotation}
            />
          </Layer>
        </Stage>
      </div>
    </>
  );
}
