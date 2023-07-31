import { CombatComponent } from "../../src/components/CombatCompontent";
import { MovementComponent } from "../../src/components/MovementComponent";
import { PositionComponent } from "../../src/components/PositionComponent";
import { PropComponent } from "../../src/components/PropComponent";
import { RenderComponent } from "../../src/components/RenderComponent";
import { Entity } from "../../src/entities/Entity";
import { EntityManager } from "../../src/entities/EntityManager";
import { SpriteData } from "../../src/utils/SpriteSheetParser";
import { Vector2D } from "../../src/utils/Vector2D";

describe('EntityManager', () => {
  let entity = new Entity("Entity");
  let entity2 = new Entity("Enity2");
  let entityWithTwoComponents = new Entity("EntityWithTwoComponents");
  let entityWithTwoDifferentComponents = new Entity("EntityWithTwoDifferentComponents");
  let entityWithTwoOverlappingComponents = new Entity("EntityWithTwoOverlappingComponents");
  let entityManager = new EntityManager();

  beforeEach(() => {
    entityManager.addEntity(entity);
    entityManager.addEntity(entity2);
    entity.addComponent("PositionComponent", new PositionComponent(new Vector2D(0, 0)));
    entityWithTwoComponents.addComponent("MovementComponent", new MovementComponent(new Vector2D(0, 0)));
    entityWithTwoComponents.addComponent("CombatComponent", new CombatComponent());
    entityManager.addEntity(entityWithTwoComponents);
    entityWithTwoDifferentComponents.addComponent("RenderComponent", new RenderComponent(10, 10, {} as SpriteData));
    entityWithTwoDifferentComponents.addComponent("PropComponent", new PropComponent());
    entityManager.addEntity(entityWithTwoDifferentComponents);
    entityWithTwoOverlappingComponents.addComponent("PropComponent", new PropComponent());
    entityWithTwoOverlappingComponents.addComponent("MovementComponent", new MovementComponent(new Vector2D(0, 0)));
    entityManager.addEntity(entityWithTwoOverlappingComponents);
  });

  describe('getEntitiesByComponent', () => {
    test('should be able to get entities by component', () => {
      const foundEntities = entityManager.getEntitiesByComponent("PositionComponent");
      expect(foundEntities).toEqual([entity]);
      expect(foundEntities).toHaveLength(1);
      const positionComponent = foundEntities[0].getComponent<PositionComponent>("PositionComponent");
      expect(positionComponent).toBeDefined();
      expect(positionComponent?.position.x).toBe(0);
      expect(positionComponent?.position.y).toBe(0);
    });
  });

  describe("getEntityByName", () => {
    test("should fetch an entity by it's name", () => {
      let entity = entityManager.getEntityByName("EntityWithTwoComponents");
      expect(entity).toBeDefined();
      expect(entity).toBe(entityWithTwoComponents);
    });

    test("should return undefined", () => {
      let entity = entityManager.getEntityByName("NonExistingEntityName");
      expect(entity).toBeUndefined();
    });
  });

  describe('getEntitiesByComponents', () => {
    test("should return all entities when given an empty array", () => {
      let entities = entityManager.getEntitiesByComponents([]);
      expect(entities).toHaveLength(5);
    });

    test("should find the only entity with these two components", () => {
      let entities = entityManager.getEntitiesByComponents(["MovementComponent", "CombatComponent"]);
      expect(entities).toHaveLength(1);
      expect(entities[0]).toBe(entityWithTwoComponents);
      expect(entities[0].hasComponent("MovementComponent")).toBe(true);
      expect(entities[0].hasComponent("CombatComponent")).toBe(true);

      entities = entityManager.getEntitiesByComponents(["RenderComponent", "PropComponent"]);
      expect(entities).toHaveLength(1);
      expect(entities[0]).toBe(entityWithTwoDifferentComponents);
      expect(entities[0].hasComponent("PropComponent")).toBe(true);
      expect(entities[0].hasComponent("RenderComponent")).toBe(true);

      entities = entityManager.getEntitiesByComponents(["PropComponent", "MovementComponent"]);
      expect(entities).toHaveLength(1);
      expect(entities[0]).toBe(entityWithTwoOverlappingComponents);
      expect(entities[0].hasComponent("PropComponent")).toBe(true);
      expect(entities[0].hasComponent("MovementComponent")).toBe(true);

      entities = entityManager.getEntitiesByComponents(["MovementComponent"]);
      expect(entities).toHaveLength(2);
    });
  });
});
