import { Component } from "../components/Component";
import { ComponentName } from "./EntityManager";

export class Entity {
  private components = new Map<string, Component>();

  constructor(public name: string) { }

  public addComponent<T extends Component>(componentName: ComponentName, component: T): T {
    this.components.set(componentName, component);
    return component;
  }

  public hasComponent(componentName: ComponentName): boolean {
    return this.components.has(componentName);
  }

  public getComponent<T extends Component>(componentName: ComponentName): T | undefined {
    return this.components.get(componentName) as T | undefined;
  }

  public getComponents(): Component[] {
    return Array.from(this.components.values());
  }

  public removeComponent(componentName: ComponentName): void {
    this.components.delete(componentName);
  }

  public removeComponents(): void {
    this.components.clear();
  }
}