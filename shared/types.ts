export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  address?: string;
  taxId?: string;
}
export interface Client {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: string;
}
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number; // as a percentage, e.g., 5 for 5%
  discount?: number; // as a percentage, e.g., 10 for 10%
}
interface BaseDocument {
  id: string;
  documentNumber: string;
  clientId: string;
  issueDate: string; // ISO 8601 string
  lineItems: LineItem[];
  notes?: string;
  currency: string;
}
export interface Invoice extends BaseDocument {
  status: InvoiceStatus;
  dueDate: string; // ISO 8601 string
  paidDate?: string; // ISO 8601 string
}
export interface Estimate extends BaseDocument {
  status: EstimateStatus;
  expiryDate: string; // ISO 8601 string
}