import { NextRequest, NextResponse } from 'next/server';

// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production, consider using Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute for API routes
const API_ROUTES = ['/api/quote/submit'];

/**
 * Get client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  // Check various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Check if the request should be rate limited
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    // First request from this IP
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (now > record.resetTime) {
    // Window has expired, reset
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  // Increment count
  record.count++;

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    console.log(`[RateLimit] IP ${ip} exceeded limit: ${record.count} requests`);
    return true;
  }

  return false;
}

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to specific API routes
  const isRateLimitedRoute = API_ROUTES.some((route) => pathname.startsWith(route));

  if (isRateLimitedRoute && request.method === 'POST') {
    const clientIP = getClientIP(request);

    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        {
          success: false,
          error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to API routes
  matcher: ['/api/:path*'],
};
