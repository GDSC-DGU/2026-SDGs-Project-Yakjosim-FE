import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/app/components/ui/alert-dialog';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionCard } from '@/components/common/SectionCard';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useUserContext } from '@/contexts/UserContext';
import type { Severity } from '@/types';
import type { RiskDisplaySeverity } from '@/utils/risk';

const riskLevels: { displaySeverity: RiskDisplaySeverity; badgeSeverity: Severity; description: string }[] = [
  { displaySeverity: 'critical', badgeSeverity: 'critical', description: '절대 함께 복용하면 안 되는 조합입니다.' },
  {
    displaySeverity: 'caution',
    badgeSeverity: 'high',
    description: '주의는 high/medium/low 위험도를 대표하며 시간 간격 조정이나 전문가 상담이 필요한 조합입니다.',
  },
  {
    displaySeverity: 'unknown',
    badgeSeverity: 'unknown',
    description: '상호작용 정보가 확인되지 않았습니다. 안전함을 의미하지 않습니다.',
  },
];

export default function SettingsPage() {
  const { state, dispatch } = useUserContext();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <PageContainer title="설정" showBottomNav>
      <div className="space-y-4">
        {/* Accessibility */}
        <SectionCard title="접근성">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="senior-mode" className="text-sm font-medium">
                고령층 모드
              </Label>
              <p className="text-xs text-gray-400">
                글꼴과 터치 영역을 키워 앱 전체를 읽기 쉽게 합니다
              </p>
            </div>
            <Switch
              id="senior-mode"
              checked={state.seniorMode}
              onCheckedChange={() => dispatch({ type: 'TOGGLE_SENIOR_MODE' })}
            />
          </div>
        </SectionCard>

        {/* Risk legend */}
        <SectionCard title="위험도 범례">
          <div className="space-y-3">
            {riskLevels.map(({ displaySeverity, badgeSeverity, description }) => (
              <div key={displaySeverity} className="flex items-start gap-3">
                <RiskBadge severity={badgeSeverity} />
                <p className="flex-1 text-sm text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Service info */}
        <SectionCard title="서비스 정보">
          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-medium">약 조심 v1.0</p>
            <p>본 서비스는 의료 진단을 대체하지 않습니다.</p>
            <p>데이터 출처: 약학정보원, 식품의약품안전처 DUR</p>
          </div>
        </SectionCard>

        {/* Data management */}
        <SectionCard title="데이터 관리">
          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                모든 데이터 초기화
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>데이터 초기화</AlertDialogTitle>
                <AlertDialogDescription>
                  저장된 약, 분석 기록, 건강 정보 등 모든 데이터가 삭제됩니다.
                  이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  초기화
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
