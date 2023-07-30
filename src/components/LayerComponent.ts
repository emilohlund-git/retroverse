import { Component } from "./Component";

export class LayerComponent extends Component {
  constructor(
    public layer: number = 0,
  ) {
    super();
  }
}