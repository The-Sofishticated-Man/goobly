import { Line } from "react-konva";
import { Ray } from "@/lib/types";

export default function WaveBeam({
  beam,
  hitDistance,
  time,
  reflectedDirection: customReflectedDirection, // <-- NEW: Accept custom direction
}: {
  beam: Ray | null;
  hitDistance: number | null;
  time: number;
  reflectedDirection?: { x: number; y: number } | null; // <-- NEW
}) {
  if (!beam) return null;

  const amplitude = 10;
  const frequency = 0.15;
  const speed = 15;

  const generateWavePoints = (
    origin: { x: number; y: number },
    direction: { x: number; y: number },
    length: number,
    phaseOffset: number = 0
  ) => {
    const points = [];
    const dx = direction.x;
    const dy = direction.y;
    const px = -dy;
    const py = dx;

    for (let d = 0; d <= length; d += 2) {
      const displacement =
        amplitude * Math.sin(frequency * d - speed * time + phaseOffset);

      const x = origin.x + d * dx + px * displacement;
      const y = origin.y + d * dy + py * displacement;
      points.push(x, y);
    }
    return points;
  };

  const incidentLength = hitDistance !== null ? hitDistance : 2000;
  const incidentPoints = generateWavePoints(beam.origin, beam.direction, incidentLength, 0);

  let reflectedPoints: number[] = [];
  if (hitDistance !== null) {
    const hitPoint = {
      x: beam.origin.x + beam.direction.x * hitDistance,
      y: beam.origin.y + beam.direction.y * hitDistance,
    };

    // Use the custom direction if provided (for curved mirrors), 
    // otherwise fallback to the flat vertical mirror math
    const reflectedDirection = customReflectedDirection || {
      x: -beam.direction.x,
      y: beam.direction.y,
    };

    const phaseAtHit = frequency * hitDistance;

    reflectedPoints = generateWavePoints(
      hitPoint,
      reflectedDirection,
      2000,
      phaseAtHit
    );
  }

  return (
    <>
      <Line
        points={incidentPoints}
        stroke="cyan"
        strokeWidth={2}
        tension={0.5}
        shadowColor="cyan"
        shadowBlur={10}
      />
      {reflectedPoints.length > 0 && (
        <Line
          points={reflectedPoints}
          stroke="cyan"
          strokeWidth={2}
          tension={0.5}
          shadowColor="cyan"
          shadowBlur={10}
        />
      )}
    </>
  );
}