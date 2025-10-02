import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatting';
import { calculateTotals } from '@/lib/invoicing';
import { useClients } from '@/hooks/use-clients';
import { useInvoice, useInvoices } from '@/hooks/use-invoices';
import { useEstimate, useEstimates } from '@/hooks/use-estimates';
import { Toaster } from '@/components/ui/sonner';
import { Invoice, Estimate } from '@shared/types';
const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive'),
  unitPrice: z.coerce.number().min(0, 'Price must be positive'),
  taxRate: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
});
const formSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'void', 'accepted', 'rejected']),
  issueDate: z.date(),
  dueDate: z.date().optional(),
  expiryDate: z.date().optional(),
  documentNumber: z.string().min(1, 'Number is required'),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;
function isInvoice(doc: Invoice | Estimate): doc is Invoice {
  return 'dueDate' in doc;
}
export function InvoiceEditorPage({ isEstimate = false }: { isEstimate?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useClients();
  const { data: existingInvoice, isLoading: isLoadingInvoice } = useInvoice(id);
  const { createInvoice, updateInvoice } = useInvoices();
  const { data: existingEstimate, isLoading: isLoadingEstimate } = useEstimate(id);
  const { createEstimate, updateEstimate } = useEstimates();
  const existingData = isEstimate ? existingEstimate : existingInvoice;
  const isLoading = isEstimate ? isLoadingEstimate : isLoadingInvoice;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      lineItems: [{ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0 }],
      status: 'draft',
      issueDate: new Date(),
      documentNumber: isEstimate ? 'EST-001' : 'INV-001',
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });
  useEffect(() => {
    if (existingData) {
      const resetData: Partial<FormData> = {
        ...existingData,
        issueDate: existingData.issueDate ? parseISO(existingData.issueDate) : new Date(),
        lineItems: existingData.lineItems.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          taxRate: Number(item.taxRate || 0),
          discount: Number(item.discount || 0),
        })),
      };
      if (isInvoice(existingData) && existingData.dueDate) {
        resetData.dueDate = parseISO(existingData.dueDate);
      } else if (!isInvoice(existingData) && existingData.expiryDate) {
        resetData.expiryDate = parseISO(existingData.expiryDate);
      }
      form.reset(resetData);
    }
  }, [existingData, form.reset, isEstimate]);
  const watchedLineItems = form.watch('lineItems');
  const totals = useMemo(() => calculateTotals({ lineItems: watchedLineItems } as Invoice), [watchedLineItems]);
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const payload = {
      ...data,
      issueDate: format(data.issueDate, 'yyyy-MM-dd'),
      dueDate: isEstimate ? undefined : (data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined),
      expiryDate: isEstimate ? (data.expiryDate ? format(data.expiryDate, 'yyyy-MM-dd') : undefined) : undefined,
      currency: 'USD',
    };
    try {
      if (isEstimate) {
        if (id) {
          await updateEstimate({ ...payload, id } as Estimate);
        } else {
          await createEstimate(payload as Omit<Estimate, 'id'>);
        }
        navigate('/app/estimates');
      } else {
        if (id) {
          await updateInvoice({ ...payload, id } as Invoice);
        } else {
          await createInvoice(payload as Omit<Invoice, 'id'>);
        }
        navigate('/app/invoices');
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };
  if (isLoading) {
    return <AppLayout><div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div></AppLayout>;
  }
  return (
    <AppLayout>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PageHeader
          title={id ? `Edit ${isEstimate ? 'Estimate' : 'Invoice'}` : `New ${isEstimate ? 'Estimate' : 'Invoice'}`}
          description={`Fill in the details below to ${id ? 'update this' : 'create a new'} ${isEstimate ? 'estimate' : 'invoice'}.`}
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" type="button" onClick={() => navigate(isEstimate ? '/app/estimates' : '/app/invoices')}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </PageHeader>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Tax %</TableHead>
                      <TableHead>Disc %</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = watchedLineItems[index];
                      const itemTotal = ((item?.quantity || 0) * (item?.unitPrice || 0)) * (1 - ((item?.discount || 0) / 100)) * (1 + ((item?.taxRate || 0) / 100));
                      return (
                        <TableRow key={field.id}>
                          <TableCell><Input {...form.register(`lineItems.${index}.description`)} placeholder="Service or product" /></TableCell>
                          <TableCell><Input type="number" {...form.register(`lineItems.${index}.quantity`)} placeholder="1" /></TableCell>
                          <TableCell><Input type="number" {...form.register(`lineItems.${index}.unitPrice`)} placeholder="0.00" /></TableCell>
                          <TableCell><Input type="number" {...form.register(`lineItems.${index}.taxRate`)} placeholder="0" /></TableCell>
                          <TableCell><Input type="number" {...form.register(`lineItems.${index}.discount`)} placeholder="0" /></TableCell>
                          <TableCell>{formatCurrency(itemTotal)}</TableCell>
                          <TableCell><Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, taxRate: 0, discount: 0 })}>
                  Add Line Item
                </Button>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-{formatCurrency(totals.totalDiscount)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(totals.totalTax)}</span></div>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(totals.grandTotal)}</span></div>
                </div>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent>
                <Textarea {...form.register('notes')} placeholder="Thank you for your business!" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Controller
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                        <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {isEstimate ? (
                            <>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="accepted">Accepted</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="void">Void</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isEstimate ? 'Estimate' : 'Invoice'} Number</Label>
                  <Input {...form.register('documentNumber')} />
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Controller
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isEstimate ? 'Expiry Date' : 'Due Date'}</Label>
                  {isEstimate ? (
                    <Controller
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                      )}
                    />
                  ) : (
                    <Controller
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                        </Popover>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
      <Toaster richColors />
    </AppLayout>
  );
}