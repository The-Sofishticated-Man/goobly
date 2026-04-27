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
} from "@/app/configs/flatMirrorConfig";
import { Ray } from "@/lib/types";
import { raySegmentReflection } from "@/lib/physics";
import { PALETTE } from "@/lib/colors";
import { Layer, Rect, Stage } from "react-konva";
import { useMemo, useState, useEffect } from "react";
import { useImage } from "react-konva-utils";
import WaveBeam from "@/entities/WaveBeam";

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

const INITIAL_LASER_ANGLE = -30;

export default function FlatMirrorReflectionPlayground({
  width,
  height,
  showWave = true,
}: {
  width?: number;
  height?: number;
  showWave?: boolean;
}) {
  const [containerSize] = useState({
    width: width || 500,
    height: height || 400,
  });
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  const [time, setTime] = useState(0);

  // --- NEW: State to track if the wave should be shown ---
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
  const [laserRotation, setLaserRotation] = useState(INITIAL_LASER_ANGLE);
  const [debug, setDebug] = useState(false);
  const [image] = useImage("/laserPointer.svg");

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

  const hitDistance = useMemo(() => {
    if (!beam) return null;
    const reflection = raySegmentReflection(beam, MIRROR_SEGMENT);
    return reflection?.distance ?? null;
  }, [beam]);

  return (
    <>
      {/* Updated UI Container to hold the checkbox and the new buttons */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label className="text-xs sm:text-sm bg-white/50 p-1 rounded w-max">
          <input
            type="checkbox"
            checked={debug}
            onChange={(e) => setDebug(e.target.checked)}
            className="mr-1"
          />
          Debug Mode
        </label>
      </div>

      <div className="w-full h-full flex justify-center items-center">
        <Stage
          width={responsiveWidth}
          height={responsiveHeight}
          background={PALETTE.background}
        >
          <Layer>
            <Rect
              width={responsiveWidth}
              height={responsiveHeight}
              stroke={PALETTE.background}
            />
            <FlatMirror beam={beam} hitDistance={hitDistance} debug={debug} />

            {/* The base Ray laser pointer */}
            <LaserPointer
              position={laserPosition}
              rotation={laserRotation}
              hitDistance={hitDistance}
              onPositionChange={setLaserPosition}
              onRotationChange={setLaserRotation}
            />

            {/* --- NEW: Conditionally render the wave based on state --- */}
            {showWave && (
              <WaveBeam beam={beam} hitDistance={hitDistance} time={time} />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
}
