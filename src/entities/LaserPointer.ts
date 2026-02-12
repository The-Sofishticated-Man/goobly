import { Graphics, Point, Ticker } from "pixi.js";
import { Entity } from "@/core/Entity";
import { Mirror } from "./Mirror";

export class LaserPointer extends Entity {
  protected defaultTexturePath = "/laserPointer.png";

  private beam = new Graphics();

  start(): void {
    this.visual.x = 100;
    this.visual.y = 250;
    this.visual.scale.set(0.6);
    this.container.addChild(this.beam);
  }

  update(_ticker: Ticker): void {
    this.beam.clear();

    // laser origin (sprite center)
    const origin = new Point(this.visual.x + 120, this.visual.y);

    // initial ray direction (rightward)
    const dir = new Point(
      Math.cos(this.visual.rotation),
      Math.sin(this.visual.rotation),
    );
    this.beam
      .moveTo(origin.x, origin.y)
      .lineTo(origin.x + 1000, origin.y)
      .stroke({ width: 20, color: 0xf5ce5c });
    // this.castRay(origin, dir, 0);
  }

  private castRay(origin: Point, direction: Point, bounce: number) {
    if (bounce > 1) return; // Limit to 1 reflection for now

    const mirrors = this.experiment.entities.filter(
      (e) => e instanceof Mirror,
    ) as Mirror[];

    let closestDist = Infinity;
    let closestPoint: Point | null = null;
    let hitMirror: Mirror | null = null;

    // Ray/mirror intersection test
    for (const m of mirrors) {
      const hit = m.getRayIntersection(origin, direction);
      if (!hit) continue;

      const dist = Math.hypot(hit.x - origin.x, hit.y - origin.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestPoint = hit;
        hitMirror = m;
      }
    }

    if (!closestPoint || !hitMirror) {
      // draw to infinite
      const end = new Point(
        origin.x + direction.x * 2000,
        origin.y + direction.y * 2000,
      );
      this.drawSegment(origin, end);
      return;
    }

    // Draw to hit point
    this.drawSegment(origin, closestPoint);

    // Reflect
    const normal = hitMirror.getNormal();
    const dot = direction.x * normal.x + direction.y * normal.y;
    const reflect = new Point(
      direction.x - 2 * dot * normal.x,
      direction.y - 2 * dot * normal.y,
    );

    this.castRay(closestPoint, reflect, bounce + 1);
  }

  private drawSegment(a: Point, b: Point) {
    this.beam.moveTo(a.x, a.y);
    this.beam.lineTo(b.x, b.y);
  }
}
