import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(content: string): Promise<Blob> {
  const pdf = new jsPDF();
  
  // Create a temporary div to render the content
  const temp = document.createElement('div');
  temp.innerHTML = content;
  document.body.appendChild(temp);
  
  try {
    const canvas = await html2canvas(temp);
    const imgData = canvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    
    return pdf.output('blob');
  } finally {
    document.body.removeChild(temp);
  }
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}