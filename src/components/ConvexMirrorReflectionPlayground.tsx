"use client";
import { useMemo, useState, useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useImage } from "react-konva-utils";
import LaserPointer from "@/entities/LaserPointer";
import ConvexMirror from "@/entities/ConvexMirror";
import {
  LASER_SIZE_MULTIPLIER,
  LASER_BEAM_OFFSET,
} from "@/app/configs/laserPointerConfig";
import {
  CONVEX_MIRROR_LENGTH,
  CONVEX_MIRROR_POSITION,
  CONVEX_MIRROR_RADIUS,
  CONVEX_MIRROR_THICKNESS,
} from "@/app/configs/convexMirrorConfig";
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

export default function ConvexMirrorReflectionPlayground({
  module,
  width,
  height,
}: {
  module: string;
  width?: number;
  height?: number;
}) {
  void module;

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
    x: responsiveWidth / 2,
    y: responsiveHeight / 2,
  });
  const [laserRotation, setLaserRotation] = useState(10);
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

  const hitDistance = useMemo(() => {
    if (!beam) return null;

    const reflection = rayCircleArcReflection(beam, CONVEX_MIRROR_ARC);
    return reflection?.distance ?? null;
  }, [beam]);

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
            <ConvexMirror beam={beam} hitDistance={hitDistance} debug={debug} />
            <LaserPointer
              position={laserPosition}
              rotation={laserRotation}
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
