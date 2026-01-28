// Quote Submission Entity - Domain Layer

export type ContactMethod = 'email' | 'sms' | 'phone';
export type InquiryStatus = 'pending' | 'quote_sent' | 'converted' | 'rejected';

export interface ScreenBlocks {
    min: number;
    max: number;
}

export interface ServerOption {
    status: 'confirmed' | 'pending';
    years?: 1 | 2 | 3;
}

export interface DomainOption {
    status: 'confirmed' | 'pending';
    type?: 'new' | 'transfer';
    years?: number;
}

export interface QuoteSubmission {
    id?: string;
    created_at?: string;

    // Client Information
    client_name: string;
    client_phone?: string;
    client_email?: string;
    contact_method: ContactMethod;

    // Project Information
    screen_blocks: ScreenBlocks;
    uiux_style: 'normal' | 'fancy';
    features: string[];
    special_notes: string[];

    // Options
    server_option: ServerOption;
    domain_option: DomainOption;

    // Generated Data
    quote_number: string;
    estimated_price_min: number;
    estimated_price_max: number;

    // Status Tracking
    status: InquiryStatus;
    quote_sent_at?: string;
    onedrive_folder_url?: string;
    pdf_url?: string;
}

export interface QuoteSetting {
    key: string;
    value: PricingRules | MessageTemplates;
}

export interface PricingRules {
    base_price_per_block: number;
    fancy_multiplier: number;
    feature_prices: Record<string, number>;
}

export interface MessageTemplates {
    quote_intro: string;
    onedrive_instruction: string;
}

// Factory function to create a new quote submission
export function createQuoteSubmission(params: {
    client_name: string;
    client_phone?: string;
    client_email?: string;
    contact_method: ContactMethod;
    screen_blocks: ScreenBlocks;
    uiux_style: 'normal' | 'fancy';
    features: string[];
    special_notes: string[];
    server_option: ServerOption;
    domain_option: DomainOption;
}): Omit<QuoteSubmission, 'quote_number' | 'estimated_price_min' | 'estimated_price_max'> & { quote_number?: string } {
    return {
        ...params,
        status: 'pending',
    };
}

// Generate unique quote number
export function generateQuoteNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    return `IW-${timestamp}`;
}
