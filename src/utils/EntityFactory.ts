import { AnimationComponent } from "../components/AnimationComponent";
import { CollisionComponent, CollisionType } from "../components/CollisionComponent";
import { DebugComponent } from "../components/DebugComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Animation } from "../sprites/Animation";
import { Vector2D } from "./Vector2D";

export class EntityFactory {
  private entity: Entity;

  constructor() {
    this.entity = new Entity();
  }

  static create(): EntityFactory {
    return new EntityFactory();
  }

  name(name: string): this {
    this.entity.name = name;
    return this;
  }

  position(position: Vector2D): this {
    this.entity.addComponent(new PositionComponent(position));
    return this;
  }

  size(width: number, height: number): this {
    const renderComponent = this.ensureRenderComponent();
    renderComponent.width = width;
    renderComponent.height = height;
    return this;
  }

  spritePath(spritePath: string): this {
    const renderComponent = this.ensureRenderComponent();
    renderComponent.setImage(spritePath);
    return this;
  }

  tiled(tiled: boolean): this {
    const renderComponent = this.ensureRenderComponent();
    renderComponent.tiled = tiled;
    return this;
  }

  solid(solid: boolean = false): this {
    if (solid) {
      this.entity.addComponent(new SolidComponent());
    }
    return this;
  }

  collision(collisionType: CollisionType): this {
    this.entity.addComponent(new CollisionComponent(collisionType));
    return this;
  }

  movement(movement: Vector2D, moveSpeed: number): this {
    this.entity.addComponent(new MovementComponent(movement, moveSpeed));
    return this;
  }

  player(): this {
    this.entity.addComponent(new PlayerComponent());
    return this;
  }

  animations(animations: Map<string, Animation>): this {
    this.entity.addComponent(new AnimationComponent(animations, 'idle'));
    return this
  }

  debug(entityManager: EntityManager, excludedComponents?: string[]): this {
    this.entity.addComponent(new DebugComponent(entityManager, excludedComponents));
    return this;
  }

  build(): Entity {
    return this.entity;
  }

  private ensureRenderComponent(): RenderComponent {
    let renderComponent = this.entity.getComponent(RenderComponent);
    if (!renderComponent) {
      renderComponent = this.entity.addComponent(new RenderComponent(0, 0));
    }
    return renderComponent;
  }
}
