import { Component } from "./Component";

export class CombatComponent extends Component {
  constructor(
    public isAttacking: boolean = false,
    public attackInitiated: boolean = false,
    public isHurt: boolean = false,
    public attackRange: number = 10,
    public attackPower: number = 5,
    public defense: number = 4,
    public health: number = 20,
    public isDead: boolean = false,
    public attackCooldown: number = 20,
  ) {
    super();
  }
}