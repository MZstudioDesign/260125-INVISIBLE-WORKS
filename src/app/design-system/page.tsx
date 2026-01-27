'use client';

import { AmbientBackground } from '@/presentation/components/common/AmbientBackground';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassTextarea,
  GlassBadge,
  GlassDivider,
  RevealText,
  SplitText,
  CharacterReveal,
  Skeleton,
  Navigation,
  SideNavigation,
  FloatingCTA,
  ScrollToTop,
  // NEW Section Components
  SplineEmbed,
  DialWheel,
  TimelineBlur,
  GradientHorizon,
  AccordionStep,
  DesignStepContent,
  ImageLightbox,
  StoryQuote,
  CTASection,
  Footer,
} from '@/presentation/components/ui';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check, Mail, Send, Phone, Calendar, MessageCircle, Play } from 'lucide-react';

const navItems = [
  { label: 'Colors', href: '#colors' },
  { label: 'Typography', href: '#typography' },
  { label: 'Cards', href: '#cards' },
  { label: 'Buttons', href: '#buttons' },
  { label: 'Forms', href: '#forms' },
  { label: 'Dividers', href: '#dividers' },
  { label: 'Sections', href: '#sections' },
];

const sideNavSections = [
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'cards', label: 'Cards' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Forms' },
  { id: 'dividers', label: 'Dividers' },
  { id: 'sections', label: 'Section Components' },
];

// Sample data for new components demo
const problemTexts = [
  '도메인', '호스팅', 'SSL인증', '보안', '속도', '구조', '레이아웃',
  '디자인', '콘텐츠', '반응형', '접근성', 'SEO', '퍼포먼스',
  '브라우저호환', '모바일최적화', '유지보수', '업데이트', '백업', '배포', '관리'
];

const timelineItems = [
  { id: '1', text: '전체가 복잡하게 느껴진 진행' },
  { id: '2', text: '왜 필요한지 모르겠던 단계들' },
  { id: '3', text: '결정할 게 너무 많았던 과정' },
  { id: '4', text: '이해하기 어려웠던 질문들' },
  { id: '5', text: '계속 늘어만 났던 수정 사항' },
];

// Design sample images for accordion step 02
const designSampleImages = [
  { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=700&fit=crop', alt: 'Design Sample 1' },
  { src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=700&fit=crop', alt: 'Design Sample 2' },
  { src: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=700&fit=crop', alt: 'Design Sample 3' },
];

const accordionSteps = [
  {
    id: 'step1',
    number: '01',
    title: '내용 전달',
    content: (
      <p className="text-[#1a1a1a]/60 text-lg">
        웹사이트에 들어갈 자료를 전달합니다.
      </p>
    ),
  },
  {
    id: 'step2',
    number: '02',
    title: '디자인 선택',
    content: (
      <DesignStepContent
        description="디자인 시안 3종 중 하나를 선택합니다."
        images={designSampleImages}
        freeEmphasis="여기까지 무료"
        subText="디자인은, 보고 판단하셔도 늦지 않습니다."
      />
    ),
  },
  {
    id: 'step3',
    number: '03',
    title: '웹사이트 완성',
    content: (
      <p className="text-[#1a1a1a]/60 text-lg">
        선택한 디자인으로 웹사이트를 정교하게 완성합니다.
      </p>
    ),
  },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen">
      <AmbientBackground variant="lido" />
      
      {/* Navigation */}
      <Navigation
        items={navItems}
        cta={{ label: '문의하기', href: '#contact' }}
      />
      
      {/* Side Navigation (Desktop) */}
      <SideNavigation sections={sideNavSections} />

      {/* Header */}
      <header className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="blur" className="mb-4">
            <GlassBadge variant="accent" animated>
              <Sparkles className="w-3.5 h-3.5" />
              Design System
            </GlassBadge>
          </RevealText>

          <SplitText
            text="Invisible Works Component Library"
            className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-tight mb-6"
            staggerDelay={0.05}
          />

          <RevealText variant="fade" delay={0.4}>
            <p className="text-xl text-[#1a1a1a]/60 max-w-2xl leading-relaxed">
              Liquid Glass 스타일의 투명하고 신뢰감 있는 컴포넌트 시스템.
              물처럼 자연스럽게 흐르는 인터페이스.
            </p>
          </RevealText>
        </div>
      </header>

      <GlassDivider variant="wave" />

      {/* Color Palette Section */}
      <section id="colors" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Color Palette</h2>
            <p className="text-[#1a1a1a]/50">브랜드의 투명함을 표현하는 컬러 시스템</p>
          </RevealText>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Pure White', color: '#FFFFFF', border: true },
              { name: 'Soft Blue', color: '#f2f8fc' },
              { name: 'Muted Aqua', color: '#7fa8c9' },
              { name: 'Dark Gray', color: '#1a1a1a' },
              { name: 'Pure Black', color: '#000000' },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <div
                  className={`aspect-square rounded-2xl shadow-lg ${
                    item.border ? 'border border-gray-200' : ''
                  }`}
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                  <p className="text-xs text-[#1a1a1a]/50 font-mono">{item.color}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlassDivider variant="line" className="max-w-5xl mx-auto" />

      {/* Typography Section */}
      <section id="typography" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Typography & Animation</h2>
            <p className="text-[#1a1a1a]/50">스크롤에 따라 자연스럽게 드러나는 텍스트</p>
          </RevealText>

          <div className="space-y-12">
            {/* Reveal Text Variants */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-[#1a1a1a]/70">RevealText Variants</h3>

              <GlassCard className="p-8" hover={false}>
                <div className="space-y-6">
                  <div>
                    <span className="text-xs text-[#7fa8c9] font-mono mb-2 block">variant="fade" (호버해보세요)</span>
                    <RevealText variant="fade" replayOnHover>
                      <p className="text-2xl text-[#1a1a1a]">페이드로 자연스럽게 등장합니다.</p>
                    </RevealText>
                  </div>

                  <div>
                    <span className="text-xs text-[#7fa8c9] font-mono mb-2 block">variant="slide" (호버해보세요)</span>
                    <RevealText variant="slide" replayOnHover>
                      <p className="text-2xl text-[#1a1a1a]">좌측에서 슬라이드로 등장합니다.</p>
                    </RevealText>
                  </div>

                  <div>
                    <span className="text-xs text-[#7fa8c9] font-mono mb-2 block">variant="blur" (호버해보세요)</span>
                    <RevealText variant="blur" replayOnHover>
                      <p className="text-2xl text-[#1a1a1a]">블러가 풀리며 선명해집니다.</p>
                    </RevealText>
                  </div>

                  <div>
                    <span className="text-xs text-[#7fa8c9] font-mono mb-2 block">variant="mask" (호버해보세요)</span>
                    <RevealText variant="mask" replayOnHover>
                      <p className="text-2xl text-[#1a1a1a]">마스크가 벗겨지며 드러납니다.</p>
                    </RevealText>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Split Text */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-[#1a1a1a]/70">SplitText</h3>

              <GlassCard className="p-8" hover={false}>
                <span className="text-xs text-[#7fa8c9] font-mono mb-4 block">단어별 순차 등장 (호버해보세요)</span>
                <SplitText
                  text="우리는 처음부터 다 보여주지 않습니다"
                  className="text-3xl text-[#1a1a1a] font-light"
                  replayOnHover
                />
              </GlassCard>
            </div>

            {/* Character Reveal */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium text-[#1a1a1a]/70">CharacterReveal</h3>

              <GlassCard className="p-8" hover={false}>
                <span className="text-xs text-[#7fa8c9] font-mono mb-4 block">글자별 순차 등장 (호버해보세요)</span>
                <CharacterReveal
                  text="Invisible Works"
                  className="text-4xl text-[#1a1a1a] font-semibold tracking-tight"
                  replayOnHover
                />
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <GlassDivider variant="dots" />

      {/* Glass Cards Section */}
      <section id="cards" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Glass Card</h2>
            <p className="text-[#1a1a1a]/50">투명하고 깊이감 있는 카드 컴포넌트</p>
          </RevealText>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-8">
              <GlassBadge variant="accent" className="mb-4">Bordered</GlassBadge>
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-2">글래스 카드</h3>
              <p className="text-[#1a1a1a]/60">
                흰색 배경과 아쿠아 보더로 브랜드 아이덴티티를 강조합니다.
                호버 시 살짝 떠오르는 인터랙션이 있습니다.
              </p>
            </GlassCard>

            <GlassCard className="p-8" hover={false}>
              <GlassBadge variant="outline" className="mb-4">hover={false}</GlassBadge>
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-2">정적 카드</h3>
              <p className="text-[#1a1a1a]/60">
                호버 효과를 비활성화하여 폼이나 콘텐츠 영역으로 사용할 수 있습니다.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <GlassDivider variant="gradient" />

      {/* Buttons Section */}
      <section id="buttons" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Glass Buttons</h2>
            <p className="text-[#1a1a1a]/50">클릭 시 리플 효과가 있는 글래스 버튼</p>
          </RevealText>

          <GlassCard className="p-8" hover={false}>
            <div className="space-y-8">
              {/* Variants */}
              <div>
                <h3 className="text-sm font-medium text-[#1a1a1a]/70 mb-4">Variants (클릭해보세요)</h3>
                <div className="flex flex-wrap gap-4">
                  <GlassButton variant="outline">
                    Outline
                  </GlassButton>
                  <GlassButton variant="accent">
                    Accent
                  </GlassButton>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-sm font-medium text-[#1a1a1a]/70 mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <GlassButton variant="outline" size="sm">
                    Small
                  </GlassButton>
                  <GlassButton variant="outline" size="md">
                    Medium
                  </GlassButton>
                  <GlassButton variant="outline" size="lg">
                    Large
                  </GlassButton>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-sm font-medium text-[#1a1a1a]/70 mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <GlassButton variant="outline">
                    다음 단계
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                  <GlassButton variant="accent">
                    <Check className="w-4 h-4" />
                    완료
                  </GlassButton>
                  <GlassButton variant="outline">
                    <Mail className="w-4 h-4" />
                    문의하기
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <GlassDivider variant="line" className="max-w-5xl mx-auto" />

      {/* Form Elements Section */}
      <section id="forms" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Form Elements</h2>
            <p className="text-[#1a1a1a]/50">투명한 입력 필드들</p>
          </RevealText>

          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="p-8" hover={false}>
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-6">Contact Form</h3>
              <div className="space-y-5">
                <GlassInput label="이름" placeholder="홍길동" />
                <GlassInput label="이메일" placeholder="hello@example.com" type="email" />
                <GlassTextarea label="메시지" placeholder="프로젝트에 대해 알려주세요..." />
                <GlassButton variant="accent" className="w-full justify-center">
                  메시지 보내기
                  <Send className="w-4 h-4" />
                </GlassButton>
              </div>
            </GlassCard>

            <div className="space-y-6">
              <GlassCard className="p-6" hover={false}>
                <h4 className="text-sm font-medium text-[#1a1a1a]/70 mb-4">Input States</h4>
                <div className="space-y-4">
                  <GlassInput placeholder="기본 상태" />
                  <GlassInput placeholder="에러 상태" error="올바른 이메일을 입력해주세요" />
                </div>
              </GlassCard>

              <GlassCard className="p-6" hover={false}>
                <h4 className="text-sm font-medium text-[#1a1a1a]/70 mb-4">Skeleton Loading</h4>
                <div className="space-y-3">
                  <Skeleton width="100%" height={16} />
                  <Skeleton width="85%" height={16} />
                  <Skeleton width="70%" height={16} />
                </div>
              </GlassCard>

              <GlassCard className="p-6" hover={false}>
                <h4 className="text-sm font-medium text-[#1a1a1a]/70 mb-4">Badges</h4>
                <div className="flex flex-wrap gap-3">
                  <GlassBadge variant="accent">Accent</GlassBadge>
                  <GlassBadge variant="outline">Outline</GlassBadge>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <GlassDivider variant="wave" />

      {/* Dividers Section */}
      <section id="dividers" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Dividers</h2>
            <p className="text-[#1a1a1a]/50">섹션을 구분하는 다양한 방식</p>
          </RevealText>

          <GlassCard className="p-8 space-y-12" hover={false}>
            <div>
              <span className="text-xs text-[#7fa8c9] font-mono mb-4 block">variant="line"</span>
              <GlassDivider variant="line" />
            </div>

            <div>
              <span className="text-xs text-[#7fa8c9] font-mono mb-4 block">variant="dots"</span>
              <GlassDivider variant="dots" />
            </div>

            <div>
              <span className="text-xs text-[#7fa8c9] font-mono mb-4 block">variant="wave"</span>
              <GlassDivider variant="wave" />
            </div>

            <div>
              <span className="text-xs text-[#7fa8c9] font-mono mb-4 block">variant="gradient"</span>
              <GlassDivider variant="gradient" />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ========== NEW SECTION COMPONENTS ========== */}
      <GlassDivider variant="gradient" />

      <section id="sections" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealText variant="slide" className="mb-12">
            <GlassBadge variant="accent" className="mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              NEW
            </GlassBadge>
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-2">Section Components</h2>
            <p className="text-[#1a1a1a]/50">페이지 섹션 구성을 위한 새로운 컴포넌트들</p>
          </RevealText>

          {/* 1. SplineEmbed */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">SplineEmbed</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">Hero 섹션용 Spline 3D 임베드 (풀 뷰포트)</p>
            <GlassCard className="p-6" hover={false}>
              <div className="bg-gradient-to-b from-[#f2f8fc] to-white rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-[#7fa8c9]/40 mx-auto mb-3" />
                  <p className="text-[#1a1a1a]/40 text-sm">Spline 3D Scene</p>
                  <p className="text-[#7fa8c9] text-xs mt-1 font-mono">100vw × 100vh</p>
                </div>
              </div>
              <p className="text-xs text-[#7fa8c9] font-mono mt-4">
                {'<SplineEmbed url="https://my.spline.design/..." />'}
              </p>
            </GlassCard>
          </div>

          {/* 2. DialWheel - 3D 원통형 회전 텍스트 */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">DialWheel</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">3D 원통형 회전 텍스트 - 하스스톤 매칭 스타일 룰렛</p>
            
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">&quot;웹사이트는 신경쓸 게 많다&quot; - 7개 표시, 선명한 투명도</p>
              <div className="rounded-2xl overflow-hidden bg-black p-8">
                <DialWheel />
              </div>
            </div>
            
            <div className="bg-[#f2f8fc] rounded-xl p-4 text-sm text-[#1a1a1a]/70">
              <p className="font-medium mb-2">특징:</p>
              <ul className="text-xs space-y-1 ml-4 list-disc">
                <li>5개 표시 (위 2개 + 가운데 + 아래 2개)</li>
                <li>부드러운 스크롤 애니메이션</li>
                <li>선명한 투명도 (offset별 점진적 감소)</li>
                <li>최소 블러 (0.5px 단위)</li>
              </ul>
            </div>
          </div>

          {/* 3. TimelineBlur */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">TimelineBlur</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">Change 섹션용 타임라인 (마우스 호버 시 취소선 효과)</p>
            <GlassCard className="p-6" hover={false}>
              <TimelineBlur items={timelineItems} className="py-4" />
              <p className="text-xs text-[#7fa8c9] font-mono mt-4">
                마우스를 올리면 키컬러 취소선이 생기며 연해지는 연출 (호버해보세요)
              </p>
            </GlassCard>
          </div>

          {/* 4. GradientHorizon - 7가지 도형 기반 시안 */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">GradientHorizon Variants</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">도형 기반 섹션 전환 효과 - 해가 뜨는 느낌의 블러 타원/오브</p>
            
            {/* Variant 1: Ellipse Glow (긴 타원 글로우) */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;ellipseGlow&quot; - 지평선에 가로로 긴 블러 타원 ✅ 기본</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="ellipseGlow" height="280px" />
              </div>
            </div>

            {/* Variant 2: Orb Float (떠오르는 오브) */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;orbFloat&quot; - 부드럽게 떠오르는 구체</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="orbFloat" height="280px" />
              </div>
            </div>

            {/* Variant 3: Radial Burst (방사형 빛) */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;radialBurst&quot; - 지평선에서 퍼지는 빛줄기</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="radialBurst" height="280px" />
              </div>
            </div>

            {/* Variant 4: Dual Orb (이중 오브) */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;dualOrb&quot; - 두 개의 오브가 겹치는 효과</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="dualOrb" height="280px" />
              </div>
            </div>

            {/* Variant 5: Soft Horizon (부드러운 수평선) */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;softHorizon&quot; - 미니멀 수평 그라데이션</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="softHorizon" height="280px" />
              </div>
            </div>

            {/* Variant 6: Wave Glow (물결 글로우) */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;waveGlow&quot; - 물결치는 레이어드 글로우</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="waveGlow" height="280px" />
              </div>
            </div>

            {/* Variant 7: Cosmic Rise (우주적 일출) - 직접 제작 */}
            <div className="mb-6">
              <p className="text-xs text-[#7fa8c9] font-mono mb-3">variant=&quot;cosmicRise&quot; - 우주에서 해가 뜨는 느낌 ⭐ 직접 제작</p>
              <div className="rounded-2xl overflow-hidden border border-[#7fa8c9]/20">
                <GradientHorizon variant="cosmicRise" height="280px" />
              </div>
            </div>
          </div>

          {/* 5. AccordionStep */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">AccordionStep</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">How We Do 섹션용 아코디언 스텝</p>
            <GlassCard className="p-6" hover={false}>
              <AccordionStep items={accordionSteps} />
            </GlassCard>
          </div>

          {/* 6. ImageLightbox */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">ImageLightbox</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">클릭 시 확대되는 이미지 (디자인 시안 미리보기용)</p>
            <div className="grid grid-cols-3 gap-4">
              <ImageLightbox
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop"
                alt="Design Sample 1"
                aspectRatio="portrait"
              />
              <ImageLightbox
                src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=600&fit=crop"
                alt="Design Sample 2"
                aspectRatio="portrait"
              />
              <ImageLightbox
                src="https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=600&fit=crop"
                alt="Design Sample 3"
                aspectRatio="portrait"
              />
            </div>
          </div>

          {/* 7. StoryQuote - Why We Work */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">StoryQuote</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">Why We Work 섹션용 타이포그래피</p>
            <GlassCard className="p-12" hover={false}>
              <StoryQuote
                title="Why We Work"
                lines={[
                  { text: '웹사이트는 필요하다고들 말합니다.' },
                  { text: '하지만 비용과 복잡함 앞에서', muted: true },
                  { text: '시작조차 못 하는 경우를 너무 많이 봤습니다.', muted: true },
                  { text: '우리는 Invisible Works입니다.', highlight: 'Invisible Works' },
                ]}
              />
            </GlassCard>
          </div>

          {/* 8. CTASection - Full-width 텍스트 */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">CTASection</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">Full-width 텍스트 CTA (가운데 정렬, 모바일 두 줄)</p>
            <GlassCard className="p-4" hover={false}>
              <CTASection
                text="내 웹사이트 디자인 보러 가기"
                href="#"
                variant="light"
              />
            </GlassCard>
          </div>

          {/* 9. Footer (CTA + 3등분 레이아웃) */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-[#1a1a1a]/70 mb-4">Footer</h3>
            <p className="text-[#1a1a1a]/50 text-sm mb-6">흰색 CTA + 좌측 텍스트 | 중앙 로고 | 우측 텍스트</p>
            <div className="rounded-2xl overflow-hidden">
              <Footer />
            </div>
          </div>
        </div>
      </section>

      {/* Design System Footer */}
      <footer id="contact" className="py-16 px-6 border-t border-[#7fa8c9]/10">
        <div className="max-w-5xl mx-auto text-center">
          <RevealText variant="blur">
            <p className="text-[#1a1a1a]/40 text-sm">
              Invisible Works Design System — Built with Next.js, Tailwind CSS, Framer Motion
            </p>
          </RevealText>
        </div>
      </footer>
      
      {/* Floating CTA */}
      <FloatingCTA
        label="문의하기"
        icon={<MessageCircle className="w-5 h-5" />}
        expandItems={[
          {
            icon: <Phone className="w-4 h-4 text-[#7fa8c9]" />,
            label: '전화 상담',
            onClick: () => {},
          },
          {
            icon: <Mail className="w-4 h-4 text-[#7fa8c9]" />,
            label: '이메일 문의',
            onClick: () => {},
          },
          {
            icon: <Calendar className="w-4 h-4 text-[#7fa8c9]" />,
            label: '미팅 예약',
            onClick: () => {},
          },
        ]}
      />
      
      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}
