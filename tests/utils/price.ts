/** Turns a label like "Item total: $29.99" or "$9.99" into the number 29.99 / 9.99. */
export function parsePrice(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}
