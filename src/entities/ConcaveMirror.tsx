import React from "react";
import { Group, Line, Circle, Text, Arc } from "react-konva";
import { Ray } from "@/lib/types";
import { computeArc } from "@/lib/angles";
import { rayCircleArcReflection } from "@/lib/physics";
import {
  BEAM_LENGTH,
  BEAM_COLOR,
  BEAM_CORE_WIDTH,
  BEAM_GLOW_WIDTH,
  BEAM_GLOW_OPACITY,
  BEAM_SHADOW_BLUR,
  BEAM_SHADOW_OPACITY,
} from "@/app/configs/beamConfig";
import {
  ARC_INCIDENT_COLOR,
  ARC_INCIDENT_RADIUS,
  ARC_OPACITY,
  ARC_REFLECTED_COLOR,
  ARC_REFLECTED_RADIUS,
  ARC_STROKE_WIDTH,
  ANGLE_LABEL_FONT_SIZE,
  ANGLE_LABEL_OFFSET,
  DEBUG_HIT_COLOR,
  DEBUG_HIT_OPACITY,
  DEBUG_HIT_RADIUS,
  DEBUG_ORIGIN_COLOR,
  DEBUG_ORIGIN_OPACITY,
  DEBUG_ORIGIN_RADIUS,
  DEBUG_RAY_COLOR,
  DEBUG_RAY_DASH,
  DEBUG_RAY_OPACITY,
  DEBUG_RAY_STROKE_WIDTH,
  MIRROR_EDGE_OPACITY,
  MIRROR_EDGE_STROKE,
  MIRROR_EDGE_STROKE_WIDTH,
  MIRROR_FILL,
  MIRROR_STROKE,
  MIRROR_STROKE_WIDTH,
  NORMAL_COLOR,
  NORMAL_DASH,
  NORMAL_LABEL_FONT_SIZE,
  NORMAL_LENGTH,
  NORMAL_OPACITY,
  NORMAL_STROKE_WIDTH,
  TANGENT_COLOR,
  TANGENT_DASH,
  TANGENT_HALF_LENGTH,
  TANGENT_LABEL_OFFSET,
  TANGENT_OPACITY,
  TANGENT_STROKE_WIDTH,
} from "@/app/configs/mirrorConfig";
import {
  CONCAVE_MIRROR_LENGTH,
  CONCAVE_MIRROR_POINT_COUNT,
  CONCAVE_MIRROR_POSITION,
  CONCAVE_MIRROR_RADIUS,
  CONCAVE_MIRROR_THICKNESS,
} from "@/app/configs/concaveMirrorConfig";

export { CONCAVE_MIRROR_LENGTH, CONCAVE_MIRROR_POSITION };

type Point = { x: number; y: number };
const FOCAL_POINT_COLOR = "#00ff9d";

// --- Arc geometry ---
// For concave, the center of curvature is to the LEFT of the mirror face
// (on the same side as the incoming laser), so normals point inward.
const ARC_HALF_ANGLE = Math.asin(
  CONCAVE_MIRROR_LENGTH / (2 * CONCAVE_MIRROR_RADIUS),
);
const ARC_START_ANGLE = -ARC_HALF_ANGLE;
const ARC_END_ANGLE = ARC_HALF_ANGLE;

// Center is LEFT of the mirror face (negative x offset from position)
const ARC_CENTER_LOCAL = {
  x: -(CONCAVE_MIRROR_RADIUS - CONCAVE_MIRROR_THICKNESS / 2),
  y: 0,
};
const ARC_CENTER_WORLD = {
  x: CONCAVE_MIRROR_POSITION.x + ARC_CENTER_LOCAL.x,
  y: CONCAVE_MIRROR_POSITION.y,
};
const CONCAVE_MIRROR_ARC = {
  center: ARC_CENTER_WORLD,
  radius: CONCAVE_MIRROR_RADIUS,
  startAngle: ARC_START_ANGLE,
  endAngle: ARC_END_ANGLE,
};

// Focal point sits at R/2 in front of (to the left of) the mirror surface
export const FOCAL_POINT_WORLD = {
  x:
    CONCAVE_MIRROR_POSITION.x -
    CONCAVE_MIRROR_RADIUS / 2 +
    CONCAVE_MIRROR_THICKNESS / 2,
  y: CONCAVE_MIRROR_POSITION.y,
};

function createArcPoints(radius: number) {
  const points: number[] = [];
  for (let index = 0; index <= CONCAVE_MIRROR_POINT_COUNT; index += 1) {
    const progress = index / CONCAVE_MIRROR_POINT_COUNT;
    const angle =
      ARC_START_ANGLE + progress * (ARC_END_ANGLE - ARC_START_ANGLE);
    points.push(
      ARC_CENTER_LOCAL.x + radius * Math.cos(angle),
      ARC_CENTER_LOCAL.y + radius * Math.sin(angle),
    );
  }
  return points;
}

function reversePointPairs(points: number[]) {
  const reversed: number[] = [];
  for (let index = points.length - 2; index >= 0; index -= 2) {
    reversed.push(points[index], points[index + 1]);
  }
  return reversed;
}

// Front face = the concave (inward-facing) reflective surface
const FRONT_ARC_POINTS = createArcPoints(CONCAVE_MIRROR_RADIUS);
// Back face = slightly smaller arc behind the front
const BACK_ARC_POINTS = reversePointPairs(
  createArcPoints(CONCAVE_MIRROR_RADIUS + CONCAVE_MIRROR_THICKNESS),
);
const MIRROR_BODY_POINTS = [...FRONT_ARC_POINTS, ...BACK_ARC_POINTS];

export default function ConcaveMirror({
  beam,
  hitDistance,
  debug = false,
  focalPoint,
}: {
  beam: Ray | null;
  hitDistance?: number | null;
  debug?: boolean;
  focalPoint?: Point;
}) {
  void hitDistance;

  const baseReflection = beam
    ? rayCircleArcReflection(beam, CONCAVE_MIRROR_ARC)
    : null;

  const reflection = baseReflection
    ? (() => {
        const focalWorld = focalPoint ?? FOCAL_POINT_WORLD;
        const toFocalX = focalWorld.x - baseReflection.intersection.x;
        const toFocalY = focalWorld.y - baseReflection.intersection.y;
        const toFocalLen = Math.hypot(toFocalX, toFocalY);

        if (toFocalLen < 0.0001) {
          return baseReflection;
        }

        return {
          ...baseReflection,
          reflected: {
            x: toFocalX / toFocalLen,
            y: toFocalY / toFocalLen,
          },
        };
      })()
    : null;

  const focalLocal = focalPoint
    ? {
        x: focalPoint.x - CONCAVE_MIRROR_POSITION.x,
        y: focalPoint.y - CONCAVE_MIRROR_POSITION.y,
      }
    : null;

  return (
    <Group x={CONCAVE_MIRROR_POSITION.x} y={CONCAVE_MIRROR_POSITION.y}>
      {/* Mirror body */}
      <Line
        points={MIRROR_BODY_POINTS}
        closed
        fill={MIRROR_FILL}
        stroke={MIRROR_STROKE}
        strokeWidth={MIRROR_STROKE_WIDTH}
        listening={false}
      />

      {/* Back edge shading */}
      <Line
        points={BACK_ARC_POINTS}
        stroke={MIRROR_EDGE_STROKE}
        strokeWidth={MIRROR_EDGE_STROKE_WIDTH}
        opacity={MIRROR_EDGE_OPACITY}
        listening={false}
      />

      {/* Reflective front face highlight */}
      <Line
        points={FRONT_ARC_POINTS}
        stroke="#e8f7ff"
        strokeWidth={CONCAVE_MIRROR_THICKNESS / 1.6}
        opacity={0.9}
        lineCap="round"
        listening={false}
      />

      {/* Angle annotation at hit point */}
      {reflection && beam && (
        <AngleAnnotation
          intersection={reflection.intersection}
          incidentDir={beam.direction}
          reflectedDir={reflection.reflected}
        />
      )}

      {/* Reflected beam */}
      {reflection && (
        <ReflectedBeam
          intersection={reflection.intersection}
          direction={reflection.reflected}
        />
      )}

      {debug && beam && <DebugOverlay beam={beam} reflection={reflection} />}

      {/* Focal point marker (drawn last so it stays on top of beam lines) */}
      {focalLocal && (
        <Group listening={false}>
          <Circle
            x={focalLocal.x}
            y={focalLocal.y}
            radius={7}
            fill={FOCAL_POINT_COLOR}
            stroke="#e9fff6"
            strokeWidth={2}
            shadowColor={FOCAL_POINT_COLOR}
            shadowBlur={10}
            shadowOpacity={0.8}
            opacity={1}
          />
          <Text
            x={focalLocal.x - 5}
            y={focalLocal.y - 24}
            text="F"
            fontSize={15}
            fontStyle="bold"
            fill={FOCAL_POINT_COLOR}
          />
        </Group>
      )}
    </Group>
  );
}

function AngleAnnotation({
  intersection,
  incidentDir,
  reflectedDir,
}: {
  intersection: Point;
  incidentDir: Point;
  reflectedDir: Point;
}) {
  const localX = intersection.x - CONCAVE_MIRROR_POSITION.x;
  const localY = intersection.y - CONCAVE_MIRROR_POSITION.y;

  // For concave, the normal points FROM hit point TOWARD center (inward)
  const rawNx = ARC_CENTER_WORLD.x - intersection.x;
  const rawNy = ARC_CENTER_WORLD.y - intersection.y;
  const nLen = Math.sqrt(rawNx * rawNx + rawNy * rawNy);
  const normalX = rawNx / nLen;
  const normalY = rawNy / nLen;

  const tangentX = -normalY;
  const tangentY = normalX;
  const normalAngleDeg = Math.atan2(normalY, normalX) * (180 / Math.PI);

  const incidentAngleRad = Math.acos(
    Math.min(1, Math.abs(incidentDir.x * normalX + incidentDir.y * normalY)),
  );
  const incidentAngleDeg = Math.round(incidentAngleRad * (180 / Math.PI));

  const incomingAngleDeg =
    Math.atan2(-incidentDir.y, -incidentDir.x) * (180 / Math.PI);
  const reflectedAngleDeg =
    Math.atan2(reflectedDir.y, reflectedDir.x) * (180 / Math.PI);

  const incidentArc = computeArc(normalAngleDeg, incomingAngleDeg);
  const reflectedArc = computeArc(normalAngleDeg, reflectedAngleDeg);

  const incidentLabelAngle =
    (incidentArc.start + incidentArc.sweep / 2) * (Math.PI / 180);
  const reflectedLabelAngle =
    (reflectedArc.start + reflectedArc.sweep / 2) * (Math.PI / 180);

  const incidentLabelRadius = ARC_INCIDENT_RADIUS + ANGLE_LABEL_OFFSET;
  const reflectedLabelRadius = ARC_REFLECTED_RADIUS + ANGLE_LABEL_OFFSET;

  const tangentPoints = [
    localX - tangentX * TANGENT_HALF_LENGTH,
    localY - tangentY * TANGENT_HALF_LENGTH,
    localX + tangentX * TANGENT_HALF_LENGTH,
    localY + tangentY * TANGENT_HALF_LENGTH,
  ];

  return (
    <Group listening={false}>
      {/* Normal line */}
      <Line
        points={[
          localX - normalX * NORMAL_LENGTH,
          localY - normalY * NORMAL_LENGTH,
          localX + normalX * NORMAL_LENGTH,
          localY + normalY * NORMAL_LENGTH,
        ]}
        stroke={NORMAL_COLOR}
        strokeWidth={NORMAL_STROKE_WIDTH}
        dash={NORMAL_DASH}
        opacity={NORMAL_OPACITY}
      />
      <Text
        x={localX + normalX * (NORMAL_LENGTH + 10) - 6}
        y={localY + normalY * (NORMAL_LENGTH + 10) - 8}
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
      <Text
        x={localX + Math.cos(reflectedLabelAngle) * reflectedLabelRadius - 10}
        y={localY + Math.sin(reflectedLabelAngle) * reflectedLabelRadius - 8}
        text={`${incidentAngleDeg}°`}
        fontSize={ANGLE_LABEL_FONT_SIZE}
        fontStyle="bold"
        fill={ARC_REFLECTED_COLOR}
      />

      {/* Tangent line */}
      <Line
        points={tangentPoints}
        stroke={TANGENT_COLOR}
        strokeWidth={TANGENT_STROKE_WIDTH + 2}
        opacity={0.8}
        dash={TANGENT_DASH}
        lineCap="round"
      />
      <Line
        points={tangentPoints}
        stroke={TANGENT_COLOR}
        strokeWidth={TANGENT_STROKE_WIDTH}
        opacity={TANGENT_OPACITY}
        dash={TANGENT_DASH}
        lineCap="round"
      />
      <Text
        x={localX + tangentX * (TANGENT_HALF_LENGTH + TANGENT_LABEL_OFFSET) - 4}
        y={localY + tangentY * (TANGENT_HALF_LENGTH + TANGENT_LABEL_OFFSET) - 9}
        text="T"
        fontSize={NORMAL_LABEL_FONT_SIZE}
        fontStyle="bold"
        fill={TANGENT_COLOR}
      />
    </Group>
  );
}

function ReflectedBeam({
  intersection,
  direction,
}: {
  intersection: Point;
  direction: Point;
}) {
  const localStartX = intersection.x - CONCAVE_MIRROR_POSITION.x;
  const localStartY = intersection.y - CONCAVE_MIRROR_POSITION.y;
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
}: {
  beam: Ray;
  reflection: ReturnType<typeof rayCircleArcReflection>;
}) {
  return (
    <>
      {/* Beam origin */}
      <Circle
        x={beam.origin.x - CONCAVE_MIRROR_POSITION.x}
        y={beam.origin.y - CONCAVE_MIRROR_POSITION.y}
        radius={DEBUG_ORIGIN_RADIUS}
        fill={DEBUG_ORIGIN_COLOR}
        opacity={DEBUG_ORIGIN_OPACITY}
      />
      {/* Center of curvature */}
      <Circle
        x={ARC_CENTER_WORLD.x - CONCAVE_MIRROR_POSITION.x}
        y={ARC_CENTER_WORLD.y - CONCAVE_MIRROR_POSITION.y}
        radius={DEBUG_ORIGIN_RADIUS}
        fill="#82cfff"
        opacity={0.35}
      />
      {reflection && (
        <>
          {/* Hit point */}
          <Circle
            x={reflection.intersection.x - CONCAVE_MIRROR_POSITION.x}
            y={reflection.intersection.y - CONCAVE_MIRROR_POSITION.y}
            radius={DEBUG_HIT_RADIUS}
            fill={DEBUG_HIT_COLOR}
            opacity={DEBUG_HIT_OPACITY}
          />
          {/* Line from center to hit point (the normal) */}
          <Line
            points={[
              ARC_CENTER_WORLD.x - CONCAVE_MIRROR_POSITION.x,
              ARC_CENTER_WORLD.y - CONCAVE_MIRROR_POSITION.y,
              reflection.intersection.x - CONCAVE_MIRROR_POSITION.x,
              reflection.intersection.y - CONCAVE_MIRROR_POSITION.y,
            ]}
            stroke="#82cfff"
            strokeWidth={1}
            opacity={0.5}
            dash={[4, 4]}
          />
        </>
      )}
      {/* Full ray extent */}
      <Line
        points={[
          beam.origin.x - CONCAVE_MIRROR_POSITION.x,
          beam.origin.y - CONCAVE_MIRROR_POSITION.y,
          beam.origin.x +
            beam.direction.x * BEAM_LENGTH -
            CONCAVE_MIRROR_POSITION.x,
          beam.origin.y +
            beam.direction.y * BEAM_LENGTH -
            CONCAVE_MIRROR_POSITION.y,
        ]}
        stroke={DEBUG_RAY_COLOR}
        strokeWidth={DEBUG_RAY_STROKE_WIDTH}
        opacity={DEBUG_RAY_OPACITY}
        dash={DEBUG_RAY_DASH}
      />
    </>
  );
}
