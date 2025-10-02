import { Invoice, Estimate, LineItem } from '@shared/types';
interface CalculationResult {
  subtotal: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
}
/**
 * Calculates the subtotal, tax, discount, and grand total for an invoice or estimate.
 * @param document - The invoice or estimate object.
 * @returns An object with subtotal, totalTax, totalDiscount, and grandTotal.
 */
export const calculateTotals = (document: Invoice | Estimate): CalculationResult => {
  if (!document || !document.lineItems) {
    return { subtotal: 0, totalTax: 0, totalDiscount: 0, grandTotal: 0 };
  }
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  document.lineItems.forEach((item: LineItem) => {
    const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
    subtotal += itemSubtotal;
    const itemDiscount = itemSubtotal * ((item.discount || 0) / 100);
    totalDiscount += itemDiscount;
    const subtotalAfterDiscount = itemSubtotal - itemDiscount;
    const itemTax = subtotalAfterDiscount * ((item.taxRate || 0) / 100);
    totalTax += itemTax;
  });
  const grandTotal = subtotal - totalDiscount + totalTax;
  return { subtotal, totalTax, totalDiscount, grandTotal };
};
/**
 * A simpler function to get only the grand total.
 * @param document - The invoice or estimate object.
 * @returns The final grand total.
 */
export const calculateTotal = (document: Invoice | Estimate): number => {
  return calculateTotals(document).grandTotal;
};