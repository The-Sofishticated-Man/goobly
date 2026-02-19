import React, { useState, useRef, useEffect } from "react";
import { useImage } from "react-konva-utils";
import { Image, Group, Line, Circle } from "react-konva";

export default function LaserPointer() {
  const [image] = useImage("/laserPointer.svg");
  const multiplier = 2;
  const laserWidth = (image?.width ?? 0) * multiplier;
  const laserHeight = (image?.height ?? 0) * multiplier;

  // State to track position, rotation, and interaction
  const groupRef = useRef(null);
  const [position, setPositioen] = useState({ x: 200, y: 100 });
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Handle the rotation logic
  useEffect(() => {
    if (!isRotating) return;

    const handlePointerMove = () => {
      const stage = groupRef.current?.getStage();
      if (!stage || !groupRef.current) return;

      // getPointerPosition seamlessly handles both mouse and touch
      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      // Get the exact center of our group
      const absPos = groupRef.current.getAbsolutePosition();

      // Calculate the angle between the center of the image and the pointer
      const dx = pointerPos.x - absPos.x;
      const dy = pointerPos.y - absPos.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Our lollipop handle is physically located at -90 degrees (top center).
      // We add 90 degrees to align the rotation exactly with the pointer.
      setRotation(angle + 90);
    };

    const handlePointerUp = () => setIsRotating(false);

    // Listen on the window to ensure smooth rotation even if the user drags fast 
    // and the cursor temporarily leaves the handle.
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
  }, [isRotating]);

  if (!image) return null;

  // To rotate correctly around its center, we calculate negative offsets
  const offsetX = laserWidth / 2;
  const offsetY = laserHeight / 2;
  const stickLength = 40; // How far the lollipop handle sticks out

  const startRotation = (e) => {
    e.cancelBubble = true; // Crucial: Prevents the parent Group from dragging
    setIsRotating(true);
  };

  return (
    <Group
      ref={groupRef}
      x={position.x}
      y={position.y}
      rotation={rotation}
      draggable
      onDragMove={(e) => {
        setPosition({ x: e.target.x(), y: e.target.y() });
      }}
    >
      {/* Main Laser Pointer Image */}
      <Image
        image={image}
        alt="Laser Pointer"
        x={-offsetX}
        y={-offsetY}
        width={laserWidth}
        height={laserHeight}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "move";
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
        }}
      />

      {/* Lollipop Stick */}
      <Line
        points={[0, -offsetY, 0, -offsetY - stickLength]}
        stroke="#0096ff"
        strokeWidth={2}
      />

      {/* Lollipop Handle (Circle) */}
      <Circle
        x={0}
        y={-offsetY - stickLength}
        radius={8}
        fill="#ffffff"
        stroke="#0096ff"
        strokeWidth={3}
        onMouseEnter={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "grab";
        }}
        onMouseLeave={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.container().style.cursor = "default";
        }}
        onMouseDown={startRotation}
        onTouchStart={startRotation}
      />
    </Group>
  );
}
