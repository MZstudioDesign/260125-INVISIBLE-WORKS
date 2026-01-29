// Quote Translations - Korean / English

export type QuoteLanguage = 'ko' | 'en';

export interface QuoteTranslations {
    // Document
    title: string;
    subtitle: string;
    invoiceTitle: string;

    // Labels
    issueDate: string;
    validUntil: string;
    quoteNumber: string;
    to: string;
    from: string;

    // Table
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;

    // Totals
    subtotal: string;
    vat: string;
    total: string;
    discount: string;
    balanceDue: string;

    // Notes
    notes: string;
    server: string;
    domain: string;
    tbd: string;
    pending: string;

    // Payment
    paymentInfo: string;
    splitPayment: string;
    deposit: string;
    balance: string;
    midPayment: string;
    bankAccount: string;
    accountHolder: string;

    // Footer
    website: string;
    termsTitle: string;
    scanToVisit: string;
    pageOf: string;

    // Misc
    year: string;
    years: string;
    newDomain: string;
    transferDomain: string;

    // Terms (compact)
    compactTerms: string[];

    // Terms (detailed)
    detailedTermsTitle: string;
    detailedTermsIntro: string;
    detailedTermsSections: {
        title: string;
        content: string[];
    }[];
}

export const translations: Record<QuoteLanguage, QuoteTranslations> = {
    ko: {
        // Document
        title: '견적서',
        subtitle: 'QUOTATION',
        invoiceTitle: 'INVOICE',

        // Labels
        issueDate: '발행일',
        validUntil: '유효기간',
        quoteNumber: 'NO.',
        to: '수신',
        from: '발신',

        // Table
        description: '항목',
        quantity: '수량',
        unitPrice: '단가',
        amount: '금액',

        // Totals
        subtotal: '소계',
        vat: '부가세',
        total: '합계',
        discount: '할인',
        balanceDue: '최종 금액',

        // Notes
        notes: '비고',
        server: '서버',
        domain: '도메인',
        tbd: '별도 상담',
        pending: '미정',

        // Payment
        paymentInfo: '결제 정보',
        splitPayment: '분할 결제 안내',
        deposit: '착수금',
        balance: '잔금',
        midPayment: '중도금',
        bankAccount: '입금 계좌',
        accountHolder: '예금주',

        // Footer
        website: 'WEBSITE',
        termsTitle: 'TERMS & CONDITIONS',
        scanToVisit: '웹사이트 방문하기',
        pageOf: '페이지',

        // Misc
        year: '년',
        years: '년',
        newDomain: '신규 등록',
        transferDomain: '이전',

        // Terms (compact)
        compactTerms: [
            '이 견적은 최종 확정 전까지 \'예상 범위\'입니다. 제공해주신 정보 기준으로 산출된 금액이며, 착수 전 상담과 자료 확인 이후 최종 금액이 확정됩니다. 본 안내는 이해를 돕기 위한 요약이며, 상세 내용은 \'세부 약관\'을 따릅니다.',
            '페이지 분량은 제작사가 산정합니다. 한 화면 단위를 기준(스크린 블록)으로 제작사가 직접 분량을 산정하며, 최종 분량에 따라 금액이 달라질 수 있습니다.',
            '포함 범위와 추가 범위는 명확히 구분됩니다. 단순한 텍스트·이미지 수정은 기본 수정에 포함되지만, 디자인 변경·구조 변경·기능 추가는 추가 비용 대상입니다.',
            '수정은 기본 1회 제공됩니다. 작업 완료 후 한 번에 모아서 전달해주신 수정 요청에 대해 무제한으로 1회 반영됩니다.',
            '결제/쇼핑 기능이 포함되면 추가 상담이 필요합니다. 보안 수준과 서버 구조가 달라지기 때문에, 기능 포함 여부에 따라 추가 비용이 발생할 수 있습니다.',
            '서버와 도메인 비용은 제작비와 별개입니다. 서버 유지관리비와 도메인 비용은 선택 항목이며, 선택 후 최종 금액이 확정됩니다.',
            '제공 자료의 권리와 책임은 고객에게 있습니다. 이미지, 로고, 텍스트 등 고객이 제공한 자료의 저작권 문제는 고객 책임입니다.',
            '제작사는 결과물의 \'성과\'를 보장하지 않습니다. 매출, 검색 순위, 광고 성과 등 사업 성과는 보장 대상이 아니며, 제작 범위에 대한 결과물만 제공합니다.',
        ],

        // Terms (detailed)
        detailedTermsTitle: 'Invisible Works 웹사이트 제작 견적서 부속 약관',
        detailedTermsIntro: '본 약관은 Invisible Works(이하 "제작사")가 제공하는 웹사이트 제작 서비스와 관련하여, 견적서와 함께 적용되는 기본 조건을 규정한다.',
        detailedTermsSections: [
            {
                title: '제1조 (문서의 성격 및 적용 범위)',
                content: [
                    '① 본 견적서는 고객이 제공한 정보 및 협의된 요구사항을 기준으로 산정된 예상 범위 견적이며, 착수 전 상세 기획 및 자료 확인 결과에 따라 범위 및 금액이 조정될 수 있다.',
                    '② 견적서에 기재된 스크린 블록(페이지 분량)은 제작사의 산정 기준을 따른다.',
                    '③ 스크린 블록의 정의는 다음과 같다: 브라우저 배율 67% 기준에서 화면을 가득 채우는 하나의 화면 단위로, 스크롤 시 한 번에 인지되는 콘텐츠 묶음을 의미한다.',
                    '④ 최소~최대 범위로 제시된 견적은 정보가 확정되기 전까지 확정 금액으로 간주되지 않는다.',
                ],
            },
            {
                title: '제2조 (작업 범위)',
                content: [
                    '① 포함 항목: 견적서에 명시된 페이지 제작, 기본 보안 적용, 협의된 기능 구현, 오픈(배포) 지원.',
                    '② 다음 각 호의 항목은 기본 견적에 포함되지 않으며, 필요 시 별도 견적 대상이다:',
                    '   • 신규 로고 및 브랜드 개발, 대규모 카피라이팅 작성',
                    '   • 사진·영상 촬영 및 전문 편집',
                    '   • 외부 서비스(API) 연동 중 정책·권한·승인 이슈가 있는 경우',
                    '   • 레이아웃 변경, 리디자인, 정보구조(IA) 재설계',
                    '   • 다국어 구축 및 번역 포함 작업',
                    '   • 법무·세무·의료 등 고위험 업종 문구 검수',
                    '   • 접근성·보안 인증(ISMS 등) 대응',
                    '③ 견적서의 "특이사항" 항목은 비용에 즉시 반영되지 않으며, 상담 이후 확정된다.',
                ],
            },
            {
                title: '제3조 (일정 및 납기)',
                content: [
                    '① 전체 일정은 착수일, 자료 수급일, 피드백 회신 속도, 외부 서비스 승인 여부에 따라 변동될 수 있다.',
                    '② 고객의 자료 제공 지연, 피드백 지연, 요구사항 변경, 외부 승인 지연이 발생한 경우 납기는 자동 연장될 수 있다.',
                    '③ 촉박한 일정의 프로젝트는 별도 협의 없이는 확정 납기를 보장하지 않는다.',
                ],
            },
            {
                title: '제4조 (고객 제공 자료 및 권리 책임)',
                content: [
                    '① 고객은 제작에 필요한 텍스트, 이미지, 영상, 로고, 상표, 정보 등을 기한 내 제공해야 한다.',
                    '② 고객이 제공하는 모든 자료는 저작권, 초상권, 상표권, 라이선스 사용 권한을 적법하게 보유해야 하며, 관련 분쟁 발생 시 책임은 고객에게 있다.',
                    '③ 고객이 외부 계정(도메인, 서버, 결제, SNS 등)의 접근 권한을 제공하지 않거나 지연 제공하는 경우 작업은 제한될 수 있다.',
                ],
            },
            {
                title: '제5조 (수정 정책)',
                content: [
                    '① 기본 수정 1회 제공: 작업 완료 후 전달된 결과물을 기준으로, 텍스트 수정, 이미지·영상 교체, 삭제 등 콘텐츠 변경 범위 내에서 무제한 1회 제공한다.',
                    '② 수정 1회의 기준은 고객이 취합하여 1회로 전달한 수정 요청 묶음을 기준으로 한다.',
                    '③ 기본 수정은 전달일로부터 7일 이내 접수된 건에 한해 적용된다.',
                    '④ 수정 처리 기간은 접수 후 3영업일 이내 전달을 원칙으로 하며, 요청량 및 외부 승인 필요 시 변동될 수 있다.',
                    '⑤ 다음 각 호는 범위 변경으로 간주되어 추가 견적 대상이다: 레이아웃 변경, 스타일 전면 수정, 기능 변경 및 추가',
                ],
            },
            {
                title: '제6조 (추가 수정 비용)',
                content: [
                    '① 텍스트·이미지·영상 무제한 수정 1회 이용권: 5만원',
                    '② 레이아웃 수정 및 리디자인(1회 미팅 포함): 10만원',
                ],
            },
            {
                title: '제7조 (기능 및 외부 서비스)',
                content: [
                    '① 쇼핑·결제·거래 기능이 포함되는 경우, 결제대행(PG), 개인정보 처리, 보안 등급, 서버 구조에 따라 추가 비용이 발생할 수 있으며 추가 상담이 필요하다.',
                    '② 외부 서비스 연동은 해당 서비스의 정책, 요금, 승인 절차에 따라 구현 가능 범위가 달라질 수 있다.',
                ],
            },
            {
                title: '제8조 (서버 유지관리 및 도메인 비용)',
                content: [
                    '① 서버 유지관리비 및 도메인 비용은 제작비와 별개의 고정 비용이다.',
                    '② 서버 유지관리비: 1년 15만원 / 2년 25만원 / 3년 30만원',
                    '③ 도메인 비용: 신규 등록 연 3만원 × 사용 연수 / 기존 도메인 이전 (연 3만원 × 사용 연수) + 이전비 3만원',
                    '④ 고객 보유 서버 및 도메인을 사용하는 경우, 관련 정보 제공 및 설정 책임은 고객에게 있다.',
                    '⑤ 서버 및 도메인 비용은 공급사 정책 변경 시 실비 정산을 원칙으로 한다.',
                ],
            },
            {
                title: '제9조 (보안 및 운영)',
                content: [
                    '① 본 견적에는 일반적인 검색 노출에 문제가 없는 기본 보안 설정이 포함된다.',
                    '② 결제·거래·민감정보 처리가 필요한 경우 상급 보안이 요구되며, 별도 상담 및 추가 견적이 필요하다.',
                    '③ 고객의 운영 방식(플러그인 추가 설치, 계정 공유, 약한 비밀번호 사용 등)으로 발생하는 문제에 대해 제작사는 책임지지 않는다.',
                ],
            },
            {
                title: '제10조 (검수 및 납품)',
                content: [
                    '① 납품물은 견적서 및 협의된 범위에 따라 제작된 웹사이트 및 관련 산출물이다.',
                    '② 고객은 전달일로부터 7일 이내 검수를 진행해야 하며, 기한 내 회신이 없는 경우 납품 승인으로 간주할 수 있다.',
                    '③ 브라우저 및 디바이스 호환은 주요 최신 버전을 기준으로 대응한다.',
                ],
            },
            {
                title: '제11조 (비용 및 결제)',
                content: [
                    '① 견적 금액은 협의된 범위를 기준으로 하며, 범위 변경 시 추가 견적이 발생한다.',
                    '② 외부 유료 서비스(플러그인, 폰트, 이미지, API, 번역, 결제 수수료 등)는 고객 부담이다.',
                    '③ 부가세 포함 여부는 견적서에 따른다.',
                ],
            },
            {
                title: '제12조 (저작권 및 산출물 권리)',
                content: [
                    '① 고객이 제공한 자료의 권리는 고객에게 있다.',
                    '② 제작 결과물의 사용 권리는 결제 완료를 전제로 고객에게 귀속된다.',
                    '③ 제작사가 보유한 템플릿, 프레임워크, 공용 컴포넌트, 노하우는 제작사의 자산이며 고객에게는 프로젝트 목적 범위 내 사용권만 부여된다.',
                ],
            },
            {
                title: '제13조 (비밀유지)',
                content: [
                    '① 당사자는 프로젝트 수행 과정에서 알게 된 상대방의 비공개 정보를 제3자에게 공개하지 않는다.',
                    '② 법령 또는 수사기관 요청에 의한 공개는 예외로 한다.',
                ],
            },
            {
                title: '제14조 (책임 제한)',
                content: [
                    '① 제작사는 고객의 사업 성과, 매출, 검색 순위, 광고 성과를 보장하지 않는다.',
                    '② 간접손해 및 기대이익에 대해서는 책임을 지지 않으며, 제작사의 책임이 인정되는 경우에도 책임 한도는 고객이 실제 지급한 제작비 범위로 제한된다.',
                ],
            },
            {
                title: '제15조 (계약 변경 및 해지)',
                content: [
                    '① 진행 중 범위 변경이 발생할 경우 추가 견적 합의 후 진행한다.',
                    '② 고객 사정으로 프로젝트가 중단 또는 해지되는 경우, 진행 단계에 따라 이미 수행된 작업 비용은 정산 대상이 될 수 있다.',
                    '③ 고객이 결제 의무를 이행하지 않거나 자료 제공이 장기간 지연되는 경우, 제작사는 작업을 중단할 수 있다.',
                ],
            },
            {
                title: '제16조 (분쟁 해결 및 관할)',
                content: [
                    '① 본 약관 및 견적서와 관련한 분쟁은 대한민국 법률에 따라 해석되며, 관할 법원은 제작사 소재지 관할 법원으로 한다.',
                ],
            },
        ],
    },

    en: {
        // Document
        title: 'QUOTATION',
        subtitle: 'Quote',
        invoiceTitle: 'INVOICE',

        // Labels
        issueDate: 'Issue Date',
        validUntil: 'Valid Until',
        quoteNumber: 'NO.',
        to: 'To',
        from: 'From',

        // Table
        description: 'Description',
        quantity: 'Qty',
        unitPrice: 'Unit Price',
        amount: 'Amount',

        // Totals
        subtotal: 'Subtotal',
        vat: 'VAT',
        total: 'Total',
        discount: 'Discount',
        balanceDue: 'Balance Due',

        // Notes
        notes: 'Notes',
        server: 'Server',
        domain: 'Domain',
        tbd: 'TBD',
        pending: 'Pending',

        // Payment
        paymentInfo: 'Payment Information',
        splitPayment: 'Split Payment',
        deposit: 'Deposit',
        balance: 'Final Payment',
        midPayment: 'Progress Payment',
        bankAccount: 'Bank Account',
        accountHolder: 'Account Holder',

        // Footer
        website: 'WEBSITE',
        termsTitle: 'TERMS & CONDITIONS',
        scanToVisit: 'Scan to visit website',
        pageOf: 'Page',

        // Misc
        year: 'year',
        years: 'years',
        newDomain: 'New Registration',
        transferDomain: 'Transfer',

        // Terms (compact)
        compactTerms: [
            'This quotation is an "estimated range" until final confirmation. The amount is calculated based on the information provided and will be finalized after consultation and material review before project initiation. This notice is a summary for understanding; detailed content follows the "Detailed Terms."',
            'Page volume is determined by the developer. The developer calculates volume based on screen blocks (one screen unit), and the final amount may vary depending on the final volume.',
            'Included scope and additional scope are clearly distinguished. Simple text and image modifications are included in basic revisions, but design changes, structural changes, and feature additions are subject to additional costs.',
            'One revision is provided as standard. After work completion, unlimited revisions are provided once for modification requests submitted together at one time.',
            'Additional consultation is required if payment/shopping features are included. Additional costs may occur depending on feature inclusion as security levels and server structures differ.',
            'Server and domain costs are separate from production costs. Server maintenance and domain costs are optional items, and the final amount is confirmed after selection.',
            'Rights and responsibilities for provided materials belong to the client. Copyright issues for images, logos, text, and other materials provided by the client are the client\'s responsibility.',
            'The developer does not guarantee "performance" of deliverables. Business outcomes such as sales, search rankings, and advertising performance are not guaranteed; only deliverables within the production scope are provided.',
        ],

        // Terms (detailed)
        detailedTermsTitle: 'Invisible Works Website Development Quotation Terms and Conditions',
        detailedTermsIntro: 'These terms stipulate the basic conditions applied together with the quotation regarding the website development services provided by Invisible Works (hereinafter "Developer").',
        detailedTermsSections: [
            {
                title: 'Article 1 (Nature and Scope of Document)',
                content: [
                    '① This quotation is an estimated range based on information provided by the client and agreed requirements, and the scope and amount may be adjusted based on detailed planning and material review results before project initiation.',
                    '② Screen blocks (page volume) stated in the quotation follow the Developer\'s calculation standards.',
                    '③ Screen block is defined as: one screen unit that fills the screen at 67% browser zoom, meaning a content bundle perceived at once when scrolling.',
                    '④ Quotations presented as min-max ranges are not considered confirmed amounts until information is finalized.',
                ],
            },
            {
                title: 'Article 2 (Scope of Work)',
                content: [
                    '① Included items: Page development specified in the quotation, basic security application, agreed feature implementation, deployment support.',
                    '② The following items are not included in the basic quotation and are subject to separate quotation if needed:',
                    '   • New logo and brand development, large-scale copywriting',
                    '   • Photo/video shooting and professional editing',
                    '   • External service (API) integration with policy, permission, or approval issues',
                    '   • Layout changes, redesign, information architecture (IA) restructuring',
                    '   • Multilingual setup and translation work',
                    '   • Legal, tax, medical, and other high-risk industry content review',
                    '   • Accessibility and security certification (ISMS, etc.) compliance',
                    '③ "Special notes" items in the quotation are not immediately reflected in costs and are confirmed after consultation.',
                ],
            },
            {
                title: 'Article 3 (Schedule and Delivery)',
                content: [
                    '① The overall schedule may vary depending on project start date, material availability, feedback response speed, and external service approval status.',
                    '② Delivery dates may be automatically extended if the client delays material provision, feedback, requirement changes, or external approvals.',
                    '③ Projects with tight schedules do not guarantee confirmed delivery dates without separate agreement.',
                ],
            },
            {
                title: 'Article 4 (Client-Provided Materials and Rights Responsibility)',
                content: [
                    '① The client must provide text, images, videos, logos, trademarks, and information necessary for production within the deadline.',
                    '② All materials provided by the client must legally possess copyright, portrait rights, trademark rights, and license usage rights, and the client is responsible for any related disputes.',
                    '③ Work may be limited if the client does not provide or delays providing access to external accounts (domain, server, payment, SNS, etc.).',
                ],
            },
            {
                title: 'Article 5 (Revision Policy)',
                content: [
                    '① One basic revision provided: Based on deliverables after work completion, unlimited revisions are provided once within the scope of content changes such as text modification, image/video replacement, and deletion.',
                    '② One revision is based on modification requests compiled and submitted once by the client.',
                    '③ Basic revisions apply only to requests received within 7 days from delivery date.',
                    '④ Revision processing period is within 3 business days after receipt in principle, and may vary depending on request volume and external approval requirements.',
                    '⑤ The following are considered scope changes and subject to additional quotation: layout changes, complete style modifications, feature changes and additions.',
                ],
            },
            {
                title: 'Article 6 (Additional Revision Costs)',
                content: [
                    '① Unlimited text/image/video revision 1-time pass: ₩50,000',
                    '② Layout revision and redesign (including 1 meeting): ₩100,000',
                ],
            },
            {
                title: 'Article 7 (Features and External Services)',
                content: [
                    '① When shopping, payment, or transaction features are included, additional costs may occur depending on payment gateway (PG), personal information processing, security level, and server structure, requiring additional consultation.',
                    '② External service integration implementation scope may vary depending on the service\'s policies, fees, and approval procedures.',
                ],
            },
            {
                title: 'Article 8 (Server Maintenance and Domain Costs)',
                content: [
                    '① Server maintenance and domain costs are fixed costs separate from production costs.',
                    '② Server maintenance: ₩150,000/1 year, ₩250,000/2 years, ₩300,000/3 years',
                    '③ Domain costs: New registration ₩30,000/year × years of use / Existing domain transfer (₩30,000/year × years of use) + ₩30,000 transfer fee',
                    '④ When using client-owned servers and domains, the client is responsible for providing related information and configuration.',
                    '⑤ Server and domain costs are settled at actual cost when provider policies change.',
                ],
            },
            {
                title: 'Article 9 (Security and Operation)',
                content: [
                    '① This quotation includes basic security settings that do not cause issues with general search exposure.',
                    '② Advanced security is required for payment, transaction, and sensitive information processing, requiring separate consultation and additional quotation.',
                    '③ The Developer is not responsible for issues arising from the client\'s operation methods (additional plugin installation, account sharing, weak password usage, etc.).',
                ],
            },
            {
                title: 'Article 10 (Inspection and Delivery)',
                content: [
                    '① Deliverables are the website and related outputs produced according to the quotation and agreed scope.',
                    '② The client must conduct inspection within 7 days from delivery date, and may be considered delivery approval if no response within the deadline.',
                    '③ Browser and device compatibility is addressed based on major latest versions.',
                ],
            },
            {
                title: 'Article 11 (Costs and Payment)',
                content: [
                    '① Quotation amount is based on agreed scope, and additional quotation occurs when scope changes.',
                    '② External paid services (plugins, fonts, images, APIs, translation, payment fees, etc.) are the client\'s responsibility.',
                    '③ VAT inclusion follows the quotation.',
                ],
            },
            {
                title: 'Article 12 (Copyright and Deliverable Rights)',
                content: [
                    '① Rights to materials provided by the client belong to the client.',
                    '② Usage rights of production deliverables belong to the client upon payment completion.',
                    '③ Templates, frameworks, common components, and know-how owned by the Developer are the Developer\'s assets, and only usage rights within the project scope are granted to the client.',
                ],
            },
            {
                title: 'Article 13 (Confidentiality)',
                content: [
                    '① Parties shall not disclose the other party\'s non-public information learned during project execution to third parties.',
                    '② Disclosure by law or investigative agency request is an exception.',
                ],
            },
            {
                title: 'Article 14 (Limitation of Liability)',
                content: [
                    '① The Developer does not guarantee the client\'s business outcomes, sales, search rankings, or advertising performance.',
                    '② No responsibility for indirect damages and expected profits; even when the Developer\'s liability is recognized, the liability limit is restricted to the production cost actually paid by the client.',
                ],
            },
            {
                title: 'Article 15 (Contract Change and Termination)',
                content: [
                    '① When scope changes occur during progress, proceed after additional quotation agreement.',
                    '② When a project is suspended or terminated due to client circumstances, costs for work already performed may be subject to settlement depending on the progress stage.',
                    '③ The Developer may suspend work if the client fails to fulfill payment obligations or delays material provision for an extended period.',
                ],
            },
            {
                title: 'Article 16 (Dispute Resolution and Jurisdiction)',
                content: [
                    '① Disputes related to these terms and the quotation shall be interpreted according to the laws of the Republic of Korea, and the court of jurisdiction shall be the court having jurisdiction over the Developer\'s location.',
                ],
            },
        ],
    },
};

/**
 * Get translations for a specific language
 */
export function getTranslations(language: QuoteLanguage): QuoteTranslations {
    return translations[language];
}

/**
 * Format currency based on language
 */
export function formatCurrencyByLanguage(
    amount: number | { min: number; max: number },
    language: QuoteLanguage
): string {
    if (typeof amount === 'number') {
        if (language === 'en') {
            return `₩${new Intl.NumberFormat('en-US').format(amount)}`;
        }
        return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    }

    if (amount.min === amount.max) {
        return formatCurrencyByLanguage(amount.min, language);
    }

    if (language === 'en') {
        return `₩${new Intl.NumberFormat('en-US').format(amount.min)} ~ ₩${new Intl.NumberFormat('en-US').format(amount.max)}`;
    }
    return `${new Intl.NumberFormat('ko-KR').format(amount.min)}원 ~ ${new Intl.NumberFormat('ko-KR').format(amount.max)}원`;
}

/**
 * Format date based on language
 */
export function formatDateByLanguage(dateString: string, language: QuoteLanguage): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    if (language === 'en') {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    }

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}
