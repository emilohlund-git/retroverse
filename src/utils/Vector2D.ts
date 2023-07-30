export class Vector2D {
  constructor(public x: number, public y: number) { }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): void {
    const length = this.length;
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
  }
}