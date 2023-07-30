"use strict";
(() => {
  // src/Game.ts
  var Game = class {
    constructor(entityManager2) {
      this.entityManager = entityManager2;
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

  // src/components/Component.ts
  var Component = class {
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
      return this.entities.filter((value) => components.every((c) => value.getComponent(c) !== void 0));
    }
  };

  // src/utils/SpriteSheetParser.ts
  var SpriteSheetParser = class {
    static {
      this.spriteSheets = {};
    }
    static extractSprites(entityId, spriteSheetName, spriteWidth, spriteHeight, imageWidth, imageHeight, spriteSheetUrl) {
      const spriteSheetImage = new Image(imageWidth, imageHeight);
      spriteSheetImage.src = spriteSheetUrl;
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

  // src/sprites/Animation.ts
  var Animation = class {
    constructor(name, frames, animationSpeed, loop, priority = 0) {
      this.name = name;
      this.frames = frames;
      this.animationSpeed = animationSpeed;
      this.loop = loop;
      this.priority = priority;
    }
  };

  // src/sprites/enemyAnimations.ts
  SpriteSheetParser.extractSprites("enemy", "enemy-idle", 32, 32, 512, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseIdle.png");
  SpriteSheetParser.extractSprites("enemy", "enemy-run", 32, 32, 128, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseWalk.png");
  SpriteSheetParser.extractSprites("enemy", "enemy-attack", 32, 32, 128, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseAttack.png");
  SpriteSheetParser.extractSprites("enemy", "enemy-hurt", 32, 32, 128, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDmg.png");
  SpriteSheetParser.extractSprites("enemy", "enemy-die", 32, 32, 384, 32, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDie.png");
  var enemyIdleSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-idle");
  var enemyRunSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-run");
  var enemyAttackSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-attack");
  var enemyHurtSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-hurt");
  var enemyDieSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-die");
  var enemyIdleAnimation = new Animation("idle", [
    enemyIdleSpriteSheet[1][0],
    enemyIdleSpriteSheet[1][1],
    enemyIdleSpriteSheet[1][2],
    enemyIdleSpriteSheet[1][3],
    enemyIdleSpriteSheet[1][4],
    enemyIdleSpriteSheet[1][5],
    enemyIdleSpriteSheet[1][6],
    enemyIdleSpriteSheet[1][7]
  ], 5e-3, true);
  var enemyIdleUpAnimation = new Animation("idle-up", [
    enemyIdleSpriteSheet[3][0],
    enemyIdleSpriteSheet[3][1],
    enemyIdleSpriteSheet[3][2],
    enemyIdleSpriteSheet[3][3],
    enemyIdleSpriteSheet[3][4],
    enemyIdleSpriteSheet[3][5],
    enemyIdleSpriteSheet[3][6],
    enemyIdleSpriteSheet[3][7]
  ], 5e-3, true);
  var enemyRunAnimation = new Animation("run", [
    enemyRunSpriteSheet[1][0],
    enemyRunSpriteSheet[1][1],
    enemyRunSpriteSheet[1][2],
    enemyRunSpriteSheet[1][3]
  ], 5e-3, true);
  var enemyRunUpAnimation = new Animation("run-up", [
    enemyRunSpriteSheet[3][0],
    enemyRunSpriteSheet[3][1],
    enemyRunSpriteSheet[3][2],
    enemyRunSpriteSheet[3][3]
  ], 5e-3, true);
  var enemyAttackAnimation = new Animation("attack", [
    enemyAttackSpriteSheet[1][0],
    enemyAttackSpriteSheet[1][1],
    enemyAttackSpriteSheet[1][2],
    enemyAttackSpriteSheet[1][3]
  ], 0.01, false);
  var enemyAttackUpAnimation = new Animation("attack-up", [
    enemyAttackSpriteSheet[3][0],
    enemyAttackSpriteSheet[3][1],
    enemyAttackSpriteSheet[3][2],
    enemyAttackSpriteSheet[3][3]
  ], 0.01, false);
  var enemyHurtAnimation = new Animation("hurt", [
    enemyHurtSpriteSheet[1][0],
    enemyHurtSpriteSheet[1][1],
    enemyHurtSpriteSheet[1][2],
    enemyHurtSpriteSheet[1][3]
  ], 0.01, false);
  var enemyDeathAnimation = new Animation("death", [
    enemyDieSpriteSheet[0][0],
    enemyDieSpriteSheet[0][1],
    enemyDieSpriteSheet[0][2],
    enemyDieSpriteSheet[0][3],
    enemyDieSpriteSheet[0][4],
    enemyDieSpriteSheet[0][5],
    enemyDieSpriteSheet[0][6],
    enemyDieSpriteSheet[0][7],
    enemyDieSpriteSheet[0][8],
    enemyDieSpriteSheet[0][9],
    enemyDieSpriteSheet[0][10],
    enemyDieSpriteSheet[0][11]
  ], 0.01, false);

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

  // src/sprites/items.ts
  SpriteSheetParser.extractSprites("items", "all-items", 16, 16, 160, 160, "./assets/spritesheets/items/items.png");
  var cheeseSprite = SpriteSheetParser.getSprite("items", "all-items", 4, 0);
  var keySprite = SpriteSheetParser.getSprite("items", "all-items", 5, 0);
  var bluePotionSprite = SpriteSheetParser.getSprite("items", "all-items", 0, 0);
  var blueRingSprite = SpriteSheetParser.getSprite("items", "all-items", 4, 1);
  var greenRingSprite = SpriteSheetParser.getSprite("items", "all-items", 5, 1);
  var redPotionSprite = SpriteSheetParser.getSprite("items", "all-items", 1, 0);
  var cheese = new ItemComponent("Cheese", "A stinky, stinky, stinky cheese. Smells like Boob's butt.", cheeseSprite);
  var key = new ItemComponent("Key", "A key", keySprite);
  var greenRing = new ItemComponent("Green Ring", "A green ring.", greenRingSprite);
  var blueRing = new ItemComponent("Blue Ring", "A blue ring.", blueRingSprite);
  var bluePotion = new ItemComponent("Blue Potion", "A blue potion.", bluePotionSprite);
  var redPotion = new ItemComponent("Red Potion", "A red potion.", redPotionSprite);

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
    constructor(animations3 = /* @__PURE__ */ new Map(), currentAnimation = "", currentFrameIndex = 0, currentAnimationTime = 0, isPlaying = false, frameWidth = 32, frameHeight = 32, state) {
      super();
      this.animations = animations3;
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

  // src/components/CombatCompontent.ts
  var CombatComponent = class extends Component {
    constructor(isAttacking = false, attackInitiated = false, isHurt = false, attackRange = 10, attackPower = 15, defense = 4, health = 20, maxHealth = 20, isDead = false, attackCooldown = 0, lastAttackTime = 0) {
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
    }
  };

  // src/components/DebugComponent.ts
  var DebugComponent = class extends Component {
    constructor(entityManager2, excludedComponents2 = []) {
      super();
      this.entityManager = entityManager2;
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
      for (const key2 of componentKeys) {
        if (key2)
          toAdd.push(key2);
      }
      debugSpan.innerHTML += JSON.stringify(toAdd, null, 3);
      this.debugDiv.appendChild(debugSpan);
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
    inventory(maxCapacity) {
      const inventoryComponent = new InventoryComponent([], maxCapacity);
      this.entity.addComponent("InventoryComponent", inventoryComponent);
      return this;
    }
    spriteData(spriteData) {
      const renderComponent = this.ensureRenderComponent();
      renderComponent.spriteData = spriteData;
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
    animations(animations3) {
      this.entity.addComponent("AnimationComponent", new AnimationComponent(animations3, "", 0, 10, false, 0, 0, 1 /* Finished */));
      return this;
    }
    ai(aggroRange) {
      this.entity.addComponent("AIComponent", new AIComponent(aggroRange));
      return this;
    }
    debug(entityManager2, excludedComponents2) {
      this.entity.addComponent("DebugComponent", new DebugComponent(entityManager2, excludedComponents2));
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

  // src/entities/enemyEntity.ts
  var animations = /* @__PURE__ */ new Map();
  animations.set(enemyIdleAnimation.name, enemyIdleAnimation);
  animations.set(enemyRunAnimation.name, enemyRunAnimation);
  animations.set(enemyRunUpAnimation.name, enemyRunUpAnimation);
  animations.set(enemyIdleUpAnimation.name, enemyIdleUpAnimation);
  animations.set(enemyAttackAnimation.name, enemyAttackAnimation);
  animations.set(enemyAttackUpAnimation.name, enemyAttackUpAnimation);
  animations.set(enemyHurtAnimation.name, enemyHurtAnimation);
  animations.set(enemyDeathAnimation.name, enemyDeathAnimation);
  function createEnemyEntity(entityManager2, name, positionX, positionY) {
    const enemyEntity = EntityFactory.create().name(name).position(new Vector2D(positionX, positionY)).size(32, 32).movement(new Vector2D(0, 0), 1).collision("box" /* BOX */).combat().ai(50).animations(animations).inventory().layer(0).build();
    const inventory = enemyEntity.getComponent("InventoryComponent");
    for (let i = 0; i < 10; i++) {
      inventory?.addItem({ ...cheese });
      inventory?.addItem({ ...key });
      inventory?.addItem({ ...blueRing });
      inventory?.addItem({ ...bluePotion });
      inventory?.addItem({ ...redPotion });
      inventory?.addItem({ ...greenRing });
    }
    entityManager2.addEntity(enemyEntity);
  }

  // src/sprites/playerAnimations.ts
  SpriteSheetParser.extractSprites("player", "player-idle", 32, 32, 512, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseIdle.png");
  SpriteSheetParser.extractSprites("player", "player-run", 32, 32, 128, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseWalk.png");
  SpriteSheetParser.extractSprites("player", "player-attack", 32, 32, 128, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseAttack.png");
  SpriteSheetParser.extractSprites("player", "player-hurt", 32, 32, 128, 128, "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseDmg.png");
  SpriteSheetParser.extractSprites("player", "player-die", 32, 32, 384, 32, "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseSoulDie.png");
  var playerIdleSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-idle");
  var playerRunSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-run");
  var playerAttackSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-attack");
  var playerHurtSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-hurt");
  var playerDieSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-die");
  var playerIdleAnimation = new Animation("idle", [
    playerIdleSpriteSheet[1][0],
    playerIdleSpriteSheet[1][1],
    playerIdleSpriteSheet[1][2],
    playerIdleSpriteSheet[1][3],
    playerIdleSpriteSheet[1][4],
    playerIdleSpriteSheet[1][5],
    playerIdleSpriteSheet[1][6],
    playerIdleSpriteSheet[1][7]
  ], 5e-3, true);
  var playerIdleUpAnimation = new Animation("idle-up", [
    playerIdleSpriteSheet[3][0],
    playerIdleSpriteSheet[3][1],
    playerIdleSpriteSheet[3][2],
    playerIdleSpriteSheet[3][3],
    playerIdleSpriteSheet[3][4],
    playerIdleSpriteSheet[3][5],
    playerIdleSpriteSheet[3][6],
    playerIdleSpriteSheet[3][7]
  ], 5e-3, true);
  var playerRunAnimation = new Animation("run", [
    playerRunSpriteSheet[1][0],
    playerRunSpriteSheet[1][1],
    playerRunSpriteSheet[1][2],
    playerRunSpriteSheet[1][3]
  ], 5e-3, true);
  var playerRunUpAnimation = new Animation("run-up", [
    playerRunSpriteSheet[3][0],
    playerRunSpriteSheet[3][1],
    playerRunSpriteSheet[3][2],
    playerRunSpriteSheet[3][3]
  ], 5e-3, true);
  var playerAttackAnimation = new Animation("attack", [
    playerAttackSpriteSheet[1][0],
    playerAttackSpriteSheet[1][1],
    playerAttackSpriteSheet[1][2],
    playerAttackSpriteSheet[1][3]
  ], 0.01, false);
  var playerAttackUpAnimation = new Animation("attack-up", [
    playerAttackSpriteSheet[3][0],
    playerAttackSpriteSheet[3][1],
    playerAttackSpriteSheet[3][2],
    playerAttackSpriteSheet[3][3]
  ], 0.01, false);
  var playerHurtAnimation = new Animation("hurt", [
    playerHurtSpriteSheet[1][0],
    playerHurtSpriteSheet[1][1],
    playerHurtSpriteSheet[1][2],
    playerHurtSpriteSheet[1][3]
  ], 0.01, false);
  var playerDeathAnimation = new Animation("death", [
    playerDieSpriteSheet[0][0],
    playerDieSpriteSheet[0][1],
    playerDieSpriteSheet[0][2],
    playerDieSpriteSheet[0][3],
    playerDieSpriteSheet[0][4],
    playerDieSpriteSheet[0][5],
    playerDieSpriteSheet[0][6],
    playerDieSpriteSheet[0][7],
    playerDieSpriteSheet[0][8],
    playerDieSpriteSheet[0][9],
    playerDieSpriteSheet[0][10],
    playerDieSpriteSheet[0][11],
    playerDieSpriteSheet[0][12],
    playerDieSpriteSheet[0][13]
  ], 0.01, false);

  // src/utils/constants.ts
  var TILE_WIDTH = 32;
  var TILE_HEIGHT = 32;
  var LEVEL_WIDTH = 20;
  var LEVEL_HEIGHT = 15;

  // src/entities/playerEntity.ts
  var animations2 = /* @__PURE__ */ new Map();
  animations2.set(playerIdleAnimation.name, playerIdleAnimation);
  animations2.set(playerRunAnimation.name, playerRunAnimation);
  animations2.set(playerRunUpAnimation.name, playerRunUpAnimation);
  animations2.set(playerIdleUpAnimation.name, playerIdleUpAnimation);
  animations2.set(playerAttackAnimation.name, playerAttackAnimation);
  animations2.set(playerAttackUpAnimation.name, playerAttackUpAnimation);
  animations2.set(playerHurtAnimation.name, playerHurtAnimation);
  animations2.set(playerDeathAnimation.name, playerDeathAnimation);
  var excludedComponents = ["DebugComponent", "PlayerComponent", "CollisionComponent", "RenderComponent", "MovementComponent", "PositionComponent", "AIComponent"];
  function createPlayerEntity(entityManager2) {
    const playerEntity = EntityFactory.create().name("player").position(new Vector2D(TILE_WIDTH * 1, TILE_HEIGHT * 1)).size(32, 32).movement(new Vector2D(0, 0), 1).collision("box" /* BOX */).player().combat().animations(animations2).layer(1).inventory().debug(entityManager2, excludedComponents).build();
    entityManager2.addEntity(playerEntity);
  }

  // src/levels/level.ts
  var levelOne = {
    spriteSheets: [
      "floor-tiles",
      "wall-tiles"
    ],
    // [Sprite Sheet Index, Row Index in Sprite Sheet, Column Index in Sprite Sheet]
    data: [
      [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 3, 1]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 1, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 3, 2], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 3, 2]],
      [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 3, 3]]
    ]
  };

  // src/ai/BehaviorTree.ts
  var BehaviorTree = class {
    constructor(rootNode) {
      this.rootNode = rootNode;
    }
    tick(entityManager2) {
      return this.rootNode.tick(entityManager2);
    }
  };

  // src/utils/math.ts
  var clamp = (number, min, max) => {
    return Math.max(min, Math.min(number, max));
  };

  // src/ai/ChasePlayer.ts
  var ChasePlayer = class {
    constructor(aiPosition, playerPosition, enemyEntity, playerEntity) {
      this.aiPosition = aiPosition;
      this.playerPosition = playerPosition;
      this.enemyEntity = enemyEntity;
      this.playerEntity = playerEntity;
    }
    tick(entityManager2) {
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
      if (distanceToPlayer <= aiComponent.aggroRange && this.hasLineOfSight(entityManager2, positionComponent, playerPositionComponent, aiComponent) && !playerCombatComponent.isDead) {
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
    hasLineOfSight(entityManager2, entityPosition, playerPosition, aiComponent) {
      const obstacles = entityManager2.getEntitiesByComponents(["SolidComponent", "CollisionComponent"]);
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
    tick(entityManager2) {
      for (const child of this.children) {
        const status = child.tick(entityManager2);
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
    constructor(entityManager2) {
      super();
      this.entityManager = entityManager2;
      this.behaviorTrees = /* @__PURE__ */ new Map();
      const aiEntities = entityManager2.getEntitiesByComponent("AIComponent");
      const playerEntity = entityManager2.getEntitiesByComponent("PlayerComponent")[0];
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
    update(_, entityManager2) {
      this.behaviorTrees.forEach((behaviorTree, _2) => {
        behaviorTree.tick(entityManager2);
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
    update(deltaTime, entityManager2) {
      const entitiesWithAnimations = entityManager2.getEntitiesByComponent("AnimationComponent");
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
        animationComponent.currentAnimationTime += deltaTime;
        const frameDuration = 1 / animation.animationSpeed;
        if (animationComponent.currentAnimationTime >= frameDuration) {
          const frameIndexIncrement = Math.floor(animationComponent.currentAnimationTime / frameDuration);
          const totalFrames = animation.frames.length;
          if (!animation.loop) {
            if (animationComponent.currentFrameIndex + frameIndexIncrement >= totalFrames - 1) {
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
    update(deltaTime, entityManager2) {
      const solidEntities = entityManager2.getEntitiesByComponent("SolidComponent");
      const collisionEntities = entityManager2.getEntitiesByComponent("MovementComponent");
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
    }
    preload() {
    }
    update(deltaTime, entityManager2) {
      const entitiesWithCombat = entityManager2.getEntitiesByComponent("CombatComponent");
      for (const attacker of entitiesWithCombat) {
        const attackerCombat = attacker.getComponent("CombatComponent");
        if (!attackerCombat)
          continue;
        const attackerPosition = attacker.getComponent("PositionComponent")?.position;
        if (!attackerPosition)
          continue;
        const attackerAnimation = attacker.getComponent("AnimationComponent");
        const attackerMovement = attacker.getComponent("MovementComponent");
        if (!attackerMovement)
          continue;
        const cooldownInterval = setInterval(() => {
          if (attackerCombat.attackCooldown > 0) {
            attackerCombat.attackCooldown--;
          } else {
            clearInterval(cooldownInterval);
            attackerCombat.attackInitiated = false;
            attackerCombat.isAttacking = false;
          }
        }, 1e3);
        if (!attackerCombat || !attackerCombat.isAttacking || !attackerAnimation || attackerCombat.attackCooldown > 0) {
          continue;
        }
        attackerCombat.attackCooldown = 100;
        let closestTarget = null;
        let closestDistanceSq = Infinity;
        for (const potentialTarget of entitiesWithCombat) {
          if (potentialTarget === attacker)
            continue;
          const targetPosition = potentialTarget.getComponent("PositionComponent")?.position;
          if (!targetPosition)
            continue;
          const diffX = targetPosition.x - attackerPosition.x;
          const diffY = targetPosition.y - attackerPosition.y;
          const distanceSq = diffX * diffX + diffY * diffY;
          if (distanceSq < attackerCombat.attackRange ** 2 && distanceSq < closestDistanceSq) {
            const angleToTarget = Math.atan2(targetPosition.y - attackerPosition.y, targetPosition.x - attackerPosition.x);
            const angleDifference = angleToTarget - attackerMovement.currentFacingAngle;
            const adjustedAngleDifference = (angleDifference + Math.PI) % (2 * Math.PI) - Math.PI;
            const allowedAngleDifference = Math.PI / 180 * 45;
            console.log("Adjusted Angle Difference: " + adjustedAngleDifference, "Allowed Angle Difference: " + allowedAngleDifference, "Angle Difference: " + angleDifference, "Angle To Target: " + angleToTarget);
            if (Math.abs(adjustedAngleDifference) >= allowedAngleDifference && distanceSq < attackerCombat.attackRange ** 2 && distanceSq < closestDistanceSq) {
              closestTarget = potentialTarget;
              closestDistanceSq = distanceSq;
            }
          }
        }
        if (closestTarget) {
          this.handleAttack(attacker, closestTarget, entityManager2);
        }
      }
    }
    render() {
    }
    handleAttack(attacker, target, entityManager2) {
      const attackerCombat = attacker.getComponent("CombatComponent");
      const targetCombat = target.getComponent("CombatComponent");
      const targetAnimationComponent = target.getComponent("AnimationComponent");
      const targetInventoryComponent = target.getComponent("InventoryComponent");
      const attackerInventoryComponent = attacker.getComponent("InventoryComponent");
      const targetPositionComponent = target.getComponent("PositionComponent");
      const world = entityManager2.getEntityByName("world-inventory");
      const worldInventory2 = world?.getComponent("InventoryComponent");
      if (!worldInventory2)
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
              worldInventory2.addItem(item);
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
    update(deltaTime, entityManager2) {
      const player = entityManager2.getEntitiesByComponent("PlayerComponent")[0];
      const movementComponent = player.getComponent("MovementComponent");
      if (!movementComponent)
        return;
      const combatComponent = player.getComponent("CombatComponent");
      if (!combatComponent)
        return;
      const animationComponent = player.getComponent("AnimationComponent");
      if (!animationComponent)
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
      this.hoveredItemIndex = null;
      this.tooltip = null;
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
    preload(entityManager2) {
    }
    update(deltaTime, entityManager2) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const player = entityManager2.getEntitiesByComponent("PlayerComponent")[0];
      const playerPosition = player.getComponent("PositionComponent")?.position;
      const inventory = player.getComponent("InventoryComponent");
      if (!inventory)
        return;
      this.playerInventory = inventory;
      this.updatePlayerInventory(inventory);
      if (playerPosition && inventory.pickingUp) {
        this.handlePickupInteraction(playerPosition, entityManager2);
      }
    }
    render() {
    }
    updatePlayerInventory(inventory) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = 0; i < inventory.maxCapacity; i++) {
        if (inventory.items[i]) {
          this.cropIconFromSpriteSheet(inventory.items[i].icon, i);
          if (i === this.hoveredItemIndex) {
            this.showTooltip(inventory.items[i].description, i * 64, 36);
          }
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
      this.hideTooltip();
    }
    showTooltip(description, x, y) {
      if (!this.tooltip) {
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add("tooltip");
        const viewport = document.getElementById("viewport");
        if (!viewport)
          throw new Error("Viewport missing.");
        viewport.appendChild(this.tooltip);
      }
      this.tooltip.style.left = x + "px";
      this.tooltip.style.top = y + this.slotHeight + 5 + "px";
      this.tooltip.innerText = description;
      this.tooltip.style.display = "block";
    }
    hideTooltip() {
      if (this.tooltip) {
        this.tooltip.style.display = "none";
      }
    }
    addToPlayerInventory(item) {
      this.playerInventory?.items.push(item);
    }
    handlePickupInteraction(playerPosition, entityManager2) {
      if (!this.playerInventory)
        return;
      const world = entityManager2.getEntityByName("world-inventory");
      if (!world)
        return;
      const worldInventory2 = world.getComponent("InventoryComponent");
      if (!worldInventory2)
        return;
      for (const item of worldInventory2.items) {
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

  // src/systems/LevelSystem.ts
  var LevelSystem = class extends System {
    constructor(width, height) {
      super();
      this.staticRenderingBatches = /* @__PURE__ */ new Map();
      this.cameraWidth = 100;
      this.cameraHeight = 90;
      this.zoomFactor = 4;
      const viewport = document.getElementById("viewport");
      if (!viewport)
        throw new Error("Viewport missing.");
      const canvas = document.createElement("canvas");
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
    update(_, entityManager2) {
      this.render();
      this.updateCamera(entityManager2);
      const playerEntity = entityManager2.getEntityByName("player");
      if (!playerEntity)
        return;
      const playerPositionComponent = playerEntity.getComponent("PositionComponent");
      if (!playerPositionComponent)
        return;
      const { position: playerPosition } = playerPositionComponent;
      this.updateStaticRenderingBatches(entityManager2);
      this.renderStaticLevelElements(playerPosition);
      this.renderDroppedItems(playerPosition, entityManager2);
    }
    updateCamera(entityManager2) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.scale(this.zoomFactor, this.zoomFactor);
    }
    updateStaticRenderingBatches(entityManager2) {
      this.staticRenderingBatches.clear();
      const staticEntities = entityManager2.getEntitiesByComponents(["SolidComponent", "RenderComponent"]);
      for (const entity of staticEntities) {
        const layerComponent = entity.getComponent("LayerComponent");
        if (!layerComponent)
          continue;
        const layer = layerComponent ? layerComponent.layer : 0;
        if (!this.staticRenderingBatches.has(layer)) {
          this.staticRenderingBatches.set(layer, []);
        }
        this.staticRenderingBatches.get(layer)?.push(entity);
      }
    }
    renderStaticLevelElements(playerPosition) {
      const sortedBatches = Array.from(this.staticRenderingBatches.entries()).sort(([layerA], [layerB]) => layerA - layerB);
      for (const [_, entities] of sortedBatches) {
        for (const entity of entities) {
          this.renderStaticEntity(entity, playerPosition);
        }
      }
    }
    renderDroppedItems(playerPosition, entityManager2) {
      const world = entityManager2.getEntityByName("world-inventory");
      if (!world)
        return;
      const worldInventory2 = world?.getComponent("InventoryComponent");
      const positionComponent = world.getComponent("PositionComponent");
      if (!worldInventory2 || !positionComponent)
        return;
      const cameraX = playerPosition.x - this.cameraWidth / 2;
      const cameraY = playerPosition.y - this.cameraHeight / 2;
      for (const item of worldInventory2.items) {
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

  // src/sprites/AnimationController.ts
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
    update(_, entityManager2) {
      const movementEntities = entityManager2.getEntitiesByComponent("MovementComponent");
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
      this.animationRenderingBatches = /* @__PURE__ */ new Map();
      this.cameraWidth = 100;
      this.cameraHeight = 90;
      this.zoomFactor = 4;
      const viewport = document.getElementById("viewport");
      if (!viewport)
        throw new Error("Viewport missing.");
      const canvas = document.createElement("canvas");
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
    update(_, entityManager2) {
      this.render();
      this.updateCamera(entityManager2);
      const playerEntity = entityManager2.getEntityByName("player");
      if (!playerEntity)
        return;
      const playerPositionComponent = playerEntity.getComponent("PositionComponent");
      this.updateAnimationRenderingBatches(entityManager2);
      if (playerPositionComponent) {
        this.renderAnimationEntities(playerPositionComponent.position);
      }
    }
    updateCamera(entityManager2) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.scale(this.zoomFactor, this.zoomFactor);
    }
    updateAnimationRenderingBatches(entityManager2) {
      this.animationRenderingBatches.clear();
      const animationEntities = entityManager2.getEntitiesByComponent("AnimationComponent");
      for (const entity of animationEntities) {
        const layerComponent = entity.getComponent("LayerComponent");
        const layer = layerComponent ? layerComponent.layer : 0;
        if (!this.animationRenderingBatches.has(layer)) {
          this.animationRenderingBatches.set(layer, []);
        }
        this.animationRenderingBatches.get(layer)?.push(entity);
      }
    }
    renderAnimationEntities(playerPosition) {
      const sortedBatches = Array.from(this.animationRenderingBatches.entries()).sort(([layerA], [layerB]) => layerA - layerB);
      for (const [_, entities] of sortedBatches) {
        for (const entity of entities) {
          this.renderEntity(entity, playerPosition);
        }
      }
    }
    renderEntity(entity, playerPosition) {
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

  // src/main.ts
  SpriteSheetParser.extractSprites("dungeon-tiles", "floor-tiles", 8, 8, 56, 16, "./assets/tiles/MiniFantasy_DungeonFloorTiles.png");
  SpriteSheetParser.extractSprites("dungeon-tiles", "wall-tiles", 8, 8, 56, 112, "./assets/tiles/MiniFantasy_DungeonWallTiles.png");
  var entityManager = new EntityManager();
  var levelSystem = new LevelSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
  var renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
  var inputSystem = new InputSystem();
  var movementSystem = new MovementSystem();
  var collisionSystem = new CollisionSystem();
  var animationSystem = new AnimationSystem();
  var combatSystem = new CombatSystem();
  var inventorySystem = new InventorySystem();
  createPlayerEntity(entityManager);
  for (let i = 1; i < 3; i++) {
    createEnemyEntity(entityManager, `enemy${i}`, i / 2, i);
  }
  var worldInventory = EntityFactory.create().name("world-inventory").position(new Vector2D(0, 0)).inventory(200).build();
  entityManager.addEntity(worldInventory);
  function createEntitiesFromLevelArray(levelData, spriteSheets, entityManager2) {
    const entitiesToAdd = [];
    for (let i = 0; i < levelData.length; i++) {
      for (let j = 0; j < levelData[i].length; j++) {
        const [spriteSheetIndex, spriteRow, spriteColumn] = levelData[i][j];
        const spriteSheet = spriteSheets[spriteSheetIndex];
        const tileEntity = EntityFactory.create().position(new Vector2D(i * 8, j * 8)).size(8, 8).layer(0).solid(SpriteSheetParser.getSprite("dungeon-tiles", spriteSheet, spriteRow, spriteColumn)).tiled(true);
        if (spriteSheet.includes("wall")) {
          tileEntity.collision("box" /* BOX */, i === 0 ? -11 : 11, j === 0 ? -11 : 11);
        }
        entitiesToAdd.push(tileEntity.build());
      }
    }
    entityManager2.addEntities(entitiesToAdd);
  }
  createEntitiesFromLevelArray(levelOne.data, levelOne.spriteSheets, entityManager);
  var aiSystem = new AISystem(entityManager);
  var game = new Game(entityManager);
  game.addSystems([
    animationSystem,
    inputSystem,
    movementSystem,
    levelSystem,
    renderSystem,
    inventorySystem,
    collisionSystem,
    aiSystem,
    combatSystem
  ]);
  game.run();
})();
