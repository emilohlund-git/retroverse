import { AnimationComponent, AnimationState } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../entities/EntityManager";
import { Animation } from "../sprites/animations/Animation";
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
    const entitiesWithAnimations = entityManager.getEntitiesByComponent("AnimationComponent");

    for (const entity of entitiesWithAnimations) {
      const animationComponent = entity.getComponent<AnimationComponent>("AnimationComponent");
      if (!animationComponent) continue;
      const renderComponent = entity.getComponent<RenderComponent>("RenderComponent");
      const combatComponent = entity.getComponent<CombatComponent>("CombatComponent");

      if (!animationComponent.isPlaying || !renderComponent || !animationComponent.currentAnimation) {
        continue;
      }

      const animation = animationComponent.animations.get(animationComponent.currentAnimation);

      if (!animation) {
        continue;
      }

      if (animation.name !== animationComponent.currentAnimation) {
        animationComponent.currentFrameIndex = 0; // Reset the current frame index
        animationComponent.currentAnimationTime = 0; // Reset the animation time
        animationComponent.state = AnimationState.Playing; // Start playing the new animation
        animationComponent.currentAnimation = animation.name; // Update the current animation
      }

      animationComponent.currentAnimationTime += deltaTime;
      const frameDuration = 1 / animation.animationSpeed;

      if (animationComponent.currentAnimationTime >= frameDuration) {
        const frameIndexIncrement = Math.floor(animationComponent.currentAnimationTime / frameDuration);
        const totalFrames = animation.frames.length;

        if (!animation.loop) {
          if (animationComponent.currentFrameIndex >= totalFrames - 1) {
            animationComponent.state = AnimationState.Finished;

            if (combatComponent) {
              if (combatComponent.isHurt) {
                combatComponent.isHurt = false;
              }
            }

            if (animationComponent.currentAnimation === "attack" ||
              animationComponent.currentAnimation === "attack-up") {
              if (combatComponent) {
                combatComponent.isAttacking = false;
              }
            }

            if (animationComponent.currentAnimation === "death") {
              this.onEntityRemoved(entity);
              entityManager.removeEntity(entity);
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