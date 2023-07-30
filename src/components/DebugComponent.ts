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

    const debugEntities = this.entityManager.getEntitiesByComponent("DebugComponent");
    for (const entity of debugEntities) {
      const components = entity.getComponents();
      components.forEach((component) => {
        if (!this.excludedComponents.includes(component.constructor.name)) {
          this.addDebugInfoForComponent(component.constructor.name, component);
        }
      });
    }
  }

  private addDebugInfoForComponent(componentName: string, component: object) {
    const componentTitle = document.createElement('h2');
    componentTitle.innerText = componentName;
    this.debugDiv.appendChild(componentTitle);

    this.handleComponentProperties(component);
  }

  private handleComponentProperties(component: Component) {
    const componentKeys = Object.entries(component) as (keyof Component)[];
    const debugSpan = document.createElement('span');
    const toAdd = <any>[];
    for (const key of componentKeys) {
      if (key)
        toAdd.push(key);
    }

    debugSpan.innerHTML += JSON.stringify(toAdd, null, 3);
    this.debugDiv.appendChild(debugSpan);
  }
}
