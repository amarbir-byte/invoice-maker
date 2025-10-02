import { useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
export function usePdfExport() {
  const exportRef = useRef<HTMLDivElement>(null);
  const exportToPdf = useCallback(async (fileName: string) => {
    const element = exportRef.current;
    if (!element) {
      toast.error('Could not find element to export.');
      return;
    }
    const toastId = toast.loading('Generating PDF...');
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth;
      const height = width / ratio;
      // If content is taller than one page, split it
      if (height > pdfHeight) {
        let position = 0;
        let pageHeight = canvas.height * pdfWidth / canvasWidth;
        let heightLeft = canvas.height;
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pageHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
        while (heightLeft > 0) {
          position = -heightLeft;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pageHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      }
      pdf.save(`${fileName}.pdf`);
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF.', { id: toastId });
    }
  }, []);
  return { exportRef, exportToPdf };
}