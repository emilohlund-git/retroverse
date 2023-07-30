import { AIComponent } from "../components/AIComponent";
import { AnimationComponent, AnimationState } from "../components/AnimationComponent";
import { CollisionComponent, CollisionType } from "../components/CollisionComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { DebugComponent } from "../components/DebugComponent";
import { InventoryComponent } from "../components/InventoryComponent";
import { LayerComponent } from "../components/LayerComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { PropComponent } from "../components/PropComponent";
import { RenderComponent } from "../components/RenderComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Animation } from "../sprites/Animation";
import { SpriteData } from "./SpriteSheetParser";
import { Vector2D } from "./Vector2D";

export class EntityFactory {
  private entity: Entity;

  constructor() {
    this.entity = new Entity('');
  }

  static create(): EntityFactory {
    return new EntityFactory();
  }

  name(name: string): this {
    this.entity.name = name;
    return this;
  }

  position(position: Vector2D): this {
    this.entity.addComponent("PositionComponent", new PositionComponent(position));
    return this;
  }

  prop(): this {
    this.entity.addComponent("PropComponent", new PropComponent());
    return this;
  }

  size(width: number, height: number): this {
    const renderComponent = this.ensureRenderComponent();
    renderComponent.width = width;
    renderComponent.height = height;
    return this;
  }

  combat(): this {
    this.entity.addComponent("CombatComponent", new CombatComponent());
    return this;
  }

  inventory(maxCapacity?: number): this {
    const inventoryComponent = new InventoryComponent([], maxCapacity);
    this.entity.addComponent("InventoryComponent", inventoryComponent);
    return this;
  }

  spriteData(spriteData: SpriteData): this {
    const renderComponent = this.ensureRenderComponent();
    renderComponent.spriteData = spriteData;
    return this;
  }

  tiled(tiled: boolean): this {
    const renderComponent = this.ensureRenderComponent();
    renderComponent.tiled = tiled;
    return this;
  }

  solid(spriteData: SpriteData): this {
    this.entity.addComponent("SolidComponent", new SolidComponent(spriteData));
    return this;
  }

  collision(collisionType: CollisionType, offsetX?: number, offsetY?: number, width?: number, height?: number): this {
    this.entity.addComponent("CollisionComponent", new CollisionComponent(collisionType, offsetX, offsetY, width, height));
    return this;
  }

  movement(movement: Vector2D, moveSpeed: number): this {
    this.entity.addComponent("MovementComponent", new MovementComponent(movement, moveSpeed));
    return this;
  }

  layer(layer: number): this {
    this.entity.addComponent("LayerComponent", new LayerComponent(layer));
    return this;
  }

  player(): this {
    this.entity.addComponent("PlayerComponent", new PlayerComponent());
    return this;
  }

  animations(animations: Map<string, Animation>, currentAnimation?: string, isPlaying?: boolean): this {
    this.entity.addComponent("AnimationComponent", new AnimationComponent(animations, currentAnimation, 0, 10, isPlaying, 0, 0, AnimationState.Finished));
    return this
  }

  ai(aggroRange: number): this {
    this.entity.addComponent("AIComponent", new AIComponent(aggroRange));
    return this;
  }

  debug(entityManager: EntityManager, excludedComponents?: string[]): this {
    this.entity.addComponent("DebugComponent", new DebugComponent(entityManager, excludedComponents));
    return this;
  }

  build(): Entity {
    return this.entity;
  }

  private ensureRenderComponent(): RenderComponent {
    let renderComponent = this.entity.getComponent<RenderComponent>("RenderComponent");
    if (!renderComponent) {
      renderComponent = this.entity.addComponent("RenderComponent", new RenderComponent(0, 0, {} as SpriteData));
    }
    return renderComponent;
  }
}
