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

  // src/utils/ImageLoader.ts
  var ImageLoader = class {
    static {
      this.loadedImages = /* @__PURE__ */ new Map();
    }
    static load(url) {
      return new Promise((resolve, reject) => {
        if (this.loadedImages.has(url)) {
          resolve(this.loadedImages.get(url));
        } else {
          const image = new Image();
          image.onload = () => {
            this.loadedImages.set(url, image);
            resolve(image);
          };
          image.onerror = reject;
          image.src = url;
        }
      });
    }
  };

  // src/components/RenderComponent.ts
  var RenderComponent = class extends Component {
    constructor(width, height, tiled, frameX = 0, frameY = 0) {
      super();
      this.width = width;
      this.height = height;
      this.tiled = tiled;
      this.frameX = frameX;
      this.frameY = frameY;
      this.image = null;
      this.flipped = false;
    }
    setImage(spritePath) {
      ImageLoader.load(spritePath).then((image) => {
        this.image = image;
      }).catch((error) => {
        throw new Error(`Failed to load image from ${spritePath}. Error: ${error}`);
      });
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

  // src/sprites/Animation.ts
  var Animation = class {
    constructor(name, frameIndices, animationSpeed, priority = 0) {
      this.name = name;
      this.frameIndices = frameIndices;
      this.animationSpeed = animationSpeed;
      this.priority = priority;
    }
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

  // src/components/AIComponent.ts
  var AIComponent = class extends Component {
    constructor(aggroRange, hasLineOfSight = false, isChasing = false) {
      super();
      this.aggroRange = aggroRange;
      this.hasLineOfSight = hasLineOfSight;
      this.isChasing = isChasing;
    }
  };

  // src/components/MovementComponent.ts
  var MovementComponent = class extends Component {
    constructor(direction, moveSpeed = 10, prevDirection = { x: 0, y: 0 }) {
      super();
      this.direction = direction;
      this.moveSpeed = moveSpeed;
      this.prevDirection = prevDirection;
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
    constructor() {
      super();
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
          if (distanceToPlayer === 0) {
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
        const obstacles = entityManager2.getEntitiesByComponent(SolidComponent);
        for (const obstacleEntity of obstacles) {
          const obstaclePosition = obstacleEntity.getComponent(PositionComponent);
          const collisionComponent = obstacleEntity.getComponent(CollisionComponent);
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

  // src/components/AnimationComponent.ts
  var AnimationComponent = class extends Component {
    constructor(animations = /* @__PURE__ */ new Map(), currentAnimation = "", currentFrameIndex = 0, currentAnimationTime = 0, isPlaying = false, frameWidth = 32, frameHeight = 32) {
      super();
      this.animations = animations;
      this.currentAnimation = currentAnimation;
      this.currentFrameIndex = currentFrameIndex;
      this.currentAnimationTime = currentAnimationTime;
      this.isPlaying = isPlaying;
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;
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
        if (!animationComponent.isPlaying || !renderComponent || !animationComponent.currentAnimation) {
          continue;
        }
        const animation = animationComponent.animations.get(animationComponent.currentAnimation);
        if (!animation) {
          continue;
        }
        animationComponent.currentAnimationTime += deltaTime;
        const frameDuration = 1 / animation.animationSpeed;
        if (animationComponent.currentAnimationTime >= frameDuration) {
          const frameIndexIncrement = Math.floor(animationComponent.currentAnimationTime / frameDuration);
          animationComponent.currentFrameIndex = (animationComponent.currentFrameIndex + frameIndexIncrement) % animation.frameIndices.length;
          animationComponent.currentAnimationTime %= frameDuration;
        }
        const currentFrameIndex = animation.frameIndices[animationComponent.currentFrameIndex];
        const spriteSheet = renderComponent.image;
        if (!spriteSheet)
          continue;
        const frameWidth = renderComponent.width;
        const frameHeight = renderComponent.height;
        const frameX = currentFrameIndex % (spriteSheet.width / frameWidth) * frameWidth || 0;
        const frameY = Math.floor(currentFrameIndex / (spriteSheet.width / frameWidth)) * frameHeight || 0;
        renderComponent.frameX = frameX;
        renderComponent.frameY = frameY;
        renderComponent.width = frameWidth;
        renderComponent.height = frameHeight;
      }
    }
    render() {
    }
    getCurrentFrameIndex() {
      const animation = this.animations.get(this.currentAnimation);
      return animation ? animation.frameIndices[this.currentFrameIndex] : 0;
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

  // src/components/CombatCompontent.ts
  var CombatComponent = class extends Component {
    constructor(isAttacking = false) {
      super();
      this.isAttacking = isAttacking;
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
      const player2 = entityManager2.getEntitiesByComponent(PlayerComponent)[0];
      const movementComponent = player2.getComponent(MovementComponent);
      const combatComponent = player2.getComponent(CombatComponent);
      const animationComponent = player2.getComponent(AnimationComponent);
      if (!player2)
        throw new Error("No player entity assigned.");
      if (!movementComponent)
        throw new Error("Player has no movement component.");
      let xDirection = 0;
      let yDirection = 0;
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
      if (combatComponent) {
        if (this.pressedKeys.has(" ")) {
          combatComponent.isAttacking = true;
          animationComponent.playAnimation("attack");
        } else {
          combatComponent.isAttacking = false;
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
        if (xMovement !== 0 && yMovement === 0) {
          animationComponent.playAnimation("run");
        } else if (yMovement !== 0) {
          if (yMovement < 0) {
            animationComponent.playAnimation("run-up");
          } else {
            animationComponent.playAnimation("run");
          }
        } else if (!combatComponent?.isAttacking) {
          if (movementComponent.prevDirection.y < 0) {
            animationComponent.playAnimation("idle-up");
          } else {
            if (animationComponent.currentAnimation !== "idle-up") {
              animationComponent.playAnimation("idle");
            }
          }
        }
        movementComponent.prevDirection = { x: xMovement, y: yMovement };
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
      this.cameraWidth = 70;
      this.cameraHeight = 50;
      this.zoomFactor = 6;
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
      const renderEntities = entityManager2.getEntitiesByComponent(RenderComponent);
      for (const entity of renderEntities) {
        const renderComponent = entity.getComponent(RenderComponent);
        const positionComponent = entity.getComponent(PositionComponent);
        const adjustedX = positionComponent.position.x - cameraX;
        const adjustedY = positionComponent.position.y - cameraY;
        if (renderComponent.image) {
          if (renderComponent.tiled) {
            for (let i = adjustedX; i < renderComponent.width + adjustedX; i += 32) {
              for (let j = adjustedY; j < renderComponent.height + adjustedY; j += 32) {
                this.ctx.drawImage(renderComponent.image, 0, 0, 32, 32, i, j, 32, 32);
              }
            }
          } else {
            const animationComponent = entity.getComponent(AnimationComponent);
            if (animationComponent) {
              if (animationComponent.currentAnimation) {
                const spriteSheet = renderComponent.image;
                const frameWidth = renderComponent.width;
                const frameHeight = renderComponent.height;
                const frameX = renderComponent.frameX;
                const frameY = renderComponent.frameY;
                if (renderComponent.flipped) {
                  this.ctx.save();
                  this.ctx.scale(-1, 1);
                  this.ctx.drawImage(
                    spriteSheet,
                    frameX,
                    frameY,
                    frameWidth,
                    frameHeight,
                    -adjustedX - frameWidth,
                    // Negate position and width
                    adjustedY,
                    frameWidth,
                    frameHeight
                  );
                  this.ctx.restore();
                } else {
                  this.ctx.drawImage(
                    spriteSheet,
                    frameX,
                    frameY,
                    frameWidth,
                    frameHeight,
                    adjustedX,
                    adjustedY,
                    frameWidth,
                    frameHeight
                  );
                }
              }
            } else {
              this.ctx.drawImage(
                renderComponent.image,
                0,
                0,
                32,
                32,
                adjustedX,
                adjustedY,
                renderComponent.width,
                renderComponent.height
              );
            }
          }
        } else {
          this.ctx.fillStyle = "gray";
          this.ctx.fillRect(adjustedX, adjustedY, renderComponent.width, renderComponent.height);
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
    spritePath(spritePath) {
      const renderComponent = this.ensureRenderComponent();
      renderComponent.setImage(spritePath);
      return this;
    }
    tiled(tiled) {
      const renderComponent = this.ensureRenderComponent();
      renderComponent.tiled = tiled;
      return this;
    }
    solid(solid = false) {
      if (solid) {
        this.entity.addComponent(new SolidComponent());
      }
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
    animations(animations) {
      this.entity.addComponent(new AnimationComponent(animations, "idle"));
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
        renderComponent = this.entity.addComponent(new RenderComponent(0, 0));
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

  // src/main.ts
  var entityManager = new EntityManager();
  var renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
  var inputSystem = new InputSystem();
  var movementSystem = new MovementSystem();
  var collisionSystem = new CollisionSystem();
  var animationSystem = new AnimationSystem();
  var idle = new Animation("idle", [192, 193, 194, 195, 196, 197, 198], 5e-3);
  var idleUp = new Animation("idle-up", [208, 209, 210, 211, 212, 213, 214], 0.01);
  var run = new Animation("run", [256, 257, 258, 259], 0.01);
  var runUp = new Animation("run-up", [272, 273, 274, 275], 0.01);
  var attack = new Animation("attack", [16, 17, 18, 19], 0.01);
  var attackUp = new Animation("attack-up", [32, 33, 34, 35], 0.01);
  var playerAnimations = /* @__PURE__ */ new Map();
  playerAnimations.set("idle", idle);
  playerAnimations.set("idle-up", idleUp);
  playerAnimations.set("run", run);
  playerAnimations.set("run-up", runUp);
  playerAnimations.set("attack", attack);
  playerAnimations.set("attack-up", attackUp);
  var excludedComponents = ["_DebugComponent", "PlayerComponent", "RenderComponent", "MovementComponent"];
  var player = EntityFactory.create().name("player").position(new Vector2D(TILE_WIDTH * 5, TILE_HEIGHT * 5)).size(32, 32).spritePath("./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseAnimations.png").solid(false).movement(new Vector2D(0, 0), 2).collision("box" /* BOX */, 11, 11, 8, 8).player().debug(entityManager, excludedComponents).combat().animations(playerAnimations).build();
  var enemy = EntityFactory.create().name("enemy").position(new Vector2D(TILE_WIDTH * 7, TILE_HEIGHT * 7)).size(TILE_WIDTH, TILE_HEIGHT).spritePath("./assets/spritesheets/player/Minifantasy_CreaturesOrcBaseAnimations.png").solid(false).movement(new Vector2D(0, 0), 2).collision("box" /* BOX */, 11, 11, 8, 8).animations(playerAnimations).ai(55).build();
  var enemy2 = EntityFactory.create().name("enemy2").position(new Vector2D(TILE_WIDTH * 13, TILE_HEIGHT * 13)).size(TILE_WIDTH, TILE_HEIGHT).spritePath("./assets/spritesheets/player/Minifantasy_CreaturesOrcBaseAnimations.png").solid(false).movement(new Vector2D(0, 0), 2).collision("box" /* BOX */, 11, 11, 8, 8).animations(playerAnimations).ai(55).build();
  var topPlatform = EntityFactory.create().name("top-platform").position(new Vector2D(TILE_WIDTH, 0)).size(renderSystem.width - TILE_WIDTH, TILE_HEIGHT).spritePath("./assets/tiles/stone_tile.png").tiled(true).collision("box" /* BOX */).solid(true).build();
  var bottomPlatform = EntityFactory.create().name("bottom-platform").position(new Vector2D(TILE_WIDTH, renderSystem.height - TILE_HEIGHT)).size(renderSystem.width - TILE_WIDTH * 2, TILE_HEIGHT).spritePath("./assets/tiles/stone_tile.png").tiled(true).collision("box" /* BOX */).solid(true).build();
  var leftPlatform = EntityFactory.create().name("left-platform").position(new Vector2D(0, 0)).size(TILE_WIDTH, renderSystem.height).spritePath("./assets/tiles/stone_tile.png").tiled(true).collision("box" /* BOX */).solid(true).build();
  var rightPlatform = EntityFactory.create().name("right-platform").position(new Vector2D(renderSystem.width - TILE_WIDTH, 0)).size(TILE_WIDTH, renderSystem.height).spritePath("./assets/tiles/stone_tile.png").tiled(true).collision("box" /* BOX */).solid(true).build();
  var randomTile = EntityFactory.create().name("random-tile").position(new Vector2D(TILE_WIDTH * 4, TILE_HEIGHT * 4)).size(TILE_WIDTH, TILE_HEIGHT).spritePath("./assets/tiles/stone_tile.png").tiled(false).collision("box" /* BOX */).solid(true).build();
  for (let i = TILE_HEIGHT + 32; i < TILE_HEIGHT * 5; i += 32) {
    const tile = EntityFactory.create().name("random-tile").position(new Vector2D(TILE_WIDTH * 3, i)).size(TILE_WIDTH, TILE_HEIGHT).spritePath("./assets/tiles/stone_tile.png").tiled(false).collision("box" /* BOX */).solid(true).build();
    entityManager.addEntity(tile);
  }
  entityManager.addEntities([
    topPlatform,
    bottomPlatform,
    rightPlatform,
    leftPlatform,
    randomTile,
    player,
    enemy,
    enemy2
  ]);
  var aiSystem = new AISystem(entityManager);
  var game = new Game(entityManager);
  game.addSystems([
    inputSystem,
    movementSystem,
    renderSystem,
    collisionSystem,
    animationSystem,
    aiSystem
  ]);
  game.run();
})();
