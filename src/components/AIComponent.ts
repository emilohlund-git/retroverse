import { Component } from "./Component";

export class AIComponent extends Component {
  constructor(
    public aggroRange: number,
    public hasLineOfSight: boolean = false,
    public isChasing: boolean = false,
  ) {
    super();
  }
}