import React, { useState, useRef } from "react";
import { useImage } from "react-konva-utils";
import { Image, Group, Line, Circle } from "react-konva";
import { useRotation } from "@/app/hooks/useRotation";
// import { useRotation } from "./useRotation";

export default function LaserPointer() {
  const [image] = useImage("/laserPointer.svg");
  const groupRef = useRef(null);

  const [position, setPosition] = useState({ x: 200, y: 100 });
  const { rotation, startRotation } = useRotation(groupRef);

  if (!image) return null;

  // Dimensions & Offsets
  const multiplier = 2;
  const laserWidth = image.width * multiplier;
  const laserHeight = image.height * multiplier;

  // Center the image so (0,0) is the middle of the laser body
  const offsetX = laserWidth / 2;
  const offsetY = laserHeight / 2;

  // Configuration for "Pointing Right"
  const beamStartX = offsetX + 20; // Right edge of the image
  const beamStartY = 0; // Vertically centered
  const beamLength = 2000;
  const stickLength = 40;

  const setCursor = (e, cursorType) => {
    const stage = e.target.getStage();
    if (stage) stage.container().style.cursor = cursorType;
  };

  return (
    <Group
      ref={groupRef}
      x={position.x}
      y={position.y}
      rotation={rotation}
      draggable
      onDragMove={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
    >
      {/* --- THE LASER BEAM --- */}
      <Group listening={false}>
        {/* 1. The Outer Glow / Stroke (45% opaque) */}
        <Line
          points={[beamStartX, beamStartY, beamStartX + beamLength, beamStartY]}
          stroke="#F5CE5C"
          strokeWidth={20} // Thicker than the core
          opacity={0.45} // 45% opacity as requested
          lineCap="round" // Makes the start and end of the line rounded
        />

        {/* 2. The Inner Core (The sharp center) */}
        <Line
          points={[beamStartX, beamStartY, beamStartX + beamLength, beamStartY]}
          stroke="#F5CE5C"
          strokeWidth={10} // Thinner core
          opacity={1} // Fully opaque
          lineCap="round"
          // Optional: add a slight shadow for the extra "neon" feel
          shadowColor="#F5CE5C"
          shadowBlur={8}
          shadowOpacity={0.6}
        />
      </Group>

      {/* 2. Laser Pointer Image */}
      <Image
        image={image}
        x={-offsetX}
        y={-offsetY}
        width={laserWidth}
        height={laserHeight}
        onMouseEnter={(e) => setCursor(e, "move")}
        onMouseLeave={(e) => setCursor(e, "default")}
      />

      {/* 3. Lollipop Stick (Attached to the BACK/LEFT of the pointer) */}
      <Line
        points={[-offsetX, 0, -offsetX - stickLength, 0]}
        stroke="#0096ff"
        strokeWidth={2}
      />

      {/* 4. Lollipop Handle */}
      <Circle
        x={-offsetX - stickLength}
        y={0}
        radius={8}
        fill="#ffffff"
        stroke="#0096ff"
        strokeWidth={3}
        onMouseEnter={(e) => setCursor(e, "grab")}
        onMouseLeave={(e) => setCursor(e, "default")}
        onMouseDown={startRotation}
        onTouchStart={startRotation}
      />
    </Group>
  );
}
