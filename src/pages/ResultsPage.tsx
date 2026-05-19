import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Save, Share2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { PageContainer } from '@/components/layout/PageContainer';
import { DisclaimerBanner } from '@/components/common/DisclaimerBanner';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { useUserContext } from '@/contexts/UserContext';
import type { Severity, AnalysisResult } from '@/types';

const severityLabels: Record<Severity, string> = {
  critical: '금기',
  high: '고위험',
  medium: '시간간격',
  low: '낮은 주의',
  unknown: '정보없음',
};

const tabFilters: { value: string; label: string; severities: Severity[] | null }[] = [
  { value: 'all', label: '전체', severities: null },
  { value: 'critical', label: '금기', severities: ['critical'] },
  { value: 'caution', label: '주의', severities: ['high', 'low'] },
  { value: 'timing', label: '시간간격', severities: ['medium'] },
  { value: 'unknown', label: '정보없음', severities: ['unknown'] },
];

function countBySeverity(results: AnalysisResult[], severity: Severity): number {
  return results.filter((r) => r.severity === severity).length;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state: analysisState } = useAnalysisContext();
  const { dispatch: userDispatch } = useUserContext();
  const [activeTab, setActiveTab] = useState('all');
  const [saved, setSaved] = useState(false);

  const session = analysisState.currentSession;

  if (!session) {
    return (
      <PageContainer title="분석 결과" showBackButton showBottomNav={false}>
        <div className="flex flex-col items-center py-20">
          <p className="text-gray-400">분석 결과가 없습니다.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/combine')}>
            분석하러 가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  const currentFilter = tabFilters.find((t) => t.value === activeTab)!;
  const filteredResults = currentFilter.severities
    ? session.results.filter((r) => currentFilter.severities!.includes(r.severity))
    : session.results;

  const handleSave = () => {
    userDispatch({ type: 'SAVE_SESSION', payload: session });
    setSaved(true);
  };

  return (
    <PageContainer title="분석 결과" showBackButton showBottomNav={false}>
      <div className="space-y-4">
        <DisclaimerBanner />

        {/* Summary card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">전체 분석 항목</p>
                <p className="text-2xl font-bold text-gray-900">
                  {session.results.length}건
                </p>
              </div>
              <RiskBadge severity={session.overallSeverity} className="text-sm px-3 py-1" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
              {(['critical', 'high', 'medium', 'low', 'unknown'] as Severity[]).map((sev) => {
                const count = countBySeverity(session.results, sev);
                if (count === 0) return null;
                return (
                  <span key={sev}>
                    {severityLabels[sev]} {count}개
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filter tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            {tabFilters.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabFilters.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {/* Content rendered below */}
            </TabsContent>
          ))}
        </Tabs>

        {/* Result cards */}
        <div className="space-y-2">
          {filteredResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              해당 카테고리의 결과가 없습니다.
            </p>
          ) : (
            filteredResults.map((result) => (
              <Card
                key={result.id}
                className="cursor-pointer transition-colors hover:bg-gray-50"
                onClick={() => navigate(`/detail/${result.id}`)}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <RiskBadge severity={result.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">
                      {result.rule.subjectName} + {result.rule.objectName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {result.summary}
                    </p>
                    {(result.severity === 'critical' || result.severity === 'high') && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        의사·약사와 상담하세요
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex gap-2 pb-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleSave}
            disabled={saved}
          >
            <Save className="mr-2 h-4 w-4" />
            {saved ? '저장됨' : '결과 저장'}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/share/${session.id}`)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            공유하기
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
