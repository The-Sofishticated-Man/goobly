"use client";
import LaserPointer from "@/entities/LaserPointer";
import { Layer, Rect, Stage } from "react-konva";

export default function Playground({ module }: { module: string }) {
  return (
    <Stage width={1800} height={800} background={"#f0f0f0"}>
      <Layer>
        <Rect width={1800} height={800} stroke={"#f0f0f0"} />
        <LaserPointer />
      </Layer>
    </Stage>
  );
}
