import { AnimationComponent } from "../components/AnimationComponent";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../entities/EntityManager";
import { Animation } from "../sprites/Animation";
import { System } from "./System";

export class AnimationSystem extends System {
  animations: Map<string, Animation> = new Map();
  currentAnimation: string = ""; // Name of the current animation
  currentFrameIndex: number = 0; // Current frame index in the animation
  currentAnimationTime: number = 0; // Time elapsed for the current animation frame
  isPlaying: boolean = false; // Whether the animation is currently playing

  constructor() {
    super();
  }

  preload() {/* */ }

  update(deltaTime: number, entityManager: EntityManager) {
    const entitiesWithAnimations = entityManager.getEntitiesByComponent(AnimationComponent);

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

      if (!spriteSheet) continue;

      const frameWidth = renderComponent.width;
      const frameHeight = renderComponent.height;
      const frameX = (currentFrameIndex % (spriteSheet.width / frameWidth)) * frameWidth || 0;
      const frameY = Math.floor(currentFrameIndex / (spriteSheet.width / frameWidth)) * frameHeight || 0;

      // Update RenderComponent to use the correct frame
      renderComponent.frameX = frameX;
      renderComponent.frameY = frameY;
      renderComponent.width = frameWidth;
      renderComponent.height = frameHeight;
    }
  }

  render() {/* */ }

  getCurrentFrameIndex(): number {
    const animation = this.animations.get(this.currentAnimation);
    return animation ? animation.frameIndices[this.currentFrameIndex] : 0;
  }

  stopAnimation() {
    this.isPlaying = false;
    this.currentAnimation = "";
    this.currentFrameIndex = 0;
    this.currentAnimationTime = 0;
  }
}