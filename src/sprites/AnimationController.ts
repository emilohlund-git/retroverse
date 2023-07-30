import { AnimationComponent, AnimationState } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { MovementComponent } from "../components/MovementComponent";

interface AnimationCondition {
  name: string;
  condition: (params: AnimationParams) => boolean;
  priority: number;
}

interface AnimationParams {
  xDirection: number;
  yDirection: number;
  currentFacingAngle: number;
  isAttacking: boolean;
  animationState: AnimationState;
  isHurt: boolean;
  attackCooldown: number;
}

export class AnimationController {
  private static conditions: AnimationCondition[] = [
    {
      name: "run",
      condition: (params) => (params.xDirection > 0 || params.xDirection < 0 || params.yDirection === 1) && params.yDirection !== -1,
      priority: 1,
    },
    {
      name: "run-up",
      condition: (params) => params.yDirection < 0,
      priority: 1,
    },
    {
      name: "idle-up",
      condition: (params) => params.xDirection === 0 && params.yDirection === 0 && params.currentFacingAngle < 0,
      priority: 0,
    },
    {
      name: "idle",
      condition: (params) => params.xDirection === 0 && params.yDirection === 0 && params.currentFacingAngle > 0,
      priority: 0,
    },
    {
      name: "attack",
      condition: (params) => params.isAttacking && params.currentFacingAngle >= 0,
      priority: 5,
    },
    {
      name: "attack-up",
      condition: (params) => params.isAttacking && params.currentFacingAngle < 0,
      priority: 5,
    },
    {
      name: "hurt",
      condition: (params) => params.isHurt,
      priority: 10
    }
    // Add more animation conditions as needed
  ];

  static playAnimation(animationComponent: AnimationComponent, movementComponent: MovementComponent, combatComponent: CombatComponent) {
    const params: AnimationParams = {
      xDirection: movementComponent.direction.x,
      yDirection: movementComponent.direction.y,
      currentFacingAngle: movementComponent.currentFacingAngle,
      isAttacking: combatComponent.isAttacking,
      animationState: animationComponent.state,
      isHurt: combatComponent.isHurt,
      attackCooldown: combatComponent.attackCooldown,
    };

    let highestPriorityCondition: AnimationCondition | null = null;
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
}
