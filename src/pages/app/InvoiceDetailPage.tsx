import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Edit, Send } from 'lucide-react';
import { useInvoices, useInvoice } from '@/hooks/use-invoices';
import { useEstimates, useEstimate } from '@/hooks/use-estimates';
import { useClients } from '@/hooks/use-clients';
import { DocumentPreview } from '@/components/documents/DocumentPreview';
import { usePdfExport } from '@/hooks/use-pdf-export';
import { Toaster } from '@/components/ui/sonner';
export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEstimate = location.pathname.includes('/estimates/');
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoice(id);
  const { sendInvoice } = useInvoices();
  const { data: estimate, isLoading: isLoadingEstimate } = useEstimate(id);
  const { sendEstimate } = useEstimates();
  const { clients, isLoading: isLoadingClients } = useClients();
  const { exportRef, exportToPdf } = usePdfExport();
  const document = isEstimate ? estimate : invoice;
  const isLoading = isEstimate ? isLoadingEstimate : isLoadingInvoice;
  const client = clients.find(c => c.id === document?.clientId);
  if (isLoading || isLoadingClients) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }
  if (!document) {
    return (
      <AppLayout>
        <PageHeader title="Not Found" description="The requested document could not be found." />
      </AppLayout>
    );
  }
  const handleExport = () => {
    const fileName = `${document.documentNumber}_${client?.name || 'client'}`.replace(/\s/g, '_');
    exportToPdf(fileName);
  };
  const handleSend = () => {
    if (!id) return;
    if (isEstimate) {
      sendEstimate({ id, status: 'sent' });
    } else {
      sendInvoice({ id, status: 'sent' });
    }
  };
  return (
    <AppLayout>
      <PageHeader
        title={isEstimate ? 'Estimate Details' : 'Invoice Details'}
        description={`Viewing ${document.documentNumber}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(isEstimate ? `/app/estimates/${id}` : `/app/invoices/${id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleSend} disabled={document.status === 'sent'}>
            <Send className="mr-2 h-4 w-4" />
            {document.status === 'sent' ? 'Sent' : 'Send'}
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </PageHeader>
      <div className="mt-8">
        <DocumentPreview ref={exportRef} document={document} client={client} isEstimate={isEstimate} />
      </div>
      <Toaster richColors />
    </AppLayout>
  );
}