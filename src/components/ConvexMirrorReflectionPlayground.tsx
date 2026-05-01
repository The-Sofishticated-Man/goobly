"use client";
import { useMemo, useState, useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useImage } from "react-konva-utils";
import LaserPointer from "@/entities/LaserPointer";
import ConvexMirror from "@/entities/ConvexMirror";
import WaveBeam from "@/entities/WaveBeam";
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

  const [containerSize] = useState({
    width: width || 500,
    height: height || 400,
  });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const [time, setTime] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = (timestamp: number) => {
      setTime(timestamp / 1000);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Back to normal responsive width scaling
  const responsiveWidth = Math.min(
    containerSize.width,
    Math.max(250, windowSize.width * 0.9),
  );

  const responsiveHeight = Math.min(
    containerSize.height,
    Math.max(200, windowSize.height * 0.9),
  );

  const [laserPosition, setLaserPosition] = useState({
    x: responsiveWidth / 4, // Tucked the laser slightly further left
    y: responsiveHeight / 1.5,
  });
  const [laserRotation, setLaserRotation] = useState(INITIAL_LASER_ANGLE);
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

    const reflection = rayCircleArcReflection(beam, CONVEX_MIRROR_ARC);
    const distance = reflection?.distance ?? null;

    let reflectedDirection = null;
    if (distance !== null) {
      const hitX = beam.origin.x + beam.direction.x * distance;
      const hitY = beam.origin.y + beam.direction.y * distance;

      const nx = hitX - CONVEX_MIRROR_ARC.center.x;
      const ny = hitY - CONVEX_MIRROR_ARC.center.y;

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
                reflectedDirection={hitInfo?.reflectedDirection}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
}
