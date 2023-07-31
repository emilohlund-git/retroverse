import { ItemComponent } from "../components/ItemComponent";
import { SpriteSheetParser } from "../utils/SpriteSheetParser";

interface ItemData {
  name: string;
  description: string;
  row: number;
  col: number;
}

export async function loadItems(): Promise<Map<string, ItemComponent>> {
  const items: ItemData[] = [
    { name: "Cheese", description: "A cheese.", row: 4, col: 0 },
    { name: "Key", description: "A key", row: 5, col: 0 },
    { name: "Green Ring", description: "A green ring.", row: 5, col: 1 },
    { name: "Blue Ring", description: "A blue ring.", row: 4, col: 1 },
    { name: "Blue Potion", description: "A blue potion.", row: 0, col: 0 },
    { name: "Red Potion", description: "A red potion.", row: 1, col: 0 },
  ];

  const itemComponents = new Map<string, ItemComponent>();
  for (const itemData of items) {
    const spriteData = SpriteSheetParser.getSprite("items", "all-items", itemData.row, itemData.col);
    if (spriteData) {
      const itemComponent = new ItemComponent(itemData.name, itemData.description, spriteData);
      itemComponents.set(itemData.name, itemComponent);
    } else {
      throw new Error(`Sprite data not found for item: ${itemData.name}`);
    }
  }

  return itemComponents;
}