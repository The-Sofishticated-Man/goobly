"use client";
import LaserPointer from "@/entities/LaserPointer";
import { Layer, Rect, Stage } from "react-konva";

export default function Playground({ module }: { module: string }) {
  return (
    <Stage width={500} height={300} background={"#f0f0f0"}>
      <Layer>
        <Rect width={500} height={300} fill="white" />
        <LaserPointer />
      </Layer>
    </Stage>
  );
}
