import { useState, useEffect, useRef, useCallback } from "react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

interface Point {
  x: number;
  y: number;
}

const LERP_SPEED = 0.25;
const EPSILON = 0.1;

export function useSmoothPosition(
  initial: Point,
  onPositionChange: (pos: Point) => void,
) {
  const targetRef = useRef(initial);
  const currentRef = useRef(initial);
  const rafRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const onChangeRef = useRef(onPositionChange);
  onChangeRef.current = onPositionChange;

  const animate = useCallback(() => {
    const dx = targetRef.current.x - currentRef.current.x;
    const dy = targetRef.current.y - currentRef.current.y;

    if (Math.abs(dx) > EPSILON || Math.abs(dy) > EPSILON) {
      currentRef.current = {
        x: currentRef.current.x + dx * LERP_SPEED,
        y: currentRef.current.y + dy * LERP_SPEED,
      };
      onChangeRef.current(currentRef.current);
    } else if (
      currentRef.current.x !== targetRef.current.x ||
      currentRef.current.y !== targetRef.current.y
    ) {
      currentRef.current = { ...targetRef.current };
      onChangeRef.current(currentRef.current);
    }

    if (
      isDraggingRef.current ||
      Math.abs(dx) > EPSILON ||
      Math.abs(dy) > EPSILON
    ) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
    }
  }, []);

  const handleDragMove = useCallback((e: KonvaEventObject<DragEvent>) => {
    const node = e.target as Konva.Node;
    // Snap Konva node back to current smooth position to prevent visual jump
    node.x(currentRef.current.x);
    node.y(currentRef.current.y);

    // Update target from the mouse pointer
    const stage = node.getStage();
    if (stage) {
      const pointer = stage.getPointerPosition();
      if (pointer) {
        targetRef.current = { x: pointer.x, y: pointer.y };
      }
    }
  }, []);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleDragEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { handleDragMove, handleDragStart, handleDragEnd };
}
