import React, { useRef } from "react";
import { useImage } from "react-konva-utils";
import { Image, Group, Line, Circle } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useRotation } from "@/app/hooks/useRotation";
import { useSmoothPosition } from "@/app/hooks/useSmoothPosition";
import {
  BEAM_LENGTH,
  BEAM_COLOR,
  BEAM_CORE_WIDTH,
  BEAM_GLOW_WIDTH,
  BEAM_GLOW_OPACITY,
  BEAM_SHADOW_BLUR,
  BEAM_SHADOW_OPACITY,
} from "@/lib/beamConfig";

export const LASER_MULTIPLIER = 2;
export const LASER_BEAM_OFFSET = 20;

interface LaserPointerProps {
  position: { x: number; y: number };
  rotation: number;
  hitDistance?: number | null;
  onPositionChange: (pos: { x: number; y: number }) => void;
  onRotationChange: (rot: number) => void;
}

export default function LaserPointer({
  position,
  rotation,
  hitDistance,
  onPositionChange,
  onRotationChange,
}: LaserPointerProps) {
  const [image] = useImage("/laserPointer.svg");
  const groupRef = useRef<Konva.Group>(null);

  const { startRotation } = useRotation(groupRef, rotation, onRotationChange);
  const { handleDragMove, handleDragStart, handleDragEnd } = useSmoothPosition(
    position,
    onPositionChange,
  );

  if (!image) return null;

  // Dimensions & Offsets
  const multiplier = LASER_MULTIPLIER;
  const laserWidth = image.width * multiplier;
  const laserHeight = image.height * multiplier;
  const offsetX = laserWidth / 2;
  const offsetY = laserHeight / 2;

  const beamStartX = offsetX + LASER_BEAM_OFFSET;
  const beamStartY = 0;
  const stickLength = 40;

  const setCursor = (e: KonvaEventObject<MouseEvent>, cursorType: string) => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = cursorType;
  };

  return (
    <Group
      ref={groupRef}
      x={position.x}
      y={position.y}
      rotation={rotation}
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      {/* Laser Beam */}
      <Group listening={false}>
        {/* Solid beam (up to mirror hit, or full length) */}
        <Line
          points={[
            beamStartX,
            beamStartY,
            beamStartX + (hitDistance ?? BEAM_LENGTH),
            beamStartY,
          ]}
          stroke={BEAM_COLOR}
          strokeWidth={BEAM_GLOW_WIDTH}
          opacity={BEAM_GLOW_OPACITY}
          lineCap="round"
        />
        <Line
          points={[
            beamStartX,
            beamStartY,
            beamStartX + (hitDistance ?? BEAM_LENGTH),
            beamStartY,
          ]}
          stroke={BEAM_COLOR}
          strokeWidth={BEAM_CORE_WIDTH}
          opacity={1}
          lineCap="round"
          shadowColor={BEAM_COLOR}
          shadowBlur={BEAM_SHADOW_BLUR}
          shadowOpacity={BEAM_SHADOW_OPACITY}
        />

        {/* Faded dashed beam past the mirror */}
        {hitDistance != null && (
          <Line
            points={[
              beamStartX + hitDistance,
              beamStartY,
              beamStartX + BEAM_LENGTH,
              beamStartY,
            ]}
            stroke={BEAM_COLOR}
            strokeWidth={BEAM_CORE_WIDTH / 2}
            opacity={0.15}
            lineCap="round"
            dash={[12, 8]}
          />
        )}
      </Group>

      {/* Laser Pointer Image */}
      <Image
        image={image}
        x={-offsetX}
        y={-offsetY}
        width={laserWidth}
        height={laserHeight}
        onMouseEnter={(e) => setCursor(e, "move")}
        onMouseLeave={(e) => setCursor(e, "default")}
      />

      {/* Lollipop Stick */}
      <Line
        points={[-offsetX, 0, -offsetX - stickLength, 0]}
        stroke="#0096ff"
        strokeWidth={2}
      />

      {/* Lollipop Handle */}
      <Circle
        x={-offsetX - stickLength}
        y={0}
        radius={8}
        fill="#ffffff"
        stroke="#0096ff"
        strokeWidth={3}
        onMouseEnter={(e) => setCursor(e, "grab")}
        onMouseLeave={(e) => setCursor(e, "default")}
        onMouseDown={startRotation}
        onTouchStart={startRotation}
      />
    </Group>
  );
}
