# INVISIBLE WORKS - Quote System Backend Plan

> **Status**: Implementation In Progress  
> **Last Updated**: 2026-01-30  
> **Goal**: Google Sheets를 메인 DB로 사용하는 서버리스 견적 시스템 구축 (Solapi 알림톡 + OneDrive 자동화 포함)

---

## 1. 목표 (Goal)

- **Architecture**: 레거시 DB 의존 없이 **Google Sheets를 DB처럼 사용**.
- **Workflow**:
  1. **문의 접수**: Google Sheets 저장.
  2. **즉시 알림**: 사용자가 선택한 수단(카톡/이메일/문자)으로 "접수 완료" 발송.
  3. **33분 후 자동 발송**: 견적서(PDF) 생성 → OneDrive 저장/링크 생성 → "견적서 안내" 발송.
- **Client**: 한국어(KR)는 카톡/문자/이메일 지원, 글로벌(Global)은 이메일 전용.

```
Client Form → API Route → Google Sheets (+ Email/SMS/AlimTalk)
                          ↓
              (Automation via Microsoft Graph API) → OneDrive (Create Folder/Link)
```

---

## 2. 현재 진행 상태 (Current Status)

### 2.1 SOLAPI (알림톡/문자) - **[✅ DONE]**
- **발신번호**: `010-5150-7858` (등록/인증 완료, 2026-07-29 만료)
- **API Key/Secret**: 발급 완료 (`.env`에 저장)
- **채널 ID (PFID)**: `KA01PF2601290741165682tiGLGeqbzm`
- **템플릿 ID**:
  - 접수 안내: `KA01TP260129080638834BvwT8r0XZTt`
  - 견적 전달: `KA01TP260129080552372jBUT7B3KgbW`
- **KakaoService.ts**: 구현 완료 (AlimTalk 발송 + SMS Fallback)

### 2.2 Google Sheets (데이터베이스) - **[✅ DONE]**
- **서비스 계정**: `sheets-robot@sheets-robot-485807.iam.gserviceaccount.com`
- **시트 ID**: `1NMALMStelNTLVysCZWJpdOOJIG5aE9_iQlAbplgQ90c`
- **GoogleSheetsService.ts**: 구현 완료

### 2.3 Gmail (이메일) - **[✅ DONE]**
- **발신 이메일**: `invisibleworks.office@gmail.com`
- **OAuth2**: 설정 완료
- **EmailService.ts**: 구현 완료 (관리자 알림 + 클라이언트 접수 확인)

### 2.4 OneDrive (파일 스토리지) - **[✅ DONE]**
- **전략**: Zapier 대신 **Microsoft Graph API** 사용 (비용 절감)
- **Azure App**: 등록 완료 (Client ID, Secret, Tenant ID 확보)
- **OneDriveService.ts**: 구현 완료 (`@azure/msal-node` 사용)
  - `createClientFolder()`: 폴더 생성 + 공유 링크 생성
  - `uploadFileToFolder()`: 파일 업로드
  - `createFolderAndUploadPDF()`: 폴더 + PDF 업로드 원스톱

### 2.5 API Route - **[✅ DONE]**
- **Endpoint**: `POST /api/quote/submit`
- **구현 완료**:
  - Honeypot 스팸 방지
  - Google Sheets 저장
  - 연락 수단별 알림 발송 (카톡/문자/이메일)
  - 관리자 이메일 알림

### 2.6 33분 스케줄러 - **[⏸️ DEFERRED]**
- **상태**: 보류 (나중에 구현)
- **내용**: 자동 PDF 생성 및 OneDrive 업로드 등 자동화 기능은 현재 구현하지 않음.

### 2.7 견적서 다국어 지원 (간단/세부) - **[⏳ TODO]**
- **내용**: 견적서(Simple/Detailed) 내용을 국문/영문으로 분리하여 제공.
- **구현**: 사용자가 선택한 언어에 맞춰 견적서 UI 텍스트 렌더링.

### 2.8 자동 알림 발송 - **[⏸️ DEFERRED]**
- **상태**: 보류 (심사 대기 중)
- **내용**: 카카오톡/문자/이메일 자동 발송 기능은 심사 완료 후 활성화 예정.

### 2.9 견적서 페이지 분리 - **[⏳ TODO]**
- **내용**: 견적서 내용이 길어질 경우, 푸터와 겹치지 않도록 페이지 분리(Pagination) 구현.
- **구현**: 간단/세부 견적서 모두 적용.

---

## 3. 환경 변수 (.env)

```bash
# Google Sheets (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL="sheets-robot@sheets-robot-485807.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
GOOGLE_PROJECT_ID="sheets-robot-485807"
GOOGLE_SHEET_ID="1NMALMStelNTLVysCZWJpdOOJIG5aE9_iQlAbplgQ90c"

# Gmail OAuth2
GMAIL_SENDER_EMAIL="invisibleworks.office@gmail.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REFRESH_TOKEN="..."

# Solapi (Kakao/SMS)
SOLAPI_API_KEY="..."
SOLAPI_API_SECRET="..."
SOLAPI_SENDER_NUMBER="010-5150-7858"
SOLAPI_PF_ID="KA01PF2601290741165682tiGLGeqbzm"
SOLAPI_TEMPLATE_ID_RECEPTION="KA01TP260129080638834BvwT8r0XZTt"
SOLAPI_TEMPLATE_ID_DELIVERY="KA01TP260129080552372jBUT7B3KgbW"

# OneDrive (Microsoft Graph API)
AZURE_TENANT_ID="..."
AZURE_CLIENT_ID="..."
AZURE_CLIENT_SECRET="..."
ONEDRIVE_OWNER_EMAIL="..."
```

---

## 4. 카카오 알림톡 템플릿 (Original Text) <<삭제금지>>

Solapi에 등록된 템플릿 원문입니다. **(수정 금지)**

### 4.1 접수 완료 안내 (Template 1) <<삭제금지>>
- **ID**: `KA01TP260129080638834BvwT8r0XZTt`
- **발송 시점**: 폼 제출 즉시
- **내용**:
```text
[접수 완료 안내 문자]
INVISIBLE WORKS

요청하신 견적이 정상적으로 시스템에 등록되었습니다. (방긋)
1시간 이내로 연락드리겠습니다.
감사합니다!
👇추가적인 문의사항 상담하기👇

[버튼: 상담하기]
[버튼: 홈페이지]
```

### 4.2 견적서 발송 (Template 2) <<삭제금지>>
- **ID**: `KA01TP260129080552372jBUT7B3KgbW`
- **발송 시점**: 접수 33분 후
- **내용**:
```text
[견적 안내문]
INVISIBLE WORKS

기다려주셔서 감사합니다. (방긋)
요청하신 견적서 작성이 완료되었습니다.
아래 버튼을 눌러 상세 견적 내용을 확인해보세요.

◼ 견적금액 : #{price}
◼ 유효기간 : #{validity}

[버튼: 견적서 확인하기]
- 타입: WL (웹링크)
- Mobile/PC 링크: http://invisibleworks.co/#{url}
```

---

## 5. 백엔드 아키텍처 및 구현 상태

### 5.1 디렉토리 구조
```
src/
├── domain/entities/
│   └── QuoteSubmission.ts        # ✅ 데이터 타입 정의
├── infrastructure/services/
│   ├── GoogleSheetsService.ts    # ✅ DB 역할
│   ├── KakaoService.ts           # ✅ Solapi SDK 연동 (AlimTalk + SMS Fallback)
│   ├── SMSService.ts             # ✅ SMS 전용 발송
│   ├── EmailService.ts           # ✅ Nodemailer (관리자 + 클라이언트 알림)
│   ├── OneDriveService.ts        # ✅ Microsoft Graph API
│   └── PricingService.ts         # ✅ 금액/기간 문자열 포매팅
└── app/api/quote/submit/
    └── route.ts                  # ✅ 메인 접수 핸들러
```

### 5.2 서비스별 상세 로직

#### GoogleSheetsService.ts
- `appendInquiryToSheet()`: 데이터 추가
- 기술: `googleapis`, `google-auth-library`

#### KakaoService.ts (Solapi)
- `sendReceptionNotification()`: 접수 완료 알림톡 발송
- `sendQuoteDeliveryNotification()`: 견적서 발송 알림톡 (변수 매핑: `#{price}`, `#{validity}`, `#{url}`)
- `sendFallbackSMS()`: 알림톡 실패 시 SMS 자동 대체
- `isKakaoConfigured()`: 설정 여부 확인

#### OneDriveService.ts (Graph API)
- `createClientFolder()`: 폴더 생성 (`[IW] {날짜}_{QuoteNumber}_{ClientName}`)
- `uploadFileToFolder()`: 파일 업로드
- `createFolderAndUploadPDF()`: 폴더 + PDF 업로드 원스톱
- 인증: `@azure/msal-node` (App-only Auth)

#### EmailService.ts
- `sendNewInquiryNotification()`: 관리자에게 새 문의 알림
- `sendReceptionConfirmationEmail()`: 클라이언트 접수 확인 이메일

---

## 6. 업무 플로우 (Workflow)

### 6.1 Contact 접수 → DB 저장 Only
1. **사용자**: Contact 폼 제출
2. **백엔드**:
   - Honeypot 검사
   - Google Sheets에 데이터 추가
   - 관리자에게 이메일 알림
   - **(보류)**: 사용자에게 자동 알림 발송은 심사 후 활성화

### 6.2 33분 후 발송 (견적 전달) - **[⏸️ DEFERRED]**
- PDF 생성, OneDrive 업로드, 자동 링크 생성 및 발송은 추후 구현.

---

## 7. Frontend Requirements

### 7.1 KR (한국어)
- **연락 수단**: **카카오톡(기본/추천)**, 문자, 이메일 (전화 X)

### 7.2 Global (EN/ZH)
- **연락 수단**: **이메일 Only**

### 7.3 성공 페이지
- **문구**: "{선택한 수단}을 확인해주세요!"
- **서브**: "접수 확인 메시지를 발송드렸습니다!"

---

## 8. SEO & Analytics

- **Robots.txt**: 모든 검색엔진 허용 (`User-agent: * Allow: /`)
- **Sitemap**: `sitemap.xml` 생성 완료
- **Verification**:
  - Naver Search Advisor 메타 태그
  - Google Search Console 메타 태그
- **Analytics**: GA4 스크립트 삽입 예정

---

## 9. Implementation Checklist

### ✅ 완료
- [x] Solapi 발신번호/템플릿 ID 문서화
- [x] KakaoService 알림톡 발송 및 Fallback SMS 구현
- [x] OneDriveService (Graph API) 구현
- [x] EmailService 클라이언트 접수 확인 이메일 추가
- [x] API Route 연락 수단별 알림 분기 처리
- [x] Honeypot 스팸 방지
- [x] 웹사이트/이메일 주소 변경 (`invisibleworks.co`, `invisibleworks.office@gmail.com`)
- [x] @azure/msal-node 패키지 설치

### ⏳ TODO
- [ ] 견적서 다국어 지원 (KR/EN)
- [ ] 견적서 페이지 분리 (Pagination)
- [ ] 실서비스 배포 및 테스트
- [ ] SEO 메타 태그 완성

### ⏸️ DEFERRED (보류/나중에)
- [ ] 33분 스케줄러 (Cron)
- [ ] OneDrive 자동화 (폴더/파일 업로드)
- [ ] 카카오톡/문자/이메일 자동 발송 (심사 대기)

---

## 10. 상세 구현 계획 (Advanced Features)

> **"D:\OneDrive - 대건중학교\260125 INVISIBLE WORKS\seriousandcarefulhardwork.md"** 파일을 참고하세요.
> - **Google Sheets Admin Config**: Sheet2를 CMS로 사용
> - **Bilingual Quote**: 국문/영문 견적서
> - **Quote Pagination**: 견적서 내용 자동 페이지 분리

---

## 11. 주요 결정 사항

### Q1. Zapier vs Microsoft Graph API?
- **결론**: **Microsoft Graph API 사용**
- **이유**: Zapier는 편리하지만 무료 구간이 적고 월 구독료가 비쌈. Graph API는 개발 소요가 있지만 유지비용이 사실상 '0원'에 가까움.

### Q2. 33분 지연 발송 구현 방식?
- **결정**: **Vercel Cron** 또는 **GitHub Actions Scheduled**
- **이유**: 무료/간편

### Q3. 카톡 채널(알림톡) 설정?
- **결론**: Solapi SDK 사용, 실패 시 SMS 자동 대체(Fallback)