"use strict";
(() => {
  // src/components/Component.ts
  var Component = class {
  };

  // src/components/DebugComponent.ts
  var DebugComponent = class _DebugComponent extends Component {
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
      const debugEntities = this.entityManager.getEntitiesByComponent(_DebugComponent);
      for (const entity of debugEntities) {
        this.addDebugInfoForComponent(entity);
        const components = entity.getComponents();
        components.forEach((component) => {
          if (!this.excludedComponents.includes(component.constructor.name)) {
            this.addDebugInfoForComponent(component);
          }
        });
      }
    }
    addDebugInfoForComponent(component) {
      const componentName = component.constructor.name;
      const componentTitle = document.createElement("h2");
      componentTitle.innerText = componentName;
      this.debugDiv.appendChild(componentTitle);
      this.handleComponentProperties(component);
    }
    handleComponentProperties(component) {
      const componentKeys = Object.keys(component);
      for (const key of componentKeys) {
        const value = component[key];
        if (typeof value !== "function") {
          const debugSpan = document.createElement("span");
          debugSpan.innerText = `${key}: ${JSON.stringify(value, null, 2)}`;
          this.debugDiv.appendChild(debugSpan);
        }
      }
    }
  };

  // src/components/PlayerComponent.ts
  var PlayerComponent = class extends Component {
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
      const entity = this.entityManager.getEntitiesByComponent(PlayerComponent)[0];
      const debugComponent = entity.getComponent(DebugComponent);
      if (debugComponent) {
        debugComponent.debug();
      }
    }
    run() {
      for (const system of this.systems) {
        system.preload(this.entityManager.getEntitiesByComponent(RenderComponent));
      }
      this.gameLoop();
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
    getEntitiesByComponent(component) {
      return this.entities.filter((value) => value.getComponent(component) !== void 0);
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
    constructor(isAttacking = false, attackInitiated = false, isHurt = false, attackRange = 50, attackPower = 5, defense = 1, health = 20, isDead = false, attackCooldown = 20) {
      super();
      this.isAttacking = isAttacking;
      this.attackInitiated = attackInitiated;
      this.isHurt = isHurt;
      this.attackRange = attackRange;
      this.attackPower = attackPower;
      this.defense = defense;
      this.health = health;
      this.isDead = isDead;
      this.attackCooldown = attackCooldown;
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

  // src/components/PositionComponent.ts
  var PositionComponent = class extends Component {
    constructor(position) {
      super();
      this.position = position;
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
      this.components = /* @__PURE__ */ new Set();
    }
    addComponent(component) {
      this.components.add(component);
      return component;
    }
    getComponent(component) {
      return Array.from(this.components).find((c) => c instanceof component);
    }
    getComponents() {
      return Array.from(this.components.values());
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
      this.entity.addComponent(new PositionComponent(position));
      return this;
    }
    size(width, height) {
      const renderComponent = this.ensureRenderComponent();
      renderComponent.width = width;
      renderComponent.height = height;
      return this;
    }
    combat() {
      this.entity.addComponent(new CombatComponent());
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
      this.entity.addComponent(new SolidComponent(spriteData));
      return this;
    }
    collision(collisionType, offsetX, offsetY, width, height) {
      this.entity.addComponent(new CollisionComponent(collisionType, offsetX, offsetY, width, height));
      return this;
    }
    movement(movement, moveSpeed) {
      this.entity.addComponent(new MovementComponent(movement, moveSpeed));
      return this;
    }
    player() {
      this.entity.addComponent(new PlayerComponent());
      return this;
    }
    animations(animations3) {
      this.entity.addComponent(new AnimationComponent(animations3, "", 0, 10, false, 0, 0, 1 /* Finished */));
      return this;
    }
    ai(aggroRange) {
      this.entity.addComponent(new AIComponent(aggroRange));
      return this;
    }
    debug(entityManager2, excludedComponents2) {
      this.entity.addComponent(new DebugComponent(entityManager2, excludedComponents2));
      return this;
    }
    build() {
      return this.entity;
    }
    ensureRenderComponent() {
      let renderComponent = this.entity.getComponent(RenderComponent);
      if (!renderComponent) {
        renderComponent = this.entity.addComponent(new RenderComponent(0, 0, {}));
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
  };

  // src/utils/constants.ts
  var TILE_WIDTH = 32;
  var TILE_HEIGHT = 32;
  var LEVEL_WIDTH = 20;
  var LEVEL_HEIGHT = 15;

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
  function createEnemyEntity(entityManager2) {
    const enemyEntity = EntityFactory.create().name("enemy").position(new Vector2D(TILE_WIDTH * 7, TILE_HEIGHT * 7)).size(32, 32).movement(new Vector2D(0, 0), 1).collision("box" /* BOX */).combat().ai(50).animations(animations).build();
    entityManager2.addEntity(enemyEntity);
  }

  // src/sprites/playerAnimations.ts
  SpriteSheetParser.extractSprites("player", "player-idle", 32, 32, 512, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseIdle.png");
  SpriteSheetParser.extractSprites("player", "player-run", 32, 32, 128, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseWalk.png");
  SpriteSheetParser.extractSprites("player", "player-attack", 32, 32, 128, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseAttack.png");
  var playerIdleSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-idle");
  var playerRunSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-run");
  var playerAttackSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-attack");
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

  // src/entities/playerEntity.ts
  var excludedComponents = ["_DebugComponent", "PlayerComponent", "CollisionComponent"];
  var animations2 = /* @__PURE__ */ new Map();
  animations2.set(playerIdleAnimation.name, playerIdleAnimation);
  animations2.set(playerRunAnimation.name, playerRunAnimation);
  animations2.set(playerRunUpAnimation.name, playerRunUpAnimation);
  animations2.set(playerIdleUpAnimation.name, playerIdleUpAnimation);
  animations2.set(playerAttackAnimation.name, playerAttackAnimation);
  animations2.set(playerAttackUpAnimation.name, playerAttackUpAnimation);
  function createPlayerEntity(entityManager2) {
    const playerEntity = EntityFactory.create().name("player").position(new Vector2D(TILE_WIDTH * 5, TILE_HEIGHT * 5)).size(32, 32).movement(new Vector2D(0, 0), 1).collision("box" /* BOX */).player().debug(entityManager2, excludedComponents).combat().animations(animations2).build();
    entityManager2.addEntity(playerEntity);
  }

  // src/ai/BehaviorTree.ts
  var BehaviorTree = class {
    constructor(rootNode) {
      this.rootNode = rootNode;
    }
    tick(entityManager2) {
      return this.rootNode.tick(entityManager2);
    }
  };

  // src/ai/ChasePlayer.ts
  var ChasePlayer = class {
    constructor(aiPosition, playerPosition) {
      this.aiPosition = aiPosition;
      this.playerPosition = playerPosition;
    }
    tick(entityManager2) {
      const enemyEntities = entityManager2.getEntitiesByComponent(AIComponent);
      const playerEntity = entityManager2.getEntityByName("player");
      if (!playerEntity) {
        return "FAILURE";
      }
      const playerPositionComponent = playerEntity.getComponent(PositionComponent);
      for (const enemyEntity of enemyEntities) {
        const aiComponent = enemyEntity.getComponent(AIComponent);
        const positionComponent = enemyEntity.getComponent(PositionComponent);
        const movementComponent = enemyEntity.getComponent(MovementComponent);
        const directionX = playerPositionComponent.position.x - positionComponent.position.x;
        const directionY = playerPositionComponent.position.y - positionComponent.position.y;
        const distanceToPlayer = Math.sqrt(directionX * directionX + directionY * directionY);
        if (distanceToPlayer <= aiComponent.aggroRange && this.hasLineOfSight(entityManager2, positionComponent, playerPositionComponent, aiComponent)) {
          if (distanceToPlayer < 10) {
            aiComponent.isChasing = false;
            movementComponent.direction.x = 0;
            movementComponent.direction.y = 0;
            return "SUCCESS";
          } else {
            aiComponent.isChasing = true;
            movementComponent.direction.x = -directionX / distanceToPlayer;
            movementComponent.direction.y = directionY / distanceToPlayer;
          }
        } else {
          aiComponent.isChasing = false;
          movementComponent.direction.x = 0;
          movementComponent.direction.y = 0;
          return "SUCCESS";
        }
      }
      return "RUNNING";
    }
    hasLineOfSight(entityManager2, entityPosition, playerPosition, aiComponent) {
      const obstacles = entityManager2.getEntitiesByComponents([SolidComponent, CollisionComponent]);
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
          const obstaclePosition = obstacleEntity.getComponent(PositionComponent);
          const collisionComponent = obstacleEntity.getComponent(CollisionComponent);
          if (!collisionComponent)
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
      const aiEntities = entityManager2.getEntitiesByComponent(AIComponent);
      const playerEntity = entityManager2.getEntitiesByComponent(PlayerComponent)[0];
      for (const enemyEntity of aiEntities) {
        const positionComponent = enemyEntity.getComponent(PositionComponent);
        const playerPositionComponent = playerEntity.getComponent(PositionComponent);
        const behaviorTree = this.createBehaviorTree(positionComponent.position, playerPositionComponent.position);
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
    createBehaviorTree(aiPosition, playerPosition) {
      const chasePlayerNode = new ChasePlayer(aiPosition, playerPosition);
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
      const entitiesWithAnimations = entityManager2.getEntitiesByComponent(AnimationComponent);
      for (const entity of entitiesWithAnimations) {
        const animationComponent = entity.getComponent(AnimationComponent);
        const renderComponent = entity.getComponent(RenderComponent);
        const combatComponent = entity.getComponent(CombatComponent);
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
              if (animationComponent.currentAnimation === "attack" || animationComponent.currentAnimation === "attack-up") {
                combatComponent.isAttacking = false;
              }
              if (combatComponent.isHurt) {
                combatComponent.isHurt = false;
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
      const solidEntities = entityManager2.getEntitiesByComponent(SolidComponent);
      const collisionEntities = entityManager2.getEntitiesByComponent(MovementComponent);
      if (!collisionEntities)
        return;
      for (const entity of collisionEntities) {
        const collisionComponent = entity.getComponent(CollisionComponent);
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
      const collisionComponent = entity.getComponent(CollisionComponent);
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
        const otherCollisionComponent = otherEntity.getComponent(CollisionComponent);
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
      const collisionComponentA = entityA.getComponent(CollisionComponent);
      const collisionComponentB = entityB.getComponent(CollisionComponent);
      const positionComponentA = entityA.getComponent(PositionComponent);
      const positionComponentB = entityB.getComponent(PositionComponent);
      const renderComponentA = entityA.getComponent(RenderComponent);
      const renderComponentB = entityB.getComponent(RenderComponent);
      const { width: collisionWidthA, height: collisionHeightA, offsetX: offsetXA, offsetY: offsetYA } = collisionComponentA;
      const { width: collisionWidthB, height: collisionHeightB, offsetX: offsetXB, offsetY: offsetYB } = collisionComponentB;
      const { width: renderWidthA, height: renderHeightA } = renderComponentA;
      const { width: renderWidthB, height: renderHeightB } = renderComponentB;
      const { x: xA, y: yA } = positionComponentA.position;
      const { x: xB, y: yB } = positionComponentB.position;
      const halfWidthA = (collisionWidthA || renderWidthA) * 0.5;
      const halfHeightA = (collisionHeightA || renderHeightA) * 0.5;
      const halfWidthB = (collisionWidthB || renderWidthB) * 0.5;
      const halfHeightB = (collisionHeightB || renderHeightB) * 0.5;
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
      const entitiesWithCombat = entityManager2.getEntitiesByComponent(CombatComponent);
      for (const attacker of entitiesWithCombat) {
        const attackerCombat = attacker.getComponent(CombatComponent);
        const attackerPosition = attacker.getComponent(PositionComponent).position;
        const attackerAnimation = attacker.getComponent(AnimationComponent);
        const attackerMovement = attacker.getComponent(MovementComponent);
        if (!attackerCombat || !attackerCombat.isAttacking || !attackerAnimation) {
          continue;
        }
        let closestTarget = null;
        let closestDistanceSq = Infinity;
        for (const potentialTarget of entitiesWithCombat) {
          if (potentialTarget === attacker)
            continue;
          const targetPosition = potentialTarget.getComponent(PositionComponent).position;
          const distanceSq = (targetPosition.x - attackerPosition.x) ** 2 + (targetPosition.y - attackerPosition.y) ** 2;
          if (distanceSq < attackerCombat.attackRange ** 1 && distanceSq < closestDistanceSq) {
            const angleToTarget = -Math.atan2(targetPosition.y - attackerPosition.y, targetPosition.x - attackerPosition.x);
            const angleDifference = -Math.abs(angleToTarget - attackerMovement.currentFacingAngle);
            if (angleDifference <= Math.PI / 180 * 20) {
              closestTarget = potentialTarget;
              closestDistanceSq = distanceSq;
            }
          }
        }
        if (closestTarget) {
          this.handleAttack(attacker, closestTarget);
        }
      }
    }
    render() {
    }
    handleAttack(attacker, target) {
      const attackerCombat = attacker.getComponent(CombatComponent);
      const targetCombat = target.getComponent(CombatComponent);
      const targetAnimationComponent = target.getComponent(AnimationComponent);
      if (!attackerCombat || !targetCombat)
        return;
      if (!targetCombat.isDead)
        targetCombat.isHurt = true;
      const damage = Math.max(attackerCombat.attackPower - targetCombat.defense, 0);
      targetCombat.health -= damage;
      if (targetCombat.health <= 0) {
        if (!targetCombat.isDead) {
          targetCombat.isDead = true;
          targetAnimationComponent.currentFrameIndex = 0;
          targetAnimationComponent.playAnimation("death");
          console.log(target.name + " died.");
        }
      }
      attackerCombat.isAttacking = false;
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
      const player = entityManager2.getEntitiesByComponent(PlayerComponent)[0];
      const movementComponent = player.getComponent(MovementComponent);
      const combatComponent = player.getComponent(CombatComponent);
      const animationComponent = player.getComponent(AnimationComponent);
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
      if (combatComponent) {
        if (this.pressedKeys.has(" ") && !combatComponent.attackInitiated) {
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
        isHurt: combatComponent.isHurt
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
      const movementEntities = entityManager2.getEntitiesByComponent(MovementComponent);
      for (const entity of movementEntities) {
        const movementComponent = entity.getComponent(MovementComponent);
        const positionComponent = entity.getComponent(PositionComponent);
        const collisionComponent = entity.getComponent(CollisionComponent);
        const animationComponent = entity.getComponent(AnimationComponent);
        const renderComponent = entity.getComponent(RenderComponent);
        const combatComponent = entity.getComponent(CombatComponent);
        let xMovement = movementComponent.direction.x * movementComponent.moveSpeed;
        let yMovement = movementComponent.direction.y * movementComponent.moveSpeed;
        if (!combatComponent.isDead) {
          if (xMovement !== 0) {
            let newX = positionComponent.position.x - xMovement;
            if (!collisionComponent.collisionDetails.right && xMovement < 0) {
              renderComponent.flipped = true;
              positionComponent.position.x = Math.floor(newX);
            } else if (!collisionComponent.collisionDetails.left && xMovement > 0) {
              renderComponent.flipped = false;
              positionComponent.position.x = Math.ceil(newX);
            }
          }
          if (yMovement !== 0) {
            let newY = positionComponent.position.y + yMovement;
            if (!collisionComponent.collisionDetails.top && yMovement < 0) {
              positionComponent.position.y = Math.floor(newY);
            } else if (!collisionComponent.collisionDetails.bottom && yMovement > 0) {
              positionComponent.position.y = Math.ceil(newY);
            }
          }
          if (xMovement !== 0 || yMovement !== 0) {
            movementComponent.currentFacingAngle = Math.atan2(yMovement, xMovement) * 180 / Math.PI;
          }
          AnimationController.playAnimation(animationComponent, movementComponent, combatComponent);
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
      this.canvas = document.createElement("canvas");
      this.cameraWidth = 100;
      this.cameraHeight = 90;
      this.zoomFactor = 4;
      if (!this.canvas)
        throw new Error("Failed to initialize game canvas.");
      const ctx = this.canvas.getContext("2d");
      if (!ctx)
        throw new Error("Failed to initialize canvas context.");
      this.ctx = ctx;
      this.canvas.width = width;
      this.canvas.height = height;
      document.body.appendChild(this.canvas);
    }
    preload() {
    }
    update(_, entityManager2) {
      const playerEntity = entityManager2.getEntityByName("player");
      if (!playerEntity)
        return;
      const playerPositionComponent = playerEntity.getComponent(PositionComponent);
      const cameraX = playerPositionComponent.position.x - this.cameraWidth / 2;
      const cameraY = playerPositionComponent.position.y - this.cameraHeight / 2;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.scale(this.zoomFactor, this.zoomFactor);
      const animationEntities = entityManager2.getEntitiesByComponent(AnimationComponent);
      const solidEntities = entityManager2.getEntitiesByComponent(SolidComponent);
      for (const entity of solidEntities) {
        const renderComponent = entity.getComponent(RenderComponent);
        const positionComponent = entity.getComponent(PositionComponent);
        const solidComponent = entity.getComponent(SolidComponent);
        const adjustedX = positionComponent.position.x - cameraX;
        const adjustedY = positionComponent.position.y - cameraY;
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
      for (const entity of animationEntities) {
        const renderComponent = entity.getComponent(RenderComponent);
        const positionComponent = entity.getComponent(PositionComponent);
        const animationComponent = entity.getComponent(AnimationComponent);
        if (animationComponent) {
          const animation = animationComponent.animations.get(animationComponent.currentAnimation);
          const currentAnimationFrame = animation?.frames[animationComponent.currentFrameIndex];
          if (!currentAnimationFrame)
            return;
          const adjustedX = positionComponent.position.x - cameraX;
          const adjustedY = positionComponent.position.y - cameraY;
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
  SpriteSheetParser.extractSprites("floor-tile", "dungeon-floor-tiles", 8, 8, 56, 16, "./assets/tiles/MiniFantasy_DungeonFloorTiles.png");
  SpriteSheetParser.extractSprites("wall-tiles", "dungeon-wall-tiles", 8, 8, 56, 112, "./assets/tiles/MiniFantasy_DungeonWallTiles.png");
  var entityManager = new EntityManager();
  var renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
  var inputSystem = new InputSystem();
  var movementSystem = new MovementSystem();
  var collisionSystem = new CollisionSystem();
  var animationSystem = new AnimationSystem();
  var combatSystem = new CombatSystem();
  createPlayerEntity(entityManager);
  createEnemyEntity(entityManager);
  console.log(SpriteSheetParser.getSpriteSheet("wall-tiles", "dungeon-wall-tiles"));
  for (let i = 0; i < 400; i += 8) {
    for (let j = 0; j < 400; j += 8) {
      const tile = EntityFactory.create().position(new Vector2D(i, j)).size(8, 8).solid(SpriteSheetParser.getSprite("floor-tile", "dungeon-floor-tiles", 0, 0)).tiled(true).build();
      entityManager.addEntity(tile);
    }
    const wall = EntityFactory.create().position(new Vector2D(i, 0)).size(8, 8).solid(SpriteSheetParser.getSprite("wall-tiles", "dungeon-wall-tiles", 4, 5)).tiled(true).collision("box" /* BOX */, 0, -15).build();
    entityManager.addEntity(wall);
  }
  var aiSystem = new AISystem(entityManager);
  var game = new Game(entityManager);
  game.addSystems([
    animationSystem,
    inputSystem,
    movementSystem,
    renderSystem,
    collisionSystem,
    aiSystem,
    combatSystem
  ]);
  game.run();
})();
