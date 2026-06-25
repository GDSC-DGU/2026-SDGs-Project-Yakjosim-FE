import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Pill, ShieldCheck, Camera, Sparkles, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { useUserContext } from '@/contexts/UserContext';
import { ROUTES } from '@/routes';
import type { Sex } from '@/types';

const outcomes = [
  {
    icon: Pill,
    title: '먹으려는 약이 안전한지 바로 알 수 있어요',
    description: '약·음식·영양제 조합의 위험 여부를 쉬운 말로 확인해요.',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    icon: Camera,
    title: '처방전 사진 한 장이면 약 정보가 바로 나와요',
    description: '텍스트 검색이 어려우면 촬영으로 약을 찾을 수 있어요.',
    iconBg: 'bg-violet-500/10 text-violet-600',
  },
  {
    icon: ShieldCheck,
    title: '약학정보원 데이터라 믿을 수 있어요',
    description: '식약처 DUR 데이터를 기반으로 안내해요.',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
  },
] as const;

const chronicConditionOptions = [
  '없음', '고혈압', '당뇨', '갑상선', '신장질환', '간질환',
] as const;

const sexOptions: { value: Sex; label: string }[] = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
];

const sexLabelMap: Record<Sex, string> = {
  male: '남성', female: '여성', other: '기타',
};

function getAgeFromBirthDate(birthDate: string): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return null;
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age -= 1;
  return age;
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < current
              ? 'w-6 bg-primary'
              : i === current
                ? 'w-6 bg-primary/40'
                : 'w-1.5 bg-border'
          }`}
        />
      ))}
    </div>
  );
}

function ProfileProgress({ birthDate, sex, chronicConditions, pregnancyStatus }: {
  birthDate: string; sex: string; chronicConditions: string[]; pregnancyStatus: string | null;
}) {
  const filled = [birthDate, sex, chronicConditions.length > 0, pregnancyStatus !== null].filter(Boolean).length;
  return (
    <div className="flex items-center gap-3">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(filled / 4) * 100}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-primary">{filled}/4</span>
    </div>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState<'welcome' | 'profile' | 'preparing'>('welcome');
  const [agreed, setAgreed] = useState(false);
  const [hasTouchedAgreement, setHasTouchedAgreement] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<Sex | ''>('');
  const [pregnancyStatus, setPregnancyStatus] = useState<'pregnant' | 'not_pregnant' | null>(null);
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const { dispatch } = useUserContext();
  const navigate = useNavigate();
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().split('T')[0];

  const isPregnant = pregnancyStatus === 'pregnant';
  const isFormValid = agreed && birthDate.length > 0 && sex.length > 0 && chronicConditions.length > 0 && pregnancyStatus !== null;
  const isMale = sex === 'male';
  const formattedBirthDate = birthDate ? birthDate.split('-').join('. ') : '';
  const sexLabel = sex ? sexLabelMap[sex] : '';
  const pregnancyLabel = pregnancyStatus === 'pregnant' ? '임신 중' : pregnancyStatus === 'not_pregnant' ? '해당 없음' : '';
  const chronicConditionLabel = chronicConditions.join(', ');

  const handleToggleCondition = (condition: string) => {
    setChronicConditions((current) => {
      if (condition === '없음') return current.includes('없음') ? [] : ['없음'];
      const withoutNone = current.filter((item) => item !== '없음');
      return withoutNone.includes(condition)
        ? withoutNone.filter((item) => item !== condition)
        : [...withoutNone, condition];
    });
  };

  const handleStart = (path: string) => {
    const age = getAgeFromBirthDate(birthDate);
    const isElderly = age !== null && age >= 65;
    dispatch({
      type: 'SET_PROFILE',
      payload: {
        birthDate, birthYear: new Date(birthDate).getFullYear(),
        sex: sex || undefined, isPregnant, isElderly, chronicConditions,
      },
    });
    dispatch({ type: 'SET_SENIOR_MODE', payload: isElderly });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigate(path, { replace: true });
  };

  const handleRequestStart = (path: string) => {
    if (!isFormValid) return;
    setPendingPath(path);
  };

  const handleConfirmStart = () => {
    if (!pendingPath) return;
    const targetPath = pendingPath;
    setPendingPath(null);
    setStep('preparing');
    setTimeout(() => handleStart(targetPath), 2000);
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-background px-6 py-8">
        <div className="absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[100px]" />

        <div className="relative mx-auto flex max-w-lg flex-col gap-6">
          {/* ── Logo ──────────────────────────────────────── */}
          <div className="animate-fade-in flex flex-col items-center gap-3 pb-2">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse-ring rounded-2xl bg-primary/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-[var(--shadow-md)]">
                <Pill className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">약 조심</h1>
              <p className="mt-1 text-sm text-muted-foreground">안전한 복약을 위한 상호작용 안내</p>
            </div>
          </div>

          {/* ── Step indicator ────────────────────────────── */}
          {step !== 'preparing' && (
            <StepIndicator current={step === 'welcome' ? 0 : 1} total={2} />
          )}

          {step === 'preparing' ? (
            /* ── Unlock value animation ──────────────────── */
            <div className="animate-scale-in flex flex-col items-center gap-6 py-16">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/15" />
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-[var(--shadow-lg)]">
                  <Sparkles className="h-9 w-9 text-primary-foreground" />
                </div>
              </div>
              <div className="space-y-6 text-center">
                <div>
                  <p className="text-lg font-bold tracking-tight text-foreground">맞춤 안전 분석을 준비하고 있어요</p>
                  <p className="mt-2 text-sm text-muted-foreground">입력한 건강 정보를 기반으로 설정할게요</p>
                </div>
                <div className="mx-auto max-w-[240px] space-y-3">
                  {['건강 프로필 확인', '맞춤 설정 적용', '분석 준비 완료'].map((label, i) => (
                    <div
                      key={label}
                      className="animate-slide-up flex items-center gap-3"
                      style={{ animationDelay: `${0.3 + i * 0.5}s` }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : step === 'welcome' ? (
            <>
              {/* ── Outcome cards (not features!) ────────── */}
              <section className="space-y-3">
                {outcomes.map(({ icon: Icon, title, description, iconBg }, i) => (
                  <div
                    key={title}
                    className="animate-slide-up surface-card flex items-start gap-4 p-5"
                    style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* ── Disclaimer ───────────────────────────── */}
              <div className="animate-slide-up rounded-2xl bg-risk-warning-bg p-4" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => { setHasTouchedAgreement(true); setAgreed(checked === true); }}
                    className="mt-0.5"
                  />
                  <label htmlFor="agree" className="cursor-pointer text-sm leading-relaxed text-risk-warning-fg">
                    이 서비스는 의료 진단이나 처방을 대체하지 않으며, 복약 안전 정보를 안내해요. 약 복용 관련 결정은 반드시 의사·약사와 상담해 주세요.
                  </label>
                </div>
              </div>

              {/* ── CTA ──────────────────────────────────── */}
              <div className="animate-slide-up surface-card space-y-3 p-5" style={{ animationDelay: '0.45s' }}>
                <p className="text-base font-semibold text-foreground">안내에 동의하면 시작할 수 있어요</p>
                <Button onClick={() => setStep('profile')} disabled={!agreed} className="h-[52px] w-full rounded-2xl text-[15px]" size="lg">
                  맞춤 분석 시작하기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                {!agreed && hasTouchedAgreement && (
                  <p className="text-center text-xs text-muted-foreground">위 안내에 동의하면 다음으로 넘어갈 수 있어요.</p>
                )}
              </div>

              {/* ── Human touch ───────────────────────────── */}
              <p className="animate-fade-in text-center text-xs text-muted-foreground/70" style={{ animationDelay: '0.6s' }}>
                약 조심 팀이 안전한 복약을 응원해요
              </p>
            </>
          ) : (
            <>
              {/* ── Profile quiz (reframed) ───────────────── */}
              <div className="animate-scale-in surface-card space-y-6 p-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">맞춤 분석을 위해 몇 가지 확인할게요</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">입력한 정보로 더 정확한 위험도를 안내할 수 있어요.</p>
                </div>

                <ProfileProgress
                  birthDate={birthDate}
                  sex={sex}
                  chronicConditions={chronicConditions}
                  pregnancyStatus={pregnancyStatus}
                />

                <div className="space-y-2">
                  <label htmlFor="birthDate" className="text-sm font-semibold text-foreground">생년월일</label>
                  <Input id="birthDate" type="date" value={birthDate} max={today} onChange={(e) => setBirthDate(e.target.value)} className="h-12 rounded-xl" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">성별</p>
                  <div className="grid grid-cols-3 gap-2">
                    {sexOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={sex === option.value ? 'default' : 'outline'}
                        className="h-12 rounded-xl"
                        onClick={() => { setSex(option.value); if (option.value === 'male') setPregnancyStatus('not_pregnant'); }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">주요 만성질환</p>
                  <div className="flex flex-wrap gap-2">
                    {chronicConditionOptions.map((condition) => {
                      const selected = chronicConditions.includes(condition);
                      return (
                        <Button
                          key={condition}
                          type="button"
                          variant={selected ? 'default' : 'outline'}
                          className="rounded-full"
                          onClick={() => handleToggleCondition(condition)}
                        >
                          {condition}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">임신 여부</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button type="button" variant={pregnancyStatus === 'not_pregnant' ? 'default' : 'outline'} className="h-12 rounded-xl" onClick={() => setPregnancyStatus('not_pregnant')}>
                      해당 없음
                    </Button>
                    <Button type="button" variant={isPregnant ? 'default' : 'outline'} className="h-12 rounded-xl" disabled={isMale} onClick={() => setPregnancyStatus('pregnant')}>
                      임신 중
                    </Button>
                  </div>
                </div>
              </div>

              {/* ── Action buttons ────────────────────────── */}
              <div className="animate-slide-up surface-card space-y-3 p-5" style={{ animationDelay: '0.15s' }}>
                <Button onClick={() => handleRequestStart(ROUTES.ANALYZE)} disabled={!isFormValid} className="h-[52px] w-full rounded-2xl text-[15px]" size="lg">
                  바로 분석하기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button onClick={() => handleRequestStart(ROUTES.HOME)} disabled={!isFormValid} variant="outline" className="h-[52px] w-full rounded-2xl text-[15px]" size="lg">
                  둘러볼게요
                </Button>
                {!isFormValid && (
                  <p className="text-center text-xs text-muted-foreground">모든 항목을 입력하면 시작할 수 있어요.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Confirmation dialog ──────────────────────────── */}
      <Dialog open={pendingPath !== null} onOpenChange={(open) => !open && setPendingPath(null)}>
        <DialogContent className="surface-elevated border-0 p-0">
          <div className="space-y-5 p-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-lg">입력한 정보가 맞나요?</DialogTitle>
              <DialogDescription>확인 후 맞춤 분석을 바로 시작해요.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 rounded-2xl bg-muted/50 p-4">
              {[
                ['생년월일', formattedBirthDate],
                ['성별', sexLabel],
                ['주요 만성질환', chronicConditionLabel],
                ['임신 여부', pregnancyLabel],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                  <span className="text-right text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" className="h-11 rounded-2xl" onClick={() => setPendingPath(null)}>
                수정할게요
              </Button>
              <Button type="button" className="h-11 rounded-2xl" onClick={handleConfirmStart}>
                맞아요
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
