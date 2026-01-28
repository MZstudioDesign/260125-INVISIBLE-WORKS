export { SimpleQuote } from './SimpleQuote';
export { DetailedQuote } from './DetailedQuote';

import { SimpleQuote } from './SimpleQuote';
import { DetailedQuote } from './DetailedQuote';
import { QuoteType, QuoteData } from '@/lib/quote/types';

export const QUOTE_TEMPLATES = {
  'simple': SimpleQuote,
  'detailed': DetailedQuote,
} as const;

export type QuoteTemplateComponent = React.ComponentType<{
  data: QuoteData;
  pageNumber?: number;
}>;

export const getQuoteTemplate = (type: QuoteType): QuoteTemplateComponent => {
  return QUOTE_TEMPLATES[type];
};

// 세부 견적서는 2페이지
export const getQuotePageCount = (type: QuoteType): number => {
  return type === 'detailed' ? 2 : 1;
};
