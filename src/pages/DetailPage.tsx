import { useParams, useNavigate } from 'react-router';
import { AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/app/components/ui/accordion';
import { PageContainer } from '@/components/layout/PageContainer';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { getRiskDisplaySeverity, getRiskSupportTags } from '@/utils/risk';

const interactionTypeLabels: Record<string, string> = {
  contraindication: '병용금기',
  caution: '주의',
  absorption_decrease: '흡수 감소',
  effect_increase: '효과 증가',
  effect_decrease: '효과 감소',
  duplicate: '중복',
};

export default function DetailPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { state } = useAnalysisContext();

  const session = state.currentSession;
  const result = session?.results.find((r) => r.id === resultId);

  if (!result) {
    return (
      <PageContainer title="상세 정보" showBackButton showBottomNav={false}>
        <div className="flex flex-col items-center py-20 animate-fade-in">
          <p className="text-muted-foreground">결과를 찾지 못했어요.</p>
          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => navigate(-1)}>
            뒤로 가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  const rule = result.rule;
  const supportTags = getRiskSupportTags(result);

  return (
    <PageContainer title="상세 정보" showBackButton showBottomNav={false}>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <DisclaimerBanner />
        </div>

        {/* Header card */}
        <div
          className="surface-card p-6 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <p className="text-[22px] font-bold tracking-tight text-foreground">
            {rule.subjectName} + {rule.objectName}
          </p>
          <div className="mt-3">
            <RiskBadge severity={result.severity} className="text-sm px-3 py-1" />
          </div>
        </div>

        {/* Mechanism + Recommendation combined */}
        <div
          className="surface-card overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="p-5">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">위험 이유</p>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-risk-warning-bg">
                <AlertTriangle className="h-4 w-4 text-risk-warning-fg" />
              </div>
              <p className="text-[15px] leading-relaxed text-foreground">{result.explanation}</p>
            </div>
          </div>
          {(supportTags.length > 0 || rule.minIntervalHours) && (
            <div className="border-t border-border/50 px-5 py-5">
              <p className="mb-3.5 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">권고 사항</p>
              <div className="space-y-3">
                {supportTags.map((tag) => (
                  <div key={tag} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-risk-info-bg">
                      <Info className="h-4 w-4 text-risk-info-fg" />
                    </div>
                    <p className="text-[15px] leading-relaxed text-foreground">{tag}</p>
                  </div>
                ))}
              </div>
              {rule.minIntervalHours && (
                <div className="mt-4 rounded-2xl bg-risk-warning-bg p-4">
                  <p className="text-[15px] font-medium text-risk-warning-fg">
                    최소 {rule.minIntervalHours}시간 간격을 두세요
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Evidence accordion */}
        <div
          className="surface-card overflow-hidden animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <Accordion type="single" collapsible>
            <AccordionItem value="evidence" className="border-b-0">
              <AccordionTrigger className="px-5 py-4 text-[15px] font-semibold tracking-tight text-foreground hover:no-underline">
                근거 정보
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <div className="space-y-3 text-[14px]">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground">출처</span>
                    <span className="font-medium text-foreground">{rule.evidenceSource}</span>
                  </div>
                  <div className="h-px bg-border/40" />
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground">성분 (주체)</span>
                    <span className="font-medium text-foreground">{rule.subjectName}</span>
                  </div>
                  <div className="h-px bg-border/40" />
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground">성분 (대상)</span>
                    <span className="font-medium text-foreground">{rule.objectName}</span>
                  </div>
                  <div className="h-px bg-border/40" />
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground">상호작용 유형</span>
                    <span className="font-medium text-foreground">
                      {interactionTypeLabels[rule.interactionType] ?? rule.interactionType}
                    </span>
                  </div>
                  {rule.evidenceUrl && (
                    <>
                      <div className="h-px bg-border/40" />
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-muted-foreground">URL</span>
                        <a
                          href={rule.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          링크
                        </a>
                      </div>
                    </>
                  )}
                  <div className="mt-3 rounded-xl bg-muted p-3">
                    <p className="text-[13px] text-muted-foreground">
                      이 정보는 공공 데이터를 기반으로 해요.
                    </p>
                    {getRiskDisplaySeverity(result.severity) === 'unknown' && (
                      <p className="mt-1.5 text-[13px] font-medium text-risk-warning-fg">
                        "확인 정보 없음"이 "안전함"을 뜻하지 않아요.
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Bottom button */}
        <div
          className="pb-6 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Button
            variant="outline"
            className="w-full rounded-xl py-3 text-[15px] font-semibold border-border/60 text-foreground shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:bg-muted/50"
            onClick={() => navigate(-1)}
          >
            결과 목록으로
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
