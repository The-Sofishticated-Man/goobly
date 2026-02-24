import React from "react";
import { Group, Line, Rect, Circle, Arc, Text } from "react-konva";
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
import {
  MIRROR_LENGTH,
  MIRROR_THICKNESS,
  MIRROR_POSITION,
  MIRROR_FILL,
  MIRROR_STROKE,
  MIRROR_STROKE_WIDTH,
  MIRROR_CORNER_RADIUS,
  MIRROR_EDGE_STROKE,
  MIRROR_EDGE_STROKE_WIDTH,
  MIRROR_EDGE_OPACITY,
  NORMAL_LENGTH,
  NORMAL_COLOR,
  NORMAL_STROKE_WIDTH,
  NORMAL_DASH,
  NORMAL_OPACITY,
  NORMAL_LABEL_FONT_SIZE,
  ARC_INCIDENT_RADIUS,
  ARC_REFLECTED_RADIUS,
  ARC_STROKE_WIDTH,
  ARC_OPACITY,
  ARC_INCIDENT_COLOR,
  ARC_REFLECTED_COLOR,
  ANGLE_LABEL_FONT_SIZE,
  ANGLE_LABEL_OFFSET,
  DEBUG_ORIGIN_RADIUS,
  DEBUG_ORIGIN_COLOR,
  DEBUG_ORIGIN_OPACITY,
  DEBUG_HIT_RADIUS,
  DEBUG_HIT_COLOR,
  DEBUG_HIT_OPACITY,
  DEBUG_RAY_COLOR,
  DEBUG_RAY_STROKE_WIDTH,
  DEBUG_RAY_OPACITY,
  DEBUG_RAY_DASH,
} from "@/lib/mirrorConfig";

export { MIRROR_LENGTH, MIRROR_POSITION };

export default function Mirror({
  beam,
  hitDistance,
  debug = false,
}: {
  beam: Ray | null;
  hitDistance?: number | null;
  debug?: boolean;
}) {
  const { x: mx, y: my } = MIRROR_POSITION;

  // Mirror surface segment in world space (front face)
  const surfaceX = mx - MIRROR_THICKNESS / 2;
  const segment = {
    start: { x: surfaceX, y: my - MIRROR_LENGTH / 2 },
    end: { x: surfaceX, y: my + MIRROR_LENGTH / 2 },
  };

  const reflection = beam ? raySegmentReflection(beam, segment) : null;

  return (
    <Group x={mx} y={my}>
      {/* Mirror surface */}
      <Rect
        x={-MIRROR_THICKNESS / 2}
        y={-MIRROR_LENGTH / 2}
        width={MIRROR_THICKNESS}
        height={MIRROR_LENGTH}
        fill={MIRROR_FILL}
        stroke={MIRROR_STROKE}
        strokeWidth={MIRROR_STROKE_WIDTH}
        cornerRadius={MIRROR_CORNER_RADIUS}
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
        stroke={MIRROR_EDGE_STROKE}
        strokeWidth={MIRROR_EDGE_STROKE_WIDTH}
        opacity={MIRROR_EDGE_OPACITY}
        listening={false}
      />

      {/* Normal line, angle arcs, and reflected beam */}
      {reflection && beam && (
        <AngleAnnotation
          intersection={reflection.intersection}
          incidentDir={beam.direction}
          reflectedDir={reflection.reflected}
          mirrorPosition={MIRROR_POSITION}
          segment={segment}
        />
      )}

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

function AngleAnnotation({
  intersection,
  incidentDir,
  reflectedDir,
  mirrorPosition,
  segment,
}: {
  intersection: { x: number; y: number };
  incidentDir: { x: number; y: number };
  reflectedDir: { x: number; y: number };
  mirrorPosition: { x: number; y: number };
  segment: { start: { x: number; y: number }; end: { x: number; y: number } };
}) {
  const localX = intersection.x - mirrorPosition.x;
  const localY = intersection.y - mirrorPosition.y;

  // Compute the mirror surface direction and normal
  const segDx = segment.end.x - segment.start.x;
  const segDy = segment.end.y - segment.start.y;
  const segLen = Math.sqrt(segDx * segDx + segDy * segDy);

  // Normal points left of the segment direction (toward the incoming beam)
  const normalX = -segDy / segLen;
  const normalY = segDx / segLen;

  // Pick the normal that faces the incoming beam
  const dot = incidentDir.x * normalX + incidentDir.y * normalY;
  const nx = dot < 0 ? normalX : -normalX;
  const ny = dot < 0 ? normalY : -normalY;

  // Normal line angle in degrees (Konva uses clockwise from right)
  const normalAngleDeg = Math.atan2(ny, nx) * (180 / Math.PI);

  // Incident angle relative to normal
  const incidentAngleRad = Math.acos(
    Math.abs(incidentDir.x * nx + incidentDir.y * ny),
  );
  const incidentAngleDeg = Math.round(incidentAngleRad * (180 / Math.PI));

  // The incident beam direction (reversed, pointing away from mirror)
  const incomingAngleDeg =
    Math.atan2(-incidentDir.y, -incidentDir.x) * (180 / Math.PI);
  // The reflected beam direction
  const reflectedAngleDeg =
    Math.atan2(reflectedDir.y, reflectedDir.x) * (180 / Math.PI);

  // Compute arc start/sweep for incident arc (from normal to incoming beam direction)
  const incidentArc = computeArc(normalAngleDeg, incomingAngleDeg);
  // Compute arc start/sweep for reflected arc (from normal to reflected beam direction)
  const reflectedArc = computeArc(normalAngleDeg, reflectedAngleDeg);

  // Label positions (midpoint of each arc's actual sweep)
  const incidentLabelAngle =
    (incidentArc.start + incidentArc.sweep / 2) * (Math.PI / 180);
  const reflectedLabelAngle =
    (reflectedArc.start + reflectedArc.sweep / 2) * (Math.PI / 180);
  const incidentLabelRadius = ARC_INCIDENT_RADIUS + ANGLE_LABEL_OFFSET;
  const reflectedLabelRadius = ARC_REFLECTED_RADIUS + ANGLE_LABEL_OFFSET;

  return (
    <Group listening={false}>
      {/* Normal line (dashed) */}
      <Line
        points={[
          localX - nx * NORMAL_LENGTH,
          localY - ny * NORMAL_LENGTH,
          localX + nx * NORMAL_LENGTH,
          localY + ny * NORMAL_LENGTH,
        ]}
        stroke={NORMAL_COLOR}
        strokeWidth={NORMAL_STROKE_WIDTH}
        dash={NORMAL_DASH}
        opacity={NORMAL_OPACITY}
      />

      {/* "N" label at end of normal */}
      <Text
        x={localX + nx * (NORMAL_LENGTH + 10) - 6}
        y={localY + ny * (NORMAL_LENGTH + 10) - 8}
        text="N"
        fontSize={NORMAL_LABEL_FONT_SIZE}
        fontStyle="bold"
        fill={NORMAL_COLOR}
      />

      {/* Incident angle arc */}
      <Arc
        x={localX}
        y={localY}
        innerRadius={ARC_INCIDENT_RADIUS - 1}
        outerRadius={ARC_INCIDENT_RADIUS + 1}
        angle={Math.abs(incidentArc.sweep)}
        rotation={incidentArc.start}
        fill={ARC_INCIDENT_COLOR}
        strokeWidth={ARC_STROKE_WIDTH}
        opacity={ARC_OPACITY}
      />

      {/* Incident angle label */}
      <Text
        x={localX + Math.cos(incidentLabelAngle) * incidentLabelRadius - 10}
        y={localY + Math.sin(incidentLabelAngle) * incidentLabelRadius - 8}
        text={`${incidentAngleDeg}°`}
        fontSize={ANGLE_LABEL_FONT_SIZE}
        fontStyle="bold"
        fill={ARC_INCIDENT_COLOR}
      />

      {/* Reflected angle arc */}
      <Arc
        x={localX}
        y={localY}
        innerRadius={ARC_REFLECTED_RADIUS - 1}
        outerRadius={ARC_REFLECTED_RADIUS + 1}
        angle={Math.abs(reflectedArc.sweep)}
        rotation={reflectedArc.start}
        fill={ARC_REFLECTED_COLOR}
        strokeWidth={ARC_STROKE_WIDTH}
        opacity={ARC_OPACITY}
      />

      {/* Reflected angle label */}
      <Text
        x={localX + Math.cos(reflectedLabelAngle) * reflectedLabelRadius - 10}
        y={localY + Math.sin(reflectedLabelAngle) * reflectedLabelRadius - 8}
        text={`${incidentAngleDeg}°`}
        fontSize={ANGLE_LABEL_FONT_SIZE}
        fontStyle="bold"
        fill={ARC_REFLECTED_COLOR}
      />
    </Group>
  );
}

/**
 * Compute arc start angle and sweep for Konva's Arc component.
 * Goes from angleA to angleB, taking the shorter path.
 */
function computeArc(
  angleA: number,
  angleB: number,
): { start: number; sweep: number } {
  let sweep = angleB - angleA;
  // Normalize to [-180, 180]
  while (sweep > 180) sweep -= 360;
  while (sweep < -180) sweep += 360;

  if (sweep >= 0) {
    return { start: angleA, sweep };
  } else {
    return { start: angleA + sweep, sweep: -sweep };
  }
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
        radius={DEBUG_ORIGIN_RADIUS}
        fill={DEBUG_ORIGIN_COLOR}
        opacity={DEBUG_ORIGIN_OPACITY}
      />
      {reflection && (
        <Circle
          x={reflection.intersection.x - mirrorPosition.x}
          y={reflection.intersection.y - mirrorPosition.y}
          radius={DEBUG_HIT_RADIUS}
          fill={DEBUG_HIT_COLOR}
          opacity={DEBUG_HIT_OPACITY}
        />
      )}
      <Line
        points={[
          beam.origin.x - mirrorPosition.x,
          beam.origin.y - mirrorPosition.y,
          beam.origin.x + beam.direction.x * BEAM_LENGTH - mirrorPosition.x,
          beam.origin.y + beam.direction.y * BEAM_LENGTH - mirrorPosition.y,
        ]}
        stroke={DEBUG_RAY_COLOR}
        strokeWidth={DEBUG_RAY_STROKE_WIDTH}
        opacity={DEBUG_RAY_OPACITY}
        dash={DEBUG_RAY_DASH}
      />
    </>
  );
}
