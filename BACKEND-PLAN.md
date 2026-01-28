# Backend Integration Plan - Simplified

> **Project**: INVISIBLE WORKS - Quote System Backend  
> **Status**: In Progress  
> **Last Updated**: 2026-01-29

---

## 📋 Overview

Google Sheets를 유일한 데이터 저장소로 사용하는 간소화된 백엔드 시스템입니다.

### Architecture

```
Client Form → API Route → Google Sheets (+ Email/SMS 알림)
```

---

## 📂 File Structure

```
src/
├── domain/
│   └── entities/
│       └── QuoteSubmission.ts    # 문의 데이터 타입
├── infrastructure/
│   └── services/
│       ├── GoogleSheetsService.ts # Google Sheets API
│       ├── EmailService.ts        # Nodemailer 이메일
│       ├── SMSService.ts          # Solapi SMS
│       ├── OneDriveService.ts     # Zapier Webhook
│       └── PricingService.ts      # 가격 계산
└── app/
    └── api/
        └── quote/
            └── submit/
                └── route.ts       # 문의 제출 API
```

---

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Data Store** | Google Sheets API v4 | 문의 데이터 저장 |
| **Email** | Nodemailer + Gmail OAuth2 | 관리자 알림, 견적서 발송 |
| **SMS** | Solapi API | 한국 SMS 발송 |
| **Automation** | Zapier | OneDrive 폴더 자동화 |

---

## 🔐 Required Environment Variables

```bash
# Google Sheets (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=

# Gmail (OAuth2)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=

# Solapi SMS
SOLAPI_API_KEY=
SOLAPI_API_SECRET=
SOLAPI_SENDER_NUMBER=

# Zapier
ZAPIER_ONEDRIVE_WEBHOOK_URL=
```

---

## 📡 API Endpoints

### POST `/api/quote/submit`

문의 접수 및 Google Sheets 저장

**Request Body:**
```json
{
  "clientName": "홍길동",
  "clientPhone": "010-1234-5678",
  "clientEmail": "client@example.com",
  "contactMethod": "email",
  "screenBlocks": { "min": 3, "max": 5 },
  "uiuxStyle": "fancy",
  "features": ["gallery", "seo"],
  "specialNotes": ["rush"],
  "serverOption": { "status": "confirmed", "years": 1 },
  "domainOption": { "status": "pending" }
}
```

**Response:**
```json
{
  "success": true,
  "quoteNumber": "IW-ABC123-XYZ",
  "estimatedPrice": {
    "min": 800000,
    "max": 1200000,
    "formatted": "800,000원 ~ 1,200,000원"
  }
}
```

---

## 🚀 Vercel Deployment

1. Vercel에 프로젝트 연결
2. Environment Variables 설정
3. 배포

> ⚠️ `output: 'export'` 제거됨 - 서버사이드 API 지원

---

## ✅ Implementation Status

- [x] GoogleSheetsService 구현
- [x] EmailService 구현
- [x] SMSService 구현
- [x] OneDriveService 구현
- [x] PricingService 구현
- [x] /api/quote/submit API 구현
- [ ] 프론트엔드 폼 연동
- [ ] 실제 환경변수 설정 및 테스트
