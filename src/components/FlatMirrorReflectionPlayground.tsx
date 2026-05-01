"use client";
import LaserPointer from "@/entities/LaserPointer";
import FlatMirror from "@/entities/FlatMirror";
import {
  MIRROR_THICKNESS,
  MIRROR_POSITION,
  MIRROR_LENGTH,
} from "@/app/configs/flatMirrorConfig";
import { Ray } from "@/lib/types";
import { raySegmentReflection } from "@/lib/physics";
import { PALETTE } from "@/lib/colors";
import { createLaserBeam } from "@/lib/laser";
import { useAnimationTime } from "@/app/hooks/useAnimationTime";
import { useResponsiveStageSize } from "@/app/hooks/useResponsiveStageSize";
import { Layer, Rect, Stage } from "react-konva";
import { useMemo, useState } from "react";
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
  const { stageWidth, stageHeight } = useResponsiveStageSize({
    width,
    height,
  });
  const time = useAnimationTime();

  const [laserPosition, setLaserPosition] = useState(() => ({
    x: stageWidth / 2,
    y: stageHeight / 2,
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

  const hitDistance = useMemo(() => {
    if (!beam) return null;
    const reflection = raySegmentReflection(beam, MIRROR_SEGMENT);
    return reflection?.distance ?? null;
  }, [beam]);

  return (
    <>
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
          width={stageWidth}
          height={stageHeight}
          background={PALETTE.background}
        >
          <Layer>
            <Rect
              width={stageWidth}
              height={stageHeight}
              stroke={PALETTE.background}
            />
            <FlatMirror beam={beam} hitDistance={hitDistance} debug={debug} />

            <LaserPointer
              position={laserPosition}
              rotation={laserRotation}
              hitDistance={hitDistance}
              onPositionChange={setLaserPosition}
              onRotationChange={setLaserRotation}
            />

            {showWave && (
              <WaveBeam beam={beam} hitDistance={hitDistance} time={time} />
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
}
