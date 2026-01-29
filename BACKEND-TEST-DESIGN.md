# Backend E2E Test Design Document

> **Project:** INVISIBLE WORKS
> **Generated:** 2026-01-29
> **Purpose:** AI-to-AI test specification for automated backend API test generation

---

## 1. Test Scope

### 1.1 Backend Endpoints

| Method | Endpoint | Purpose | Priority |
|--------|----------|---------|----------|
| POST | `/api/quote/submit` | Submit contact/quote request | CRITICAL |

### 1.2 Core Backend Flows

1. **Contact Form API Submission** - Validate input → Save to Google Sheets → Send notifications
2. **Honeypot Bot Prevention** - Detect and block bot submissions
3. **Rate Limiting** - Prevent excessive API requests
4. **Input Validation** - Validate required fields and formats

---

## 2. API Test Scenarios

### 2.1 Contact Form - Honeypot Bot Prevention

```yaml
id: API-001
name: Honeypot field blocks bot submissions
priority: CRITICAL
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      clientName: "Bot Test"
      contactMethod: "email"
      clientEmail: "bot@test.com"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      _gotcha: "bot-filled-value"
    description: Submit with honeypot field filled
  - action: assert
    response_body:
      success: true
      quoteNumber: "IW-BLOCKED"
    description: Verify fake success response
expected_results:
  - Returns success (to hide detection)
  - quoteNumber is "IW-BLOCKED"
  - No actual data saved
```

### 2.2 Contact Form - API Validation Error

```yaml
id: API-002
name: API returns validation error for missing fields
priority: CRITICAL
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      clientName: ""
      contactMethod: "invalid"
    description: Submit with invalid data
  - action: assert
    response_status: 400
    response_body:
      success: false
      error: "Validation failed"
    description: Verify validation error response
expected_results:
  - HTTP 400 status
  - success=false
  - Error details in response
```

### 2.3 Rate Limiting

```yaml
id: API-003
name: Rate limiting blocks excessive requests
priority: HIGH
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: loop
    count: 12
    steps:
      - action: api_call
        method: POST
        url: "/api/quote/submit"
        body:
          clientName: "Rate Test"
          contactMethod: "email"
          clientEmail: "rate@test.com"
          screenBlocks: { min: 1, max: 15 }
          uiuxStyle: "normal"
    description: Send 12 requests rapidly
  - action: assert
    last_response_status: 429
    description: Verify rate limit triggered
  - action: assert
    last_response_body:
      code: "RATE_LIMITED"
    description: Verify rate limit error code
expected_results:
  - First 10 requests succeed
  - 11th+ request returns 429
  - Error message in Korean
```

### 2.4 Valid Korean Submission (Email)

```yaml
id: API-004
name: Valid Korean contact submission with email
priority: CRITICAL
preconditions:
  - API endpoint /api/quote/submit available
  - Google Sheets service configured
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    headers:
      Content-Type: "application/json"
    body:
      industry: "food"
      customIndustry: ""
      purpose: "trust"
      assets: ["sns", "logo"]
      hasQuote: "no"
      quoteUrl: ""
      contactMethod: "email"
      clientPhone: ""
      clientEmail: "test@example.com"
      screenBlocks: { min: 5, max: 10 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit valid Korean contact request with email
  - action: assert
    response_status: 200
    response_body:
      success: true
    description: Verify successful submission
  - action: assert
    response_body:
      quoteNumber:
        pattern: "^IW-\\d{6}$"
    description: Verify quote number format (IW-XXXXXX)
expected_results:
  - HTTP 200 status
  - success=true
  - quoteNumber in format IW-XXXXXX
  - Data saved to Google Sheets
```

### 2.5 Valid Korean Submission (KakaoTalk)

```yaml
id: API-005
name: Valid Korean contact submission with KakaoTalk
priority: CRITICAL
preconditions:
  - API endpoint /api/quote/submit available
  - Google Sheets service configured
  - Solapi/Kakao service configured
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    headers:
      Content-Type: "application/json"
    body:
      industry: "beauty"
      customIndustry: ""
      purpose: "reservation"
      assets: ["none"]
      hasQuote: "no"
      quoteUrl: ""
      contactMethod: "kakao"
      clientPhone: "010-1234-5678"
      clientEmail: ""
      screenBlocks: { min: 1, max: 5 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit valid Korean contact request with KakaoTalk
  - action: assert
    response_status: 200
    response_body:
      success: true
    description: Verify successful submission
expected_results:
  - HTTP 200 status
  - success=true
  - KakaoTalk notification sent via Solapi
  - Data saved to Google Sheets
```

### 2.6 Valid Korean Submission (SMS)

```yaml
id: API-006
name: Valid Korean contact submission with SMS
priority: HIGH
preconditions:
  - API endpoint /api/quote/submit available
  - Google Sheets service configured
  - Solapi SMS service configured
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    headers:
      Content-Type: "application/json"
    body:
      industry: "brand"
      customIndustry: ""
      purpose: "inquiry"
      assets: ["logo"]
      hasQuote: "yes"
      quoteUrl: "https://example.com/quote"
      contactMethod: "sms"
      clientPhone: "010-9876-5432"
      clientEmail: ""
      screenBlocks: { min: 10, max: 20 }
      uiuxStyle: "premium"
      locale: "ko"
    description: Submit valid Korean contact request with SMS
  - action: assert
    response_status: 200
    response_body:
      success: true
    description: Verify successful submission
expected_results:
  - HTTP 200 status
  - success=true
  - SMS notification sent via Solapi
  - Data saved to Google Sheets
```

### 2.7 Invalid Email Format

```yaml
id: API-007
name: API rejects invalid email format
priority: HIGH
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "food"
      purpose: "trust"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "email"
      clientEmail: "invalid-email-format"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "en"
    description: Submit with invalid email format
  - action: assert
    response_status: 400
    response_body:
      success: false
      field: "clientEmail"
    description: Verify email validation error
expected_results:
  - HTTP 400 status
  - success=false
  - Error indicates clientEmail field
```

### 2.8 Invalid Phone Format

```yaml
id: API-008
name: API rejects invalid phone format
priority: HIGH
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "food"
      purpose: "trust"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "kakao"
      clientPhone: "123"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit with invalid phone format
  - action: assert
    response_status: 400
    response_body:
      success: false
      field: "clientPhone"
    description: Verify phone validation error
expected_results:
  - HTTP 400 status
  - success=false
  - Error indicates clientPhone field
  - Phone must be 10-11 digits
```

### 2.9 Missing Required Fields

```yaml
id: API-009
name: API rejects missing required fields
priority: HIGH
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: ""
      purpose: ""
      contactMethod: ""
    description: Submit with missing required fields
  - action: assert
    response_status: 400
    response_body:
      success: false
      error: "Validation failed"
    description: Verify validation error response
expected_results:
  - HTTP 400 status
  - success=false
  - Error lists missing fields
```

### 2.10 Invalid Contact Method

```yaml
id: API-010
name: API rejects invalid contact method
priority: MEDIUM
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "food"
      purpose: "trust"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "telegram"
      clientEmail: "test@example.com"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit with unsupported contact method
  - action: assert
    response_status: 400
    response_body:
      success: false
      field: "contactMethod"
    description: Verify contact method validation error
expected_results:
  - HTTP 400 status
  - success=false
  - Error indicates invalid contactMethod
  - Valid values: email, kakao, sms
```

### 2.11 Non-Korean Locale Cannot Use KakaoTalk

```yaml
id: API-011
name: Non-Korean locale cannot use KakaoTalk contact method
priority: HIGH
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "brand"
      purpose: "inquiry"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "kakao"
      clientPhone: "010-1234-5678"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "en"
    description: Submit with KakaoTalk from English locale
  - action: assert
    response_status: 400
    response_body:
      success: false
      error: "KakaoTalk is only available for Korean locale"
    description: Verify locale restriction
expected_results:
  - HTTP 400 status
  - success=false
  - Error message about KakaoTalk availability
```

### 2.12 Custom Industry Submission

```yaml
id: API-012
name: Custom industry value is properly saved
priority: MEDIUM
preconditions:
  - API endpoint /api/quote/submit available
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "other"
      customIndustry: "IT 스타트업"
      purpose: "trust"
      assets: ["sns"]
      hasQuote: "no"
      contactMethod: "email"
      clientEmail: "startup@example.com"
      screenBlocks: { min: 5, max: 15 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit with custom industry value
  - action: assert
    response_status: 200
    response_body:
      success: true
    description: Verify successful submission
expected_results:
  - HTTP 200 status
  - success=true
  - Custom industry value saved to Google Sheets
```

---

## 3. External Service Integration Tests

### 3.1 Google Sheets Integration

```yaml
id: INTEGRATION-001
name: Data is saved to Google Sheets
priority: CRITICAL
preconditions:
  - Google Sheets API configured
  - Valid service account credentials
test_approach: integration_test
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "food"
      purpose: "trust"
      assets: ["sns"]
      hasQuote: "no"
      contactMethod: "email"
      clientEmail: "sheets-test@example.com"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit valid contact request
  - action: verify_google_sheets
    sheet_id: "${GOOGLE_SHEET_ID}"
    expected_row:
      email: "sheets-test@example.com"
      industry: "food"
    description: Verify data exists in Google Sheets
expected_results:
  - Row added to Google Sheets
  - All fields properly formatted
  - Timestamp recorded
```

### 3.2 Solapi Kakao Notification

```yaml
id: INTEGRATION-002
name: KakaoTalk notification sent via Solapi
priority: HIGH
preconditions:
  - Solapi API configured
  - Valid API credentials
  - KakaoTalk template approved
test_approach: mock_or_sandbox
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "beauty"
      purpose: "reservation"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "kakao"
      clientPhone: "010-1234-5678"
      screenBlocks: { min: 1, max: 5 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit valid KakaoTalk contact request
expected_results:
  - Solapi API called
  - Template ID matches TEMPLATE_ID_RECEPTION
  - Phone number formatted correctly
  - Message queued for delivery
```

### 3.3 Solapi SMS Notification

```yaml
id: INTEGRATION-003
name: SMS notification sent via Solapi
priority: HIGH
preconditions:
  - Solapi API configured
  - Valid API credentials
test_approach: mock_or_sandbox
steps:
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "brand"
      purpose: "inquiry"
      assets: ["logo"]
      hasQuote: "no"
      contactMethod: "sms"
      clientPhone: "010-9876-5432"
      screenBlocks: { min: 1, max: 10 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit valid SMS contact request
expected_results:
  - Solapi SMS API called
  - Sender number matches SOLAPI_SENDER_NUMBER
  - Message content includes quote number
```

---

## 4. Error Handling Tests

### 4.1 Google Sheets Service Failure

```yaml
id: ERROR-001
name: Graceful handling when Google Sheets fails
priority: HIGH
preconditions:
  - Google Sheets service temporarily unavailable (simulated)
test_approach: mock_failure
steps:
  - action: mock_service_failure
    service: "google_sheets"
    error: "Service unavailable"
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "food"
      purpose: "trust"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "email"
      clientEmail: "error-test@example.com"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit when Google Sheets is down
  - action: assert
    response_status: 500
    response_body:
      success: false
      error: "Service temporarily unavailable"
    description: Verify graceful error handling
expected_results:
  - HTTP 500 status
  - User-friendly error message
  - Error logged for monitoring
```

### 4.2 Notification Service Failure (Non-Critical)

```yaml
id: ERROR-002
name: Submission succeeds even if notification fails
priority: MEDIUM
preconditions:
  - Solapi service temporarily unavailable (simulated)
  - Google Sheets service available
test_approach: mock_failure
steps:
  - action: mock_service_failure
    service: "solapi"
    error: "Notification service unavailable"
  - action: api_call
    method: POST
    url: "/api/quote/submit"
    body:
      industry: "food"
      purpose: "trust"
      assets: ["none"]
      hasQuote: "no"
      contactMethod: "kakao"
      clientPhone: "010-1234-5678"
      screenBlocks: { min: 1, max: 15 }
      uiuxStyle: "normal"
      locale: "ko"
    description: Submit when notification service is down
  - action: assert
    response_status: 200
    response_body:
      success: true
      warning: "Notification could not be sent"
    description: Verify submission still succeeds
expected_results:
  - HTTP 200 status (submission succeeds)
  - Data saved to Google Sheets
  - Warning about notification failure
  - Error logged for retry
```

---

## 5. Test Data Requirements

### 5.1 Valid API Request Bodies

```yaml
korean_kakao_request:
  industry: "food"
  customIndustry: ""
  purpose: "trust"
  assets: ["sns", "logo"]
  hasQuote: "no"
  quoteUrl: ""
  contactMethod: "kakao"
  clientPhone: "010-1234-5678"
  clientEmail: ""
  screenBlocks: { min: 5, max: 10 }
  uiuxStyle: "normal"
  locale: "ko"

korean_sms_request:
  industry: "beauty"
  customIndustry: ""
  purpose: "reservation"
  assets: ["none"]
  hasQuote: "no"
  quoteUrl: ""
  contactMethod: "sms"
  clientPhone: "010-9876-5432"
  clientEmail: ""
  screenBlocks: { min: 1, max: 5 }
  uiuxStyle: "normal"
  locale: "ko"

global_email_request:
  industry: "brand"
  customIndustry: ""
  purpose: "inquiry"
  assets: ["none"]
  hasQuote: "no"
  quoteUrl: ""
  contactMethod: "email"
  clientPhone: ""
  clientEmail: "global@example.com"
  screenBlocks: { min: 10, max: 20 }
  uiuxStyle: "premium"
  locale: "en"
```

### 5.2 Invalid API Request Bodies

```yaml
invalid_email:
  clientEmail: "invalid-email"

invalid_phone:
  clientPhone: "123"

missing_required:
  industry: ""
  purpose: ""
  contactMethod: ""

invalid_contact_method:
  contactMethod: "telegram"

honeypot_filled:
  _gotcha: "bot-value"
```

---

## 6. Environment Configuration

```yaml
base_urls:
  development: "http://localhost:4555"
  staging: "https://staging.invisibleworks.co"
  production: "https://invisibleworks.co"

api_endpoints:
  submit: "/api/quote/submit"

timeouts:
  api_response: 5000
  external_service: 10000

rate_limits:
  requests_per_minute: 10
  block_duration_seconds: 60
```

---

## 7. Test Execution Order

```yaml
priority_order:
  1_critical:
    - API-001  # Honeypot security
    - API-002  # Validation errors
    - API-004  # Valid Korean email
    - API-005  # Valid Korean KakaoTalk
    - INTEGRATION-001  # Google Sheets

  2_high:
    - API-003  # Rate limiting
    - API-006  # Valid Korean SMS
    - API-007  # Invalid email format
    - API-008  # Invalid phone format
    - API-009  # Missing required fields
    - API-011  # Locale restrictions
    - INTEGRATION-002  # Solapi Kakao
    - INTEGRATION-003  # Solapi SMS
    - ERROR-001  # Google Sheets failure

  3_medium:
    - API-010  # Invalid contact method
    - API-012  # Custom industry
    - ERROR-002  # Notification failure
```

---

## 8. External Service Mocks

```yaml
mock_services:
  google_sheets:
    endpoint: appendInquiryToSheet
    mock_response: { success: true }

  kakao_service:
    endpoint: sendReceptionNotification
    mock_response: { success: true, messageId: "mock-123" }

  sms_service:
    endpoint: sendSMS
    mock_response: { success: true, messageId: "mock-456" }

  email_service:
    endpoint: sendNewInquiryNotification
    mock_response: { success: true }
```

---

*Document generated for TestSprite MCP consumption*
