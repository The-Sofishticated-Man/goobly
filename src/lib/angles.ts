export function computeArc(
  angleA: number,
  angleB: number,
): { start: number; sweep: number } {
  let sweep = angleB - angleA;

  while (sweep > 180) sweep -= 360;
  while (sweep < -180) sweep += 360;

  if (sweep >= 0) return { start: angleA, sweep };
  return { start: angleA + sweep, sweep: -sweep };
}
