'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuoteSettings, DEFAULT_SETTINGS } from '@/lib/quote/settings';

interface QuoteSettingsResponse {
    success: boolean;
    data: QuoteSettings;
    cachedAt: string | null;
    fromCache: boolean;
    fallback?: boolean;
    error?: string;
}

interface UseQuoteSettingsResult {
    settings: QuoteSettings;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    lastFetchedAt: Date | null;
}

// Client-side cache
let clientCache: QuoteSettings | null = null;
let clientCacheTimestamp: number = 0;
const CLIENT_CACHE_TTL_MS = 60 * 1000; // 1 minute

export function useQuoteSettings(): UseQuoteSettingsResult {
    const [settings, setSettings] = useState<QuoteSettings>(clientCache ?? DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(!clientCache);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(
        clientCacheTimestamp ? new Date(clientCacheTimestamp) : null
    );

    const fetchSettings = useCallback(async () => {
        const now = Date.now();

        // Use client cache if valid
        if (clientCache && (now - clientCacheTimestamp) < CLIENT_CACHE_TTL_MS) {
            setSettings(clientCache);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/config/quote-settings');
            const data: QuoteSettingsResponse = await response.json();

            if (data.success && data.data) {
                setSettings(data.data);
                clientCache = data.data;
                clientCacheTimestamp = now;
                setLastFetchedAt(new Date(now));

                if (data.fallback) {
                    console.warn('[useQuoteSettings] Using fallback settings:', data.error);
                }
            } else {
                throw new Error('Invalid response');
            }
        } catch (err) {
            console.error('[useQuoteSettings] Failed to fetch:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch settings');
            // Keep using current settings (cached or default)
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        isLoading,
        error,
        refetch: fetchSettings,
        lastFetchedAt,
    };
}
