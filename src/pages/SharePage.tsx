import { useNavigate } from 'react-router';
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { getRiskDisplayLabel, getRiskSupportTags } from '@/utils/risk';
import { buildShareText, formatSessionDate, groupSessionItems } from '@/utils/share';

export default function SharePage() {
  const navigate = useNavigate();
  const { state } = useAnalysisContext();

  const session = state.currentSession;

  if (!session) {
    return (
      <PageContainer title="결과 공유" showBackButton showBottomNav={false}>
        <div className="animate-fade-in flex flex-col items-center py-20">
          <p className="text-muted-foreground">공유할 결과가 없어요.</p>
          <Button
            variant="outline"
            className="mt-6 h-12 rounded-xl px-6"
            onClick={() => navigate(-1)}
          >
            뒤로 가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  const date = new Date(session.createdAt);
  const dateStr = formatSessionDate(date);
  const { drugs, foods, supplements } = groupSessionItems(session);
  const shareText = buildShareText(session);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast('결과를 복사했어요.');
    } catch {
      toast('복사하지 못했어요.', {
        description: '브라우저 권한을 확인해봐요.',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '약 조심 - 분석 결과',
          text: shareText,
        });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <PageContainer title="결과 공유" showBackButton showBottomNav={false}>
      <div className="space-y-6">
        {/* Preview card */}
        <div
          className="animate-slide-up surface-card overflow-hidden"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold tracking-tight text-foreground">약 조심</p>
              <p className="text-xs text-muted-foreground">{dateStr}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">선택 항목</p>
              <div className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                <p>약물 ({drugs.length}개): {drugs.length > 0 ? drugs.map((item) => item.name).join(', ') : '없음'}</p>
                <p>음식 ({foods.length}개): {foods.length > 0 ? foods.map((item) => item.name).join(', ') : '없음'}</p>
                <p>영양제 ({supplements.length}개): {supplements.length > 0 ? supplements.map((item) => item.name).join(', ') : '없음'}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {session.results.map((result, i) => (
                <div
                  key={result.id}
                  className="animate-fade-in flex items-start gap-3 rounded-xl bg-muted/50 p-4"
                  style={{ animationDelay: `${0.2 + i * 0.06}s` }}
                >
                  <div className="shrink-0 pt-0.5">
                    <RiskBadge severity={result.severity} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {result.rule.subjectName} + {result.rule.objectName}
                    </p>
                    {getRiskSupportTags(result).length > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-risk-warning-fg">
                        {getRiskSupportTags(result).join(' · ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {session.results.length === 0 && (
                <div className="rounded-xl bg-muted/50 p-4">
                  <p className="text-sm font-semibold text-foreground">확인 정보 없음</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    선택한 조합에 대해 확인한 상호작용 정보가 없어요.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                이 정보는 의료 진단을 대체하지 않아요. 복약 관련 결정은 반드시
                의사·약사와 상담해 주세요.
              </p>
            </div>
          </div>
        </div>

        {/* Share options */}
        <div
          className="animate-slide-up space-y-3"
          style={{ animationDelay: '0.3s' }}
        >
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-sm font-semibold shadow-[var(--shadow-sm)]"
            onClick={handleCopyText}
          >
            <Copy className="mr-2 h-4 w-4" />
            텍스트 복사
          </Button>
          <Button
            className="h-12 w-full rounded-xl text-sm font-semibold shadow-[var(--shadow-sm)]"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-4 w-4" />
            공유하기
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
