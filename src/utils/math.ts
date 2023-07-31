import { Vector2D } from "./Vector2D";

export const normalizeNumber = (number: number, min: number, max: number): number => {
  if (min === max) {
    return 0.5; // Default to 0.5 if min and max are equal to avoid division by zero.
  }

  // Ensure the number stays within the specified range [min, max]
  const clampedNumber = clamp(number, min, max);

  // Calculate the normalized value
  return (clampedNumber - min) / (max - min);
}

export const clamp = (number: number, min: number, max: number): number => {
  return Math.max(min, Math.min(number, max));
}

export const calculateDistance = (pos1: Vector2D, pos2: Vector2D): number => {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}