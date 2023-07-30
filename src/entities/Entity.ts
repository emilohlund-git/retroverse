import { Component } from "../components/Component";

export class Entity {
  private components = new Map<string, Component>();

  constructor(public name: string) { }

  public addComponent<T extends Component>(componentName: string, component: T): T {
    this.components.set(componentName, component);
    return component;
  }

  public hasComponent(componentName: string): boolean {
    return this.components.has(componentName);
  }

  public getComponent<T extends Component>(componentName: string): T | undefined {
    return this.components.get(componentName) as T | undefined;
  }

  public getComponents(): Component[] {
    return Array.from(this.components.values());
  }

  public removeComponent(componentName: string): void {
    this.components.delete(componentName);
  }
}