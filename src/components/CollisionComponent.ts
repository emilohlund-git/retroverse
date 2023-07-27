import { Component } from "./Component";

export enum CollisionType {
  NONE = 'none',
  BOX = 'box',
  CIRCLE = 'circle',
}

export interface CollisionDetails {
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
}

export class CollisionComponent extends Component {
  public collisionDetails: CollisionDetails = {
    top: false,
    left: false,
    right: false,
    bottom: false,
  };

  constructor(
    public collisionType: CollisionType = CollisionType.BOX,
    public offsetX: number = 0,
    public offsetY: number = 0,
    public width?: number,
    public height?: number,
  ) {
    super();
  }
}