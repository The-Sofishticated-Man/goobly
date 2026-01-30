import { Entity } from "@/core/Entity";
import { Ticker } from "pixi.js";

export class Frisk extends Entity {
  protected defaultTexturePath: string = "/frisk.png";
  start(): void {
    this.sprite.x = 250;
    this.sprite.y = 250;
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.5);
  }
  update(ticker: Ticker): void {
    this.sprite.rotation += 0.01 * ticker.deltaTime;
  }
}
