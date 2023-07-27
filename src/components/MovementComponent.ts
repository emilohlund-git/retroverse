import { Vector2D } from "../utils/Vector2D";
import { Component } from "./Component";

export class MovementComponent extends Component {
  constructor(
    public direction: Vector2D,
    public moveSpeed: number = 10,
    public prevDirection: Vector2D = { x: 0, y: 0 }
  ) {
    super();
  }
}