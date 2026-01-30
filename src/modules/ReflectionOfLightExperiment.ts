import { BaseExperiment } from "@/core/BaseExperiment";
import { LaserPointer } from "@/entities/LaserPointer";

export class ReflectionOfLightExperiment extends BaseExperiment {
  async start(): Promise<void> {
    await this.addEntity(new LaserPointer({ draggable: true }));
  }
  update(): void {}
}
