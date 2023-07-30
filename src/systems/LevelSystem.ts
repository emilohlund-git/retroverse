import { LayerComponent } from "../components/LayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { System } from "./System";

export class LevelSystem extends System {
  private staticRenderingBatches: Map<number, Entity[]> = new Map();
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

    const playerPositionComponent = playerEntity.getComponent<PositionComponent>("PositionComponent");
    if (!playerPositionComponent) return;
    const { position: playerPosition } = playerPositionComponent

    this.updateStaticRenderingBatches(entityManager);
    this.renderStaticLevelElements(playerPosition);
  }

  private updateCamera(entityManager: EntityManager) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.zoomFactor, this.zoomFactor);
  }

  private updateStaticRenderingBatches(entityManager: EntityManager) {
    this.staticRenderingBatches.clear();

    const staticEntities = entityManager.getEntitiesByComponents(["SolidComponent", "RenderComponent"]);
    for (const entity of staticEntities) {
      const layerComponent = entity.getComponent<LayerComponent>("LayerComponent");
      if (!layerComponent) continue;
      const layer = layerComponent ? layerComponent.layer : 0;

      if (!this.staticRenderingBatches.has(layer)) {
        this.staticRenderingBatches.set(layer, []);
      }

      this.staticRenderingBatches.get(layer)?.push(entity);
    }
  }

  private renderStaticLevelElements(playerPosition: Vector2D) {
    const sortedBatches = Array.from(this.staticRenderingBatches.entries()).sort(([layerA], [layerB]) => layerA - layerB);

    for (const [_, entities] of sortedBatches) {
      for (const entity of entities) {
        this.renderStaticEntity(entity, playerPosition);
      }
    }
  }

  private renderStaticEntity(entity: Entity, playerPosition: Vector2D) {
    const positionComponent = entity.getComponent<PositionComponent>("PositionComponent");
    const renderComponent = entity.getComponent<RenderComponent>("RenderComponent");
    const solidComponent = entity.getComponent<SolidComponent>("SolidComponent");

    if (!solidComponent || !positionComponent || !renderComponent) return;

    const { position } = positionComponent;

    const cameraX = playerPosition.x - this.cameraWidth / 2;
    const cameraY = playerPosition.y - this.cameraHeight / 2;
    const adjustedX = (position.x - cameraX);
    const adjustedY = (position.y - cameraY);

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
