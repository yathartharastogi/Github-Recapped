/**
 * Standard utility helpers
 */

/**
 * Combines CSS class names filtering out falsy values.
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const classes: string[] = [];
  
  inputs.forEach((input) => {
    if (!input) return;
    
    if (typeof input === "string") {
      classes.push(input);
    } else if (typeof input === "object") {
      Object.entries(input).forEach(([key, value]) => {
        if (value) classes.push(key);
      });
    }
  });

  return classes.join(" ");
}

/**
 * Formats a number with comma separators (e.g. 1000 -> 1,000)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}
