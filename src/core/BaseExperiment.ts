import { Application, Ticker } from "pixi.js";
import { Entity } from "./Entity";

export abstract class BaseExperiment {
  public app: Application;
  public entities: Entity[] = [];
  constructor(
    protected canvas: HTMLCanvasElement,
    protected width: number = 500,
    protected height: number = 500,
    protected backgroundColor: number = 0xffffff,
  ) {
    this.app = new Application();
  }

  async init() {
    await this.app.init({
      view: this.canvas,
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
    });

    this.app.ticker.add((delta) => this.update(delta));
    await this.start();
  }
  async addEntity(entity: Entity): Promise<BaseExperiment> {
    this.entities.push(entity);
    // initialize entity
    await entity.init(this);
    // mount onto stage
    this.app.stage.addChild(entity.container);
    await entity.start();
    this.app.ticker.add((delta) => entity.update(delta));
    return this;
  }
  // cleanup resources
  destroy(): void {
    this.app.destroy(true, { children: true, texture: true });
  }

  // runs once at the beginning
  abstract start(): void | Promise<void>;
  // runs on every frame
  abstract update(ticker: Ticker): void;
}
