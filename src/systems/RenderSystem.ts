import { AnimationComponent } from "../components/AnimationComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { SolidComponent } from "../components/SolidComponent";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class RenderSystem extends System {
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private cameraWidth: number = 100;
  private cameraHeight: number = 90;
  private zoomFactor: number = 4;

  constructor(width: number, height: number) {
    super();
    if (!this.canvas) throw new Error('Failed to initialize game canvas.');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to initialize canvas context.');
    this.ctx = ctx;

    this.canvas.width = width;
    this.canvas.height = height;

    document.body.appendChild(this.canvas);
  }

  preload() { }

  update(_: number, entityManager: EntityManager): void {
    // Update the camera position here (you can use the player's position as the camera position, for example)
    const playerEntity = entityManager.getEntityByName('player');
    if (!playerEntity) return;

    const playerPositionComponent = playerEntity.getComponent(PositionComponent);

    const cameraX = playerPositionComponent.position.x - this.cameraWidth / 2;
    const cameraY = playerPositionComponent.position.y - this.cameraHeight / 2;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.zoomFactor, this.zoomFactor); // Apply zoom

    const animationEntities = entityManager.getEntitiesByComponent(AnimationComponent);
    const solidEntities = entityManager.getEntitiesByComponent(SolidComponent);

    for (const entity of solidEntities) {
      const renderComponent = entity.getComponent(RenderComponent);
      const positionComponent = entity.getComponent(PositionComponent);
      const solidComponent = entity.getComponent(SolidComponent);

      const adjustedX = (positionComponent.position.x - cameraX);
      const adjustedY = (positionComponent.position.y - cameraY);

      this.ctx.drawImage(
        solidComponent.spriteData.image,
        solidComponent.spriteData.x,
        solidComponent.spriteData.y,
        renderComponent.width,
        renderComponent.height,
        adjustedX,
        adjustedY,
        renderComponent.width,
        renderComponent.height,
      );
    }

    for (const entity of animationEntities) {
      const renderComponent = entity.getComponent(RenderComponent);
      const positionComponent = entity.getComponent(PositionComponent);
      const animationComponent = entity.getComponent(AnimationComponent);

      if (animationComponent) {
        const animation = animationComponent.animations.get(animationComponent.currentAnimation);
        const currentAnimationFrame = animation?.frames[animationComponent.currentFrameIndex];
        if (!currentAnimationFrame) return;

        const adjustedX = (positionComponent.position.x - cameraX);
        const adjustedY = (positionComponent.position.y - cameraY);

        if (renderComponent.flipped) {
          this.ctx.save();
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(
            currentAnimationFrame.image,
            currentAnimationFrame.x,
            currentAnimationFrame.y,
            renderComponent.width,
            renderComponent.height,
            -adjustedX - renderComponent.width,
            adjustedY,
            renderComponent.width,
            renderComponent.height,
          );
          this.ctx.restore();
        } else {
          // No flip, draw as usual
          this.ctx.drawImage(
            currentAnimationFrame.image,
            currentAnimationFrame.x,
            currentAnimationFrame.y,
            renderComponent.width,
            renderComponent.height,
            adjustedX,
            adjustedY,
            renderComponent.width,
            renderComponent.height,
          );
        }
      }
    }
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  get height(): number {
    return this.canvas.height;
  }

  get width(): number {
    return this.canvas.width;
  }
}
