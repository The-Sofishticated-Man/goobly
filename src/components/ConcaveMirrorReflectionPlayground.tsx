"use client";
import { useMemo, useState, useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useImage } from "react-konva-utils";
import LaserPointer from "@/entities/LaserPointer";
import ConcaveMirror from "@/entities/ConcaveMirror";
import {
  LASER_SIZE_MULTIPLIER,
  LASER_BEAM_OFFSET,
  LASER_INITIAL_ANGLE,
} from "@/app/configs/laserPointerConfig";
import {
  CONCAVE_MIRROR_LENGTH,
  CONCAVE_MIRROR_POSITION,
  CONCAVE_MIRROR_RADIUS,
  CONCAVE_MIRROR_THICKNESS,
} from "@/app/configs/concaveMirrorConfig";
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

  const [containerSize] = useState({
    width: width || 500,
    height: height || 400,
  });

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsiveWidth = Math.min(
    containerSize.width,
    Math.max(250, windowSize.width * 0.9),
  );
  const responsiveHeight = Math.min(
    containerSize.height,
    Math.max(200, windowSize.height * 0.9),
  );

  const [laserPosition, setLaserPosition] = useState({
    x: responsiveWidth / 4,
    y: responsiveHeight / 2,
  });
  const [laserRotation, setLaserRotation] = useState(LASER_INITIAL_ANGLE);
  const [debug, setDebug] = useState(false);
  const [image] = useImage("/laserPointer.svg");

  const beam = useMemo<Ray | null>(() => {
    if (!image) return null;

    const beamStartX =
      (image.width * LASER_SIZE_MULTIPLIER) / 2 + LASER_BEAM_OFFSET;
    const radians = (laserRotation * Math.PI) / 180;

    return {
      origin: {
        x: laserPosition.x + beamStartX * Math.cos(radians),
        y: laserPosition.y + beamStartX * Math.sin(radians),
      },
      direction: { x: Math.cos(radians), y: Math.sin(radians) },
    };
  }, [laserPosition.x, laserPosition.y, laserRotation, image]);

  const hitInfo = useMemo(() => {
    if (!beam) return null;

    const reflection = rayCircleArcReflection(beam, CONCAVE_MIRROR_ARC);
    const distance = reflection?.distance ?? null;

    let reflectedDirection = null;
    if (distance !== null) {
      const hitX = beam.origin.x + beam.direction.x * distance;
      const hitY = beam.origin.y + beam.direction.y * distance;

      // For concave: normal points FROM the hit point TOWARD the center of
      // curvature (inward), so we flip the direction vs. convex.
      const nx = CONCAVE_MIRROR_ARC.center.x - hitX;
      const ny = CONCAVE_MIRROR_ARC.center.y - hitY;

      const len = Math.sqrt(nx * nx + ny * ny);
      const nux = nx / len;
      const nuy = ny / len;

      const dot = beam.direction.x * nux + beam.direction.y * nuy;
      reflectedDirection = {
        x: beam.direction.x - 2 * dot * nux,
        y: beam.direction.y - 2 * dot * nuy,
      };
    }

    return { distance, reflectedDirection };
  }, [beam]);

  const hitDistance = hitInfo?.distance ?? null;

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
        <Stage width={responsiveWidth} height={responsiveHeight}>
          <Layer>
            <Rect
              width={responsiveWidth}
              height={responsiveHeight}
              fill={"#262626"}
            />
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
