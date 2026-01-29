// Quote PDF Pagination Utilities

import { QuoteItem, A4_HEIGHT_PX } from './types';

// Page layout constants (in pixels at 72dpi)
export const PAGE_PADDING_TOP = 40;
export const PAGE_PADDING_BOTTOM = 100; // Space for footer
export const HEADER_HEIGHT_FIRST_PAGE = 280; // Logo + title + info grid + table header
export const HEADER_HEIGHT_CONTINUATION = 100; // Minimal header for continuation pages
export const FOOTER_HEIGHT = 80;
export const TABLE_HEADER_HEIGHT = 40;

// Item height estimates (in pixels)
export const ITEM_BASE_HEIGHT = 45; // Base height for an item row
export const ITEM_SUBITEM_HEIGHT = 16; // Height per sub-item
export const TOTALS_SECTION_HEIGHT = 200; // Height for totals section

// Available content height per page type
export const CONTENT_HEIGHT_FIRST_PAGE = A4_HEIGHT_PX - PAGE_PADDING_TOP - HEADER_HEIGHT_FIRST_PAGE - PAGE_PADDING_BOTTOM;
export const CONTENT_HEIGHT_CONTINUATION = A4_HEIGHT_PX - PAGE_PADDING_TOP - HEADER_HEIGHT_CONTINUATION - PAGE_PADDING_BOTTOM;

/**
 * Calculate estimated height for a quote item
 */
export function calculateItemHeight(item: QuoteItem): number {
  let height = ITEM_BASE_HEIGHT;

  // Add height for sub-items
  if (item.subItems && item.subItems.length > 0) {
    height += item.subItems.length * ITEM_SUBITEM_HEIGHT;
  }

  return height;
}

/**
 * Split items into pages based on available height
 */
export function paginateItems(items: QuoteItem[]): QuoteItem[][] {
  if (items.length === 0) return [[]];

  const pages: QuoteItem[][] = [];
  let currentPage: QuoteItem[] = [];
  let currentHeight = 0;
  let isFirstPage = true;

  // First page needs less content height due to larger header
  let availableHeight = CONTENT_HEIGHT_FIRST_PAGE - TOTALS_SECTION_HEIGHT;

  for (const item of items) {
    const itemHeight = calculateItemHeight(item);

    // Check if item fits on current page
    if (currentHeight + itemHeight <= availableHeight) {
      currentPage.push(item);
      currentHeight += itemHeight;
    } else {
      // Start a new page
      pages.push(currentPage);
      currentPage = [item];
      currentHeight = itemHeight;
      isFirstPage = false;
      availableHeight = CONTENT_HEIGHT_CONTINUATION;
    }
  }

  // Add the last page
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages.length > 0 ? pages : [[]];
}

/**
 * Calculate total number of pages needed for quote
 */
export function calculateTotalPages(items: QuoteItem[], hasTermsPage: boolean = false): number {
  const itemPages = paginateItems(items);
  return itemPages.length + (hasTermsPage ? 1 : 0);
}

/**
 * Get items for a specific page
 */
export function getItemsForPage(items: QuoteItem[], pageNumber: number): QuoteItem[] {
  const pages = paginateItems(items);
  const index = pageNumber - 1;
  return pages[index] || [];
}

/**
 * Check if this is the last page with items (before terms page)
 */
export function isLastItemPage(items: QuoteItem[], pageNumber: number): boolean {
  const pages = paginateItems(items);
  return pageNumber === pages.length;
}

/**
 * Page info for rendering
 */
export interface PageInfo {
  pageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastItemPage: boolean;
  items: QuoteItem[];
  showTotals: boolean;
}

/**
 * Get complete page info for pagination
 */
export function getPageInfo(
  allItems: QuoteItem[],
  pageNumber: number,
  hasTermsPage: boolean = false
): PageInfo {
  const pages = paginateItems(allItems);
  const totalPages = pages.length + (hasTermsPage ? 1 : 0);
  const isLastItem = pageNumber === pages.length;

  return {
    pageNumber,
    totalPages,
    isFirstPage: pageNumber === 1,
    isLastItemPage: isLastItem,
    items: pages[pageNumber - 1] || [],
    showTotals: isLastItem,
  };
}
