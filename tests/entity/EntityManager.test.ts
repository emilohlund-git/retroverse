import { PositionComponent } from "../../src/components/PositionComponent";
import { Entity } from "../../src/entities/Entity";
import { EntityManager } from "../../src/entities/EntityManager";
import { Vector2D } from "../../src/utils/Vector2D";

describe('EntityManager', () => {
  let entity = new Entity();
  let entity2 = new Entity();
  let entityManager = new EntityManager();

  beforeEach(() => {
    entityManager.addEntity(entity);
    entityManager.addEntity(entity2);
    entity.addComponent(new PositionComponent(new Vector2D(0, 0)));
  });

  describe('getEntitiesByComponent', () => {
    test('should be able to get entities by component', () => {
      const foundEntities = entityManager.getEntitiesByComponent(PositionComponent);
      expect(foundEntities).toEqual([entity]);
    });
  });

  describe('getEntitiesByComponents', () => {

  });
});
