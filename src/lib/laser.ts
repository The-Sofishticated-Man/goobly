import {
  LASER_BEAM_OFFSET,
  LASER_SIZE_MULTIPLIER,
} from "@/app/configs/laserPointerConfig";
import { Ray } from "@/lib/types";

type LaserImage = { width: number; height: number };

export function createLaserBeam({
  image,
  position,
  rotation,
}: {
  image: LaserImage | null | undefined;
  position: { x: number; y: number };
  rotation: number;
}): Ray | null {
  if (!image) return null;

  const beamStartX =
    (image.width * LASER_SIZE_MULTIPLIER) / 2 + LASER_BEAM_OFFSET;
  const radians = (rotation * Math.PI) / 180;

  return {
    origin: {
      x: position.x + beamStartX * Math.cos(radians),
      y: position.y + beamStartX * Math.sin(radians),
    },
    direction: { x: Math.cos(radians), y: Math.sin(radians) },
  };
}
