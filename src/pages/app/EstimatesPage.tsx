import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Edit, Trash2, Loader2, FileCheck, Eye } from "lucide-react";
import { useEstimates } from "@/hooks/use-estimates";
import { useClients } from "@/hooks/use-clients";
import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatting";
import { calculateTotal } from "@/lib/invoicing";
import { Toaster } from "@/components/ui/sonner";
export function EstimatesPage() {
  const navigate = useNavigate();
  const { estimates, isLoading: isLoadingEstimates, deleteEstimate, convertEstimate } = useEstimates();
  const { clients, isLoading: isLoadingClients } = useClients();
  const clientsMap = new Map(clients.map(c => [c.id, c]));
  const handleConvertToInvoice = async (estimateId: string) => {
    const newInvoice = await convertEstimate(estimateId);
    if (newInvoice) {
      navigate(`/app/invoices/${newInvoice.id}/view`);
    }
  };
  const isLoading = isLoadingEstimates || isLoadingClients;
  return (
    <AppLayout>
      <PageHeader
        title="Estimates"
        description="Create and manage your estimates."
      >
        <Button asChild>
          <Link to="/app/estimates/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Estimate
          </Link>
        </Button>
      </PageHeader>
      <div className="mt-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : estimates.length > 0 ? (
                  estimates.map((estimate) => (
                    <TableRow key={estimate.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/app/estimates/${estimate.id}/view`)}>
                      <TableCell className="font-medium">{estimate.documentNumber}</TableCell>
                      <TableCell>{clientsMap.get(estimate.clientId)?.name || 'Unknown'}</TableCell>
                      <TableCell><InvoiceStatusBadge status={estimate.status} /></TableCell>
                      <TableCell>{formatDate(estimate.issueDate)}</TableCell>
                      <TableCell>{formatDate(estimate.expiryDate)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(calculateTotal(estimate), estimate.currency)}</TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/app/estimates/${estimate.id}/view`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleConvertToInvoice(estimate.id)}>
                                <FileCheck className="mr-2 h-4 w-4" />
                                <span>Convert to Invoice</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/app/estimates/${estimate.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteEstimate(estimate.id)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No estimates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </AppLayout>
  );
}