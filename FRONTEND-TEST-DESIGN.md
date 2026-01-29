# Frontend E2E Test Design Document

> **Project:** INVISIBLE WORKS
> **Generated:** 2026-01-29
> **Purpose:** AI-to-AI test specification for automated frontend E2E test generation

---

## 1. Test Scope

### 1.1 Frontend Pages

| Route Pattern | Page | Priority |
|---------------|------|----------|
| `/{locale}` | Home (7 sections, animations, CTA) | HIGH |
| `/{locale}/contact` | 5-step wizard contact form | CRITICAL |
| `/{locale}/portfolio` | Portfolio gallery with lightbox | MEDIUM |
| `/{locale}/tools/business-card` | Business card PDF generator | HIGH |
| `/{locale}/tools/quote` | Quote PDF generator (2 tabs) | HIGH |
| `/{locale}/design-system` | Component demo (ContactModal) | LOW |
| `/{locale}/privacy` | Static privacy policy | LOW |
| `/{locale}/terms` | Static terms of service | LOW |

**Supported Locales:** `ko`, `en`, `zh-CN`, `zh-TW`

### 1.2 Core User Flows

1. **Contact Form Submission** - 5-step wizard → API submit → success screen
2. **Business Card Generation** - Template select → form fill → PDF download
3. **Quote Generation** - Tab select → items config → PDF download
4. **Navigation** - Header nav, mobile menu, scroll behavior
5. **Localization** - Language switching, locale-specific behaviors

---

## 2. E2E Test Scenarios

### 2.1 Contact Form - Happy Path (Korean)

```yaml
id: CONTACT-001
name: Complete contact form submission (Korean locale)
priority: CRITICAL
preconditions:
  - Browser at /{locale}/contact where locale=ko
  - localStorage cleared
steps:
  - action: click
    target: "[data-industry='food']"
    description: Select food industry option
  - action: click
    target: "button:has-text('다음')"
    description: Proceed to step 2
  - action: click
    target: "[data-purpose='trust']"
    description: Select trust purpose
  - action: click
    target: "button:has-text('다음')"
    description: Proceed to step 3
  - action: click
    target: "[data-asset='sns']"
    description: Select SNS asset
  - action: click
    target: "button:has-text('다음')"
    description: Proceed to step 4
  - action: click
    target: "[data-quote='no']"
    description: Select no previous quote
  - action: click
    target: "button:has-text('다음')"
    description: Proceed to step 5
  - action: click
    target: "button:has-text('카카오톡')"
    description: Select KakaoTalk contact method
  - action: fill
    target: "input[type='tel']"
    value: "010-1234-5678"
    description: Enter phone number
  - action: click
    target: "button:has-text('입력 완료')"
    description: Submit form
  - action: wait
    target: "text=카카오톡을 확인해주세요"
    timeout: 10000
    description: Wait for success message
expected_results:
  - Success screen displayed
  - API response success=true
  - localStorage cleared
```

### 2.2 Contact Form - Happy Path (Global/Email Only)

```yaml
id: CONTACT-002
name: Complete contact form submission (English locale - email only)
priority: CRITICAL
preconditions:
  - Browser at /en/contact
  - localStorage cleared
steps:
  - action: click
    target: "[data-industry='brand']"
    description: Select brand industry
  - action: click
    target: "button:has-text('Next')"
    description: Proceed to step 2
  - action: click
    target: "[data-purpose='inquiry']"
    description: Select inquiry purpose
  - action: click
    target: "button:has-text('Next')"
    description: Proceed to step 3
  - action: click
    target: "[data-asset='none']"
    description: Select no assets
  - action: click
    target: "button:has-text('Next')"
    description: Proceed to step 4
  - action: click
    target: "[data-quote='no']"
    description: Select no previous quote
  - action: click
    target: "button:has-text('Next')"
    description: Proceed to step 5
  - action: assert
    target: "button:has-text('KakaoTalk')"
    condition: not.visible
    description: Verify KakaoTalk option not available for non-KR
  - action: assert
    target: "button:has-text('Text')"
    condition: not.visible
    description: Verify SMS option not available for non-KR
  - action: fill
    target: "input[type='email']"
    value: "test@example.com"
    description: Enter email address
  - action: click
    target: "button:has-text('Submit')"
    description: Submit form
  - action: wait
    target: "text=Please check your email"
    timeout: 10000
    description: Wait for success message
expected_results:
  - Only email contact method visible
  - Success screen with email confirmation message
  - API called with contactMethod='email'
```

### 2.3 Contact Form - Email Validation Error

```yaml
id: CONTACT-003
name: Contact form email validation failure
priority: HIGH
preconditions:
  - Browser at /en/contact
  - Navigated to step 5 (contact method)
steps:
  - action: fill
    target: "input[type='email']"
    value: "invalid-email"
    description: Enter invalid email format
  - action: click
    target: "button:has-text('Submit')"
    description: Attempt to submit
  - action: assert
    target: "text=Invalid email format"
    condition: visible
    description: Verify error message displayed
expected_results:
  - Form not submitted
  - Error message visible
  - Input has error styling (border-red)
```

### 2.4 Contact Form - Phone Validation Error

```yaml
id: CONTACT-004
name: Contact form phone validation failure (Korean)
priority: HIGH
preconditions:
  - Browser at /ko/contact
  - Navigated to step 5, SMS selected
steps:
  - action: click
    target: "button:has-text('문자')"
    description: Select SMS contact method
  - action: fill
    target: "input[type='tel']"
    value: "123"
    description: Enter invalid short phone number
  - action: click
    target: "button:has-text('입력 완료')"
    description: Attempt to submit
  - action: assert
    target: "text=올바른 전화번호 형식이 아닙니다"
    condition: visible
    description: Verify Korean error message
expected_results:
  - Form not submitted
  - Korean validation error displayed
  - Phone must be 10-11 digits
```

### 2.5 Contact Form - Phone Auto-Formatting

```yaml
id: CONTACT-005
name: Phone number auto-formatting
priority: MEDIUM
preconditions:
  - Browser at /ko/contact
  - Navigated to step 5, KakaoTalk selected
steps:
  - action: fill
    target: "input[type='tel']"
    value: "01012345678"
    description: Enter phone without hyphens
  - action: assert
    target: "input[type='tel']"
    condition: value
    value: "010-1234-5678"
    description: Verify auto-formatted value
expected_results:
  - Input value formatted as 010-1234-5678
```

### 2.6 Contact Form - Keyboard Navigation

```yaml
id: CONTACT-006
name: Contact form keyboard navigation
priority: MEDIUM
preconditions:
  - Browser at /ko/contact
  - Step 1 visible, industry selected
steps:
  - action: press
    key: "Enter"
    description: Press Enter to proceed
  - action: assert
    target: "text=웹사이트로"
    condition: visible
    description: Verify step 2 title visible
  - action: press
    key: "Escape"
    description: Press Escape to go back
  - action: assert
    target: "text=어떤 웹사이트를"
    condition: visible
    description: Verify returned to step 1
expected_results:
  - Enter advances to next step when valid
  - Escape returns to previous step
```

### 2.7 Contact Form - LocalStorage Persistence

```yaml
id: CONTACT-007
name: Form state persists across page reload
priority: HIGH
preconditions:
  - Browser at /ko/contact
  - localStorage cleared
steps:
  - action: click
    target: "[data-industry='beauty']"
    description: Select beauty industry
  - action: click
    target: "button:has-text('다음')"
    description: Proceed to step 2
  - action: click
    target: "[data-purpose='reservation']"
    description: Select reservation purpose
  - action: reload
    description: Reload the page
  - action: assert
    target: "[data-industry='beauty']"
    condition: selected
    description: Verify industry selection persisted
  - action: assert
    target: "text=웹사이트로"
    condition: visible
    description: Verify on step 2
expected_results:
  - Form data restored from localStorage
  - Current step restored
  - Selected options maintained
```

### 2.8 Contact Form - Custom Industry Input

```yaml
id: CONTACT-010
name: Custom industry text input appears when 'other' selected
priority: MEDIUM
preconditions:
  - Browser at /ko/contact
  - Step 1 visible
steps:
  - action: click
    target: "[data-industry='other']"
    description: Select 'other' industry
  - action: assert
    target: "input[placeholder*='스타트업']"
    condition: visible
    description: Verify custom input appears
  - action: fill
    target: "input[placeholder*='스타트업']"
    value: "IT 서비스"
    description: Enter custom industry
  - action: click
    target: "button:has-text('다음')"
    description: Proceed to next step
expected_results:
  - Custom input field appears on 'other' selection
  - Can proceed with custom value
  - Custom value included in submission
```

### 2.9 Contact Form - Asset Selection Behavior

```yaml
id: CONTACT-011
name: Selecting 'none' clears other asset selections
priority: MEDIUM
preconditions:
  - Browser at /ko/contact
  - Navigated to step 3 (assets)
steps:
  - action: click
    target: "[data-asset='sns']"
    description: Select SNS
  - action: click
    target: "[data-asset='logo']"
    description: Select Logo
  - action: assert
    target: "[data-asset='sns']"
    condition: checked
    description: Verify SNS selected
  - action: click
    target: "[data-asset='none']"
    description: Select 'none' option
  - action: assert
    target: "[data-asset='sns']"
    condition: not.checked
    description: Verify SNS deselected
  - action: assert
    target: "[data-asset='logo']"
    condition: not.checked
    description: Verify Logo deselected
  - action: assert
    target: "[data-asset='none']"
    condition: checked
    description: Verify only 'none' selected
expected_results:
  - Selecting 'none' clears all other selections
  - Selecting other options clears 'none'
  - Mutual exclusivity maintained
```

---

## 3. Business Card Generator Tests

### 3.1 Business Card Generator - Complete Flow

```yaml
id: BIZCARD-001
name: Generate business card PDF with all fields
priority: HIGH
preconditions:
  - Browser at /ko/tools/business-card
steps:
  - action: click
    target: "[data-template='modern']"
    description: Select modern template
  - action: fill
    target: "input[name='name']"
    value: "홍길동"
    description: Enter name (required)
  - action: fill
    target: "input[name='title']"
    value: "대표이사"
    description: Enter job title
  - action: fill
    target: "input[name='company']"
    value: "테스트 주식회사"
    description: Enter company name
  - action: fill
    target: "input[name='phone']"
    value: "010-1234-5678"
    description: Enter phone
  - action: fill
    target: "input[name='email']"
    value: "hong@test.com"
    description: Enter email
  - action: click
    target: "button:has-text('PDF')"
    description: Click download PDF button
  - action: wait
    target: "[data-testid='download-complete']"
    timeout: 10000
    description: Wait for PDF generation
expected_results:
  - Preview updates in real-time
  - PDF download triggered
  - File downloaded successfully
```

### 3.2 Business Card Generator - Name Required Validation

```yaml
id: BIZCARD-002
name: PDF download disabled without name
priority: MEDIUM
preconditions:
  - Browser at /ko/tools/business-card
steps:
  - action: assert
    target: "input[name='name']"
    condition: value
    value: ""
    description: Verify name field empty
  - action: assert
    target: "button:has-text('PDF')"
    condition: disabled
    description: Verify PDF button disabled
  - action: fill
    target: "input[name='name']"
    value: "테스트"
    description: Enter name
  - action: assert
    target: "button:has-text('PDF')"
    condition: enabled
    description: Verify PDF button enabled
expected_results:
  - Download button disabled when name empty
  - Download button enabled when name provided
```

### 3.3 Business Card Generator - Template Selection

```yaml
id: BIZCARD-003
name: Template selection changes preview and default color
priority: MEDIUM
preconditions:
  - Browser at /ko/tools/business-card
steps:
  - action: click
    target: "[data-template='minimal']"
    description: Select minimal template
  - action: assert
    target: "[data-preview]"
    condition: has-class
    value: "template-minimal"
    description: Verify preview shows minimal template
  - action: click
    target: "[data-template='corporate']"
    description: Select corporate template
  - action: assert
    target: "[data-preview]"
    condition: has-class
    value: "template-corporate"
    description: Verify preview shows corporate template
expected_results:
  - Preview updates immediately on template change
  - Default accent color changes per template
```

---

## 4. Quote Generator Tests

### 4.1 Quote Generator - Simple Quote Tab

```yaml
id: QUOTE-001
name: Generate simple quote PDF
priority: HIGH
preconditions:
  - Browser at /ko/tools/quote
steps:
  - action: click
    target: "[data-tab='simple']"
    description: Select simple quote tab
  - action: fill
    target: "input[name='clientName']"
    value: "테스트 고객"
    description: Enter client name
  - action: fill
    target: "input[name='projectName']"
    value: "웹사이트 제작"
    description: Enter project name
  - action: click
    target: "button:has-text('PDF')"
    description: Generate PDF
  - action: wait
    target: "[data-testid='pdf-ready']"
    timeout: 15000
    description: Wait for PDF generation
expected_results:
  - Simple quote form displayed
  - PDF generated successfully
  - Download triggered
```

### 4.2 Quote Generator - Detailed Quote with Items

```yaml
id: QUOTE-002
name: Generate detailed quote with multiple items
priority: HIGH
preconditions:
  - Browser at /ko/tools/quote
steps:
  - action: click
    target: "[data-tab='detailed']"
    description: Select detailed quote tab
  - action: fill
    target: "input[name='clientName']"
    value: "상세 견적 고객"
    description: Enter client name
  - action: fill
    target: "[data-item='0'] input[name='description']"
    value: "메인 페이지 제작"
    description: Enter first item description
  - action: fill
    target: "[data-item='0'] input[name='quantity']"
    value: "1"
    description: Enter quantity
  - action: fill
    target: "[data-item='0'] input[name='price']"
    value: "500000"
    description: Enter unit price
  - action: click
    target: "button:has-text('항목 추가')"
    description: Add another item
  - action: fill
    target: "[data-item='1'] input[name='description']"
    value: "서브 페이지 제작"
    description: Enter second item description
  - action: click
    target: "button:has-text('PDF')"
    description: Generate PDF
expected_results:
  - Multiple items displayed
  - Total calculated correctly
  - PDF includes all items
```

### 4.3 Quote Generator - Remove Item

```yaml
id: QUOTE-003
name: Remove item from detailed quote (minimum 1 required)
priority: MEDIUM
preconditions:
  - Browser at /ko/tools/quote
  - Detailed tab selected with 2 items
steps:
  - action: click
    target: "[data-item='1'] button[data-action='remove']"
    description: Remove second item
  - action: assert
    target: "[data-item='1']"
    condition: not.exists
    description: Verify second item removed
  - action: click
    target: "[data-item='0'] button[data-action='remove']"
    description: Attempt to remove last item
  - action: assert
    target: "[data-item='0']"
    condition: visible
    description: Verify last item cannot be removed
expected_results:
  - Can remove items when more than 1 exists
  - Cannot remove the last remaining item
  - Minimum 1 item enforced
```

---

## 5. Navigation Tests

### 5.1 Navigation - Desktop Scroll Behavior

```yaml
id: NAV-001
name: Navigation style changes on scroll
priority: MEDIUM
preconditions:
  - Browser at /ko (home page)
  - Desktop viewport (width >= 768px)
steps:
  - action: assert
    target: "nav"
    condition: has-class
    value: "transparent"
    description: Verify nav is transparent at top
  - action: scroll
    y: 100
    description: Scroll down 100px
  - action: assert
    target: "nav"
    condition: has-class
    value: "solid"
    description: Verify nav becomes solid
  - action: scroll
    y: 0
    description: Scroll back to top
  - action: assert
    target: "nav"
    condition: has-class
    value: "transparent"
    description: Verify nav returns to transparent
expected_results:
  - Nav transparent at scroll position 0
  - Nav solid after scrolling > 20px
  - Transitions smoothly
```

### 5.2 Navigation - Mobile Menu Toggle

```yaml
id: NAV-002
name: Mobile menu opens and closes
priority: HIGH
preconditions:
  - Browser at /ko
  - Mobile viewport (width < 768px)
steps:
  - action: assert
    target: "[data-mobile-menu]"
    condition: not.visible
    description: Verify mobile menu hidden initially
  - action: click
    target: "[data-hamburger]"
    description: Click hamburger button
  - action: assert
    target: "[data-mobile-menu]"
    condition: visible
    description: Verify mobile menu opened
  - action: click
    target: "[data-mobile-menu] a[href*='portfolio']"
    description: Click portfolio link
  - action: assert
    target: "[data-mobile-menu]"
    condition: not.visible
    description: Verify menu closes after navigation
expected_results:
  - Hamburger button visible on mobile
  - Menu opens on click
  - Menu closes on link click
  - Menu closes on outside click
```

### 5.3 Language Switcher

```yaml
id: I18N-001
name: Language switcher changes locale
priority: HIGH
preconditions:
  - Browser at /ko
steps:
  - action: click
    target: "[data-language-switcher]"
    description: Open language dropdown
  - action: click
    target: "[data-locale='en']"
    description: Select English
  - action: assert
    target: url
    condition: contains
    value: "/en"
    description: Verify URL changed to English locale
  - action: assert
    target: "html"
    condition: attribute
    attribute: "lang"
    value: "en"
    description: Verify HTML lang attribute
expected_results:
  - URL path changes to /en
  - Page content in English
  - HTML lang attribute updated
```

---

## 6. Portfolio Tests

### 6.1 Portfolio - Lightbox Modal

```yaml
id: PORTFOLIO-001
name: Portfolio card opens lightbox modal
priority: MEDIUM
preconditions:
  - Browser at /ko/portfolio
steps:
  - action: click
    target: "[data-portfolio-card]:first-child"
    description: Click first portfolio card
  - action: assert
    target: "[data-lightbox]"
    condition: visible
    description: Verify lightbox modal opened
  - action: assert
    target: "[data-lightbox] img"
    condition: visible
    description: Verify image displayed in lightbox
  - action: press
    key: "Escape"
    description: Press Escape to close
  - action: assert
    target: "[data-lightbox]"
    condition: not.visible
    description: Verify lightbox closed
expected_results:
  - Lightbox opens on card click
  - Image displayed full size
  - Escape key closes modal
  - Click outside closes modal
```

---

## 7. Responsive Layout Tests

### 7.1 Responsive Layout - Contact Page

```yaml
id: RESPONSIVE-001
name: Contact page layout adapts to viewport
priority: MEDIUM
preconditions:
  - Browser at /ko/contact
steps:
  - action: viewport
    width: 375
    height: 812
    description: Set mobile viewport (iPhone X)
  - action: assert
    target: "[data-layout='split']"
    condition: not.visible
    description: Verify split layout hidden on mobile
  - action: viewport
    width: 1280
    height: 800
    description: Set desktop viewport
  - action: assert
    target: "[data-layout='split']"
    condition: visible
    description: Verify split layout visible on desktop
  - action: assert
    target: "[data-left-panel]"
    condition: has-style
    style: "width"
    value: "45%"
    description: Verify left panel width
expected_results:
  - Mobile: single column, full height
  - Desktop: 50:50 split layout
  - Smooth transitions
```

---

## 8. Test Data Requirements

### 8.1 Valid Test Data

```yaml
korean_contact:
  industry: "food"
  purpose: "trust"
  assets: ["sns", "logo"]
  hasQuote: "no"
  contactMethod: "kakao"
  phone: "010-1234-5678"

global_contact:
  industry: "brand"
  purpose: "inquiry"
  assets: ["none"]
  hasQuote: "no"
  contactMethod: "email"
  email: "test@example.com"

business_card:
  name: "홍길동"
  title: "대표이사"
  company: "테스트 주식회사"
  phone: "010-1234-5678"
  email: "hong@test.com"
  website: "https://test.com"

quote_simple:
  clientName: "테스트 고객"
  projectName: "웹사이트 제작"

quote_detailed:
  clientName: "상세 고객"
  items:
    - description: "메인 페이지"
      quantity: 1
      price: 500000
    - description: "서브 페이지"
      quantity: 5
      price: 100000
```

### 8.2 Invalid Test Data

```yaml
invalid_email:
  - "invalid"
  - "no@domain"
  - "@nodomain.com"
  - "spaces in@email.com"

invalid_phone:
  - "123"
  - "abcdefghijk"
  - "010-123-45678901"

empty_required:
  clientName: ""
  name: ""
```

---

## 9. Environment Configuration

```yaml
base_urls:
  development: "http://localhost:4555"
  staging: "https://staging.invisibleworks.co"
  production: "https://invisibleworks.co"

viewports:
  mobile:
    width: 375
    height: 812
  tablet:
    width: 768
    height: 1024
  desktop:
    width: 1280
    height: 800

locales:
  - ko
  - en
  - zh-CN
  - zh-TW

timeouts:
  navigation: 10000
  api_response: 5000
  pdf_generation: 15000
  animation: 1000
```

---

## 10. Test Execution Order

```yaml
priority_order:
  1_critical:
    - CONTACT-001  # Korean happy path
    - CONTACT-002  # Global happy path

  2_high:
    - CONTACT-003  # Email validation
    - CONTACT-004  # Phone validation
    - CONTACT-007  # LocalStorage persistence
    - BIZCARD-001  # Business card flow
    - QUOTE-001    # Simple quote flow
    - QUOTE-002    # Detailed quote flow
    - NAV-002      # Mobile menu
    - I18N-001     # Language switching

  3_medium:
    - CONTACT-005  # Phone formatting
    - CONTACT-006  # Keyboard navigation
    - CONTACT-010  # Custom industry
    - CONTACT-011  # Asset selection
    - BIZCARD-002  # Name validation
    - BIZCARD-003  # Template selection
    - QUOTE-003    # Remove item
    - NAV-001      # Scroll behavior
    - PORTFOLIO-001 # Lightbox
    - RESPONSIVE-001 # Layout
```

---

## 11. DOM Selectors Reference

```yaml
selectors:
  contact_form:
    industry_option: "[data-industry='{value}']"
    purpose_option: "[data-purpose='{value}']"
    asset_option: "[data-asset='{value}']"
    quote_option: "[data-quote='{value}']"
    contact_method: "button:has-text('{method}')"
    phone_input: "input[type='tel']"
    email_input: "input[type='email']"
    next_button_ko: "button:has-text('다음')"
    next_button_en: "button:has-text('Next')"
    submit_button_ko: "button:has-text('입력 완료')"
    submit_button_en: "button:has-text('Submit')"
    success_message_ko: "text=카카오톡을 확인해주세요"
    success_message_en: "text=Please check your email"

  navigation:
    hamburger: "[data-hamburger]"
    mobile_menu: "[data-mobile-menu]"
    language_switcher: "[data-language-switcher]"
    locale_option: "[data-locale='{locale}']"

  business_card:
    template_option: "[data-template='{template}']"
    name_input: "input[name='name']"
    pdf_button: "button:has-text('PDF')"

  quote:
    tab_simple: "[data-tab='simple']"
    tab_detailed: "[data-tab='detailed']"
    item_row: "[data-item='{index}']"
    add_item: "button:has-text('항목 추가')"
    remove_item: "button[data-action='remove']"
```

---

*Document generated for TestSprite MCP consumption*
