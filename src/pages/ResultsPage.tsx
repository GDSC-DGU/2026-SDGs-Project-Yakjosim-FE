import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, ChevronRight, FileText, Image as ImageIcon, Share2 } from 'lucide-react';
import { ROUTES, analyzeDetailPath, analyzeSharePath } from '@/routes';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { PageContainer } from '@/components/layout/PageContainer';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import type { AnalysisResult } from '@/types';
import {
  getRiskDisplaySeverity,
  getRiskSupportTags,
  type RiskDisplaySeverity,
} from '@/utils/risk';
import {
  downloadSessionAsImage,
  formatSessionDate,
  getSessionFileDatePrefix,
  groupSessionItems,
  saveSessionAsPdf,
} from '@/utils/share';

const tabFilters: {
  value: string;
  label: string;
  severities: RiskDisplaySeverity[] | null;
}[] = [
  { value: 'all', label: '전체', severities: null },
  { value: 'critical', label: '금기', severities: ['critical'] },
  { value: 'caution', label: '주의', severities: ['caution'] },
  { value: 'unknown', label: '확인 정보 없음', severities: ['unknown'] },
];

function countBySeverity(results: AnalysisResult[], severity: RiskDisplaySeverity): number {
  return results.filter((r) => getRiskDisplaySeverity(r.severity) === severity).length;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state: analysisState } = useAnalysisContext();
  const [activeTab, setActiveTab] = useState('all');

  const session = analysisState.currentSession;

  if (!session) {
    return (
      <PageContainer title="분석 결과" showBackButton showBottomNav={false}>
        <div className="flex flex-col items-center py-20 animate-fade-in">
          <p className="text-muted-foreground">아직 분석 결과가 없어요.</p>
          <Button variant="outline" className="mt-4 rounded-xl" onClick={() => navigate(ROUTES.ANALYZE)}>
            분석하러 가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  const currentFilter = tabFilters.find((t) => t.value === activeTab)!;
  const filteredResults = currentFilter.severities
    ? session.results.filter((r) =>
        currentFilter.severities!.includes(getRiskDisplaySeverity(r.severity)),
      )
    : session.results;
  const { drugs, foods, supplements } = groupSessionItems(session);
  const dateStr = formatSessionDate(session.createdAt);
  const totalPairs = (session.items.length * (session.items.length - 1)) / 2;
  const noInfoCount = totalPairs - session.results.length;
  const exportFilePrefix = getSessionFileDatePrefix(session.createdAt);

  const handleImageSave = async () => {
    try {
      await downloadSessionAsImage(session, `${exportFilePrefix}_yak-josim-result.png`);
      toast('이미지 저장을 시작했어요.');
    } catch {
      toast('이미지를 저장하지 못했어요.', {
        description: '브라우저 환경을 확인하고 다시 시도해봐요.',
      });
    }
  };

  const handlePdfSave = () => {
    try {
      saveSessionAsPdf(session, `${exportFilePrefix}_약 조심 분석 결과`);
    } catch {
      toast('PDF를 저장하지 못했어요.', {
        description: '팝업 차단을 확인해봐요.',
      });
    }
  };

  return (
    <PageContainer title="분석 결과" showBackButton showBottomNav={false}>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <DisclaimerBanner />
        </div>

        {/* Summary card */}
        <div
          className="surface-card p-6 animate-slide-up"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-muted-foreground">전체 분석 항목</p>
              <p className="text-[28px] font-bold tracking-tight text-foreground mt-0.5">
                {session.results.length}건
              </p>
            </div>
            <RiskBadge severity={session.overallSeverity} className="text-sm px-3 py-1" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5 text-[13px] text-muted-foreground">
            {(['critical', 'caution'] as RiskDisplaySeverity[]).map((sev) => {
              const count = countBySeverity(session.results, sev);
              if (count === 0) return null;
              return (
                <span
                  key={sev}
                  className={`rounded-full px-2.5 py-0.5 font-medium ${
                    sev === 'critical'
                      ? 'bg-risk-critical-bg text-risk-critical-fg'
                      : 'bg-risk-warning-bg text-risk-warning-fg'
                  }`}
                >
                  {sev === 'critical' ? '금기' : '주의'} {count}개
                </span>
              );
            })}
          </div>
          <div className="mt-5 space-y-3.5 rounded-2xl bg-muted p-4">
            <p className="text-[15px] font-semibold tracking-tight text-foreground">선택 항목</p>
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground tracking-wide">약물 ({drugs.length}개)</p>
              <p className="mt-1 text-[15px] text-foreground">
                {drugs.length > 0 ? drugs.map((item) => item.name).join(', ') : '없음'}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground tracking-wide">음식 ({foods.length}개)</p>
              <p className="mt-1 text-[15px] text-foreground">
                {foods.length > 0 ? foods.map((item) => item.name).join(', ') : '없음'}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-muted-foreground tracking-wide">영양제 ({supplements.length}개)</p>
              <p className="mt-1 text-[15px] text-foreground">
                {supplements.length > 0 ? supplements.map((item) => item.name).join(', ') : '없음'}
              </p>
            </div>
          </div>
        </div>

        {/* 금기 요약 블록 */}
        {countBySeverity(session.results, 'critical') > 0 && (
          <div
            className="space-y-3.5 rounded-[20px] bg-risk-critical-bg p-5 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-risk-critical-bg">
                <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-risk-critical-fg" />
              </div>
              <p className="text-[15px] font-semibold text-risk-critical-fg">
                금기 조합 {countBySeverity(session.results, 'critical')}건을 발견했어요
              </p>
            </div>
            <div className="space-y-2">
              {session.results
                .filter((r) => getRiskDisplaySeverity(r.severity) === 'critical')
                .map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => navigate(analyzeDetailPath(r.id))}
                    className="w-full rounded-xl bg-card px-4 py-3 text-left shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:-translate-y-0.5"
                  >
                    <p className="text-pretty text-[15px] font-medium text-foreground">
                      {r.rule.subjectName} + {r.rule.objectName}
                    </p>
                    <p className="mt-1 flex items-center gap-0.5 text-[13px] font-medium text-risk-critical-fg">
                      자세히 보기 <ChevronRight className="h-3.5 w-3.5" />
                    </p>
                  </button>
                ))}
            </div>
            <p className="text-[13px] font-medium text-risk-critical-fg">지금 바로 의사나 약사에게 상담해 주세요.</p>
          </div>
        )}

        {/* Filter tabs */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: '0.15s' }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full rounded-2xl bg-muted p-1.5">
              {tabFilters.map((tab) => {
                const count = tab.severities
                  ? tab.severities.reduce((sum, sev) => sum + countBySeverity(session.results, sev), 0)
                  : session.results.length;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 gap-1.5 rounded-xl text-[13px] font-medium data-[state=active]:shadow-[var(--shadow-sm)]"
                  >
                    {tab.label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                      activeTab === tab.value
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted-foreground/10 text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabFilters.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {/* Content rendered below */}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Result cards */}
        <div className="space-y-3">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center animate-fade-in">
              <p className="text-[15px] text-muted-foreground">
                해당 카테고리에는 결과가 없어요.
              </p>
            </div>
          ) : (
            filteredResults.map((result, index) => (
              <div
                key={result.id}
                className="surface-card surface-card-hover cursor-pointer p-4 animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                onClick={() => navigate(analyzeDetailPath(result.id))}
              >
                <div className="flex items-center gap-3.5">
                  <RiskBadge severity={result.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-pretty text-[15px] font-medium text-foreground" data-slot="result-pair-name">
                      {result.rule.subjectName} + {result.rule.objectName}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {getRiskSupportTags(result).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-risk-warning-bg px-2.5 py-1 text-[12px] font-medium text-risk-warning-fg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {getRiskDisplaySeverity(result.severity) === 'unknown' && (
                      <p className="mt-1.5 text-[13px] font-medium text-risk-warning-fg">
                        확인 정보 없음이 안전하다는 뜻은 아니에요.
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* No-info summary */}
        {noInfoCount > 0 && (
          <p
            className="text-center text-[13px] text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            이 외 {noInfoCount}개 조합은 확인한 상호작용 정보가 없어요
          </p>
        )}

        {/* Bottom actions */}
        <div
          className="grid grid-cols-3 gap-3 pb-6 animate-slide-up"
          data-slot="export-actions"
          style={{ animationDelay: '0.35s' }}
        >
          <Button
            variant="outline"
            className="w-full rounded-xl border-none bg-muted text-foreground shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:bg-muted/80"
            onClick={handleImageSave}
          >
            <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            이미지 저장
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl border-none bg-muted text-foreground shadow-[var(--shadow-xs)] transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:bg-muted/80"
            onClick={handlePdfSave}
          >
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            PDF 저장
          </Button>
          <Button
            className="w-full rounded-xl shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)]"
            onClick={() => navigate(analyzeSharePath(session.id))}
          >
            <Share2 className="mr-2 h-4 w-4" />
            공유하기
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
