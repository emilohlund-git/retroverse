import { Entity } from "../entities/Entity";
import { Component } from "./Component";
import { InventoryComponent } from "./InventoryComponent";

export interface OpenDoorAction {
  inventory: InventoryComponent;
  interactable: InteractableComponent;
  interactableEntity: Entity;
}

export type InteractionActionArgs = OpenDoorAction /* extend with unions e.g.: | AnotherAction | AThirdAction */;

export interface InteractionConditions {
  hasItem?: (inventory: InventoryComponent, item: string) => boolean
}

export class InteractableComponent extends Component {
  constructor(
    public interacting: boolean = false,
    public conditions: InteractionConditions[] = [],
    public interactionAction: (args: InteractionActionArgs) => any,
    public interactionItemName?: string,
  ) {
    super();
  }
}