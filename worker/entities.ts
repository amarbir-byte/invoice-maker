import { IndexedEntity } from "./core-utils";
import type { Client, Invoice, Estimate, Business } from "@shared/types";
import { MOCK_CLIENTS, MOCK_INVOICES, MOCK_ESTIMATES } from "@shared/mock-data";
// BUSINESS PROFILE ENTITY
export class BusinessProfileEntity extends IndexedEntity<Business> {
  static readonly entityName = "business-profile";
  static readonly indexName = "business-profiles";
  static readonly initialState: Business = { id: "", name: "" };
  static seedData: Business[] = [
    {
      id: "default",
      name: "Your Company",
      address: "123 Main Street, Anytown, USA 12345",
      taxId: "12-3456789",
    },
  ];
}
// CLIENT ENTITY: one DO instance per client
export class ClientEntity extends IndexedEntity<Client> {
  static readonly entityName = "client";
  static readonly indexName = "clients";
  static readonly initialState: Client = { id: "", name: "", email: "" };
  static seedData = MOCK_CLIENTS;
}
// INVOICE ENTITY
export class InvoiceEntity extends IndexedEntity<Invoice> {
  static readonly entityName = "invoice";
  static readonly indexName = "invoices";
  static readonly initialState: Invoice = {
    id: "",
    documentNumber: "",
    clientId: "",
    issueDate: "",
    dueDate: "",
    status: "draft",
    currency: "USD",
    lineItems: [],
  };
  static seedData = MOCK_INVOICES;
}
// ESTIMATE ENTITY
export class EstimateEntity extends IndexedEntity<Estimate> {
  static readonly entityName = "estimate";
  static readonly indexName = "estimates";
  static readonly initialState: Estimate = {
    id: "",
    documentNumber: "",
    clientId: "",
    issueDate: "",
    expiryDate: "",
    status: "draft",
    currency: "USD",
    lineItems: [],
  };
  static seedData = MOCK_ESTIMATES;
}