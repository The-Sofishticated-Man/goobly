import {
  Assets,
  Container,
  FederatedPointerEvent,
  Graphics,
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
  protected abstract defaultTexturePath: string;

  //global container that holds everything
  public container = new Container();

  //container that holds the actual image of the entity
  public visual!: Container;

  protected isDragging = false;
  protected options: EntityOptions;

  //reference to the experiment the entity is part of
  protected experiment!: BaseExperiment;

  constructor(options: EntityOptions = {}) {
    this.options = options;
  }

  async init(experiment: BaseExperiment): Promise<this> {
    this.experiment = experiment;
    const texPath = this.options.texturePath ?? this.defaultTexturePath;
    this.visual = await this.createVisual(texPath);

    this.container.addChild(this.visual);

    if (this.options.draggable) this.enableDragging();
    return this;
  }

  public enableDragging() {
    this.visual.cursor = "pointer";
    this.visual.interactive = true;

    const dragOffset = { x: 0, y: 0 };

    this.visual.on("pointerdown", (e: FederatedPointerEvent) => {
      this.isDragging = true;

      const pos = e.global;
      dragOffset.x = pos.x - this.visual.x;
      dragOffset.y = pos.y - this.visual.y;

      this.visual.alpha = 0.8;
    });

    this.visual.on("pointerup", () => {
      this.isDragging = false;
      this.visual.alpha = 1;
    });

    this.visual.on("pointerupoutside", () => {
      this.isDragging = false;
      this.visual.alpha = 1;
    });

    this.visual.on("pointermove", (e: FederatedPointerEvent) => {
      if (!this.isDragging) return;
      const pos = e.global;
      this.visual.x = pos.x - dragOffset.x;
      this.visual.y = pos.y - dragOffset.y;
    });

    return this;
  }
  private async createVisual(path: string): Promise<Container> {
    // handle svg file
    if (path.endsWith(".svg")) {
      const svgContext = await Assets.load({
        src: path,
        data: { parseAsGraphicsContext: true },
      });
      const graphics = new Graphics(svgContext);

      const bounds = graphics.getLocalBounds();
      graphics.pivot.set(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
      );

      return graphics;
    } else {
      // handle other file types (jpg, png, etc...)
      const tex = await Assets.load<Texture>(path);
      const sprite = new Sprite(tex);
      sprite.anchor.set(0.5);
      return sprite;
    }
  }
  // cleanup resources
  destroy(): void {
    this.container.destroy({ children: true });
  }

  // runs once at the beginning
  abstract start(): void;
  // runs on every frame
  abstract update(ticker: Ticker): void;
}
