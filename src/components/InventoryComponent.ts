import { Component } from "./Component";
import { ItemComponent } from "./ItemComponent";

export class InventoryComponent extends Component {
  constructor(
    public items = <ItemComponent[]>[],
    public maxCapacity = 10,
    public pickingUp: boolean = false,
  ) {
    super();
  }

  addItems(items: ItemComponent[]) {
    this.items.push(...items);
  }

  addItem(item: ItemComponent) {
    this.items.push(item);
  }

  removeItem(item: ItemComponent) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}