import { EntityManager } from "../entities/EntityManager";
import { Component } from "./Component";

export class DebugComponent extends Component {
  private debugDiv: HTMLDivElement;
  private excludedComponents: string[];

  constructor(private entityManager: EntityManager, excludedComponents: string[] = []) {
    super();
    this.excludedComponents = excludedComponents;
    this.debugDiv = document.createElement('div');
    this.debugDiv.id = 'debug-window';
    document.getElementById("debug-container")?.appendChild(this.debugDiv);
  }

  debug() {
    this.debugDiv.innerHTML = '';

    const debugEntities = this.entityManager.getEntitiesByComponent(DebugComponent);
    for (const entity of debugEntities) {
      this.addDebugInfoForComponent(entity);
      const components = entity.getComponents();
      components.forEach((component) => {
        if (!this.excludedComponents.includes(component.constructor.name)) {
          this.addDebugInfoForComponent(component);
        }
      });
    }
  }

  private addDebugInfoForComponent(component: object) {
    const componentName = component.constructor.name;
    const componentTitle = document.createElement('h2');
    componentTitle.innerText = componentName;
    this.debugDiv.appendChild(componentTitle);

    this.handleComponentProperties(component);
  }

  private handleComponentProperties(component: Component) {
    const componentKeys = Object.keys(component) as (keyof Component)[];
    for (const key of componentKeys) {
      const value = component[key];
      if (typeof value !== "function") {
        const debugSpan = document.createElement('span');
        debugSpan.innerText = `${key}: ${JSON.stringify(value, null, 2)}`;
        this.debugDiv.appendChild(debugSpan);
      }
    }
  }
}
