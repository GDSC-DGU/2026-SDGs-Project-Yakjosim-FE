import { useNavigate } from 'react-router';
import { ROUTES } from '@/routes';
import {
  Pill,
  ClipboardList,
  Camera,
  Search,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CircleAlert,
  CircleCheck,
  ChevronRight,
  Heart,
  Users,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { IPhoneMockup, MacBookMockup } from '@/components/common/DeviceMockup';

const riskLevels = [
  { icon: AlertTriangle, label: '금기', bg: 'bg-risk-critical-bg', text: 'text-risk-critical-fg', iconColor: 'text-risk-critical' },
  { icon: CircleAlert, label: '주의', bg: 'bg-risk-warning-bg', text: 'text-risk-warning-fg', iconColor: 'text-risk-warning' },
  { icon: CircleCheck, label: '확인 정보 없음', bg: 'bg-risk-safe-bg', text: 'text-risk-safe-fg', iconColor: 'text-risk-safe' },
] as const;

const riskPreviews = [
  { pair: '아스피린 + 와파린', level: '병용 금기', dot: 'bg-risk-critical', text: 'text-risk-critical-fg' },
  { pair: '타이레놀 + 자몽주스', level: '주의 필요', dot: 'bg-risk-warning', text: 'text-risk-warning-fg' },
  { pair: '비타민C + 오메가3', level: '확인 정보 없음', dot: 'bg-risk-safe', text: 'text-risk-safe-fg' },
  { pair: '메트포르민 + 알코올', level: '병용 금기', dot: 'bg-risk-critical', text: 'text-risk-critical-fg' },
  { pair: '철분제 + 녹차', level: '주의 필요', dot: 'bg-risk-warning', text: 'text-risk-warning-fg' },
  { pair: '오메가3 + 비타민D', level: '확인 정보 없음', dot: 'bg-risk-safe', text: 'text-risk-safe-fg' },
  { pair: '혈압약 + 자몽', level: '병용 금기', dot: 'bg-risk-critical', text: 'text-risk-critical-fg' },
  { pair: '칼슘 + 커피', level: '주의 필요', dot: 'bg-risk-warning', text: 'text-risk-warning-fg' },
];

const features = [
  {
    icon: Search,
    title: '약 이름으로 빠르게 검색',
    description: '약품명, 제조사, 성분명으로 복용 중인 약을 검색해요. 검색 결과에서 약의 주요 성분, 제형, 용도를 한눈에 확인할 수 있어요.',
    image: '/images/feature-search.jpg',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    icon: Camera,
    title: '처방전 촬영으로 간편 등록',
    description: '처방전이나 약봉투 사진을 촬영하면 OCR로 약물을 자동 인식해요. 텍스트 입력이 어려운 고령 사용자도 쉽게 이용할 수 있어요.',
    image: '/images/feature-ocr.jpg',
    iconBg: 'bg-violet-500/10 text-violet-600',
  },
  {
    icon: ShieldCheck,
    title: '전문 데이터 기반 안전 분석',
    description: '약학정보원과 식약처 DUR 데이터를 기반으로, 약·음식·영양제 조합의 상호작용을 금기/주의/확인 정보 없음 3단계로 안내해요.',
    image: '/images/feature-data.jpg',
    iconBg: 'bg-risk-safe-bg text-risk-safe-fg',
  },
];

const steps = [
  { icon: Search, title: '약을 찾거나 추가해요', description: '약 이름으로 검색하거나, 처방전 촬영으로 빠르게 추가해요.' },
  { icon: ClipboardList, title: '함께 먹는 것을 선택해요', description: '음식이나 영양제를 목록에서 빠르게 추가하고 조합해요.' },
  { icon: ShieldCheck, title: '위험도와 가이드를 확인해요', description: '금기, 주의, 확인 정보 없음 결과와 행동 가이드를 확인해요.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageContainer showBottomNav wide>
      <div className="space-y-16 lg:space-y-28">

        {/* ══════════════════════════════════════════════════════
            1. HERO
        ══════════════════════════════════════════════════════ */}
        <section className="animate-fade-in relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary/[0.07] via-background to-blue-400/[0.05] p-6 sm:p-8 lg:p-12 xl:p-14">
          <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-primary/[0.05] blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-400/[0.05] blur-[80px]" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <div className="animate-slide-up inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-semibold text-primary" style={{ animationDelay: '0.1s' }}>
                <Sparkles className="h-3.5 w-3.5" />
                복약 안전 안내 서비스
              </div>

              <div className="animate-slide-up space-y-4" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-[1.75rem] font-bold leading-[1.2] tracking-[-0.025em] text-foreground sm:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem]">
                  지금 먹으려는 조합,
                  <br />
                  <span className="text-primary">먼저 확인</span>해봐요
                </h1>
                <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground lg:text-base">
                  약, 음식, 영양제 조합의 위험 여부를 쉬운 말로 안내해드려요
                </p>
              </div>

              <div className="animate-slide-up flex flex-wrap gap-2" style={{ animationDelay: '0.3s' }}>
                {riskLevels.map(({ icon: Icon, label, bg, text, iconColor }) => (
                  <span key={label} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${bg} ${text}`}>
                    <Icon className={`h-3 w-3 ${iconColor}`} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="animate-slide-up flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '0.4s' }}>
                <Button className="py-4 sm:py-0 sm:!h-[54px] flex-1 rounded-2xl text-base sm:text-[15px] font-semibold shadow-[var(--shadow-md)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:scale-[1.02] sm:max-w-[260px]" size="lg" onClick={() => navigate(ROUTES.ANALYZE)}>
                  바로 분석 시작하기
                  <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Button>
                <Button variant="outline" className="py-4 sm:py-0 sm:!h-[54px] rounded-2xl text-base sm:text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] sm:max-w-[200px]" size="lg" onClick={() => navigate(ROUTES.SEARCH)}>
                  약 검색하기
                </Button>
              </div>
            </div>

            {/* Desktop: auto-scrolling risk ticker */}
            <div className="hidden lg:block">
              <div className="relative h-[280px] overflow-hidden rounded-[20px]">
                <div className="absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
                <div className="flex flex-col gap-3" style={{ animation: 'ticker-scroll 20s linear infinite' }}>
                  {[...riskPreviews, ...riskPreviews].map(({ pair, level, dot, text }, i) => (
                    <div key={`${pair}-${i}`} className="surface-card flex items-center gap-3.5 p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)]">
                      <div className={`h-3 w-3 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{pair}</p>
                        <p className={`text-xs font-medium ${text}`}>{level}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            2. 바로가기 (Quick Actions — moved up)
        ══════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="animate-slide-up space-y-2 px-1" style={{ animationDelay: '0.35s' }}>
            <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">바로가기</h2>
            <p className="text-sm text-muted-foreground lg:text-base">원하는 기능으로 바로 이동해요</p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {[
              { label: '약 검색', desc: '약 이름으로 검색', path: ROUTES.SEARCH, icon: Pill, gradient: 'from-blue-500/8 via-blue-400/4 to-transparent' },
              { label: '처방전 촬영', desc: '사진으로 약 인식', path: ROUTES.SEARCH_OCR, icon: Camera, gradient: 'from-violet-500/8 via-violet-400/4 to-transparent' },
              { label: '조합 분석', desc: '상호작용 확인', path: ROUTES.ANALYZE, icon: ClipboardList, gradient: 'from-amber-500/8 via-amber-400/4 to-transparent' },
              { label: '설정', desc: '고령층 모드 등', path: ROUTES.SETTINGS, icon: ShieldCheck, gradient: 'from-emerald-500/8 via-emerald-400/4 to-transparent' },
            ].map(({ label, desc, path, icon: Icon, gradient }, i) => (
              <button key={path} type="button" className="animate-slide-up surface-card group relative overflow-hidden p-5 text-left transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1 lg:p-6" style={{ animationDelay: `${0.4 + i * 0.06}s` }} onClick={() => navigate(path)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                <div className="relative flex flex-col gap-3">
                  <Icon className="h-6 w-6 text-primary/70 transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            3. 왜 필요한가? (Problem Statement)
        ══════════════════════════════════════════════════════ */}
        <section className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative overflow-hidden rounded-[24px] lg:grid lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] lg:aspect-auto lg:h-full lg:rounded-r-none">
              <img src="/images/hero-pills.jpg" alt="여러 종류의 약" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
            </div>
            <div className="relative -mt-16 mx-4 surface-card p-6 lg:mt-0 lg:mx-0 lg:rounded-l-none lg:shadow-none lg:bg-muted/30 lg:p-10 xl:p-14">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-risk-critical-bg px-3 py-1 text-xs font-semibold text-risk-critical-fg">
                  <Heart className="h-3 w-3" />
                  복약 안전 문제
                </span>
                <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">
                  매년 약물 상호작용으로<br />수천 건의 부작용이 발생해요
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                  여러 약을 함께 복용하거나, 약과 음식·영양제를 함께 먹을 때 예상치 못한 상호작용이 발생할 수 있어요. 특히 고령 환자나 다약제 복용자는 위험이 더 높아요.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    { icon: Users, value: '65세 이상', label: '다약제 복용 비율 높음' },
                    { icon: TrendingUp, value: '약 5종+', label: '동시 복용 시 위험 증가' },
                  ].map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            4. 주요 기능 (Zigzag Layout with Images)
        ══════════════════════════════════════════════════════ */}
        <section className="space-y-8 lg:space-y-10">
          <div className="animate-slide-up space-y-2 px-1 text-center" style={{ animationDelay: '0.55s' }}>
            <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">주요 기능</h2>
            <p className="text-sm text-muted-foreground lg:text-base">복약 안전을 위한 핵심 기능을 제공해요</p>
          </div>

          {features.map(({ icon: Icon, title, description, image, iconBg }, i) => {
            const isReversed = i % 2 === 1;
            return (
              <div
                key={title}
                className={`animate-slide-up flex flex-col gap-6 lg:items-center lg:gap-12 ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-[20px] shadow-[var(--shadow-md)] lg:w-1/2">
                  <img src={image} alt={title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} bg-opacity-90 backdrop-blur-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="lg:w-1/2 lg:py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground lg:text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base lg:leading-relaxed">{description}</p>
                  {i === 0 && (
                    <Button variant="outline" className="mt-5 rounded-xl" onClick={() => navigate(ROUTES.SEARCH)}>
                      약 검색하기 <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  )}
                  {i === 1 && (
                    <Button variant="outline" className="mt-5 rounded-xl" onClick={() => navigate(ROUTES.SEARCH_OCR)}>
                      촬영으로 추가하기 <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  )}
                  {i === 2 && (
                    <Button className="mt-5 rounded-xl" onClick={() => navigate(ROUTES.ANALYZE)}>
                      분석 시작하기 <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* ══════════════════════════════════════════════════════
            5. 이렇게 확인해요 (Steps)
        ══════════════════════════════════════════════════════ */}
        <section className="space-y-6 lg:space-y-8">
          <div className="animate-slide-up space-y-2 px-1 text-center" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">이렇게 확인해요</h2>
            <p className="text-sm text-muted-foreground lg:text-base">3단계로 간편하게 확인할 수 있어요</p>
          </div>

          {/* Mobile: vertical */}
          <div className="relative space-y-4 lg:hidden">
            <div className="absolute bottom-8 left-[23px] top-8 w-px bg-gradient-to-b from-primary/30 via-primary/15 to-transparent" />
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="animate-slide-in-right relative flex gap-5" style={{ animationDelay: `${0.75 + i * 0.1}s` }}>
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[var(--shadow-md)]">{i + 1}</div>
                <div className="surface-card flex-1 p-5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary/60" />
                    <p className="text-[15px] font-semibold text-foreground">{title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="animate-slide-up surface-card group relative p-7 transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1" style={{ animationDelay: `${0.75 + i * 0.1}s` }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[var(--shadow-sm)]">{i + 1}</div>
                  <Icon className="h-5 w-5 text-primary/40 transition-colors group-hover:text-primary/70" />
                </div>
                <div className="mt-5">
                  <p className="text-base font-semibold text-foreground">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background shadow-[var(--shadow-sm)]">
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            6. 어디서든 확인해요 (Device Showcase)
        ══════════════════════════════════════════════════════ */}
        <section className="space-y-6 lg:space-y-8">
          <div className="animate-slide-up space-y-2 px-1 text-center" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">어디서든 확인해요</h2>
            <p className="text-sm text-muted-foreground lg:text-base">모바일과 데스크톱에서 동일한 경험을 제공해요</p>
          </div>

          <div className="animate-slide-up relative hidden lg:block" style={{ animationDelay: '0.85s' }}>
            <div className="flex items-end justify-center gap-6">
              <IPhoneMockup src="/screenshots/mobile-analyze.png" alt="조합 분석 화면" className="-rotate-3 opacity-80 hover:opacity-100 hover:rotate-0 transition-all duration-500" />
              <MacBookMockup src="/screenshots/desktop-home.png" alt="데스크톱 홈 화면" />
              <IPhoneMockup src="/screenshots/mobile-settings.png" alt="설정 화면" className="rotate-3 opacity-80 hover:opacity-100 hover:rotate-0 transition-all duration-500" />
            </div>
          </div>

          <div className="animate-slide-up -mx-5 lg:hidden" style={{ animationDelay: '0.85s' }}>
            <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 scrollbar-none">
              {[
                { src: '/screenshots/mobile-home.png', alt: '홈 화면' },
                { src: '/screenshots/mobile-analyze.png', alt: '조합 분석' },
                { src: '/screenshots/mobile-search.png', alt: '약 검색' },
                { src: '/screenshots/mobile-settings.png', alt: '설정' },
              ].map(({ src, alt }) => (
                <div key={src} className="shrink-0 snap-center">
                  <IPhoneMockup src={src} alt={alt} />
                  <p className="mt-3 text-center text-xs font-medium text-muted-foreground">{alt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            7. Final CTA
        ══════════════════════════════════════════════════════ */}
        <section className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-blue-400/[0.06] p-8 text-center lg:p-12">
            <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-primary/[0.06] blur-[60px]" />
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-blue-400/[0.06] blur-[60px]" />
            <div className="relative space-y-5">
              <h2 className="text-xl font-bold tracking-tight text-foreground lg:text-2xl">복용 조합이 궁금하다면</h2>
              <p className="text-sm text-muted-foreground lg:text-base">지금 바로 약, 음식, 영양제 조합을 분석해봐요</p>
              <Button className="h-[54px] rounded-2xl px-10 text-[15px] font-semibold shadow-[var(--shadow-md)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:scale-[1.02]" size="lg" onClick={() => navigate(ROUTES.ANALYZE)}>
                분석 시작하기
                <ArrowRight className="ml-2 h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            8. Trust Footer
        ══════════════════════════════════════════════════════ */}
        <section className="animate-slide-up" style={{ animationDelay: '0.95s' }}>
          <div className="flex flex-col items-center gap-3 py-2 sm:flex-row sm:justify-center sm:gap-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              약학정보원 데이터 기반
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              식품의약품안전처 DUR
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CircleAlert className="h-3.5 w-3.5" />
              의료 진단을 대체하지 않아요
            </span>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
