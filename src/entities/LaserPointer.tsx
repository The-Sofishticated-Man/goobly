import React from "react";
import { useImage } from "react-konva-utils";
import { Image } from "react-konva";
export default function LaserPointer() {
  const [image] = useImage("/laserPointer.svg");
  const multiplier = 2;
  const laserWidth = (image?.width ?? 0) * multiplier;
  const laserHeight = (image?.height ?? 0) * multiplier;
  return (
    <>
      {image && (
        <Image
          image={image}
          alt="Laser Pointer"
          x={200}
          y={100}
          width={laserWidth}
          height={laserHeight}
          draggable
          // Change cursor on hover
          onMouseEnter={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = "pointer";
          }}
          onMouseLeave={(e) => {
            const stage = e.target.getStage();
            if (stage) stage.container().style.cursor = "default";
          }}
        />
      )}
    </>
  );
}
