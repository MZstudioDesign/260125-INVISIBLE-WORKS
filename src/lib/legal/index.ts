import { privacyKo } from './privacy-ko';
import { termsKo } from './terms-ko';
import { privacyEn } from './privacy-en';
import { termsEn } from './terms-en';

export const legalData = {
    privacy: {
        ko: privacyKo,
        en: privacyEn,
        'zh-CN': privacyEn, // Fallback to English for now (better than Korean for international users)
        'zh-TW': privacyEn, // Fallback to English for now
    },
    terms: {
        ko: termsKo,
        en: termsEn,
        'zh-CN': termsEn, // Fallback to English for now
        'zh-TW': termsEn, // Fallback to English for now
    }
};
