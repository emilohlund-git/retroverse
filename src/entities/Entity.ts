import { Component } from "../components/Component";

export class Entity {
  private components = new Set<Component>();

  constructor(public name?: string) { }

  public addComponent<T extends Component>(component: T): T {
    this.components.add(component);
    return component;
  }

  public getComponent<T extends Component>(component: new (...args: any[]) => T): T {
    return Array.from(this.components).find((c) => c instanceof component) as T;
  }

  public getComponents(): Component[] {
    return Array.from(this.components.values());
  }
}