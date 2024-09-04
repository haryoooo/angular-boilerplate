// src/app/helpers/number-format.helper.ts
export function formatMoney(value: number | string): string {
  if (value == null || isNaN(Number(value))) return '';

  // Convert value to a string if it's a number
  const numberString = typeof value === 'number' ? value.toString() : value;

  // Use regex to insert thousand separators
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseMoney(value: string): number {
  // Remove non-numeric characters except the decimal separator
  return parseFloat(value.replace(/\./g, ''));
}
