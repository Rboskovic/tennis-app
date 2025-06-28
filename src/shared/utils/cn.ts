import { clsx, type ClassValue } from "clsx";

/**
 * Utility function for combining class names
 *
 * This function combines multiple class names and handles conditional classes.
 * It's a wrapper around clsx for consistent class name handling.
 *
 * @param inputs - Array of class names, objects, or conditional classes
 * @returns Combined class name string
 *
 * @example
 * cn('base-class', { 'conditional-class': condition }, 'another-class')
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
