import { PropData } from "../levels/level";
import { createEntityAnimations } from "../sprites/animations/animationFactory";
import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";
import { EntityManager } from "./EntityManager";

export async function createPropsEntities(entityManager: EntityManager, propsData: PropData[]) {
  for (const propData of propsData) {
    const propAnimations = await createEntityAnimations(propData.name);
    const propEntity = EntityFactory.create()
      .name(propData.name)
      .size(propData.size[0], propData.size[1])
      .position(new Vector2D(propData.position.x, propData.position.y))
      .animations(propAnimations, propData.animationType, propData.isLooping)
      .prop()
      .layer(propData.layer)
      .build();

    entityManager.addEntity(propEntity);
  }
}