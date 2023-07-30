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