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
  constructor(
    public collisionType: CollisionType = CollisionType.BOX,
    public collisionDetails: CollisionDetails = {
      top: false,
      left: false,
      right: false,
      bottom: false,
    }
  ) {
    super();
  }
}