import { AnimationComponent, AnimationState } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../entities/EntityManager";
import { Animation } from "../sprites/Animation";
import { SpriteData } from "../utils/SpriteSheetParser";
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
      const combatComponent = entity.getComponent(CombatComponent);

      if (!animationComponent.isPlaying || !renderComponent || !animationComponent.currentAnimation) {
        continue;
      }

      animationComponent.state = AnimationState.Playing;

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
            animationComponent.state = AnimationState.Finished;

            if (combatComponent.isHurt) {
              combatComponent.isHurt = false;
            }

            if (animationComponent.currentAnimation === "attack" ||
              animationComponent.currentAnimation === "attack-up") {
              combatComponent.isAttacking = false;
            }

            continue;
          }
        }

        animationComponent.currentFrameIndex = (animationComponent.currentFrameIndex + frameIndexIncrement) % animation.frames.length;
        animationComponent.currentAnimationTime %= frameDuration;
      }
    }
  }

  render() {/* */ }

  getCurrentSpriteData(): SpriteData | undefined {
    const animation = this.animations.get(this.currentAnimation);
    return animation ? animation.frames[this.currentFrameIndex] : undefined;
  }

  stopAnimation() {
    this.isPlaying = false;
    this.currentAnimation = "";
    this.currentFrameIndex = 0;
    this.currentAnimationTime = 0;
  }
}