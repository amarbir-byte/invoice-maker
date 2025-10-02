import { useInvoices } from "@/hooks/use-invoices";
import { useClients } from "@/hooks/use-clients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { InvoiceStatusBadge } from "../invoices/InvoiceStatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { calculateTotal } from "@/lib/invoicing";
import { useNavigate } from "react-router-dom";
export function RecentInvoices() {
  const navigate = useNavigate();
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();
  const { clients, isLoading: isLoadingClients } = useClients();
  const isLoading = isLoadingInvoices || isLoadingClients;
  const clientsMap = new Map(clients.map(c => [c.id, c]));
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>An overview of your most recent invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/app/invoices/${invoice.id}/view`)}>
                  <TableCell className="font-medium">{clientsMap.get(invoice.clientId)?.name || 'Unknown Client'}</TableCell>
                  <TableCell>{invoice.documentNumber}</TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateTotal(invoice), invoice.currency)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No recent invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}