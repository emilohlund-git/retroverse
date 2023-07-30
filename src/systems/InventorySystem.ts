import { InventoryComponent } from "../components/InventoryComponent";
import { ItemComponent } from "../components/ItemComponent";
import { PositionComponent } from "../components/PositionComponent";
import { EntityManager } from "../entities/EntityManager";
import { SpriteData } from "../utils/SpriteSheetParser";
import { Vector2D } from "../utils/Vector2D";
import { System } from "./System";

export class InventorySystem extends System {
  private canvas = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D;
  public playerInventory: InventoryComponent | null = null;

  private slotWidth = 16;
  private slotHeight = 16;
  private slotSpacing = 2;

  private hoveredItemIndex: number | null = null;
  private tooltip: HTMLDivElement | null = null;

  constructor() {
    super();
    const viewport = document.getElementById("viewport");
    if (!viewport) throw new Error("Viewport missing.");
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("Error initializing inventory context.");
    this.ctx = context;
    viewport.appendChild(this.canvas);

    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
  }

  preload(entityManager: EntityManager) {

  };

  update(deltaTime: number, entityManager: EntityManager) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const player = entityManager.getEntitiesByComponent("PlayerComponent")[0];
    const playerPosition = player.getComponent<PositionComponent>("PositionComponent")?.position;
    const inventory = player.getComponent<InventoryComponent>("InventoryComponent")!;
    if (!inventory) return;

    this.playerInventory = inventory;

    this.updatePlayerInventory(inventory);

    if (playerPosition && inventory.pickingUp) {
      this.handlePickupInteraction(playerPosition, entityManager);
    }
  };

  render() { };

  public updatePlayerInventory(inventory: InventoryComponent) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < inventory.maxCapacity; i++) {
      if (inventory.items[i]) {
        this.cropIconFromSpriteSheet(inventory.items[i].icon, i);

        if (i === this.hoveredItemIndex) {
          // Show tooltip for the hovered item
          this.showTooltip(inventory.items[i].description, i * 64, 36);
        }
      }
    }
  }

  private cropIconFromSpriteSheet(spriteData: SpriteData, slotIndex: number) {
    const numSlotsPerRow = 10;
    const x = (slotIndex % numSlotsPerRow) * (this.slotWidth + this.slotSpacing);
    const y = Math.floor(slotIndex / numSlotsPerRow) * (this.slotHeight + this.slotSpacing);

    // Draw the slot background (you can change this to any shape or style you want)
    this.ctx.fillStyle = "#888"; // Set the slot background color (gray in this case)
    this.ctx.fillRect(x, y, this.slotWidth, this.slotHeight);

    // Draw the cropped image on top of the slot background
    this.ctx.drawImage(
      spriteData.image,
      spriteData.x,
      spriteData.y,
      spriteData.width,
      spriteData.height,
      x,
      y,
      this.slotWidth,
      this.slotHeight
    );
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.playerInventory) return;
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the slot index that the mouse is currently hovering over
    const numSlotsPerRow = 10;
    const hoveredSlotIndex =
      Math.floor(mouseY / (this.slotHeight + this.slotHeight * 3 + this.slotSpacing)) * numSlotsPerRow +
      Math.floor(mouseX / (this.slotWidth + this.slotWidth * 3 + this.slotSpacing));

    if (hoveredSlotIndex >= 0 && hoveredSlotIndex < this.playerInventory.maxCapacity) {
      this.hoveredItemIndex = hoveredSlotIndex;
    } else {
      this.hoveredItemIndex = null;
    }

    this.updatePlayerInventory(this.playerInventory);
  }

  private handleMouseLeave() {
    if (!this.playerInventory) return;
    this.hoveredItemIndex = null;
    this.updatePlayerInventory(this.playerInventory);
    this.hideTooltip()
  }

  private showTooltip(description: string, x: number, y: number) {
    if (!this.tooltip) {
      this.tooltip = document.createElement("div");
      this.tooltip.classList.add("tooltip");
      const viewport = document.getElementById("viewport");
      if (!viewport) throw new Error("Viewport missing.");
      viewport.appendChild(this.tooltip);
    }

    // Position the tooltip below the item slot
    this.tooltip.style.left = x + "px";
    this.tooltip.style.top = y + this.slotHeight + 5 + "px"; // You can adjust the tooltip position as needed

    // Set the tooltip content to the item description
    this.tooltip.innerText = description;
    this.tooltip.style.display = "block";
  }

  private hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = "none";
    }
  }

  public addToPlayerInventory(item: ItemComponent) {
    this.playerInventory?.items.push(item);
  }

  private handlePickupInteraction(playerPosition: Vector2D, entityManager: EntityManager) {
    if (!this.playerInventory) return;

    const world = entityManager.getEntityByName("world-inventory");
    if (!world) return;

    const worldInventory = world.getComponent<InventoryComponent>("InventoryComponent");
    if (!worldInventory) return;

    for (const item of worldInventory.items) {
      if (item.isDropped) {
        const distanceToItem = this.calculateDistance(playerPosition, item.dropPosition);

        const pickupDistance = 20;
        if (distanceToItem <= pickupDistance && this.playerInventory.items.length <= this.playerInventory.maxCapacity) {
          this.playerInventory.items.push(item);

          item.isDropped = false;

          break;
        }
      }
    }
  }

  private calculateDistance(pos1: Vector2D, pos2: Vector2D): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}