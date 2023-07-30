import { AnimationComponent } from "../components/AnimationComponent";
import { LayerComponent } from "../components/LayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { System } from "./System";

export class RenderSystem extends System {
  private animationRenderingBatches: Map<number, Entity[]> = new Map();
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cameraWidth: number = 100;
  private cameraHeight: number = 90;
  private zoomFactor: number = 4;

  constructor(width: number, height: number) {
    super();
    const viewport = document.getElementById("viewport");
    if (!viewport) throw new Error("Viewport missing.");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    if (!canvas) throw new Error('Failed to initialize game canvas.');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to initialize canvas context.');
    this.ctx = ctx;
    this.canvas = canvas;
    viewport.appendChild(canvas);
  }

  preload() { }

  update(_: number, entityManager: EntityManager): void {
    this.render();
    this.updateCamera(entityManager);

    const playerEntity = entityManager.getEntityByName('player');
    if (!playerEntity) return;

    const { position: playerPosition } = playerEntity.getComponent(PositionComponent);

    this.updateAnimationRenderingBatches(entityManager);
    this.renderAnimationEntities(playerPosition);
  }

  private updateCamera(entityManager: EntityManager) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.zoomFactor, this.zoomFactor);
  }

  private updateAnimationRenderingBatches(entityManager: EntityManager) {
    this.animationRenderingBatches.clear();

    const animationEntities = entityManager.getEntitiesByComponent(AnimationComponent);

    for (const entity of animationEntities) {
      const layerComponent = entity.getComponent(LayerComponent);
      const layer = layerComponent ? layerComponent.layer : 0;

      if (!this.animationRenderingBatches.has(layer)) {
        this.animationRenderingBatches.set(layer, []);
      }

      this.animationRenderingBatches.get(layer)?.push(entity);
    }
  }

  private renderAnimationEntities(playerPosition: Vector2D) {
    const sortedBatches = Array.from(this.animationRenderingBatches.entries()).sort(([layerA], [layerB]) => layerA - layerB);

    for (const [_, entities] of sortedBatches) {
      for (const entity of entities) {
        this.renderEntity(entity, playerPosition);
      }
    }
  }

  private renderEntity(entity: Entity, playerPosition: Vector2D) {
    const renderComponent = entity.getComponent(RenderComponent);
    const positionComponent = entity.getComponent(PositionComponent);
    const animationComponent = entity.getComponent(AnimationComponent);

    if (animationComponent) {
      const animation = animationComponent.animations.get(animationComponent.currentAnimation);
      const currentAnimationFrame = animation?.frames[animationComponent.currentFrameIndex];
      if (!currentAnimationFrame) return;

      const cameraX = playerPosition.x - this.cameraWidth / 2;
      const cameraY = playerPosition.y - this.cameraHeight / 2;
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
