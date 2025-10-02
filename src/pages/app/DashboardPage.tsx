import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { DollarSign, FileWarning, FileText, FileEdit, Loader2 } from "lucide-react";
import { useInvoices } from "@/hooks/use-invoices";
import { useMemo } from "react";
import { isAfter, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/formatting";
import { calculateTotal } from "@/lib/invoicing";
export function DashboardPage() {
  const { invoices, isLoading } = useInvoices();
  const stats = useMemo(() => {
    if (!invoices || invoices.length === 0) {
      return {
        totalOutstanding: 0,
        totalPaidLast30Days: 0,
        overdue: 0,
        drafts: 0,
      };
    }
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let totalOutstanding = 0;
    let totalPaidLast30Days = 0;
    let overdue = 0;
    let drafts = 0;
    invoices.forEach(invoice => {
      const total = calculateTotal(invoice);
      if (invoice.status === 'sent' || invoice.status === 'overdue') {
        totalOutstanding += total;
      }
      if (invoice.status === 'paid' && invoice.paidDate && isAfter(parseISO(invoice.paidDate), thirtyDaysAgo)) {
        totalPaidLast30Days += total;
      }
      if (invoice.status === 'overdue') {
        overdue += total;
      }
      if (invoice.status === 'draft') {
        drafts += total;
      }
    });
    return { totalOutstanding, totalPaidLast30Days, overdue, drafts };
  }, [invoices]);
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's a summary of your business.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Outstanding"
            value={formatCurrency(stats.totalOutstanding)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Paid (Last 30 days)"
            value={formatCurrency(stats.totalPaidLast30Days)}
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Overdue"
            value={formatCurrency(stats.overdue)}
            icon={<FileWarning className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Drafts"
            value={formatCurrency(stats.drafts)}
            icon={<FileEdit className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
        <div className="grid grid-cols-1 gap-8">
          <RecentInvoices />
        </div>
      </div>
    </AppLayout>
  );
}