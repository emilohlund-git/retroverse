"use strict";
(() => {
  // src/Game.ts
  var Game = class {
    constructor(entityManager) {
      this.entityManager = entityManager;
      this.lastUpdateTime = 0;
      this.systems = /* @__PURE__ */ new Set();
    }
    addSystem(system) {
      this.systems.add(system);
    }
    addSystems(systems) {
      systems.forEach((system) => this.systems.add(system));
    }
    gameLoop() {
      const now = Date.now();
      const deltaTime = now - this.lastUpdateTime;
      this.lastUpdateTime = now;
      this.update(deltaTime);
      requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(deltaTime) {
      for (const system of this.systems) {
        system.update(deltaTime, this.entityManager);
      }
      this.debug();
    }
    debug() {
      const entity = this.entityManager.getEntitiesByComponent("PlayerComponent")[0];
      const debugComponent = entity.getComponent("DebugComponent");
      if (debugComponent) {
        debugComponent.debug();
      }
    }
    run() {
      for (const system of this.systems) {
        system.preload(this.entityManager);
      }
      this.gameLoop();
    }
  };

  // src/entities/EntityManager.ts
  var EntityManager = class {
    constructor() {
      this.entities = [];
    }
    addEntity(entity) {
      this.entities.push(entity);
    }
    addEntities(entities) {
      this.entities.push(...entities);
    }
    getEntityByName(name) {
      return this.entities.find((e) => e.name === name);
    }
    getEntitiesByComponent(componentName) {
      return this.entities.filter((value) => value.getComponent(componentName) !== void 0);
    }
    getEntitiesByComponents(components) {
      const uniqueEntities = /* @__PURE__ */ new Set();
      this.entities.forEach((entity) => {
        if (components.every((c) => entity.getComponent(c) !== void 0)) {
          uniqueEntities.add(entity);
        }
      });
      return Array.from(uniqueEntities);
    }
  };

  // src/utils/SpriteSheetParser.ts
  var SpriteSheetParser = class {
    static {
      this.spriteSheets = {};
    }
    static loadImage(url, imageWidth, imageHeight) {
      return new Promise((resolve, reject) => {
        const image = new Image(imageWidth, imageHeight);
        image.onerror = reject;
        image.src = url;
        image.onload = () => resolve(image);
      });
    }
    static async extractSprites(entityId, spriteSheetName, spriteWidth, spriteHeight, imageWidth, imageHeight, spriteSheetUrl) {
      try {
        const spriteSheetImage = await this.loadImage(spriteSheetUrl, imageWidth, imageHeight);
        const numRows = Math.floor(spriteSheetImage.height / spriteHeight);
        const numCols = Math.floor(spriteSheetImage.width / spriteWidth);
        const sprites = {};
        for (let row = 0; row < numRows; row++) {
          sprites[row] = {};
          for (let col = 0; col < numCols; col++) {
            sprites[row][col] = {
              image: spriteSheetImage,
              x: col * spriteWidth,
              y: row * spriteHeight,
              width: spriteWidth,
              height: spriteHeight
            };
          }
        }
        if (!this.spriteSheets[entityId]) {
          this.spriteSheets[entityId] = {};
        }
        this.spriteSheets[entityId][spriteSheetName] = sprites;
      } catch (error) {
        console.error(`Error loading sprite sheet: ${spriteSheetUrl}`);
      }
    }
    static getSprite(entityId, spriteSheetName, row, col) {
      const entitySpriteSheets = this.spriteSheets[entityId];
      if (!entitySpriteSheets)
        return void 0;
      const sprites = entitySpriteSheets[spriteSheetName];
      if (!sprites)
        return void 0;
      return sprites[row]?.[col];
    }
    static getSpriteSheet(entityId, spriteSheetName) {
      const entitySpriteSheet = this.spriteSheets[entityId];
      if (!entitySpriteSheet)
        return void 0;
      const spriteSheet = entitySpriteSheet[spriteSheetName];
      if (!spriteSheet)
        return void 0;
      return spriteSheet;
    }
  };

  // src/sprites/animations/Animation.ts
  var Animation = class {
    constructor(name, frames, animationSpeed, loop, priority = 0) {
      this.name = name;
      this.frames = frames;
      this.animationSpeed = animationSpeed;
      this.loop = loop;
      this.priority = priority;
    }
  };

  // src/sprites/animations/animationFactory.ts
  function createEntityAnimations(entityId) {
    const animations = /* @__PURE__ */ new Map();
    switch (entityId) {
      case "player":
        animations.set("idle", createAnimationFromSpriteSheet(entityId, "idle", 1, 8, 5e-3, true));
        animations.set("idle-up", createAnimationFromSpriteSheet(entityId, "idle", 3, 8, 5e-3, true));
        animations.set("run", createAnimationFromSpriteSheet(entityId, "run", 1, 4, 5e-3, true));
        animations.set("run-up", createAnimationFromSpriteSheet(entityId, "run", 3, 4, 5e-3, true));
        animations.set("attack", createAnimationFromSpriteSheet(entityId, "attack", 1, 4, 0.01, false));
        animations.set("attack-up", createAnimationFromSpriteSheet(entityId, "attack", 3, 4, 0.01, false));
        animations.set("hurt", createAnimationFromSpriteSheet(entityId, "hurt", 1, 4, 0.01, false));
        animations.set("death", createAnimationFromSpriteSheet(entityId, "die", 0, 12, 0.01, false));
        break;
      case "enemy":
        animations.set("idle", createAnimationFromSpriteSheet(entityId, "idle", 1, 8, 5e-3, true));
        animations.set("idle-up", createAnimationFromSpriteSheet(entityId, "idle", 3, 8, 5e-3, true));
        animations.set("run", createAnimationFromSpriteSheet(entityId, "run", 1, 4, 5e-3, true));
        animations.set("run-up", createAnimationFromSpriteSheet(entityId, "run", 3, 4, 5e-3, true));
        animations.set("attack", createAnimationFromSpriteSheet(entityId, "attack", 1, 4, 0.01, false));
        animations.set("attack-up", createAnimationFromSpriteSheet(entityId, "attack", 3, 4, 0.01, false));
        animations.set("hurt", createAnimationFromSpriteSheet(entityId, "hurt", 1, 4, 0.01, false));
        animations.set("death", createAnimationFromSpriteSheet(entityId, "die", 0, 12, 0.01, false));
        break;
      case "torch":
        animations.set("fire", createAnimationFromSpriteSheet(entityId, "fire", 0, 8, 5e-3, true));
        break;
    }
    return animations;
  }
  function createAnimationFromSpriteSheet(entityId, animationName, row, numFrames, frameDuration, loop) {
    const spriteSheet = SpriteSheetParser.getSpriteSheet(entityId, animationName);
    if (!spriteSheet) {
      throw new Error(`Sprite sheet not found for entityId: ${entityId} and animation: ${animationName}`);
    }
    const frames = [];
    for (let col = 0; col < numFrames; col++) {
      const spriteData = spriteSheet[row][col];
      if (!spriteData) {
        throw new Error(`Sprite data not found for row: ${row} and col: ${col} in ${entityId}-${animationName}`);
      }
      frames.push(spriteData);
    }
    return new Animation(animationName, frames, frameDuration, loop);
  }

  // src/components/Component.ts
  var Component = class {
  };

  // src/components/AIComponent.ts
  var AIComponent = class extends Component {
    constructor(aggroRange, hasLineOfSight = false, isChasing = false) {
      super();
      this.aggroRange = aggroRange;
      this.hasLineOfSight = hasLineOfSight;
      this.isChasing = isChasing;
    }
  };

  // src/components/AnimationComponent.ts
  var AnimationComponent = class extends Component {
    constructor(animations = /* @__PURE__ */ new Map(), currentAnimation = "", currentFrameIndex = 0, currentAnimationTime = 0, isPlaying = false, frameWidth = 32, frameHeight = 32, state) {
      super();
      this.animations = animations;
      this.currentAnimation = currentAnimation;
      this.currentFrameIndex = currentFrameIndex;
      this.currentAnimationTime = currentAnimationTime;
      this.isPlaying = isPlaying;
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;
      this.state = state;
    }
    addAnimation(animation) {
      this.animations.set(animation.name, animation);
    }
    playAnimation(animationName) {
      if (this.animations.has(animationName)) {
        this.currentAnimation = animationName;
        this.isPlaying = true;
      }
    }
    stopAnimation() {
      this.isPlaying = false;
      this.currentFrameIndex = 0;
      this.currentAnimationTime = 0;
      this.currentAnimation = "";
    }
  };

  // src/components/CollisionComponent.ts
  var CollisionComponent = class extends Component {
    constructor(collisionType = "box" /* BOX */, offsetX = 0, offsetY = 0, width, height) {
      super();
      this.collisionType = collisionType;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.width = width;
      this.height = height;
      this.collisionDetails = {
        top: false,
        left: false,
        right: false,
        bottom: false
      };
    }
  };

  // src/components/CombatCompontent.ts
  var CombatComponent = class extends Component {
    constructor(isAttacking = false, attackInitiated = false, isHurt = false, attackRange = 10, attackPower = 9, defense = 4, health = 20, maxHealth = 20, isDead = false, attackCooldown = 0, lastAttackTime = 0, knockbackDistance = 10) {
      super();
      this.isAttacking = isAttacking;
      this.attackInitiated = attackInitiated;
      this.isHurt = isHurt;
      this.attackRange = attackRange;
      this.attackPower = attackPower;
      this.defense = defense;
      this.health = health;
      this.maxHealth = maxHealth;
      this.isDead = isDead;
      this.attackCooldown = attackCooldown;
      this.lastAttackTime = lastAttackTime;
      this.knockbackDistance = knockbackDistance;
    }
  };

  // src/components/DebugComponent.ts
  var DebugComponent = class extends Component {
    constructor(entityManager, excludedComponents2 = []) {
      super();
      this.entityManager = entityManager;
      this.excludedComponents = excludedComponents2;
      this.debugDiv = document.createElement("div");
      this.debugDiv.id = "debug-window";
      document.getElementById("debug-container")?.appendChild(this.debugDiv);
    }
    debug() {
      this.debugDiv.innerHTML = "";
      const debugEntities = this.entityManager.getEntitiesByComponent("DebugComponent");
      for (const entity of debugEntities) {
        const components = entity.getComponents();
        components.forEach((component) => {
          if (!this.excludedComponents.includes(component.constructor.name)) {
            this.addDebugInfoForComponent(component.constructor.name, component);
          }
        });
      }
    }
    addDebugInfoForComponent(componentName, component) {
      const componentTitle = document.createElement("h2");
      componentTitle.innerText = componentName;
      this.debugDiv.appendChild(componentTitle);
      this.handleComponentProperties(component);
    }
    handleComponentProperties(component) {
      const componentKeys = Object.entries(component);
      const debugSpan = document.createElement("span");
      const toAdd = [];
      for (const key of componentKeys) {
        if (key)
          toAdd.push(key);
      }
      debugSpan.innerHTML += JSON.stringify(toAdd, null, 3);
      this.debugDiv.appendChild(debugSpan);
    }
  };

  // src/components/InteractableComponent.ts
  var InteractableComponent = class extends Component {
    constructor(interacting = false, conditions = [], interactionAction, interactionItemName) {
      super();
      this.interacting = interacting;
      this.conditions = conditions;
      this.interactionAction = interactionAction;
      this.interactionItemName = interactionItemName;
    }
  };

  // src/components/InventoryComponent.ts
  var InventoryComponent = class extends Component {
    constructor(items = [], maxCapacity = 10, pickingUp = false) {
      super();
      this.items = items;
      this.maxCapacity = maxCapacity;
      this.pickingUp = pickingUp;
    }
    addItems(items) {
      this.items.push(...items);
    }
    addItem(item) {
      this.items.push(item);
    }
    removeItem(item) {
      this.items.splice(this.items.indexOf(item), 1);
    }
  };

  // src/components/LayerComponent.ts
  var LayerComponent = class extends Component {
    constructor(layer = 0) {
      super();
      this.layer = layer;
    }
  };

  // src/components/MovementComponent.ts
  var MovementComponent = class extends Component {
    constructor(direction, moveSpeed = 0, currentFacingAngle = 0) {
      super();
      this.direction = direction;
      this.moveSpeed = moveSpeed;
      this.currentFacingAngle = currentFacingAngle;
    }
  };

  // src/components/PlayerComponent.ts
  var PlayerComponent = class extends Component {
  };

  // src/components/PositionComponent.ts
  var PositionComponent = class extends Component {
    constructor(position) {
      super();
      this.position = position;
    }
  };

  // src/components/PropComponent.ts
  var PropComponent = class extends Component {
    constructor() {
      super();
    }
  };

  // src/components/RenderComponent.ts
  var RenderComponent = class extends Component {
    constructor(width, height, spriteData, spriteSheet, tiled, frameX = 0, frameY = 0) {
      super();
      this.width = width;
      this.height = height;
      this.spriteData = spriteData;
      this.spriteSheet = spriteSheet;
      this.tiled = tiled;
      this.frameX = frameX;
      this.frameY = frameY;
      this.flipped = false;
    }
  };

  // src/components/SolidComponent.ts
  var SolidComponent = class extends Component {
    constructor(spriteData) {
      super();
      this.spriteData = spriteData;
    }
  };

  // src/entities/Entity.ts
  var Entity = class {
    constructor(name) {
      this.name = name;
      this.components = /* @__PURE__ */ new Map();
    }
    addComponent(componentName, component) {
      this.components.set(componentName, component);
      return component;
    }
    hasComponent(componentName) {
      return this.components.has(componentName);
    }
    getComponent(componentName) {
      return this.components.get(componentName);
    }
    getComponents() {
      return Array.from(this.components.values());
    }
    removeComponent(componentName) {
      this.components.delete(componentName);
    }
  };

  // src/utils/EntityFactory.ts
  var EntityFactory = class _EntityFactory {
    constructor() {
      this.entity = new Entity("");
    }
    static create() {
      return new _EntityFactory();
    }
    name(name) {
      this.entity.name = name;
      return this;
    }
    position(position) {
      this.entity.addComponent("PositionComponent", new PositionComponent(position));
      return this;
    }
    interactable(conditions, interactionAction, interactionItemName) {
      this.entity.addComponent("InteractableComponent", new InteractableComponent(false, conditions, interactionAction, interactionItemName));
      return this;
    }
    prop() {
      this.entity.addComponent("PropComponent", new PropComponent());
      return this;
    }
    size(width, height) {
      const renderComponent = this.ensureRenderComponent();
      renderComponent.width = width;
      renderComponent.height = height;
      return this;
    }
    combat() {
      this.entity.addComponent("CombatComponent", new CombatComponent());
      return this;
    }
    inventory(maxCapacity, items = []) {
      const inventoryComponent = new InventoryComponent(items, maxCapacity);
      this.entity.addComponent("InventoryComponent", inventoryComponent);
      return this;
    }
    tiled(tiled) {
      const renderComponent = this.ensureRenderComponent();
      renderComponent.tiled = tiled;
      return this;
    }
    solid(spriteData) {
      this.entity.addComponent("SolidComponent", new SolidComponent(spriteData));
      return this;
    }
    collision(collisionType, offsetX, offsetY, width, height) {
      this.entity.addComponent("CollisionComponent", new CollisionComponent(collisionType, offsetX, offsetY, width, height));
      return this;
    }
    movement(movement, moveSpeed) {
      this.entity.addComponent("MovementComponent", new MovementComponent(movement, moveSpeed));
      return this;
    }
    layer(layer) {
      this.entity.addComponent("LayerComponent", new LayerComponent(layer));
      return this;
    }
    player() {
      this.entity.addComponent("PlayerComponent", new PlayerComponent());
      return this;
    }
    animations(animations, currentAnimation, isPlaying) {
      this.entity.addComponent("AnimationComponent", new AnimationComponent(animations, currentAnimation, 0, 10, isPlaying, 0, 0, 1 /* Finished */));
      return this;
    }
    ai(aggroRange) {
      this.entity.addComponent("AIComponent", new AIComponent(aggroRange));
      return this;
    }
    debug(entityManager, excludedComponents2) {
      this.entity.addComponent("DebugComponent", new DebugComponent(entityManager, excludedComponents2));
      return this;
    }
    build() {
      return this.entity;
    }
    ensureRenderComponent() {
      let renderComponent = this.entity.getComponent("RenderComponent");
      if (!renderComponent) {
        renderComponent = this.entity.addComponent("RenderComponent", new RenderComponent(0, 0, {}));
      }
      return renderComponent;
    }
  };

  // src/utils/Vector2D.ts
  var Vector2D = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    get length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
      const length = this.length;
      if (length !== 0) {
        this.x /= length;
        this.y /= length;
      }
    }
  };

  // src/entities/createPropsEntities.ts
  function createPropsEntities(entityManager, propsData) {
    for (const propData of propsData) {
      const propAnimations = createEntityAnimations(propData.name);
      const propEntity = EntityFactory.create().name(propData.name).size(propData.size[0], propData.size[1]).position(new Vector2D(propData.position.x, propData.position.y)).animations(propAnimations, propData.animationType, propData.isLooping).prop().layer(propData.layer).build();
      entityManager.addEntity(propEntity);
    }
  }

  // src/entities/enemyEntity.ts
  function createEnemyEntity(entityManager, name, positionX, positionY, animations, items) {
    const enemyEntity = EntityFactory.create().name(name).position(new Vector2D(positionX, positionY)).size(32, 32).movement(new Vector2D(0, 0), 1).collision("box" /* BOX */, 0, 0, 16, 16).combat().ai(50).animations(animations).inventory(10, items).layer(3).build();
    entityManager.addEntity(enemyEntity);
  }

  // src/utils/constants.ts
  var TILE_WIDTH = 32;
  var TILE_HEIGHT = 32;
  var LEVEL_WIDTH = 20;
  var LEVEL_HEIGHT = 15;

  // src/entities/playerEntity.ts
  var excludedComponents = ["DebugComponent", "PlayerComponent", "CollisionComponent", "RenderComponent", "MovementComponent", "PositionComponent", "AIComponent"];
  function createPlayerEntity(entityManager, animations) {
    const playerEntity = EntityFactory.create().name("player").position(new Vector2D(TILE_WIDTH * 1, TILE_HEIGHT * 1)).size(32, 32).movement(new Vector2D(0, 0), 1).collision("box" /* BOX */, 2, 0, 16, 16).player().combat().animations(animations).layer(2).inventory().debug(entityManager, excludedComponents).build();
    entityManager.addEntity(playerEntity);
  }

  // src/levels/LevelInitializer.ts
  var LevelInitializer = class {
    constructor(entityManager) {
      this.entityManager = entityManager;
    }
    async createEntitiesFromLevelArray(levelData, spriteSheets) {
      const entitiesToAdd = [];
      for (let i = 0; i < levelData.length; i++) {
        for (let j = 0; j < levelData[i].length; j++) {
          const [interactable, layer, hasCollision, spriteSheetIndex, spriteRow, spriteColumn] = levelData[i][j];
          const spriteSheet = spriteSheets[spriteSheetIndex];
          const spriteData = SpriteSheetParser.getSprite("dungeon-tiles", spriteSheet, spriteRow, spriteColumn);
          if (spriteData) {
            const tileEntity = this.createTileEntity(i, j, spriteData, layer, hasCollision);
            if (interactable === 1) {
              this.addInteractableComponent(tileEntity, "Key");
            }
            entitiesToAdd.push(tileEntity.build());
          }
        }
      }
      this.entityManager.addEntities(entitiesToAdd);
    }
    createTileEntity(i, j, spriteData, layer, hasCollision) {
      const tileEntity = EntityFactory.create().position(new Vector2D(i * 8, j * 8)).size(8, 8).layer(layer).solid(spriteData).tiled(true);
      if (hasCollision === 1) {
        tileEntity.collision("box" /* BOX */, -2, -2, 0, 0);
      }
      return tileEntity;
    }
    addInteractableComponent(entityFactory, interactionItemName) {
      const interactionAction = (inventory, interactable, interactableEntity) => {
        const itemToRemove = inventory.items.find((i) => i.name === interactable.interactionItemName);
        if (itemToRemove && interactable.interactionItemName) {
          inventory.removeItem(itemToRemove);
        }
        const solidComponent = interactableEntity.getComponent("SolidComponent");
        if (!solidComponent)
          return;
        solidComponent.spriteData.y += solidComponent.spriteData.height;
        interactableEntity.removeComponent("CollisionComponent");
      };
      const conditions = [{
        hasItem(inventory, item) {
          return inventory.items.findIndex((i) => i.name === item) !== -1;
        }
      }];
      entityFactory.interactable(conditions, interactionAction, interactionItemName);
    }
  };

  // src/components/ItemComponent.ts
  var ItemComponent = class extends Component {
    constructor(name, description, icon, dropPosition = new Vector2D(0, 0), isDropped = false) {
      super();
      this.name = name;
      this.description = description;
      this.icon = icon;
      this.dropPosition = dropPosition;
      this.isDropped = isDropped;
    }
  };

  // src/sprites/itemFactory.ts
  async function loadItems() {
    const items = [
      { name: "Cheese", description: "A cheese.", row: 4, col: 0 },
      { name: "Key", description: "A key", row: 5, col: 0 },
      { name: "Green Ring", description: "A green ring.", row: 5, col: 1 },
      { name: "Blue Ring", description: "A blue ring.", row: 4, col: 1 },
      { name: "Blue Potion", description: "A blue potion.", row: 0, col: 0 },
      { name: "Red Potion", description: "A red potion.", row: 1, col: 0 }
    ];
    const itemComponents = /* @__PURE__ */ new Map();
    for (const itemData of items) {
      const spriteData = SpriteSheetParser.getSprite("items", "all-items", itemData.row, itemData.col);
      if (spriteData) {
        const itemComponent = new ItemComponent(itemData.name, itemData.description, spriteData);
        itemComponents.set(itemData.name, itemComponent);
      } else {
        throw new Error(`Sprite data not found for item: ${itemData.name}`);
      }
    }
    return itemComponents;
  }

  // src/ai/BehaviorTree.ts
  var BehaviorTree = class {
    constructor(rootNode) {
      this.rootNode = rootNode;
    }
    tick(entityManager) {
      return this.rootNode.tick(entityManager);
    }
  };

  // src/utils/math.ts
  var clamp = (number, min, max) => {
    return Math.max(min, Math.min(number, max));
  };
  var calculateDistance = (pos1, pos2) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // src/ai/ChasePlayer.ts
  var ChasePlayer = class {
    constructor(aiPosition, playerPosition, enemyEntity, playerEntity) {
      this.aiPosition = aiPosition;
      this.playerPosition = playerPosition;
      this.enemyEntity = enemyEntity;
      this.playerEntity = playerEntity;
    }
    tick(entityManager) {
      if (!this.playerEntity) {
        return "FAILURE";
      }
      const playerPositionComponent = this.playerEntity.getComponent("PositionComponent");
      if (!playerPositionComponent)
        return "FAILURE";
      const playerCombatComponent = this.playerEntity.getComponent("CombatComponent");
      if (!playerCombatComponent)
        return "FAILURE";
      const aiComponent = this.enemyEntity.getComponent("AIComponent");
      if (!aiComponent)
        return "FAILURE";
      const positionComponent = this.enemyEntity.getComponent("PositionComponent");
      if (!positionComponent)
        return "FAILURE";
      const movementComponent = this.enemyEntity.getComponent("MovementComponent");
      if (!movementComponent)
        return "FAILURE";
      const combatComponent = this.enemyEntity.getComponent("CombatComponent");
      if (!combatComponent)
        return "FAILURE";
      const directionX = playerPositionComponent.position.x - positionComponent.position.x;
      const directionY = playerPositionComponent.position.y - positionComponent.position.y;
      const distanceToPlayer = Math.sqrt(directionX * directionX + directionY * directionY);
      if (distanceToPlayer <= aiComponent.aggroRange && this.hasLineOfSight(entityManager, positionComponent, playerPositionComponent, aiComponent) && !playerCombatComponent.isDead) {
        if (distanceToPlayer < 10) {
          aiComponent.isChasing = false;
          if (combatComponent.attackCooldown < 1) {
            combatComponent.isAttacking = true;
          }
          movementComponent.direction.x = 0;
          movementComponent.direction.y = 0;
          return "SUCCESS";
        } else {
          aiComponent.isChasing = true;
          combatComponent.attackInitiated = false;
          combatComponent.isAttacking = false;
          movementComponent.direction.x = clamp(-directionX, -1, 1);
          movementComponent.direction.y = clamp(directionY, -1, 1);
        }
      } else {
        aiComponent.isChasing = false;
        combatComponent.attackInitiated = false;
        combatComponent.isAttacking = false;
        movementComponent.direction.x = 0;
        movementComponent.direction.y = 0;
        return "SUCCESS";
      }
      return "RUNNING";
    }
    hasLineOfSight(entityManager, entityPosition, playerPosition, aiComponent) {
      const obstacles = entityManager.getEntitiesByComponents(["SolidComponent", "CollisionComponent"]);
      const directionX = playerPosition.position.x - entityPosition.position.x;
      const directionY = playerPosition.position.y - entityPosition.position.y;
      const distanceToPlayer = Math.sqrt(directionX * directionX + directionY * directionY);
      const normalizedDirectionX = directionX / distanceToPlayer;
      const normalizedDirectionY = directionY / distanceToPlayer;
      const numIntervals = 80;
      for (let i = 1; i <= numIntervals; i++) {
        const intervalFactor = i / numIntervals;
        const stepX = entityPosition.position.x + intervalFactor * normalizedDirectionX * distanceToPlayer;
        const stepY = entityPosition.position.y + intervalFactor * normalizedDirectionY * distanceToPlayer;
        for (const obstacleEntity of obstacles) {
          const obstaclePosition = obstacleEntity.getComponent("PositionComponent");
          const collisionComponent = obstacleEntity.getComponent("CollisionComponent");
          if (!collisionComponent || !obstaclePosition)
            continue;
          if (this.isObstacleBetweenPoints(entityPosition.position, { x: stepX, y: stepY }, obstaclePosition.position, collisionComponent.collisionDetails)) {
            aiComponent.hasLineOfSight = false;
            return false;
          }
        }
      }
      aiComponent.hasLineOfSight = true;
      return true;
    }
    isObstacleBetweenPoints(startPoint, endPoint, obstaclePosition, collisionDetails) {
      const obstacleTopLeft = { x: obstaclePosition.x, y: obstaclePosition.y };
      const obstacleBottomRight = {
        x: obstaclePosition.x + (collisionDetails.right ? 1 : 0),
        y: obstaclePosition.y + (collisionDetails.bottom ? 1 : 0)
      };
      if (startPoint.x >= obstacleTopLeft.x && startPoint.x <= obstacleBottomRight.x || endPoint.x >= obstacleTopLeft.x && endPoint.x <= obstacleBottomRight.x) {
        if (startPoint.y >= obstacleTopLeft.y && startPoint.y <= obstacleBottomRight.y || endPoint.y >= obstacleTopLeft.y && endPoint.y <= obstacleBottomRight.y) {
          return true;
        }
      }
      return false;
    }
  };

  // src/ai/SelectorNode.ts
  var SelectorNode = class {
    constructor(children) {
      this.children = children;
    }
    tick(entityManager) {
      for (const child of this.children) {
        const status = child.tick(entityManager);
        if (status === "SUCCESS") {
          return "SUCCESS";
        }
      }
      return "FAILURE";
    }
  };

  // src/systems/System.ts
  var System = class {
  };

  // src/systems/AISystem.ts
  var AISystem = class extends System {
    constructor(entityManager) {
      super();
      this.entityManager = entityManager;
      this.behaviorTrees = /* @__PURE__ */ new Map();
      const aiEntities = entityManager.getEntitiesByComponent("AIComponent");
      const playerEntity = entityManager.getEntitiesByComponent("PlayerComponent")[0];
      for (const enemyEntity of aiEntities) {
        const positionComponent = enemyEntity.getComponent("PositionComponent");
        if (!positionComponent)
          continue;
        const playerPositionComponent = playerEntity.getComponent("PositionComponent");
        if (!playerPositionComponent)
          continue;
        const behaviorTree = this.createBehaviorTree(positionComponent.position, playerPositionComponent.position, enemyEntity, playerEntity);
        this.behaviorTrees.set(enemyEntity.name, behaviorTree);
      }
    }
    preload() {
    }
    update(_, entityManager) {
      this.behaviorTrees.forEach((behaviorTree, _2) => {
        behaviorTree.tick(entityManager);
      });
    }
    render() {
    }
    createBehaviorTree(aiPosition, playerPosition, enemyEntity, playerEntity) {
      const chasePlayerNode = new ChasePlayer(aiPosition, playerPosition, enemyEntity, playerEntity);
      const rootSelector = new SelectorNode([
        chasePlayerNode
      ]);
      return new BehaviorTree(rootSelector);
    }
  };

  // src/systems/AnimationSystem.ts
  var AnimationSystem = class extends System {
    // Whether the animation is currently playing
    constructor() {
      super();
      this.animations = /* @__PURE__ */ new Map();
      this.currentAnimation = "";
      // Name of the current animation
      this.currentFrameIndex = 0;
      // Current frame index in the animation
      this.currentAnimationTime = 0;
      // Time elapsed for the current animation frame
      this.isPlaying = false;
    }
    preload() {
    }
    update(deltaTime, entityManager) {
      const entitiesWithAnimations = entityManager.getEntitiesByComponent("AnimationComponent");
      for (const entity of entitiesWithAnimations) {
        const animationComponent = entity.getComponent("AnimationComponent");
        if (!animationComponent)
          continue;
        const renderComponent = entity.getComponent("RenderComponent");
        const combatComponent = entity.getComponent("CombatComponent");
        if (!animationComponent.isPlaying || !renderComponent || !animationComponent.currentAnimation) {
          continue;
        }
        animationComponent.state = 0 /* Playing */;
        const animation = animationComponent.animations.get(animationComponent.currentAnimation);
        if (!animation) {
          continue;
        }
        if (animation.name !== animationComponent.currentAnimation && animationComponent.currentAnimation !== "attack" && animationComponent.currentAnimation !== "hurt" && animationComponent.currentAnimation !== "attack" && animationComponent.currentAnimation !== "attack-up" && animationComponent.currentAnimation !== "death")
          animationComponent.currentFrameIndex = 0;
        animationComponent.currentAnimationTime += deltaTime;
        const frameDuration = 1 / animation.animationSpeed;
        if (animationComponent.currentAnimationTime >= frameDuration) {
          const frameIndexIncrement = Math.floor(animationComponent.currentAnimationTime / frameDuration);
          const totalFrames = animation.frames.length;
          if (!animation.loop) {
            if (animationComponent.currentFrameIndex >= totalFrames - 1) {
              animationComponent.state = 1 /* Finished */;
              if (combatComponent) {
                if (combatComponent.isHurt) {
                  combatComponent.isHurt = false;
                }
              }
              if (animationComponent.currentAnimation === "attack" || animationComponent.currentAnimation === "attack-up") {
                if (combatComponent) {
                  combatComponent.isAttacking = false;
                }
              }
              continue;
            }
          }
          animationComponent.currentFrameIndex = (animationComponent.currentFrameIndex + frameIndexIncrement) % animation.frames.length;
          animationComponent.currentAnimationTime %= frameDuration;
        }
      }
    }
    render() {
    }
    getCurrentSpriteData() {
      const animation = this.animations.get(this.currentAnimation);
      return animation ? animation.frames[this.currentFrameIndex] : void 0;
    }
    stopAnimation() {
      this.isPlaying = false;
      this.currentAnimation = "";
      this.currentFrameIndex = 0;
      this.currentAnimationTime = 0;
    }
  };

  // src/systems/CollisionSystem.ts
  var CollisionSystem = class extends System {
    constructor() {
      super();
    }
    preload() {
    }
    update(deltaTime, entityManager) {
      const solidEntities = entityManager.getEntitiesByComponent("SolidComponent");
      const collisionEntities = entityManager.getEntitiesByComponent("MovementComponent");
      if (!collisionEntities)
        return;
      for (const entity of collisionEntities) {
        const collisionComponent = entity.getComponent("CollisionComponent");
        if (!collisionComponent)
          continue;
        const shapeA = collisionComponent.collisionType;
        if (shapeA === "box" /* BOX */)
          this.handleBoxCollision(entity, solidEntities);
        if (shapeA === "circle" /* CIRCLE */)
          this.handleCircleCollision();
      }
    }
    render() {
    }
    handleBoxCollision(entity, collisionEntities) {
      const collisionComponent = entity.getComponent("CollisionComponent");
      if (!collisionComponent)
        return;
      collisionComponent.collisionDetails = {
        top: false,
        left: false,
        right: false,
        bottom: false
      };
      for (const otherEntity of collisionEntities) {
        if (otherEntity === entity)
          continue;
        const otherCollisionComponent = otherEntity.getComponent("CollisionComponent");
        if (!otherCollisionComponent)
          continue;
        const shapeB = otherCollisionComponent.collisionType;
        if (shapeB === "box" /* BOX */) {
          this.checkSATCollision(entity, otherEntity);
        } else if (shapeB === "circle" /* CIRCLE */) {
        }
      }
    }
    handleCircleCollision() {
    }
    checkAABBIntersection(x1, y1, w1, h1, x2, y2, w2, h2) {
      return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }
    checkCircleIntersection(x1, y1, radius1, x2, y2, radius2) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      const distanceSquared = dx * dx + dy * dy;
      const radiusSum = radius1 + radius2;
      return distanceSquared < radiusSum * radiusSum;
    }
    checkSATCollision(entityA, entityB) {
      const collisionComponentA = entityA.getComponent("CollisionComponent");
      if (!collisionComponentA)
        return false;
      const collisionComponentB = entityB.getComponent("CollisionComponent");
      if (!collisionComponentB)
        return false;
      const positionComponentA = entityA.getComponent("PositionComponent");
      if (!positionComponentA)
        return false;
      const positionComponentB = entityB.getComponent("PositionComponent");
      if (!positionComponentB)
        return false;
      const renderComponentA = entityA.getComponent("RenderComponent");
      if (!renderComponentA)
        return false;
      const renderComponentB = entityB.getComponent("RenderComponent");
      if (!renderComponentB)
        return false;
      const { width: collisionWidthA, height: collisionHeightA, offsetX: offsetXA, offsetY: offsetYA } = collisionComponentA;
      const { width: collisionWidthB, height: collisionHeightB, offsetX: offsetXB, offsetY: offsetYB } = collisionComponentB;
      const { width: renderWidthA, height: renderHeightA } = renderComponentA;
      const { width: renderWidthB, height: renderHeightB } = renderComponentB;
      const { x: xA, y: yA } = positionComponentA.position;
      const { x: xB, y: yB } = positionComponentB.position;
      const halfWidthA = (collisionWidthA ?? renderWidthA) * 0.5;
      const halfHeightA = (collisionHeightA ?? renderHeightA) * 0.5;
      const halfWidthB = (collisionWidthB ?? renderWidthB) * 0.5;
      const halfHeightB = (collisionHeightB ?? renderHeightB) * 0.5;
      const centerA = { x: xA + halfWidthA + offsetXA, y: yA + halfHeightA + offsetYA };
      const centerB = { x: xB + halfWidthB + offsetXB, y: yB + halfHeightB + offsetYB };
      const dx = centerA.x - centerB.x;
      const dy = centerA.y - centerB.y;
      const overlapX = halfWidthA + halfWidthB - Math.abs(dx);
      const overlapY = halfHeightA + halfHeightB - Math.abs(dy);
      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          if (dx < 0) {
            collisionComponentA.collisionDetails.right = true;
            collisionComponentB.collisionDetails.left = true;
          } else {
            collisionComponentA.collisionDetails.left = true;
            collisionComponentB.collisionDetails.right = true;
          }
        } else {
          if (dy < 0) {
            collisionComponentA.collisionDetails.bottom = true;
            collisionComponentB.collisionDetails.top = true;
          } else {
            collisionComponentA.collisionDetails.top = true;
            collisionComponentB.collisionDetails.bottom = true;
          }
        }
        return true;
      }
      return false;
    }
  };

  // src/systems/CombatSystem.ts
  var CombatSystem = class extends System {
    constructor() {
      super();
      this.attackCooldownIntervals = /* @__PURE__ */ new Map();
    }
    preload() {
    }
    update(deltaTime, entityManager) {
      const entitiesWithCombat = entityManager.getEntitiesByComponent("CombatComponent");
      for (const attacker of entitiesWithCombat) {
        const attackerCombat = attacker.getComponent("CombatComponent");
        if (!attackerCombat)
          continue;
        if (this.attackCooldownIntervals.has(attacker)) {
          continue;
        }
        const attackerPosition = attacker.getComponent("PositionComponent")?.position;
        if (!attackerPosition)
          continue;
        const attackerAnimation = attacker.getComponent("AnimationComponent");
        const attackerMovement = attacker.getComponent("MovementComponent");
        if (!attackerMovement)
          continue;
        if (!attackerCombat.isAttacking)
          continue;
        if (!attackerAnimation)
          continue;
        attackerCombat.attackCooldown = 10;
        this.startAttackCooldownInterval(attackerCombat, attacker);
        const closestTarget = this.calculateClosestTarget(
          entitiesWithCombat,
          attacker,
          attackerPosition,
          attackerCombat,
          attackerMovement
        );
        if (closestTarget) {
          this.handleAttack(attacker, closestTarget, entityManager);
        }
      }
    }
    render() {
    }
    startAttackCooldownInterval(attackerCombat, attacker) {
      const interval = setInterval(() => {
        if (attackerCombat.attackCooldown > 0) {
          attackerCombat.attackCooldown--;
        } else {
          attackerCombat.attackInitiated = false;
          attackerCombat.isAttacking = false;
          clearInterval(interval);
          this.attackCooldownIntervals.delete(attacker);
        }
      }, 100);
      this.attackCooldownIntervals.set(attacker, interval);
      return interval;
    }
    calculateClosestTarget(entitiesWithCombat, attacker, attackerPosition, attackerCombat, attackerMovement) {
      let closestTarget = null;
      let closestDistanceSq = Infinity;
      for (const potentialTarget of entitiesWithCombat) {
        if (potentialTarget === attacker)
          continue;
        const targetPosition = potentialTarget.getComponent("PositionComponent")?.position;
        if (!targetPosition)
          return null;
        const diffX = targetPosition.x - attackerPosition.x;
        const diffY = targetPosition.y - attackerPosition.y;
        const distanceSq = diffX * diffX + diffY * diffY;
        if (distanceSq < attackerCombat.attackRange ** 2 && distanceSq < closestDistanceSq) {
          const angleToTarget = Math.atan2(targetPosition.y - attackerPosition.y, targetPosition.x - attackerPosition.x);
          const angleDifference = angleToTarget - attackerMovement.currentFacingAngle;
          const adjustedAngleDifference = (angleDifference + Math.PI) % (2 * Math.PI) - Math.PI;
          const allowedAngleDifference = Math.PI / 180 * 45;
          if (Math.abs(adjustedAngleDifference) >= allowedAngleDifference && distanceSq < attackerCombat.attackRange ** 2 && distanceSq < closestDistanceSq) {
            closestTarget = potentialTarget;
            closestDistanceSq = distanceSq;
          }
        }
      }
      return closestTarget;
    }
    handleAttack(attacker, target, entityManager) {
      const attackerCombat = attacker.getComponent("CombatComponent");
      const targetCombat = target.getComponent("CombatComponent");
      const targetAnimationComponent = target.getComponent("AnimationComponent");
      const targetInventoryComponent = target.getComponent("InventoryComponent");
      const targetPositionComponent = target.getComponent("PositionComponent");
      const world = entityManager.getEntityByName("world-inventory");
      const worldInventory = world?.getComponent("InventoryComponent");
      if (!worldInventory)
        return;
      if (!attackerCombat || !targetCombat || !targetPositionComponent)
        return;
      if (!targetCombat.isDead)
        targetCombat.isHurt = true;
      const damage = Math.max(attackerCombat.attackPower - targetCombat.defense, 0);
      targetCombat.health = targetCombat.health - damage;
      if (targetCombat.health <= 0) {
        if (!targetCombat.isDead) {
          targetCombat.isDead = true;
          if (targetInventoryComponent) {
            for (const item of targetInventoryComponent.items) {
              const randomXOffset = Math.random() * 10 - -10;
              const randomYOffset = Math.random() * 10;
              item.dropPosition = new Vector2D(
                targetPositionComponent.position.x + randomXOffset,
                targetPositionComponent.position.y - randomYOffset
              );
              item.isDropped = true;
              worldInventory.addItem(item);
            }
            if (targetAnimationComponent) {
              targetAnimationComponent.currentFrameIndex = 0;
              targetAnimationComponent.playAnimation("death");
            }
            target.removeComponent("InventoryComponent");
            target.removeComponent("AIComponent");
            target.removeComponent("MovementComponent");
            target.removeComponent("CombatComponent");
          }
        }
      }
    }
  };

  // src/systems/InputSystem.ts
  var InputSystem = class extends System {
    constructor() {
      super();
      this.pressedKeys = /* @__PURE__ */ new Set();
      window.addEventListener("keydown", this.handleKeyDown.bind(this));
      window.addEventListener("keyup", this.handleKeyUp.bind(this));
      window.addEventListener("blur", this.handleBlur.bind(this));
    }
    preload() {
    }
    update(deltaTime, entityManager) {
      const interactableEntities = entityManager.getEntitiesByComponent("InteractableComponent");
      const player = entityManager.getEntitiesByComponent("PlayerComponent")[0];
      const movementComponent = player.getComponent("MovementComponent");
      if (!movementComponent)
        return;
      const combatComponent = player.getComponent("CombatComponent");
      if (!combatComponent)
        return;
      const animationComponent = player.getComponent("AnimationComponent");
      if (!animationComponent)
        return;
      const positionComponent = player.getComponent("PositionComponent");
      if (!positionComponent)
        return;
      const inventoryComponent = player.getComponent("InventoryComponent");
      if (!player)
        throw new Error("No player entity assigned.");
      if (!movementComponent)
        throw new Error("Player has no movement component.");
      let xDirection = 0;
      let yDirection = 0;
      if (!combatComponent.isAttacking) {
        if (this.pressedKeys.has("A")) {
          xDirection = 1;
        }
        if (this.pressedKeys.has("D")) {
          xDirection = -1;
        }
        if (this.pressedKeys.has("S")) {
          yDirection = 1;
        }
        if (this.pressedKeys.has("W")) {
          yDirection = -1;
        }
      }
      if (inventoryComponent) {
        if (this.pressedKeys.has("E")) {
          this.checkInteractions(interactableEntities, positionComponent.position);
          inventoryComponent.pickingUp = true;
        } else {
          inventoryComponent.pickingUp = false;
        }
      }
      if (combatComponent) {
        if (this.pressedKeys.has(" ") && !combatComponent.attackInitiated && combatComponent.attackCooldown < 1) {
          animationComponent.currentFrameIndex = 0;
          combatComponent.attackInitiated = true;
          combatComponent.isAttacking = true;
        } else if (!this.pressedKeys.has(" ")) {
          combatComponent.attackInitiated = false;
        }
      }
      movementComponent.direction.x = xDirection;
      movementComponent.direction.y = yDirection;
    }
    render() {
    }
    handleKeyDown(e) {
      this.pressedKeys.add(e.key.toUpperCase());
    }
    handleKeyUp(e) {
      this.pressedKeys.delete(e.key.toUpperCase());
    }
    handleBlur() {
      this.pressedKeys.clear();
    }
    checkInteractions(interactableEntities, playerPosition) {
      interactableEntities.forEach((i) => {
        const interactablePosition = i.getComponent("PositionComponent")?.position;
        const solidComponent = i.getComponent("SolidComponent");
        const interactableComponent = i.getComponent("InteractableComponent");
        if (interactablePosition && solidComponent && interactableComponent && !interactableComponent.interacting) {
          if (calculateDistance(playerPosition, interactablePosition) <= 15) {
            interactableComponent.interacting = true;
          }
        }
      });
    }
  };

  // src/systems/InteractionSystem.ts
  var InteractionSystem = class extends System {
    constructor() {
      super();
    }
    preload() {
    }
    update(deltaTime, entityManager) {
      const player = entityManager.getEntityByName("player");
      if (!player)
        throw new Error("Player not instantiated.");
      const playerInventory = player.getComponent("InventoryComponent");
      if (!playerInventory)
        return;
      const interactableEntities = entityManager.getEntitiesByComponent("InteractableComponent");
      for (const entity of interactableEntities) {
        const interactableComponent = entity.getComponent("InteractableComponent");
        if (!interactableComponent)
          continue;
        if (interactableComponent.interacting) {
          if (this.areConditionsSatisfied(entity, interactableComponent, playerInventory)) {
            interactableComponent.interactionAction(playerInventory, interactableComponent, entity);
            interactableComponent.interacting = false;
          }
        }
      }
    }
    render() {
    }
    areConditionsSatisfied(interactableEntity, interactable, inventory) {
      for (const condition of interactable.conditions) {
        if (condition.hasItem) {
          if (!interactable.interactionItemName)
            continue;
          const conditionSatisfied = condition.hasItem(inventory, interactable.interactionItemName);
          if (!conditionSatisfied) {
            return false;
          }
        }
      }
      return true;
    }
  };

  // src/systems/InventorySystem.ts
  var InventorySystem = class extends System {
    constructor() {
      super();
      this.canvas = document.createElement("canvas");
      this.playerInventory = null;
      this.slotWidth = 16;
      this.slotHeight = 16;
      this.slotSpacing = 2;
      this.numSlotsPerRow = 10;
      this.hoveredItemIndex = null;
      this.tooltip = null;
      this.canvas.id = "inventory-canvas";
      const viewport = document.getElementById("viewport");
      if (!viewport)
        throw new Error("Viewport missing.");
      const context = this.canvas.getContext("2d");
      if (!context)
        throw new Error("Error initializing inventory context.");
      this.ctx = context;
      viewport.appendChild(this.canvas);
      this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
      this.canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    }
    preload(entityManager) {
    }
    update(deltaTime, entityManager) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const player = entityManager.getEntitiesByComponent("PlayerComponent")[0];
      const playerPosition = player.getComponent("PositionComponent")?.position;
      const inventory = player.getComponent("InventoryComponent");
      if (!inventory)
        return;
      this.playerInventory = inventory;
      this.updatePlayerInventory(inventory);
      if (playerPosition && inventory.pickingUp) {
        this.handlePickupInteraction(playerPosition, entityManager);
      }
    }
    render() {
    }
    updatePlayerInventory(inventory) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; i < inventory.maxCapacity; i++) {
        if (inventory.items[i]) {
          this.cropIconFromSpriteSheet(inventory.items[i].icon, i);
        }
      }
    }
    cropIconFromSpriteSheet(spriteData, slotIndex) {
      const numSlotsPerRow = 10;
      const x = slotIndex % numSlotsPerRow * (this.slotWidth + this.slotSpacing);
      const y = Math.floor(slotIndex / numSlotsPerRow) * (this.slotHeight + this.slotSpacing);
      this.ctx.fillStyle = "#888";
      this.ctx.fillRect(x, y, this.slotWidth, this.slotHeight);
      this.ctx.drawImage(
        spriteData.image,
        spriteData.x,
        spriteData.y,
        spriteData.width,
        spriteData.height,
        x,
        y,
        this.slotWidth,
        this.slotHeight
      );
    }
    handleMouseMove(event) {
      if (!this.playerInventory)
        return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const numSlotsPerRow = 10;
      const hoveredSlotIndex = Math.floor(mouseY / (this.slotHeight + this.slotHeight * 3 + this.slotSpacing)) * numSlotsPerRow + Math.floor(mouseX / (this.slotWidth + this.slotWidth * 3 + this.slotSpacing));
      if (hoveredSlotIndex >= 0 && hoveredSlotIndex < this.playerInventory.maxCapacity) {
        this.hoveredItemIndex = hoveredSlotIndex;
      } else {
        this.hoveredItemIndex = null;
      }
      this.updatePlayerInventory(this.playerInventory);
    }
    handleMouseLeave() {
      if (!this.playerInventory)
        return;
      this.hoveredItemIndex = null;
      this.updatePlayerInventory(this.playerInventory);
    }
    addToPlayerInventory(item) {
      this.playerInventory?.items.push(item);
    }
    handlePickupInteraction(playerPosition, entityManager) {
      if (!this.playerInventory)
        return;
      const world = entityManager.getEntityByName("world-inventory");
      if (!world)
        return;
      const worldInventory = world.getComponent("InventoryComponent");
      if (!worldInventory)
        return;
      for (const item of worldInventory.items) {
        if (item.isDropped) {
          const distanceToItem = this.calculateDistance(playerPosition, item.dropPosition);
          const pickupDistance = 20;
          if (distanceToItem <= pickupDistance && this.playerInventory.items.length <= this.playerInventory.maxCapacity) {
            this.playerInventory.items.push(item);
            item.isDropped = false;
            break;
          }
        }
      }
    }
    calculateDistance(pos1, pos2) {
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };

  // src/sprites/animations/AnimationController.ts
  var AnimationController = class {
    static {
      this.conditions = [
        {
          name: "run",
          condition: (params) => (params.xDirection > 0 || params.xDirection < 0 || params.yDirection === 1) && params.yDirection !== -1,
          priority: 1
        },
        {
          name: "run-up",
          condition: (params) => params.yDirection < 0,
          priority: 1
        },
        {
          name: "idle-up",
          condition: (params) => params.xDirection === 0 && params.yDirection === 0 && params.currentFacingAngle < 0,
          priority: 0
        },
        {
          name: "idle",
          condition: (params) => params.xDirection === 0 && params.yDirection === 0 && params.currentFacingAngle > 0,
          priority: 0
        },
        {
          name: "attack",
          condition: (params) => params.isAttacking && params.currentFacingAngle >= 0,
          priority: 5
        },
        {
          name: "attack-up",
          condition: (params) => params.isAttacking && params.currentFacingAngle < 0,
          priority: 5
        },
        {
          name: "hurt",
          condition: (params) => params.isHurt,
          priority: 10
        }
        // Add more animation conditions as needed
      ];
    }
    static playAnimation(animationComponent, movementComponent, combatComponent) {
      const params = {
        xDirection: movementComponent.direction.x,
        yDirection: movementComponent.direction.y,
        currentFacingAngle: movementComponent.currentFacingAngle,
        isAttacking: combatComponent.isAttacking,
        animationState: animationComponent.state,
        isHurt: combatComponent.isHurt,
        attackCooldown: combatComponent.attackCooldown
      };
      let highestPriorityCondition = null;
      for (const condition of this.conditions) {
        if (condition.condition(params)) {
          if (!highestPriorityCondition || condition.priority > highestPriorityCondition.priority) {
            highestPriorityCondition = condition;
          }
        }
      }
      if (highestPriorityCondition) {
        animationComponent.playAnimation(highestPriorityCondition.name);
      } else {
        animationComponent.playAnimation("idle");
      }
    }
  };

  // src/systems/MovementSystem.ts
  var MovementSystem = class extends System {
    constructor() {
      super();
    }
    preload() {
    }
    update(_, entityManager) {
      const movementEntities = entityManager.getEntitiesByComponent("MovementComponent");
      for (const entity of movementEntities) {
        const movementComponent = entity.getComponent("MovementComponent");
        if (!movementComponent)
          continue;
        const positionComponent = entity.getComponent("PositionComponent");
        if (!positionComponent)
          continue;
        const collisionComponent = entity.getComponent("CollisionComponent");
        const animationComponent = entity.getComponent("AnimationComponent");
        const renderComponent = entity.getComponent("RenderComponent");
        if (!renderComponent)
          continue;
        const combatComponent = entity.getComponent("CombatComponent");
        let xMovement = movementComponent.direction.x * movementComponent.moveSpeed;
        let yMovement = movementComponent.direction.y * movementComponent.moveSpeed;
        if (combatComponent && !combatComponent.isDead) {
          if (xMovement !== 0) {
            let newX = positionComponent.position.x - xMovement;
            if (collisionComponent && !collisionComponent.collisionDetails.right && xMovement < 0) {
              renderComponent.flipped = true;
              positionComponent.position.x = Math.floor(newX);
            } else if (collisionComponent && !collisionComponent.collisionDetails.left && xMovement > 0) {
              renderComponent.flipped = false;
              positionComponent.position.x = Math.ceil(newX);
            }
          }
          if (yMovement !== 0) {
            let newY = positionComponent.position.y + yMovement;
            if (collisionComponent && !collisionComponent.collisionDetails.top && yMovement < 0) {
              positionComponent.position.y = Math.floor(newY);
            } else if (collisionComponent && !collisionComponent.collisionDetails.bottom && yMovement > 0) {
              positionComponent.position.y = Math.ceil(newY);
            }
          }
          if (xMovement !== 0 || yMovement !== 0) {
            movementComponent.currentFacingAngle = Math.atan2(yMovement, xMovement) * 180 / Math.PI;
          }
          if (animationComponent) {
            AnimationController.playAnimation(animationComponent, movementComponent, combatComponent);
          }
        }
      }
    }
    render() {
    }
  };

  // src/systems/RenderSystem.ts
  var RenderSystem = class extends System {
    constructor(width, height) {
      super();
      this.renderingBatches = /* @__PURE__ */ new Map();
      this.cameraWidth = 100;
      this.cameraHeight = 90;
      this.zoomFactor = 4;
      const viewport = document.getElementById("viewport");
      if (!viewport)
        throw new Error("Viewport missing.");
      const canvas = document.createElement("canvas");
      canvas.id = "game-canvas";
      canvas.width = width;
      canvas.height = height;
      if (!canvas)
        throw new Error("Failed to initialize game canvas.");
      const ctx = canvas.getContext("2d");
      if (!ctx)
        throw new Error("Failed to initialize canvas context.");
      this.ctx = ctx;
      this.canvas = canvas;
      viewport.appendChild(canvas);
    }
    preload() {
    }
    update(_, entityManager) {
      this.render();
      this.updateCamera(entityManager);
      const playerEntity = entityManager.getEntityByName("player");
      if (!playerEntity)
        return;
      const playerPositionComponent = playerEntity.getComponent("PositionComponent");
      if (playerPositionComponent) {
        this.applyLighting(playerPositionComponent.position);
        this.updateRenderingBatches(entityManager);
        this.renderEntities(playerPositionComponent.position);
        this.renderDroppedItems(playerPositionComponent.position, entityManager);
      }
    }
    updateCamera(entityManager) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.scale(this.zoomFactor, this.zoomFactor);
    }
    updateRenderingBatches(entityManager) {
      this.renderingBatches.clear();
      const animationEntities = entityManager.getEntitiesByComponent("AnimationComponent");
      const staticEntities = entityManager.getEntitiesByComponents(["SolidComponent", "RenderComponent"]);
      for (const entity of [...animationEntities, ...staticEntities]) {
        const layerComponent = entity.getComponent("LayerComponent");
        const layer = layerComponent ? layerComponent.layer : 0;
        if (!this.renderingBatches.has(layer)) {
          this.renderingBatches.set(layer, []);
        }
        this.renderingBatches.get(layer)?.push(entity);
      }
    }
    renderEntities(playerPosition) {
      const sortedBatches = Array.from(this.renderingBatches.entries()).sort(([layerA], [layerB]) => layerA - layerB);
      for (const [_, entities] of sortedBatches) {
        for (const entity of entities) {
          const positionComponent = entity.getComponent("PositionComponent");
          if (!positionComponent)
            continue;
          if (entity.hasComponent("AnimationComponent")) {
            this.renderAnimationEntity(entity, playerPosition);
          } else {
            this.renderStaticEntity(entity, playerPosition);
          }
        }
      }
    }
    renderAnimationEntity(entity, playerPosition) {
      const renderComponent = entity.getComponent("RenderComponent");
      if (!renderComponent)
        return;
      const positionComponent = entity.getComponent("PositionComponent");
      if (!positionComponent)
        return;
      const animationComponent = entity.getComponent("AnimationComponent");
      const combatComponent = entity.getComponent("CombatComponent");
      if (animationComponent) {
        const animation = animationComponent.animations.get(animationComponent.currentAnimation);
        const currentAnimationFrame = animation?.frames[animationComponent.currentFrameIndex];
        if (!currentAnimationFrame)
          return;
        const cameraX = playerPosition.x - this.cameraWidth / 2;
        const cameraY = playerPosition.y - this.cameraHeight / 2;
        const adjustedX = positionComponent.position.x - cameraX;
        const adjustedY = positionComponent.position.y - cameraY;
        if (combatComponent) {
          this.ctx.fillStyle = "gray";
          this.ctx.fillRect(adjustedX + 13, adjustedY + 8, 7, 1);
          this.ctx.fillStyle = "red";
          this.ctx.fillRect(adjustedX + 13, adjustedY + 8, combatComponent.health / combatComponent.maxHealth * 7, 1);
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
            renderComponent.height
          );
          this.ctx.restore();
        } else {
          this.ctx.drawImage(
            currentAnimationFrame.image,
            currentAnimationFrame.x,
            currentAnimationFrame.y,
            renderComponent.width,
            renderComponent.height,
            adjustedX,
            adjustedY,
            renderComponent.width,
            renderComponent.height
          );
        }
      }
    }
    renderDroppedItems(playerPosition, entityManager) {
      const world = entityManager.getEntityByName("world-inventory");
      if (!world)
        return;
      const worldInventory = world?.getComponent("InventoryComponent");
      const positionComponent = world.getComponent("PositionComponent");
      if (!worldInventory || !positionComponent)
        return;
      const cameraX = playerPosition.x - this.cameraWidth / 2;
      const cameraY = playerPosition.y - this.cameraHeight / 2;
      for (const item of worldInventory.items) {
        const adjustedX = item.dropPosition.x - cameraX;
        const adjustedY = item.dropPosition.y - cameraY;
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
            6
          );
        }
      }
    }
    renderStaticEntity(entity, playerPosition) {
      const positionComponent = entity.getComponent("PositionComponent");
      const renderComponent = entity.getComponent("RenderComponent");
      const solidComponent = entity.getComponent("SolidComponent");
      if (!solidComponent || !positionComponent || !renderComponent)
        return;
      const { position } = positionComponent;
      const distance = Math.sqrt(
        (position.x - playerPosition.x) ** 2 + (position.y - playerPosition.y) ** 2
      );
      const maxDistance = Math.sqrt(this.cameraWidth ** 2 + this.cameraHeight ** 2);
      const alpha = Math.min(1, (maxDistance - distance) / maxDistance);
      this.ctx.globalAlpha = alpha;
      const cameraX = playerPosition.x - this.cameraWidth / 2;
      const cameraY = playerPosition.y - this.cameraHeight / 2;
      const adjustedX = position.x - cameraX;
      const adjustedY = position.y - cameraY;
      this.ctx.drawImage(
        solidComponent.spriteData.image,
        solidComponent.spriteData.x,
        solidComponent.spriteData.y,
        renderComponent.width,
        renderComponent.height,
        adjustedX,
        adjustedY,
        renderComponent.width,
        renderComponent.height
      );
      this.ctx.globalAlpha = 1;
    }
    applyLighting(playerPosition) {
      const cameraX = playerPosition.x - this.cameraWidth / 2;
      const cameraY = playerPosition.y - this.cameraHeight / 2;
      const gradient = this.ctx.createRadialGradient(
        playerPosition.x - cameraX,
        // x0: X-coordinate of the center of the gradient
        playerPosition.y - cameraY,
        // y0: Y-coordinate of the center of the gradient
        0,
        // r0: Inner radius (0 means the center, where the player is, is fully illuminated)
        playerPosition.x - cameraX,
        // x1: X-coordinate of the outer circle (edge of the camera view)
        playerPosition.y - cameraY,
        // y1: Y-coordinate of the outer circle (edge of the camera view)
        this.cameraWidth / 2
        // r1: Outer radius (tiles at the edge of the camera view are fully darkened)
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalCompositeOperation = "source-over";
    }
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    get height() {
      return this.canvas.height;
    }
    get width() {
      return this.canvas.width;
    }
  };

  // src/GameInitializer.ts
  var GameInitializer = class {
    constructor(config) {
      this.config = config;
      this.entityManager = new EntityManager();
      this.game = new Game(this.entityManager);
      this.levelInitializer = new LevelInitializer(this.entityManager);
    }
    async initialize() {
      await this.loadSprites();
      this.createPlayer();
      await this.createEnemies();
      this.createWorldInventory();
      await this.createLevels();
      await this.createProps();
      this.addSystems();
      this.game.run();
    }
    async loadSprites() {
      for (const path of this.config.spriteSheetPaths) {
        await SpriteSheetParser.extractSprites(
          path.entityId,
          path.spriteSheetName,
          path.spriteWidth,
          path.spriteHeight,
          path.imageWidth,
          path.imageHeight,
          path.spriteSheetUrl
        );
      }
    }
    createPlayer() {
      const playerAnimations = createEntityAnimations("player");
      createPlayerEntity(this.entityManager, playerAnimations);
    }
    async createEnemies() {
      const enemyAnimations = createEntityAnimations("enemy");
      const items = await loadItems();
      const enemyLoot = [];
      enemyLoot.push(items.get("Key"));
      for (let i = 1; i < 2; i++) {
        createEnemyEntity(this.entityManager, `enemy${i}`, 110, 10, enemyAnimations, enemyLoot);
      }
    }
    async createProps() {
      createPropsEntities(this.entityManager, this.config.levels[0].props);
    }
    createWorldInventory() {
      const worldInventory = EntityFactory.create().name("world-inventory").position(new Vector2D(0, 0)).inventory(200).build();
      this.entityManager.addEntity(worldInventory);
    }
    async createLevels() {
      for (const levelData of this.config.levels) {
        await this.levelInitializer.createEntitiesFromLevelArray(levelData.data, levelData.spriteSheets);
      }
    }
    addSystems() {
      const aiSystem = new AISystem(this.entityManager);
      const renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
      const inputSystem = new InputSystem();
      const movementSystem = new MovementSystem();
      const collisionSystem = new CollisionSystem();
      const animationSystem = new AnimationSystem();
      const combatSystem = new CombatSystem();
      const inventorySystem = new InventorySystem();
      const interactionSystem = new InteractionSystem();
      this.game.addSystems([
        animationSystem,
        inputSystem,
        movementSystem,
        renderSystem,
        inventorySystem,
        collisionSystem,
        aiSystem,
        combatSystem,
        interactionSystem
      ]);
    }
  };

  // src/levels/level.ts
  var levelOne = {
    spriteSheets: [
      "floor-tiles",
      "wall-tiles",
      "door-tiles"
    ],
    props: [
      { name: "torch", size: [16, 16], position: { x: 105, y: 0 }, animationType: "fire", isLooping: true, layer: 1 },
      { name: "torch", size: [16, 16], position: { x: 128, y: 0 }, animationType: "fire", isLooping: true, layer: 1 }
    ],
    // [interactable, layer, hasCollision, spriteSheetIndex, spriteRow, spriteColumn]
    data: [
      [[0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 0, 1, 1, 2, 3], [0, 4, 1, 1, 3, 1], [0, 4, 1, 1, 4, 1]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 3], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 2, 3], [0, 3, 1, 1, 2, 3], [0, 3, 1, 1, 2, 1], [0, 3, 1, 1, 2, 1], [0, 3, 1, 1, 2, 1], [0, 3, 1, 1, 3, 1], [0, 0, 1, 1, 4, 1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 3, 1, 1, 6, 1], [0, 0, 1, 1, 7, 1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 3, 0, 1, 6, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [1, 0, 1, 2, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 3, 0, 1, 6, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 3, 0, 1, 6, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 3, 1, 1, 6, 3], [0, 0, 1, 1, 7, 3], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 2, 3], [0, 3, 1, 1, 2, 3], [0, 3, 1, 1, 2, 3], [0, 3, 1, 1, 2, 3], [0, 3, 1, 1, 2, 3], [0, 3, 1, 1, 3, 3], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 1], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 2], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 3], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 3], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 3, 2], [0, 0, 1, 1, 4, 3], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 1, 1, 3, 2], [0, 4, 1, 1, 4, 2]],
      [[0, 0, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 2, 3], [0, 4, 1, 1, 3, 3], [0, 4, 1, 1, 4, 3]]
    ]
  };

  // src/main.ts
  var gameConfig = {
    spriteSheetPaths: [
      {
        entityId: "torch",
        spriteSheetName: "fire",
        spriteWidth: 16,
        spriteHeight: 16,
        imageWidth: 160,
        imageHeight: 160,
        spriteSheetUrl: "./assets/spritesheets/decorations/Minifantasy_DungeonTorch.png"
      },
      {
        entityId: "items",
        spriteSheetName: "all-items",
        spriteWidth: 16,
        spriteHeight: 16,
        imageWidth: 160,
        imageHeight: 160,
        spriteSheetUrl: "./assets/spritesheets/items/items.png"
      },
      {
        entityId: "enemy",
        spriteSheetName: "idle",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 512,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseIdle.png"
      },
      {
        entityId: "enemy",
        spriteSheetName: "run",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 128,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseWalk.png"
      },
      {
        entityId: "enemy",
        spriteSheetName: "attack",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 128,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseAttack.png"
      },
      {
        entityId: "enemy",
        spriteSheetName: "hurt",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 128,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDmg.png"
      },
      {
        entityId: "enemy",
        spriteSheetName: "die",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 384,
        imageHeight: 32,
        spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDie.png"
      },
      {
        entityId: "player",
        spriteSheetName: "idle",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 512,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseIdle.png"
      },
      {
        entityId: "player",
        spriteSheetName: "run",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 128,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseWalk.png"
      },
      {
        entityId: "player",
        spriteSheetName: "attack",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 128,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseAttack.png"
      },
      {
        entityId: "player",
        spriteSheetName: "hurt",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 128,
        imageHeight: 128,
        spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseDmg.png"
      },
      {
        entityId: "player",
        spriteSheetName: "die",
        spriteWidth: 32,
        spriteHeight: 32,
        imageWidth: 384,
        imageHeight: 32,
        spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseSoulDie.png"
      },
      {
        entityId: "dungeon-tiles",
        spriteSheetName: "floor-tiles",
        spriteWidth: 8,
        spriteHeight: 8,
        imageWidth: 56,
        imageHeight: 16,
        spriteSheetUrl: "./assets/tiles/Minifantasy_DungeonFloorTiles.png"
      },
      {
        entityId: "dungeon-tiles",
        spriteSheetName: "wall-tiles",
        spriteWidth: 8,
        spriteHeight: 8,
        imageWidth: 56,
        imageHeight: 112,
        spriteSheetUrl: "./assets/tiles/Minifantasy_DungeonWallTiles.png"
      },
      {
        entityId: "dungeon-tiles",
        spriteSheetName: "door-tiles",
        spriteWidth: 8,
        spriteHeight: 8,
        imageWidth: 8,
        imageHeight: 16,
        spriteSheetUrl: "./assets/tiles/Minifantasy_DungeonDoorTiles.png"
      }
    ],
    levels: [levelOne]
  };
  var initializer = new GameInitializer(gameConfig);
  initializer.initialize();
})();
