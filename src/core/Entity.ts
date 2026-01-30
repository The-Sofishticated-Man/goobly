import {
  Assets,
  Container,
  FederatedPointerEvent,
  Sprite,
  Texture,
  Ticker,
} from "pixi.js";
import { BaseExperiment } from "./BaseExperiment";

interface EntityOptions {
  texturePath?: string;
  draggable?: boolean;
}

export abstract class Entity {
  public container = new Container();
  public sprite!: Sprite;
  protected isDragging = false;
  protected options: EntityOptions;
  protected experiment!: BaseExperiment;
  constructor(options: EntityOptions = {}) {
    this.options = options;
  }

  async init(experiment: BaseExperiment): Promise<this> {
    this.experiment = experiment;
    const texPath = this.options.texturePath ?? this.defaultTexturePath;
    const tex = await Assets.load<Texture>(texPath);
    this.sprite = new Sprite(tex);
    this.sprite.anchor.set(0.5);
    this.sprite.eventMode = "static";

    this.container.addChild(this.sprite);

    if (this.options.draggable) this.enableDragging();
    return this;
  }

  public enableDragging() {
    this.sprite.eventMode = "static";
    this.sprite.cursor = "pointer";
    this.sprite.interactive = true;

    const dragOffset = { x: 0, y: 0 };

    this.sprite.on("pointerdown", (e: FederatedPointerEvent) => {
      this.isDragging = true;

      const pos = e.global;
      dragOffset.x = pos.x - this.sprite.x;
      dragOffset.y = pos.y - this.sprite.y;

      this.sprite.alpha = 0.8; // Optional feedback
    });

    this.sprite.on("pointerup", () => {
      this.isDragging = false;
      this.sprite.alpha = 1; // Optional feedback
    });

    this.sprite.on("pointerupoutside", () => {
      this.isDragging = false;
      this.sprite.alpha = 1;
    });

    this.sprite.on("pointermove", (e: FederatedPointerEvent) => {
      if (!this.isDragging) return;
      const pos = e.global;
      this.sprite.x = pos.x - dragOffset.x;
      this.sprite.y = pos.y - dragOffset.y;
    });

    return this;
  }

  abstract start(): void;
  abstract update(ticker: Ticker): void;
  destroy(): void {
    this.container.destroy({ children: true });
  }

  protected abstract defaultTexturePath: string;
}
