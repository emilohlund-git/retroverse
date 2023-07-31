import { CollisionType } from "../components/CollisionComponent";
import { Animation } from "../sprites/animations/Animation";
import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";
import { TILE_HEIGHT, TILE_WIDTH } from "../utils/constants";
import { EntityManager } from "./EntityManager";

const excludedComponents = ['DebugComponent', 'PlayerComponent', 'CollisionComponent', 'RenderComponent', 'MovementComponent', 'PositionComponent', 'AIComponent'];

export function createPlayerEntity(entityManager: EntityManager, animations: Map<string, Animation>) {
  const playerEntity = EntityFactory.create()
    .name('player')
    .position(new Vector2D(TILE_WIDTH * 1, TILE_HEIGHT * 1))
    .size(32, 32)
    .movement(new Vector2D(0, 0), 1)
    .collision(CollisionType.BOX, 2, 0, 16, 16)
    .player()
    .combat()
    .animations(animations)
    .layer(2)
    .inventory()
    .debug(entityManager, excludedComponents)
    .build();

  entityManager.addEntity(playerEntity);
}