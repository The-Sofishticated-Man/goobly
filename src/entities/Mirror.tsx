import React, { useEffect } from "react";
import { Group, Line, Rect, Circle } from "react-konva";
import { Ray } from "@/lib/types";
import { raySegmentReflection } from "@/lib/physics";
import {
  BEAM_LENGTH,
  BEAM_COLOR,
  BEAM_CORE_WIDTH,
  BEAM_GLOW_WIDTH,
  BEAM_GLOW_OPACITY,
  BEAM_SHADOW_BLUR,
  BEAM_SHADOW_OPACITY,
} from "@/lib/beamConfig";

const MIRROR_LENGTH = 400;
const MIRROR_THICKNESS = 8;
const MIRROR_POSITION = { x: 1550, y: 400 };

export default function Mirror({
  beam,
  onIntersect,
  debug = false,
}: {
  beam: Ray | null;
  onIntersect?: (distance: number | null) => void;
  debug?: boolean;
}) {
  const { x: mx, y: my } = MIRROR_POSITION;

  // Mirror surface segment in world space
  const segment = {
    start: { x: mx, y: my - MIRROR_LENGTH / 2 },
    end: { x: mx, y: my + MIRROR_LENGTH / 2 },
  };

  const reflection = beam ? raySegmentReflection(beam, segment) : null;

  useEffect(() => {
    if (debug && beam) {
      console.log("Beam:", beam);
      console.log("Reflection:", reflection);
    }
  }, [debug, beam, reflection]);

  useEffect(() => {
    onIntersect?.(reflection?.distance ?? null);
  }, [reflection?.distance, onIntersect]);

  return (
    <Group x={mx} y={my}>
      {/* Mirror surface */}
      <Rect
        x={-MIRROR_THICKNESS / 2}
        y={-MIRROR_LENGTH / 2}
        width={MIRROR_THICKNESS}
        height={MIRROR_LENGTH}
        fill="#c0c0c0"
        stroke="#808080"
        strokeWidth={2}
        cornerRadius={2}
        listening={false}
      />

      {/* Mirror frame edge */}
      <Line
        points={[
          MIRROR_THICKNESS / 2,
          -MIRROR_LENGTH / 2,
          MIRROR_THICKNESS / 2,
          MIRROR_LENGTH / 2,
        ]}
        stroke="#404040"
        strokeWidth={1}
        opacity={0.6}
        listening={false}
      />

      {/* Reflected beam */}
      {reflection && (
        <ReflectedBeam
          intersection={reflection.intersection}
          direction={reflection.reflected}
          mirrorPosition={MIRROR_POSITION}
        />
      )}

      {/* Debug visuals */}
      {debug && beam && (
        <DebugOverlay
          beam={beam}
          reflection={reflection}
          mirrorPosition={MIRROR_POSITION}
        />
      )}
    </Group>
  );
}

function ReflectedBeam({
  intersection,
  direction,
  mirrorPosition,
}: {
  intersection: { x: number; y: number };
  direction: { x: number; y: number };
  mirrorPosition: { x: number; y: number };
}) {
  const localStartX = intersection.x - mirrorPosition.x;
  const localStartY = intersection.y - mirrorPosition.y;
  const localEndX = localStartX + direction.x * BEAM_LENGTH;
  const localEndY = localStartY + direction.y * BEAM_LENGTH;
  const points = [localStartX, localStartY, localEndX, localEndY];

  return (
    <Group listening={false}>
      <Line
        points={points}
        stroke={BEAM_COLOR}
        strokeWidth={BEAM_GLOW_WIDTH}
        opacity={BEAM_GLOW_OPACITY}
        lineCap="round"
      />
      <Line
        points={points}
        stroke={BEAM_COLOR}
        strokeWidth={BEAM_CORE_WIDTH}
        opacity={1}
        lineCap="round"
        shadowColor={BEAM_COLOR}
        shadowBlur={BEAM_SHADOW_BLUR}
        shadowOpacity={BEAM_SHADOW_OPACITY}
      />
    </Group>
  );
}

function DebugOverlay({
  beam,
  reflection,
  mirrorPosition,
}: {
  beam: Ray;
  reflection: ReturnType<typeof raySegmentReflection>;
  mirrorPosition: { x: number; y: number };
}) {
  return (
    <>
      <Circle
        x={beam.origin.x - mirrorPosition.x}
        y={beam.origin.y - mirrorPosition.y}
        radius={5}
        fill="red"
        opacity={0.5}
      />
      {reflection && (
        <Circle
          x={reflection.intersection.x - mirrorPosition.x}
          y={reflection.intersection.y - mirrorPosition.y}
          radius={8}
          fill="green"
          opacity={0.7}
        />
      )}
      <Line
        points={[
          beam.origin.x - mirrorPosition.x,
          beam.origin.y - mirrorPosition.y,
          beam.origin.x + beam.direction.x * BEAM_LENGTH - mirrorPosition.x,
          beam.origin.y + beam.direction.y * BEAM_LENGTH - mirrorPosition.y,
        ]}
        stroke="red"
        strokeWidth={1}
        opacity={0.3}
        dash={[5, 5]}
      />
    </>
  );
}
