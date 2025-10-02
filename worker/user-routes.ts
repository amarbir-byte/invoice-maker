import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env } from './core-utils';
import { ClientEntity, InvoiceEntity, EstimateEntity, BusinessProfileEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { formatISO, addDays } from 'date-fns';
// Schemas
const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1),
  quantity: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
  taxRate: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
});
const invoiceSchema = z.object({
  clientId: z.string().min(1),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void']),
  lineItems: z.array(lineItemSchema),
  notes: z.string().optional(),
  currency: z.string().default('USD'),
  documentNumber: z.string(),
});
const estimateSchema = z.object({
  clientId: z.string().min(1),
  issueDate: z.string().min(1),
  expiryDate: z.string().min(1),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected']),
  lineItems: z.array(lineItemSchema),
  notes: z.string().optional(),
  currency: z.string().default('USD'),
  documentNumber: z.string(),
});
const clientSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
const businessProfileSchema = z.object({
    name: z.string().min(1, "Business name is required"),
    address: z.string().optional(),
    taxId: z.string().optional(),
    logoUrl: z.string().optional(),
});
const invoiceStatusSchema = z.object({ status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void']) });
const estimateStatusSchema = z.object({ status: z.enum(['draft', 'sent', 'accepted', 'rejected']) });
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await Promise.all([
      ClientEntity.ensureSeed(c.env),
      InvoiceEntity.ensureSeed(c.env),
      EstimateEntity.ensureSeed(c.env),
      BusinessProfileEntity.ensureSeed(c.env),
    ]);
    await next();
  });
  // --- BUSINESS PROFILE ROUTES ---
  app.get('/api/business-profile', async (c) => {
    const profile = new BusinessProfileEntity(c.env, 'default');
    return ok(c, await profile.getState());
  });
  app.put('/api/business-profile', zValidator('json', businessProfileSchema), async (c) => {
    const profile = new BusinessProfileEntity(c.env, 'default');
    const updatedProfile = { ...c.req.valid('json'), id: 'default' };
    await profile.save(updatedProfile);
    return ok(c, updatedProfile);
  });
  // --- CLIENT ROUTES ---
  app.get('/api/clients', async (c) => ok(c, (await ClientEntity.list(c.env)).items));
  app.get('/api/clients/:id', async (c) => {
    const client = new ClientEntity(c.env, c.req.param('id'));
    return await client.exists() ? ok(c, await client.getState()) : notFound(c, 'Client not found');
  });
  app.post('/api/clients', zValidator('json', clientSchema), async (c) => {
    const newClient = { id: crypto.randomUUID(), ...c.req.valid('json') };
    await ClientEntity.create(c.env, newClient);
    return ok(c, newClient);
  });
  app.put('/api/clients/:id', zValidator('json', clientSchema), async (c) => {
    const id = c.req.param('id');
    const client = new ClientEntity(c.env, id);
    if (!await client.exists()) return notFound(c, 'Client not found');
    const updatedClient = { ...c.req.valid('json'), id };
    await client.save(updatedClient);
    return ok(c, updatedClient);
  });
  app.delete('/api/clients/:id', async (c) => {
    const deleted = await ClientEntity.delete(c.env, c.req.param('id'));
    return deleted ? ok(c, { id: c.req.param('id'), deleted: true }) : notFound(c, 'Client not found');
  });
  // --- INVOICE ROUTES ---
  app.get('/api/invoices', async (c) => ok(c, (await InvoiceEntity.list(c.env)).items));
  app.get('/api/invoices/:id', async (c) => {
    const invoice = new InvoiceEntity(c.env, c.req.param('id'));
    return await invoice.exists() ? ok(c, await invoice.getState()) : notFound(c, 'Invoice not found');
  });
  app.post('/api/invoices', zValidator('json', invoiceSchema), async (c) => {
    const newInvoice = { id: crypto.randomUUID(), ...c.req.valid('json') };
    await InvoiceEntity.create(c.env, newInvoice);
    return ok(c, newInvoice);
  });
  app.put('/api/invoices/:id', zValidator('json', invoiceSchema), async (c) => {
    const id = c.req.param('id');
    const invoice = new InvoiceEntity(c.env, id);
    if (!await invoice.exists()) return notFound(c, 'Invoice not found');
    const updatedInvoice = { ...c.req.valid('json'), id };
    await invoice.save(updatedInvoice);
    return ok(c, updatedInvoice);
  });
  app.delete('/api/invoices/:id', async (c) => {
    const deleted = await InvoiceEntity.delete(c.env, c.req.param('id'));
    return deleted ? ok(c, { id: c.req.param('id'), deleted: true }) : notFound(c, 'Invoice not found');
  });
  app.put('/api/invoices/:id/status', zValidator('json', invoiceStatusSchema), async (c) => {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    const invoice = new InvoiceEntity(c.env, id);
    if (!await invoice.exists()) return notFound(c, 'Invoice not found');
    await invoice.patch({ status });
    return ok(c, await invoice.getState());
  });
  // --- ESTIMATE ROUTES ---
  app.get('/api/estimates', async (c) => ok(c, (await EstimateEntity.list(c.env)).items));
  app.get('/api/estimates/:id', async (c) => {
    const estimate = new EstimateEntity(c.env, c.req.param('id'));
    return await estimate.exists() ? ok(c, await estimate.getState()) : notFound(c, 'Estimate not found');
  });
  app.post('/api/estimates', zValidator('json', estimateSchema), async (c) => {
    const newEstimate = { id: crypto.randomUUID(), ...c.req.valid('json') };
    await EstimateEntity.create(c.env, newEstimate);
    return ok(c, newEstimate);
  });
  app.put('/api/estimates/:id', zValidator('json', estimateSchema), async (c) => {
    const id = c.req.param('id');
    const estimate = new EstimateEntity(c.env, id);
    if (!await estimate.exists()) return notFound(c, 'Estimate not found');
    const updatedEstimate = { ...c.req.valid('json'), id };
    await estimate.save(updatedEstimate);
    return ok(c, updatedEstimate);
  });
  app.delete('/api/estimates/:id', async (c) => {
    const deleted = await EstimateEntity.delete(c.env, c.req.param('id'));
    return deleted ? ok(c, { id: c.req.param('id'), deleted: true }) : notFound(c, 'Estimate not found');
  });
  app.put('/api/estimates/:id/status', zValidator('json', estimateStatusSchema), async (c) => {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    const estimate = new EstimateEntity(c.env, id);
    if (!await estimate.exists()) return notFound(c, 'Estimate not found');
    await estimate.patch({ status });
    return ok(c, await estimate.getState());
  });
  // Convert Estimate to Invoice
  app.post('/api/estimates/:id/convert', async (c) => {
    const id = c.req.param('id');
    const estimateEntity = new EstimateEntity(c.env, id);
    if (!await estimateEntity.exists()) return notFound(c, 'Estimate not found');
    const estimate = await estimateEntity.getState();
    const newInvoice = {
      id: crypto.randomUUID(),
      documentNumber: estimate.documentNumber.replace('EST', 'INV'),
      clientId: estimate.clientId,
      issueDate: formatISO(new Date()),
      dueDate: formatISO(addDays(new Date(), 30)),
      status: 'draft' as const,
      currency: estimate.currency,
      lineItems: estimate.lineItems,
      notes: estimate.notes,
    };
    await InvoiceEntity.create(c.env, newInvoice);
    await estimateEntity.patch({ status: 'accepted' });
    return ok(c, newInvoice);
  });
}