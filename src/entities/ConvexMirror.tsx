import React from "react";
import { Group, Line, Circle, Text, Arc } from "react-konva";
import { Ray } from "@/lib/types";
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
  CONVEX_MIRROR_LENGTH,
  CONVEX_MIRROR_POINT_COUNT,
  CONVEX_MIRROR_POSITION,
  CONVEX_MIRROR_RADIUS,
  CONVEX_MIRROR_THICKNESS,
} from "@/app/configs/convexMirrorConfig";

export { CONVEX_MIRROR_LENGTH, CONVEX_MIRROR_POSITION };

type Point = { x: number; y: number };

const ARC_HALF_ANGLE = Math.asin(
  CONVEX_MIRROR_LENGTH / (2 * CONVEX_MIRROR_RADIUS),
);
const ARC_START_ANGLE = Math.PI - ARC_HALF_ANGLE;
const ARC_END_ANGLE = Math.PI + ARC_HALF_ANGLE;
const ARC_CENTER_LOCAL = {
  x: CONVEX_MIRROR_RADIUS - CONVEX_MIRROR_THICKNESS / 2,
  y: 0,
};
const ARC_CENTER_WORLD = {
  x: CONVEX_MIRROR_POSITION.x + ARC_CENTER_LOCAL.x,
  y: CONVEX_MIRROR_POSITION.y,
};
const CONVEX_MIRROR_ARC = {
  center: ARC_CENTER_WORLD,
  radius: CONVEX_MIRROR_RADIUS,
  startAngle: ARC_START_ANGLE,
  endAngle: ARC_END_ANGLE,
};

function createArcPoints(radius: number) {
  const points: number[] = [];

  for (let index = 0; index <= CONVEX_MIRROR_POINT_COUNT; index += 1) {
    const progress = index / CONVEX_MIRROR_POINT_COUNT;
    const angle = ARC_END_ANGLE - progress * (ARC_END_ANGLE - ARC_START_ANGLE);

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

const FRONT_ARC_POINTS = createArcPoints(CONVEX_MIRROR_RADIUS);
const BACK_ARC_POINTS = reversePointPairs(
  createArcPoints(CONVEX_MIRROR_RADIUS - CONVEX_MIRROR_THICKNESS),
);
const MIRROR_BODY_POINTS = [...FRONT_ARC_POINTS, ...BACK_ARC_POINTS];

export default function ConvexMirror({
  beam,
  hitDistance,
  debug = false,
}: {
  beam: Ray | null;
  hitDistance?: number | null;
  debug?: boolean;
}) {
  void hitDistance;

  const reflection = beam
    ? rayCircleArcReflection(beam, CONVEX_MIRROR_ARC)
    : null;

  return (
    <Group x={CONVEX_MIRROR_POSITION.x} y={CONVEX_MIRROR_POSITION.y}>
      <Line
        points={MIRROR_BODY_POINTS}
        closed
        fill={MIRROR_FILL}
        stroke={MIRROR_STROKE}
        strokeWidth={MIRROR_STROKE_WIDTH}
        listening={false}
      />

      <Line
        points={BACK_ARC_POINTS}
        stroke={MIRROR_EDGE_STROKE}
        strokeWidth={MIRROR_EDGE_STROKE_WIDTH}
        opacity={MIRROR_EDGE_OPACITY}
        listening={false}
      />

      <Line
        points={FRONT_ARC_POINTS}
        stroke="#e8f7ff"
        strokeWidth={CONVEX_MIRROR_THICKNESS / 1.6}
        opacity={0.9}
        lineCap="round"
        listening={false}
      />

      {reflection && beam && (
        <AngleAnnotation
          intersection={reflection.intersection}
          incidentDir={beam.direction}
          reflectedDir={reflection.reflected}
        />
      )}

      {reflection && (
        <ReflectedBeam
          intersection={reflection.intersection}
          direction={reflection.reflected}
        />
      )}

      {debug && beam && <DebugOverlay beam={beam} reflection={reflection} />}
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
  const localX = intersection.x - CONVEX_MIRROR_POSITION.x;
  const localY = intersection.y - CONVEX_MIRROR_POSITION.y;
  const normalX = (intersection.x - ARC_CENTER_WORLD.x) / CONVEX_MIRROR_RADIUS;
  const normalY = (intersection.y - ARC_CENTER_WORLD.y) / CONVEX_MIRROR_RADIUS;
  const tangentX = -normalY;
  const tangentY = normalX;
  const normalAngleDeg = Math.atan2(normalY, normalX) * (180 / Math.PI);
  const incidentAngleRad = Math.acos(
    Math.abs(incidentDir.x * normalX + incidentDir.y * normalY),
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

      <Line
        points={tangentPoints}
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

function computeArc(
  angleA: number,
  angleB: number,
): { start: number; sweep: number } {
  let sweep = angleB - angleA;

  while (sweep > 180) {
    sweep -= 360;
  }

  while (sweep < -180) {
    sweep += 360;
  }

  if (sweep >= 0) {
    return { start: angleA, sweep };
  }

  return { start: angleA + sweep, sweep: -sweep };
}

function ReflectedBeam({
  intersection,
  direction,
}: {
  intersection: Point;
  direction: Point;
}) {
  const localStartX = intersection.x - CONVEX_MIRROR_POSITION.x;
  const localStartY = intersection.y - CONVEX_MIRROR_POSITION.y;
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
      <Circle
        x={beam.origin.x - CONVEX_MIRROR_POSITION.x}
        y={beam.origin.y - CONVEX_MIRROR_POSITION.y}
        radius={DEBUG_ORIGIN_RADIUS}
        fill={DEBUG_ORIGIN_COLOR}
        opacity={DEBUG_ORIGIN_OPACITY}
      />
      <Circle
        x={ARC_CENTER_WORLD.x - CONVEX_MIRROR_POSITION.x}
        y={ARC_CENTER_WORLD.y - CONVEX_MIRROR_POSITION.y}
        radius={DEBUG_ORIGIN_RADIUS}
        fill="#82cfff"
        opacity={0.35}
      />
      {reflection && (
        <>
          <Circle
            x={reflection.intersection.x - CONVEX_MIRROR_POSITION.x}
            y={reflection.intersection.y - CONVEX_MIRROR_POSITION.y}
            radius={DEBUG_HIT_RADIUS}
            fill={DEBUG_HIT_COLOR}
            opacity={DEBUG_HIT_OPACITY}
          />
          <Line
            points={[
              ARC_CENTER_WORLD.x - CONVEX_MIRROR_POSITION.x,
              ARC_CENTER_WORLD.y - CONVEX_MIRROR_POSITION.y,
              reflection.intersection.x - CONVEX_MIRROR_POSITION.x,
              reflection.intersection.y - CONVEX_MIRROR_POSITION.y,
            ]}
            stroke="#82cfff"
            strokeWidth={1}
            opacity={0.5}
            dash={[4, 4]}
          />
        </>
      )}
      <Line
        points={[
          beam.origin.x - CONVEX_MIRROR_POSITION.x,
          beam.origin.y - CONVEX_MIRROR_POSITION.y,
          beam.origin.x +
            beam.direction.x * BEAM_LENGTH -
            CONVEX_MIRROR_POSITION.x,
          beam.origin.y +
            beam.direction.y * BEAM_LENGTH -
            CONVEX_MIRROR_POSITION.y,
        ]}
        stroke={DEBUG_RAY_COLOR}
        strokeWidth={DEBUG_RAY_STROKE_WIDTH}
        opacity={DEBUG_RAY_OPACITY}
        dash={DEBUG_RAY_DASH}
      />
    </>
  );
}
