"use client";
import LaserPointer from "@/entities/LaserPointer";
import {
  LASER_SIZE_MULTIPLIER,
  LASER_BEAM_OFFSET,
} from "@/app/configs/laserPointerConfig";
import FlatMirror from "@/entities/FlatMirror";
import {
  MIRROR_THICKNESS,
  MIRROR_POSITION,
  MIRROR_LENGTH,
} from "@/app/configs/mirrorConfig";
import { Ray } from "@/lib/types";
import { raySegmentReflection } from "@/lib/physics";
import { Layer, Rect, Stage } from "react-konva";
import { useMemo, useState, useEffect } from "react";
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

export default function FlatMirrorReflectionPlayground({
  module,
  width,
  height,
}: {
  module: string;
  width?: number;
  height?: number;
}) {
  const [containerSize, setContainerSize] = useState({
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

  // Calculate responsive dimensions
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

  // Compute beam synchronously — no useEffect delay
  const beam = useMemo<Ray | null>(() => {
    if (!image) return null;
    const beamStartX =
      (image.width * LASER_SIZE_MULTIPLIER) / 2 + LASER_BEAM_OFFSET;
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
        <Stage
          width={responsiveWidth}
          height={responsiveHeight}
          background={"#262626"}
        >
          <Layer>
            <Rect
              width={responsiveWidth}
              height={responsiveHeight}
              stroke={"#262626"}
            />
            <FlatMirror beam={beam} hitDistance={hitDistance} debug={debug} />
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
