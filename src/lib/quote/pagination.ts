// Quote PDF Pagination Utilities

import { QuoteItem, A4_HEIGHT_PX } from './types';

// Page layout constants (in pixels at 72dpi)
// Page layout constants (in pixels at 72dpi)
// Page layout constants (in pixels at 72dpi)
export const PAGE_PADDING_TOP = 40;
export const PAGE_PADDING_BOTTOM = 260; // Balanced: ~240px needed + 20px safety
export const PAGE_PADDING_BOTTOM_CONTINUATION = 120; // Minimal footer for continuation pages (Company Info + Page No)
export const HEADER_HEIGHT_FIRST_PAGE = 280; // Logo + title + info grid + table header
export const HEADER_HEIGHT_CONTINUATION = 100; // Minimal header for continuation pages
export const FOOTER_HEIGHT = 80;
export const TABLE_HEADER_HEIGHT = 40;

// Item height estimates (in pixels)
export const ITEM_BASE_HEIGHT = 60; // Increased base height to account for text wrapping (safe estimate)
export const ITEM_SUBITEM_HEIGHT = 16; // Height per sub-item
export const TOTALS_SECTION_HEIGHT = 260; // Adjusted for better fit (not too aggressive)

// Available content height per page type
export const CONTENT_HEIGHT_FIRST_PAGE = A4_HEIGHT_PX - PAGE_PADDING_TOP - HEADER_HEIGHT_FIRST_PAGE - PAGE_PADDING_BOTTOM;
export const CONTENT_HEIGHT_CONTINUATION = A4_HEIGHT_PX - PAGE_PADDING_TOP - HEADER_HEIGHT_CONTINUATION - PAGE_PADDING_BOTTOM_CONTINUATION;

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

  // Start with First Page settings
  let isFirstPage = true;
  let availableHeight = CONTENT_HEIGHT_FIRST_PAGE;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemHeight = calculateItemHeight(item);

    // 1. Check if Item fits
    if (currentHeight + itemHeight > availableHeight) {
      // Push current page
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      // Reset for next page (Continuation Page)
      currentPage = [];
      currentHeight = 0;
      isFirstPage = false;
      availableHeight = CONTENT_HEIGHT_CONTINUATION;
    }

    currentPage.push(item);
    currentHeight += itemHeight;

    // 2. If Last Item, Check if Totals fit
    if (i === items.length - 1) {
      if (currentHeight + TOTALS_SECTION_HEIGHT > availableHeight) {
        // Totals don't fit on this page, push current items
        // and start a new empty page just for totals
        pages.push(currentPage);
        currentPage = [];
        // The new page will be a continuation page (unless it was already page 1 and we split, but logic holds)
      }
    }
  }

  // Push the final page
  pages.push(currentPage);

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
