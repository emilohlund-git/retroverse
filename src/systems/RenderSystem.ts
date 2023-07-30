import { AnimationComponent } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { InventoryComponent } from "../components/InventoryComponent";
import { LayerComponent } from "../components/LayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { System } from "./System";

export class RenderSystem extends System {
  private renderingBatches: Map<number, Entity[]> = new Map();
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

    if (playerPositionComponent) {
      this.updateRenderingBatches(entityManager);
      this.renderEntities(playerPositionComponent.position);
      this.renderDroppedItems(playerPositionComponent.position, entityManager);
    }
  }

  private updateCamera(entityManager: EntityManager) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.scale(this.zoomFactor, this.zoomFactor);
  }

  private updateRenderingBatches(entityManager: EntityManager) {
    this.renderingBatches.clear();

    const animationEntities = entityManager.getEntitiesByComponent("AnimationComponent");
    const staticEntities = entityManager.getEntitiesByComponents(["SolidComponent", "RenderComponent"]);

    for (const entity of [...animationEntities, ...staticEntities]) {
      const layerComponent = entity.getComponent<LayerComponent>("LayerComponent");
      const layer = layerComponent ? layerComponent.layer : 0;

      if (!this.renderingBatches.has(layer)) {
        this.renderingBatches.set(layer, []);
      }

      this.renderingBatches.get(layer)?.push(entity);
    }
  }

  private renderEntities(playerPosition: Vector2D) {
    const sortedBatches = Array.from(this.renderingBatches.entries()).sort(([layerA], [layerB]) => layerA - layerB);

    for (const [_, entities] of sortedBatches) {
      for (const entity of entities) {
        const positionComponent = entity.getComponent<PositionComponent>("PositionComponent");
        if (!positionComponent) continue;

        if (entity.hasComponent("AnimationComponent")) {
          this.renderAnimationEntity(entity, playerPosition);
        } else {
          this.renderStaticEntity(entity, playerPosition);
        }
      }
    }
  }

  private renderAnimationEntity(entity: Entity, playerPosition: Vector2D) {
    const renderComponent = entity.getComponent<RenderComponent>("RenderComponent");
    if (!renderComponent) return;
    const positionComponent = entity.getComponent<PositionComponent>("PositionComponent");
    if (!positionComponent) return;
    const animationComponent = entity.getComponent<AnimationComponent>("AnimationComponent");

    const combatComponent = entity.getComponent<CombatComponent>("CombatComponent");

    if (animationComponent) {
      const animation = animationComponent.animations.get(animationComponent.currentAnimation);
      const currentAnimationFrame = animation?.frames[animationComponent.currentFrameIndex];
      if (!currentAnimationFrame) return;

      const cameraX = playerPosition.x - this.cameraWidth / 2;
      const cameraY = playerPosition.y - this.cameraHeight / 2;
      const adjustedX = (positionComponent.position.x - cameraX);
      const adjustedY = (positionComponent.position.y - cameraY);

      if (combatComponent) {
        this.ctx.fillStyle = "gray"
        this.ctx.fillRect(adjustedX + 13, adjustedY + 8, 7, 1);
        this.ctx.fillStyle = "red"
        this.ctx.fillRect(adjustedX + 13, adjustedY + 8, (combatComponent.health / combatComponent.maxHealth) * 7, 1);
      }

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

  private renderDroppedItems(playerPosition: Vector2D, entityManager: EntityManager) {
    const world = entityManager.getEntityByName("world-inventory");
    if (!world) return;

    const worldInventory = world?.getComponent<InventoryComponent>("InventoryComponent");

    const positionComponent = world.getComponent<PositionComponent>("PositionComponent");
    if (!worldInventory || !positionComponent) return;

    const cameraX = playerPosition.x - this.cameraWidth / 2;
    const cameraY = playerPosition.y - this.cameraHeight / 2;

    for (const item of worldInventory.items) {
      const adjustedX = (item.dropPosition.x - cameraX);
      const adjustedY = (item.dropPosition.y - cameraY);

      if (item.isDropped) {
        this.ctx.drawImage(
          item.icon.image,
          item.icon.x,
          item.icon.y,
          item.icon.width,
          item.icon.height,
          adjustedX,
          adjustedY + 15,
          6,
          6,
        );
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
