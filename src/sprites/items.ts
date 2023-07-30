import { ItemComponent } from "../components/ItemComponent";
import { SpriteSheetParser } from "../utils/SpriteSheetParser";

SpriteSheetParser.extractSprites("items", "all-items", 16, 16, 160, 160, "./assets/spritesheets/items/items.png");

const cheeseSprite = SpriteSheetParser.getSprite("items", "all-items", 4, 0)!;
const keySprite = SpriteSheetParser.getSprite("items", "all-items", 5, 0)!;
const bluePotionSprite = SpriteSheetParser.getSprite("items", "all-items", 0, 0)!;
const blueRingSprite = SpriteSheetParser.getSprite("items", "all-items", 4, 1)!;
const greenRingSprite = SpriteSheetParser.getSprite("items", "all-items", 5, 1)!;
const redPotionSprite = SpriteSheetParser.getSprite("items", "all-items", 1, 0)!;
export const cheese = new ItemComponent("Cheese", "A stinky, stinky, stinky cheese. Smells like Boob's butt.", cheeseSprite);
export const key = new ItemComponent("Key", "A key", keySprite);
export const greenRing = new ItemComponent("Green Ring", "A green ring.", greenRingSprite);
export const blueRing = new ItemComponent("Blue Ring", "A blue ring.", blueRingSprite);
export const bluePotion = new ItemComponent("Blue Potion", "A blue potion.", bluePotionSprite);
export const redPotion = new ItemComponent("Red Potion", "A red potion.", redPotionSprite);