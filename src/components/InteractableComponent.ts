import { Component } from "./Component";
import { InventoryComponent } from "./InventoryComponent";

export interface InteractionConditions {
  hasItem?: (inventory: InventoryComponent, item: string) => boolean
}

export class InteractableComponent extends Component {
  constructor(
    public interacted: boolean = false,
    public conditions: InteractionConditions[] = [],
  ) {
    super();
  }
}