// Quote Submission Entity - Domain Layer

export type ContactMethod = 'email' | 'sms' | 'kakao';
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

export interface LinkItem {
    type: string;
    customType?: string;
    url: string;
}

export interface QuoteSubmission {
    id?: string;
    created_at?: string;

    // Contact Form Data
    client_name: string; // Used for Industry/Company Name if no separate name field
    client_phone?: string;
    client_email?: string;
    contact_method: ContactMethod;

    industry: string;
    industry_custom?: string;
    purpose: string;
    preferred_color: string;
    tone_and_manner: string;
    current_assets: string[];
    has_quote: string;
    additional_links?: LinkItem[];
    additional_note?: string;

    // Project Information (Optional in initial contact)
    screen_blocks?: ScreenBlocks;
    uiux_style?: 'normal' | 'fancy';
    features?: string[];
    special_notes?: string[];

    // Options (Optional)
    server_option?: ServerOption;
    domain_option?: DomainOption;

    // Generated Data
    quote_number: string;
    estimated_price_min?: number;
    estimated_price_max?: number;

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
export function createQuoteSubmission(params: Partial<QuoteSubmission> & {
    client_name: string;
    contact_method: ContactMethod;
}): Partial<QuoteSubmission> {
    return {
        ...params,
        status: 'pending',
    };
}

// Generate unique quote number
export function generateQuoteNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `IW-${timestamp}-${random}`;
}
