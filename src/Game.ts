import { DebugComponent } from "./components/DebugComponent";
import { EntityManager } from "./entities/EntityManager";
import { System } from "./systems/System";

export class Game {
  private lastUpdateTime = 0;
  private systems = new Set<System>();

  constructor(public entityManager: EntityManager) {
  }

  public addSystem(system: System) {
    this.systems.add(system);
  }

  public addSystems(systems: System[]) {
    systems.forEach((system) => this.systems.add(system));
  }

  private gameLoop() {
    const now = Date.now();
    const deltaTime = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    this.update(deltaTime);
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number) {
    for (const system of this.systems) {
      system.update(deltaTime, this.entityManager);
    }
    this.debug();
  }

  private debug() {
    const entity = this.entityManager.getEntitiesByComponent("PlayerComponent")[0];
    const debugComponent = entity.getComponent<DebugComponent>("DebugComponent");
    if (debugComponent) {
      debugComponent.debug();
    }
  }

  public run() {
    for (const system of this.systems) {
      system.preload(this.entityManager);
    }
    this.gameLoop();
  }
}