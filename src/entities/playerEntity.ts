import { CollisionType } from "../components/CollisionComponent";
import { playerAttackAnimation, playerAttackUpAnimation, playerDeathAnimation, playerHurtAnimation, playerIdleAnimation, playerIdleUpAnimation, playerRunAnimation, playerRunUpAnimation } from "../sprites/playerAnimations";
import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";
import { TILE_HEIGHT, TILE_WIDTH } from "../utils/constants";
import { EntityManager } from "./EntityManager";

const animations = new Map();
animations.set(playerIdleAnimation.name, playerIdleAnimation);
animations.set(playerRunAnimation.name, playerRunAnimation);
animations.set(playerRunUpAnimation.name, playerRunUpAnimation);
animations.set(playerIdleUpAnimation.name, playerIdleUpAnimation);
animations.set(playerAttackAnimation.name, playerAttackAnimation);
animations.set(playerAttackUpAnimation.name, playerAttackUpAnimation);
animations.set(playerHurtAnimation.name, playerHurtAnimation);
animations.set(playerDeathAnimation.name, playerDeathAnimation);

const excludedComponents = ['DebugComponent', 'PlayerComponent', 'CollisionComponent', 'RenderComponent', 'MovementComponent', 'PositionComponent', 'AIComponent'];

export function createPlayerEntity(entityManager: EntityManager) {
  const playerEntity = EntityFactory.create()
    .name('player')
    .position(new Vector2D(TILE_WIDTH * 1, TILE_HEIGHT * 1))
    .size(32, 32)
    .movement(new Vector2D(0, 0), 1)
    .collision(CollisionType.BOX)
    .player()
    .combat()
    .animations(animations)
    .layer(1)
    .inventory()
    .debug(entityManager, excludedComponents)
    .build();

  entityManager.addEntity(playerEntity);
}