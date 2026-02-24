import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useState, useEffect, useRef, useCallback, RefObject } from "react";
import { ROTATION_LERP_SPEED } from "@/app/configs/laserPointerConfig";

export function useRotation(
  groupRef: RefObject<Konva.Group | null>,
  externalRotation?: number,
  onRotationChange?: (rotation: number) => void,
) {
  const [rotation, setRotation] = useState(externalRotation ?? 0);
  const [isRotating, setIsRotating] = useState(false);
  const previousAngleRef = useRef<number | null>(null);
  const targetRotationRef = useRef(externalRotation ?? 0);
  const currentRef = useRef(externalRotation ?? 0);
  const rafRef = useRef<number | null>(null);
  const onRotationChangeRef = useRef(onRotationChange);

  const currentRotation = externalRotation ?? rotation;

  // Keep refs in sync
  onRotationChangeRef.current = onRotationChange;
  currentRef.current = currentRotation;

  // Animation loop: lerp toward target
  useEffect(() => {
    if (!isRotating) {
      // Run one final convergence pass after releasing
      const settle = () => {
        const diff = targetRotationRef.current - currentRef.current;
        if (Math.abs(diff) < 0.01) {
          rafRef.current = null;
          return;
        }
        const next = currentRef.current + diff * ROTATION_LERP_SPEED;
        currentRef.current = next;
        if (onRotationChangeRef.current) {
          onRotationChangeRef.current(next);
        } else {
          setRotation(next);
        }
        rafRef.current = requestAnimationFrame(settle);
      };
      // Kick off settling if there's still a gap
      if (Math.abs(targetRotationRef.current - currentRef.current) > 0.01) {
        rafRef.current = requestAnimationFrame(settle);
      }
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const animate = () => {
      const diff = targetRotationRef.current - currentRef.current;
      if (Math.abs(diff) > 0.01) {
        const next = currentRef.current + diff * ROTATION_LERP_SPEED;
        currentRef.current = next;
        if (onRotationChangeRef.current) {
          onRotationChangeRef.current(next);
        } else {
          setRotation(next);
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRotating]);

  // Mouse/touch handlers (only update the target ref, no state)
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

      if (previousAngleRef.current !== null) {
        let delta = angle - previousAngleRef.current;
        if (delta > 180) delta -= 360;
        else if (delta < -180) delta += 360;

        targetRotationRef.current += delta;
      } else {
        targetRotationRef.current = angle + 180;
        currentRef.current = angle + 180;
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
  }, [isRotating, groupRef]);

  const startRotation = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      e.cancelBubble = true;
      targetRotationRef.current = currentRef.current;
      setIsRotating(true);
    },
    [],
  );

  return { rotation: currentRotation, startRotation };
}
