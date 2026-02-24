import React, { useRef, useEffect } from "react";
import { useImage } from "react-konva-utils";
import { Image, Group, Line, Circle } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useRotation } from "@/app/hooks/useRotation";
import { Ray } from "@/lib/types";
import {
  BEAM_LENGTH,
  BEAM_COLOR,
  BEAM_CORE_WIDTH,
  BEAM_GLOW_WIDTH,
  BEAM_GLOW_OPACITY,
  BEAM_SHADOW_BLUR,
  BEAM_SHADOW_OPACITY,
} from "@/lib/beamConfig";

interface LaserPointerProps {
  position: { x: number; y: number };
  rotation: number;
  onPositionChange: (pos: { x: number; y: number }) => void;
  onRotationChange: (rot: number) => void;
  onBeamChange?: (beam: Ray | null) => void;
}

export default function LaserPointer({
  position,
  rotation,
  onPositionChange,
  onRotationChange,
  onBeamChange,
}: LaserPointerProps) {
  const [image] = useImage("/laserPointer.svg");
  const groupRef = useRef<Konva.Group>(null);

  const { startRotation } = useRotation(groupRef, rotation, onRotationChange);

  // Dimensions & Offsets (depend on loaded image)
  const multiplier = 2;
  const laserWidth = image ? image.width * multiplier : 0;
  const laserHeight = image ? image.height * multiplier : 0;
  const offsetX = laserWidth / 2;
  const offsetY = laserHeight / 2;

  const beamStartX = offsetX + 20;
  const beamStartY = 0;
  const stickLength = 40;

  // Compute and report beam ray whenever position/rotation/image changes
  useEffect(() => {
    if (!image || !onBeamChange) return;
    const rad = (rotation * Math.PI) / 180;
    onBeamChange({
      origin: {
        x: position.x + beamStartX * Math.cos(rad),
        y: position.y + beamStartX * Math.sin(rad),
      },
      direction: {
        x: Math.cos(rad),
        y: Math.sin(rad),
      },
    });
  }, [position.x, position.y, rotation, image, beamStartX, onBeamChange]);

  if (!image) return null;

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
      onDragMove={(e) => onPositionChange({ x: e.target.x(), y: e.target.y() })}
    >
      {/* Laser Beam */}
      <Group listening={false}>
        <Line
          points={[
            beamStartX,
            beamStartY,
            beamStartX + BEAM_LENGTH,
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
            beamStartX + BEAM_LENGTH,
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
