import { Point, Ray, Segment, Reflection } from "./types";

interface CircleArc {
  center: Point;
  radius: number;
  startAngle: number;
  endAngle: number;
}

/**
 * Calculates the intersection of a ray with a line segment,
 * and the reflected ray direction using the segment's normal.
 */
export function raySegmentReflection(
  ray: Ray,
  segment: Segment,
): Reflection | null {
  const segDx = segment.end.x - segment.start.x;
  const segDy = segment.end.y - segment.start.y;

  const originDx = segment.start.x - ray.origin.x;
  const originDy = segment.start.y - ray.origin.y;

  const denom = segDx * ray.direction.y - segDy * ray.direction.x;

  // Lines are parallel
  if (Math.abs(denom) < 0.0001) return null;

  // t = distance along ray to intersection
  const t = (segDx * originDy - segDy * originDx) / denom;
  // u = position along segment (0..1)
  const u = (ray.direction.x * originDy - ray.direction.y * originDx) / denom;

  // Intersection must be on the segment and in front of the ray
  if (u < 0 || u > 1 || t < 0) return null;

  const intersection = {
    x: ray.origin.x + ray.direction.x * t,
    y: ray.origin.y + ray.direction.y * t,
  };

  // Segment normal (perpendicular, pointing "left" of the segment direction)
  const segLength = Math.sqrt(segDx * segDx + segDy * segDy);
  const normalX = -segDy / segLength;
  const normalY = segDx / segLength;

  // Reflected direction: r = d - 2(d·n)n
  const dot = ray.direction.x * normalX + ray.direction.y * normalY;
  const reflected = {
    x: ray.direction.x - 2 * dot * normalX,
    y: ray.direction.y - 2 * dot * normalY,
  };

  return { intersection, reflected, distance: t };
}

function normalizeAngle(angle: number) {
  const fullTurn = Math.PI * 2;
  let normalized = angle % fullTurn;

  if (normalized < 0) {
    normalized += fullTurn;
  }

  return normalized;
}

function isAngleOnArc(angle: number, startAngle: number, endAngle: number) {
  const normalizedAngle = normalizeAngle(angle);
  const normalizedStart = normalizeAngle(startAngle);
  const normalizedEnd = normalizeAngle(endAngle);

  if (normalizedStart <= normalizedEnd) {
    return (
      normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd
    );
  }

  return normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd;
}

/**
 * Calculates the first intersection of a ray with a circular arc,
 * then reflects the ray using the arc normal at the hit point.
 */
export function rayCircleArcReflection(
  ray: Ray,
  arc: CircleArc,
): Reflection | null {
  const offsetX = ray.origin.x - arc.center.x;
  const offsetY = ray.origin.y - arc.center.y;
  const dirDot =
    ray.direction.x * ray.direction.x + ray.direction.y * ray.direction.y;
  const twiceProjection =
    2 * (ray.direction.x * offsetX + ray.direction.y * offsetY);
  const radiusDelta =
    offsetX * offsetX + offsetY * offsetY - arc.radius * arc.radius;
  const discriminant =
    twiceProjection * twiceProjection - 4 * dirDot * radiusDelta;

  if (discriminant < 0 || dirDot === 0) {
    return null;
  }

  const sqrtDiscriminant = Math.sqrt(discriminant);
  const tValues = [
    (-twiceProjection - sqrtDiscriminant) / (2 * dirDot),
    (-twiceProjection + sqrtDiscriminant) / (2 * dirDot),
  ]
    .filter((t) => t >= 0)
    .sort((left, right) => left - right);

  for (const t of tValues) {
    const intersection = {
      x: ray.origin.x + ray.direction.x * t,
      y: ray.origin.y + ray.direction.y * t,
    };
    const hitAngle = Math.atan2(
      intersection.y - arc.center.y,
      intersection.x - arc.center.x,
    );

    if (!isAngleOnArc(hitAngle, arc.startAngle, arc.endAngle)) {
      continue;
    }

    const normalX = (intersection.x - arc.center.x) / arc.radius;
    const normalY = (intersection.y - arc.center.y) / arc.radius;
    const dot = ray.direction.x * normalX + ray.direction.y * normalY;

    return {
      intersection,
      reflected: {
        x: ray.direction.x - 2 * dot * normalX,
        y: ray.direction.y - 2 * dot * normalY,
      },
      distance: t,
    };
  }

  return null;
}
