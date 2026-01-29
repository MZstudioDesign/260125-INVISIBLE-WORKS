export { SimpleQuote } from './SimpleQuote';
export { DetailedQuote } from './DetailedQuote';

import { SimpleQuote } from './SimpleQuote';
import { DetailedQuote } from './DetailedQuote';
import { QuoteType, QuoteData, QuoteLanguage, QuoteItem } from '@/lib/quote/types';
import { paginateItems } from '@/lib/quote/pagination';
import { generateEstimateQuoteItems } from '@/lib/quote/settings';

export const QUOTE_TEMPLATES = {
  'simple': SimpleQuote,
  'detailed': DetailedQuote,
} as const;

export type QuoteTemplateComponent = React.ComponentType<{
  data: QuoteData;
  pageNumber?: number;
  language?: QuoteLanguage;
}>;

export const getQuoteTemplate = (type: QuoteType): QuoteTemplateComponent => {
  return QUOTE_TEMPLATES[type];
};

/**
 * Calculate dynamic page count based on content
 * - SimpleQuote: pages based on auto items + manual items
 * - DetailedQuote: pages based on manual items + 1 for terms
 */
export const getQuotePageCount = (type: QuoteType, data?: QuoteData): number => {
  if (!data) {
    // Default fallback
    return type === 'detailed' ? 2 : 1;
  }

  if (type === 'simple') {
    // Simple quote: auto items + manual items
    const autoItems = generateEstimateQuoteItems(data);
    const manualItems = data.items.filter(item => item.description.trim() !== '');
    const allItems = [...autoItems, ...manualItems];
    const pages = paginateItems(allItems);
    return Math.max(1, pages.length);
  } else {
    // Detailed quote: manual items + 1 for terms
    const pages = paginateItems(data.items);
    return pages.length + 1; // +1 for terms page
  }
};
