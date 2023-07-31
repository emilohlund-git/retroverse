import { Component } from "./Component";

export class CombatComponent extends Component {
  constructor(
    public isAttacking: boolean = false,
    public attackInitiated: boolean = false,
    public isHurt: boolean = false,
    public attackRange: number = 10,
    public attackPower: number = 9,
    public defense: number = 4,
    public health: number = 20,
    public maxHealth: number = 20,
    public isDead: boolean = false,
    public attackCooldown: number = 0,
    public lastAttackTime: number = 0,
    public knockbackDistance: number = 10,
  ) {
    super();
  }
}