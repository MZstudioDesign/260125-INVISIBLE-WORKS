import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FULL_WIDTH_MM, FULL_HEIGHT_MM, BusinessCardData } from './types';

interface GeneratePDFOptions {
  frontElement: HTMLElement;
  backElement: HTMLElement;
  data: BusinessCardData;
  filename?: string;
}

export async function generateBusinessCardPDF({
  frontElement,
  backElement,
  data,
  filename,
}: GeneratePDFOptions): Promise<void> {
  // Create PDF with custom size (with bleed)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [FULL_WIDTH_MM, FULL_HEIGHT_MM], // 96mm x 56mm
  });

  // Capture front side at high resolution
  const frontCanvas = await html2canvas(frontElement, {
    scale: 4, // 4x for high quality (approximately 300dpi equivalent)
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  // Add front side to PDF
  const frontDataUrl = frontCanvas.toDataURL('image/png', 1.0);
  pdf.addImage(frontDataUrl, 'PNG', 0, 0, FULL_WIDTH_MM, FULL_HEIGHT_MM);

  // Add new page for back side
  pdf.addPage([FULL_WIDTH_MM, FULL_HEIGHT_MM], 'landscape');

  // Capture back side
  const backCanvas = await html2canvas(backElement, {
    scale: 4,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  // Add back side to PDF
  const backDataUrl = backCanvas.toDataURL('image/png', 1.0);
  pdf.addImage(backDataUrl, 'PNG', 0, 0, FULL_WIDTH_MM, FULL_HEIGHT_MM);

  // Generate filename
  const safeName = data.name.replace(/[^a-zA-Z0-9가-힣]/g, '_') || 'card';
  const templateName = data.template.replace(/-/g, '_');
  const finalFilename = filename || `${templateName}_${safeName}_명함.pdf`;

  // Save PDF
  pdf.save(finalFilename);
}

// Utility: Convert SVG to PNG Base64
export async function svgToPngBase64(svgElement: SVGElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };
    
    img.src = url;
  });
}

// Utility: Process uploaded file to Base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Utility: Process SVG file to PNG Base64
export async function processSvgFile(file: File): Promise<string> {
  const svgText = await file.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgElement = svgDoc.querySelector('svg');
  
  if (!svgElement) {
    throw new Error('Invalid SVG file');
  }
  
  // Set default dimensions if not present
  if (!svgElement.getAttribute('width')) {
    svgElement.setAttribute('width', '200');
  }
  if (!svgElement.getAttribute('height')) {
    svgElement.setAttribute('height', '200');
  }
  
  return svgToPngBase64(svgElement);
}
