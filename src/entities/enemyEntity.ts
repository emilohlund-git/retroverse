import { CollisionType } from "../components/CollisionComponent";
import { enemyAttackAnimation, enemyAttackUpAnimation, enemyDeathAnimation, enemyHurtAnimation, enemyIdleAnimation, enemyIdleUpAnimation, enemyRunAnimation, enemyRunUpAnimation } from "../sprites/enemyAnimations";
import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";
import { EntityManager } from "./EntityManager";

const animations = new Map();
animations.set(enemyIdleAnimation.name, enemyIdleAnimation);
animations.set(enemyRunAnimation.name, enemyRunAnimation);
animations.set(enemyRunUpAnimation.name, enemyRunUpAnimation);
animations.set(enemyIdleUpAnimation.name, enemyIdleUpAnimation);
animations.set(enemyAttackAnimation.name, enemyAttackAnimation);
animations.set(enemyAttackUpAnimation.name, enemyAttackUpAnimation);
animations.set(enemyHurtAnimation.name, enemyHurtAnimation);
animations.set(enemyDeathAnimation.name, enemyDeathAnimation);

const excludedComponents = ['DebugComponent', 'PlayerComponent', 'CollisionComponent', 'RenderComponent', 'MovementComponent', 'PositionComponent', 'AIComponent'];

export function createEnemyEntity(entityManager: EntityManager, name: string, positionX: number, positionY: number) {
  const enemyEntity = EntityFactory.create()
    .name(name)
    .position(new Vector2D(positionX, positionY))
    .size(32, 32)
    .movement(new Vector2D(0, 0), 1)
    .collision(CollisionType.BOX)
    .combat()
    .ai(50)
    .animations(animations)
    .layer(0)
    .build();

  entityManager.addEntity(enemyEntity);
}