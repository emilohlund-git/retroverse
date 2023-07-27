import { AnimationComponent } from "../components/AnimationComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class RenderSystem extends System {
  private canvas = document.createElement('canvas');
  private ctx: CanvasRenderingContext2D;

  constructor(
    width: number,
    height: number,
  ) {
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
    this.render();
    const renderEntities = entityManager.getEntitiesByComponent(RenderComponent);

    for (const entity of renderEntities) {
      const renderComponent = entity.getComponent(RenderComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (renderComponent.image) {
        if (renderComponent.tiled) {
          for (let i = positionComponent.position.x; i < renderComponent.width + positionComponent.position.x; i += 32) {
            for (let j = positionComponent.position.y; j < renderComponent.height + positionComponent.position.y; j += 32) {
              this.ctx.drawImage(
                renderComponent.image,
                0,
                0,
                32,
                32,
                i,
                j,
                32,
                32
              );
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
                  -positionComponent.position.x - frameWidth, // Negate position and width
                  positionComponent.position.y,
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
                  positionComponent.position.x,
                  positionComponent.position.y,
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
              positionComponent.position.x,
              positionComponent.position.y,
              renderComponent.width,
              renderComponent.height
            );
          }
        }
      } else {
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(
          positionComponent.position.x,
          positionComponent.position.y,
          renderComponent.width,
          renderComponent.height
        );
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