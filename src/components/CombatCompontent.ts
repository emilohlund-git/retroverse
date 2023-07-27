import { Component } from "./Component";

export class CombatComponent extends Component {
  constructor(
    public isAttacking = false
  ) {
    super();
  }
}