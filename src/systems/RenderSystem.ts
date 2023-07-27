import { AnimationComponent } from "../components/AnimationComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class RenderSystem extends System {
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;
  private cameraWidth: number = 70;
  private cameraHeight: number = 50;
  private zoomFactor: number = 6;

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

    // Get the player's position
    const playerPositionComponent = playerEntity.getComponent(PositionComponent);

    // Calculate the camera position to center it on the player
    const cameraX = playerPositionComponent.position.x - this.cameraWidth / 2;
    const cameraY = playerPositionComponent.position.y - this.cameraHeight / 2;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.zoomFactor, this.zoomFactor); // Apply zoom

    const renderEntities = entityManager.getEntitiesByComponent(RenderComponent);

    for (const entity of renderEntities) {
      const renderComponent = entity.getComponent(RenderComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      // Adjust the rendering positions based on the camera position
      const adjustedX = (positionComponent.position.x - cameraX);
      const adjustedY = (positionComponent.position.y - cameraY);

      if (renderComponent.image) {
        if (renderComponent.tiled) {
          for (let i = adjustedX; i < renderComponent.width + adjustedX; i += 32) {
            for (let j = adjustedY; j < renderComponent.height + adjustedY; j += 32) {
              this.ctx.drawImage(renderComponent.image, 0, 0, 32, 32, i, j, 32, 32);
            }
          }
        } else {
          const animationComponent = entity.getComponent(AnimationComponent);

          if (animationComponent) {
            if (animationComponent.currentAnimation) {
              const spriteSheet = renderComponent.image;
              const frameWidth = renderComponent.width;
              const frameHeight = renderComponent.height;
              const frameX = renderComponent.frameX;
              const frameY = renderComponent.frameY;

              if (renderComponent.flipped) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                  spriteSheet,
                  frameX,
                  frameY,
                  frameWidth,
                  frameHeight,
                  -adjustedX - frameWidth, // Negate position and width
                  adjustedY,
                  frameWidth,
                  frameHeight
                );
                this.ctx.restore();
              } else {
                // No flip, draw as usual
                this.ctx.drawImage(
                  spriteSheet,
                  frameX,
                  frameY,
                  frameWidth,
                  frameHeight,
                  adjustedX,
                  adjustedY,
                  frameWidth,
                  frameHeight
                );
              }
            }
          } else {
            this.ctx.drawImage(
              renderComponent.image,
              0,
              0,
              32,
              32,
              adjustedX,
              adjustedY,
              renderComponent.width,
              renderComponent.height
            );
          }
        }
      } else {
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(adjustedX, adjustedY, renderComponent.width, renderComponent.height);
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
