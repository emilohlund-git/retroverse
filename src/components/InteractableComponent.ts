import { Component } from "./Component";
import { InventoryComponent } from "./InventoryComponent";

export interface InteractionConditions {
  hasItem?: (inventory: InventoryComponent, item: string) => boolean
}

export class InteractableComponent extends Component {
  constructor(
    public interacting: boolean = false,
    public conditions: InteractionConditions[] = [],
    public interactionAction: (...args: any[]) => any,
    public interactionItemName?: string,
  ) {
    super();
  }
}