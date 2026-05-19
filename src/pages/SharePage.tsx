import { useNavigate } from 'react-router';
import { Copy, Share2, Image } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import type { Severity } from '@/types';

const severityLabels: Record<Severity, string> = {
  critical: '금기',
  high: '고위험 주의',
  medium: '시간 간격 필요',
  low: '낮은 주의',
  unknown: '확인 정보 없음',
};

export default function SharePage() {
  const navigate = useNavigate();
  const { state } = useAnalysisContext();

  const session = state.currentSession;

  if (!session) {
    return (
      <PageContainer title="결과 공유" showBackButton showBottomNav={false}>
        <div className="flex flex-col items-center py-20">
          <p className="text-gray-400">공유할 결과가 없습니다.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            뒤로 가기
          </Button>
        </div>
      </PageContainer>
    );
  }

  const date = new Date(session.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  const drugCount = session.items.filter((i) => i.type === 'drug').length;
  const foodCount = session.items.filter((i) => i.type === 'food').length;
  const supplementCount = session.items.filter((i) => i.type === 'supplement').length;

  const generateShareText = () => {
    let text = `[약 조심] 약물 상호작용 분석 결과\n`;
    text += `분석 일시: ${dateStr}\n`;
    text += `분석 항목: 약물 ${drugCount}개`;
    if (foodCount > 0) text += `, 음식 ${foodCount}개`;
    if (supplementCount > 0) text += `, 영양제 ${supplementCount}개`;
    text += `\n\n`;

    for (const result of session.results) {
      text += `[${severityLabels[result.severity]}] ${result.rule.subjectName} + ${result.rule.objectName}\n`;
      text += `  ${result.summary}\n`;
      if (result.recommendation) {
        text += `  권고: ${result.recommendation}\n`;
      }
      text += `\n`;
    }

    text += `---\n`;
    text += `본 정보는 의료 진단을 대체하지 않습니다. 복약 관련 결정은 반드시 의사·약사와 상담하세요.\n`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      alert('결과가 클립보드에 복사되었습니다.');
    } catch {
      alert('복사에 실패했습니다. 브라우저 권한을 확인해 주세요.');
    }
  };

  const handleShare = async () => {
    const shareText = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: '약 조심 - 분석 결과',
          text: shareText,
        });
      } catch {
        // User cancelled or error - fallback to copy
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  const handleImageSave = () => {
    alert('이미지 저장 기능은 준비 중입니다.');
  };

  return (
    <PageContainer title="결과 공유" showBackButton showBottomNav={false}>
      <div className="space-y-4">
        {/* Preview card */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900">약 조심</p>
              <p className="text-xs text-gray-400">{dateStr}</p>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                약물 {drugCount}개
                {foodCount > 0 && ` · 음식 ${foodCount}개`}
                {supplementCount > 0 && ` · 영양제 ${supplementCount}개`}
              </p>
            </div>

            <div className="space-y-2">
              {session.results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-start gap-2 rounded-lg bg-gray-50 p-3"
                >
                  <RiskBadge severity={result.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {result.rule.subjectName} + {result.rule.objectName}
                    </p>
                    <p className="text-xs text-gray-500">{result.summary}</p>
                  </div>
                </div>
              ))}
              {session.results.length === 0 && (
                <p className="text-sm text-gray-400">발견된 상호작용이 없습니다.</p>
              )}
            </div>

            <p className="text-xs text-gray-400 border-t pt-3">
              본 정보는 의료 진단을 대체하지 않습니다. 복약 관련 결정은 반드시
              의사·약사와 상담하세요.
            </p>
          </CardContent>
        </Card>

        {/* Share options */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={handleImageSave}>
            <Image className="mr-2 h-4 w-4" />
            이미지로 저장
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCopyText}>
            <Copy className="mr-2 h-4 w-4" />
            텍스트 복사
          </Button>
          <Button className="w-full" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            공유하기
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
