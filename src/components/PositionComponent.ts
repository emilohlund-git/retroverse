import { Vector2D } from "../utils/Vector2D";
import { Component } from "./Component";

export class PositionComponent extends Component {
  constructor(public position: Vector2D) {
    super();
  }
}