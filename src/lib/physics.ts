import { Ray, Segment, Reflection } from "./types";

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
