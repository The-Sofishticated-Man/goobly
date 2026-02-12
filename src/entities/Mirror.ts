import { Point, Ticker } from "pixi.js";
import { Entity } from "@/core/Entity";

export class Mirror extends Entity {
  protected defaultTexturePath = "/mirror.png";

  start(): void {
    this.visual.x = 400;
    this.visual.y = 250;
  }

  update(_ticker: Ticker): void {}

  getRayIntersection(origin: Point, dir: Point): Point | null {
    const half = this.visual.width / 2;

    const p1 = new Point(this.visual.x - half, this.visual.y);
    const p2 = new Point(this.visual.x + half, this.visual.y);

    // Ray: R = origin + dir * t
    // Segment: S = p1 + (p2 - p1) * u

    const v1 = new Point(origin.x - p1.x, origin.y - p1.y);
    const v2 = new Point(p2.x - p1.x, p2.y - p1.y);
    const v3 = new Point(-dir.y, dir.x);

    const dot = v2.x * v3.x + v2.y * v3.y;
    if (Math.abs(dot) < 0.00001) return null;

    const t = (v2.x * v1.y - v2.y * v1.x) / dot;
    const u = (v1.x * v3.x + v1.y * v3.y) / dot;

    if (t >= 0 && u >= 0 && u <= 1) {
      return new Point(origin.x + dir.x * t, origin.y + dir.y * t);
    }

    return null;
  }

  getNormal(): Point {
    // Mirror normal points upward
    const n = new Point(0, -1);
    return n;
  }
}
