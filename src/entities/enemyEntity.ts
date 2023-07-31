import { CollisionType } from "../components/CollisionComponent";
import { ItemComponent } from "../components/ItemComponent";
import { Animation } from "../sprites/animations/Animation";
import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";
import { EntityManager } from "./EntityManager";

export function createEnemyEntity(entityManager: EntityManager, name: string, positionX: number, positionY: number, animations: Map<string, Animation>, items?: ItemComponent[]) {
  const enemyEntity = EntityFactory.create()
    .name(name)
    .position(new Vector2D(positionX, positionY))
    .size(32, 32)
    .movement(new Vector2D(0, 0), 1)
    .collision(CollisionType.BOX, 0, 0, 16, 16)
    .combat()
    .ai(50)
    .animations(animations)
    .inventory(10, items)
    .layer(3)
    .build();

  entityManager.addEntity(enemyEntity);
}