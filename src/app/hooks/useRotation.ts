import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useState, useEffect, useRef, RefObject } from "react";

export function useRotation(
  groupRef: RefObject<Konva.Group | null>,
  externalRotation?: number,
  onRotationChange?: (rotation: number) => void,
) {
  const [rotation, setRotation] = useState(externalRotation ?? 0);
  const [isRotating, setIsRotating] = useState(false);
  const previousAngleRef = useRef<number | null>(null);
  const ROTATION_SPEED = 0.4; // Adjust this for faster/slower rotation

  // Use external rotation if provided, otherwise use internal state
  const currentRotation = externalRotation ?? rotation;

  useEffect(() => {
    if (!isRotating) return;

    const handlePointerMove = () => {
      const stage = groupRef.current?.getStage();
      if (!stage || !groupRef.current) return;

      const pointerPos = stage.getPointerPosition();
      const absPos = groupRef.current.getAbsolutePosition();

      if (!pointerPos || !absPos) return;

      const dx = pointerPos.x - absPos.x;
      const dy = pointerPos.y - absPos.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Handle angle wrapping to avoid sudden flips
      if (previousAngleRef.current !== null) {
        let delta = angle - previousAngleRef.current;

        // If the delta is large, we probably crossed the -180/180 boundary
        if (delta > 180) {
          delta -= 360;
        } else if (delta < -180) {
          delta += 360;
        }

        const newRotation = currentRotation + delta * ROTATION_SPEED;

        if (onRotationChange) {
          onRotationChange(newRotation);
        } else {
          setRotation(newRotation);
        }
      } else {
        // First time, just set the initial rotation
        const initialRotation = angle + 180;
        if (onRotationChange) {
          onRotationChange(initialRotation);
        } else {
          setRotation(initialRotation);
        }
      }

      previousAngleRef.current = angle;
    };

    const handlePointerUp = () => {
      setIsRotating(false);
      previousAngleRef.current = null;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isRotating, groupRef, currentRotation, onRotationChange]);

  const startRotation = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    setIsRotating(true);
  };

  return { rotation: currentRotation, startRotation };
}
