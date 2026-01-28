import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { A4_WIDTH_MM, A4_HEIGHT_MM, QuoteData } from './types';

interface GeneratePDFOptions {
  element: HTMLElement;
  data: QuoteData;
  filename?: string;
}

// html2canvas가 지원하지 않는 CSS 색상 함수(lab, lch 등)를 제거하는 함수
function sanitizeColors(doc: Document) {
  const unsupportedColorPattern = /\b(lab|lch|oklch|oklab)\(/gi;

  // 모든 요소 처리
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;

    // 1. 인라인 스타일에서 지원되지 않는 색상 함수 제거
    if (htmlEl.style && htmlEl.style.cssText) {
      if (unsupportedColorPattern.test(htmlEl.style.cssText)) {
        // 인라인 스타일 전체를 정규식으로 치환
        htmlEl.style.cssText = htmlEl.style.cssText.replace(
          /:\s*(lab|lch|oklch|oklab)\([^)]+\)/gi,
          ': #000000'
        );
      }
    }

    // 2. computed style에서 주요 색상 속성 체크
    const computedStyle = window.getComputedStyle(htmlEl);
    const colorProps = [
      'color', 'backgroundColor', 'borderColor',
      'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
      'outlineColor', 'textDecorationColor', 'caretColor', 'fill', 'stroke'
    ];

    colorProps.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && unsupportedColorPattern.test(value)) {
        const fallback = prop.includes('background') ? '#ffffff' :
          (prop === 'fill' || prop === 'stroke') ? '#000000' : '#000000';
        htmlEl.style.setProperty(prop, fallback);
      }
    });

    // 3. SVG 요소의 fill/stroke 속성 직접 처리
    if (htmlEl instanceof SVGElement) {
      const svgEl = htmlEl as SVGElement;
      ['fill', 'stroke'].forEach((attr) => {
        const attrValue = svgEl.getAttribute(attr);
        if (attrValue && unsupportedColorPattern.test(attrValue)) {
          svgEl.setAttribute(attr, attr === 'fill' ? '#000000' : '#000000');
        }
      });
    }
  });

  // 4. 스타일시트의 CSS 변수에서도 지원되지 않는 색상 처리
  // document의 :root에 설정된 CSS 변수 초기화 (필요시)
  const root = doc.documentElement;
  const rootStyle = window.getComputedStyle(root);
  const cssVars = Array.from(rootStyle).filter(prop => prop.startsWith('--'));

  cssVars.forEach((varName) => {
    const value = rootStyle.getPropertyValue(varName);
    if (value && unsupportedColorPattern.test(value)) {
      root.style.setProperty(varName, '#000000');
    }
  });
}

export async function generateQuotePDF({
  element,
  data,
  filename,
}: GeneratePDFOptions): Promise<void> {
  // Create PDF with A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm x 297mm
  });

  // html2canvas 옵션 (색상 함수 호환성 처리)
  const canvasOptions = {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc: Document) => {
      // oklch/lab CSS 변수들을 안전한 hex 값으로 교체
      const root = clonedDoc.documentElement;
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#1a1a1a');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--card-foreground', '#1a1a1a');
      root.style.setProperty('--popover', '#ffffff');
      root.style.setProperty('--popover-foreground', '#1a1a1a');
      root.style.setProperty('--primary', '#333333');
      root.style.setProperty('--primary-foreground', '#fafafa');
      root.style.setProperty('--secondary', '#f5f5f5');
      root.style.setProperty('--secondary-foreground', '#333333');
      root.style.setProperty('--muted', '#f5f5f5');
      root.style.setProperty('--muted-foreground', '#737373');
      root.style.setProperty('--accent', '#7fa8c9');
      root.style.setProperty('--accent-foreground', '#1a1a1a');
      root.style.setProperty('--destructive', '#ef4444');
      root.style.setProperty('--border', '#e5e5e5');
      root.style.setProperty('--input', '#e5e5e5');
      root.style.setProperty('--ring', '#a3a3a3');

      sanitizeColors(clonedDoc);
    },
  };

  // 페이지별로 분리된 요소들 찾기
  const pageElements = element.querySelectorAll('[data-page]');

  if (pageElements.length > 0) {
    // 여러 페이지 처리
    for (let i = 0; i < pageElements.length; i++) {
      const pageEl = pageElements[i] as HTMLElement;

      // 첫 페이지가 아니면 새 페이지 추가
      if (i > 0) {
        pdf.addPage();
      }

      // Capture at high resolution
      const canvas = await html2canvas(pageEl, canvasOptions);

      // Add to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    }
  } else {
    // 단일 페이지 처리 (기존 로직)
    const canvas = await html2canvas(element, canvasOptions);

    const imgData = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  }

  // Generate filename
  const safeClientName = data.clientName.replace(/[^a-zA-Z0-9가-힣]/g, '_') || 'client';
  const dateStr = data.date.replace(/-/g, '');
  const finalFilename = filename || `견적서_${safeClientName}_${dateStr}.pdf`;

  // Save PDF
  pdf.save(finalFilename);
}
