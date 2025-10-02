import React from 'react';
import { Invoice, Estimate, Client, LineItem } from '@shared/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/formatting';
import { calculateTotals } from '@/lib/invoicing';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';
interface DocumentPreviewProps {
  document: Invoice | Estimate;
  client?: Client;
  isEstimate?: boolean;
}
function isInvoice(doc: Invoice | Estimate): doc is Invoice {
  return 'dueDate' in doc;
}
export const DocumentPreview = React.forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({ document, client, isEstimate }, ref) => {
    const { subtotal, totalTax, totalDiscount, grandTotal } = calculateTotals(document);
    return (
      <div ref={ref} className="p-4 sm:p-8 bg-background text-foreground">
        <Card className="w-full max-w-4xl mx-auto shadow-lg border">
          <CardHeader className="bg-muted/50 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold font-display text-indigo-600">
                  {isEstimate ? 'ESTIMATE' : 'INVOICE'}
                </h1>
                <p className="text-muted-foreground">{document.documentNumber}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold">Your Company Name</h2>
                <p className="text-sm text-muted-foreground">123 Business Rd, Suite 100</p>
                <p className="text-sm text-muted-foreground">City, State, 12345</p>
                <p className="text-sm text-muted-foreground">your.email@company.com</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-1">
                <h3 className="font-semibold text-muted-foreground">Bill To</h3>
                <p className="font-bold">{client?.name || 'N/A'}</p>
                <p className="text-sm">{client?.companyName}</p>
                <p className="text-sm">{client?.address}</p>
                <p className="text-sm">{client?.email}</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-muted-foreground">Issue Date</h3>
                  <p>{formatDate(document.issueDate)}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-muted-foreground">{isEstimate ? 'Expiry Date' : 'Due Date'}</h3>
                  <p>{formatDate(isInvoice(document) ? document.dueDate : document.expiryDate)}</p>
                </div>
              </div>
              <div className="space-y-1 text-right md:text-left">
                <h3 className="font-semibold text-muted-foreground">Status</h3>
                <InvoiceStatusBadge status={document.status} />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {document.lineItems.map((item) => {
                  const itemSubtotal = item.quantity * item.unitPrice;
                  const discountAmount = itemSubtotal * ((item.discount || 0) / 100);
                  const itemTotal = itemSubtotal - discountAmount;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice, document.currency)}</TableCell>
                      <TableCell className="text-right">{item.discount ? `${item.discount}%` : '-'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(itemTotal, document.currency)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Separator className="my-6" />
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal, document.currency)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span className="text-green-600">-{formatCurrency(totalDiscount, document.currency)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatCurrency(totalTax, document.currency)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal, document.currency)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          {document.notes && (
            <CardFooter className="bg-muted/50 p-6">
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{document.notes}</p>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }
);
DocumentPreview.displayName = 'DocumentPreview';