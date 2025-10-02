import { Client, Invoice, Estimate, InvoiceStatus, EstimateStatus } from './types';
import { subDays, addDays, formatISO } from 'date-fns';
export const MOCK_CLIENTS: Client[] = [
  { id: 'client-1', name: 'Acme Inc.', email: 'contact@acme.com', companyName: 'Acme Corporation' },
  { id: 'client-2', name: 'Stark Industries', email: 'tony@starkindustries.com', companyName: 'Stark Industries' },
  { id: 'client-3', name: 'Wayne Enterprises', email: 'bruce@wayne.enterprises', companyName: 'Wayne Enterprises' },
];
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    documentNumber: 'INV-2024-001',
    clientId: 'client-1',
    issueDate: formatISO(new Date()),
    dueDate: formatISO(addDays(new Date(), 30)),
    status: 'paid',
    currency: 'USD',
    lineItems: [
      { id: 'li-1', description: 'Web Design Services', quantity: 1, unitPrice: 2500 },
      { id: 'li-2', description: 'Hosting (1 Year)', quantity: 1, unitPrice: 300 },
    ],
  },
  {
    id: 'inv-002',
    documentNumber: 'INV-2024-002',
    clientId: 'client-2',
    issueDate: formatISO(subDays(new Date(), 15)),
    dueDate: formatISO(addDays(new Date(), 15)),
    status: 'sent',
    currency: 'USD',
    lineItems: [
      { id: 'li-3', description: 'Arc Reactor Consulting', quantity: 10, unitPrice: 10000 },
    ],
  },
  {
    id: 'inv-003',
    documentNumber: 'INV-2024-003',
    clientId: 'client-3',
    issueDate: formatISO(subDays(new Date(), 45)),
    dueDate: formatISO(subDays(new Date(), 15)),
    status: 'overdue',
    currency: 'USD',
    lineItems: [
      { id: 'li-4', description: 'Advanced Grappling Hook', quantity: 5, unitPrice: 5000 },
    ],
  },
  {
    id: 'inv-004',
    documentNumber: 'INV-2024-004',
    clientId: 'client-1',
    issueDate: formatISO(subDays(new Date(), 5)),
    dueDate: formatISO(addDays(new Date(), 25)),
    status: 'draft',
    currency: 'USD',
    lineItems: [
      { id: 'li-5', description: 'Brand Strategy Workshop', quantity: 1, unitPrice: 1200 },
    ],
  },
  {
    id: 'inv-005',
    documentNumber: 'INV-2024-005',
    clientId: 'client-2',
    issueDate: formatISO(subDays(new Date(), 2)),
    dueDate: formatISO(addDays(new Date(), 28)),
    status: 'sent',
    currency: 'USD',
    lineItems: [
      { id: 'li-6', description: 'AI Integration', quantity: 1, unitPrice: 15000 },
    ],
  },
];
export const MOCK_ESTIMATES: Estimate[] = [
  {
    id: 'est-001',
    documentNumber: 'EST-2024-001',
    clientId: 'client-1',
    issueDate: formatISO(subDays(new Date(), 10)),
    expiryDate: formatISO(addDays(new Date(), 20)),
    status: 'sent',
    currency: 'USD',
    lineItems: [
      { id: 'li-est-1', description: 'E-commerce Platform Development', quantity: 1, unitPrice: 12000 },
    ],
  },
  {
    id: 'est-002',
    documentNumber: 'EST-2024-002',
    clientId: 'client-3',
    issueDate: formatISO(subDays(new Date(), 3)),
    expiryDate: formatISO(addDays(new Date(), 27)),
    status: 'draft',
    currency: 'USD',
    lineItems: [
      { id: 'li-est-2', description: 'Security System Upgrade', quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: 'est-003',
    documentNumber: 'EST-2024-003',
    clientId: 'client-2',
    issueDate: formatISO(subDays(new Date(), 30)),
    expiryDate: formatISO(new Date()),
    status: 'accepted',
    currency: 'USD',
    lineItems: [
      { id: 'li-est-3', description: 'New Iron Suit UI/UX', quantity: 1, unitPrice: 50000 },
    ],
  },
];
export const MOCK_DASHBOARD_STATS = {
  totalOutstanding: 125000,
  totalPaidLast30Days: 2800,
  overdue: 25000,
  drafts: 1200,
};