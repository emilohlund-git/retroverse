import { Animation } from "../sprites/Animation";
import { Component } from "./Component";

export class AnimationComponent extends Component {
  constructor(
    public animations: Map<string, Animation> = new Map(),
    public currentAnimation: string = '',
    public currentFrameIndex: number = 0,
    public currentAnimationTime: number = 0,
    public isPlaying: boolean = false,
    public frameWidth: number = 32,
    public frameHeight: number = 32,
  ) {
    super();
  }

  addAnimation(animation: Animation) {
    this.animations.set(animation.name, animation);
  }

  playAnimation(animationName: string) {
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
}