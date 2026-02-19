import { useState, useEffect } from "react";

export function useRotation(groupRef) {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

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

      setRotation(angle+180);
    };

    const handlePointerUp = () => setIsRotating(false);

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

  const startRotation = (e) => {
    e.cancelBubble = true;
    setIsRotating(true);
  };

  return { rotation, startRotation };
}