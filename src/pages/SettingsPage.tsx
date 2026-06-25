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
  { displaySeverity: 'critical', badgeSeverity: 'critical', description: '절대 함께 복용하면 안 되는 조합이에요.' },
  {
    displaySeverity: 'caution',
    badgeSeverity: 'high',
    description: '시간 간격 조정이나 전문가 상담이 필요한 조합이에요.',
  },
  {
    displaySeverity: 'unknown',
    badgeSeverity: 'unknown',
    description: '상호작용 정보를 확인하지 못했어요. 안전하다는 뜻은 아니에요.',
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
      <div className="space-y-5">
        {/* Accessibility */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <SectionCard title="접근성">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label htmlFor="senior-mode" className="text-sm font-semibold text-foreground">
                  고령층 모드
                </Label>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  글꼴과 터치 영역을 키워 읽기 쉽게 해요
                </p>
              </div>
              <Switch
                id="senior-mode"
                checked={state.seniorMode}
                onCheckedChange={() => dispatch({ type: 'TOGGLE_SENIOR_MODE' })}
              />
            </div>
          </SectionCard>
        </div>

        {/* Risk legend */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <SectionCard title="위험도 범례">
            <div className="space-y-3">
              {riskLevels.map(({ displaySeverity, badgeSeverity, description }, i) => (
                <div
                  key={displaySeverity}
                  className="animate-fade-in flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3"
                  style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                >
                  <RiskBadge severity={badgeSeverity} />
                  <p className="flex-1 text-sm leading-snug text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Service info */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <SectionCard title="서비스 정보">
            <div className="space-y-2">
              <p className="text-[15px] font-semibold text-foreground">약 조심 v1.0</p>
              <p className="text-sm text-muted-foreground">의료 진단을 대체하지 않아요</p>
              <p className="text-xs text-muted-foreground">데이터: 약학정보원, 식약처 DUR</p>
            </div>
          </SectionCard>
        </div>

        {/* Data management */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <SectionCard title="데이터 관리">
            <p className="mb-3 text-sm text-muted-foreground">
              저장한 모든 데이터를 삭제하고 초기 상태로 되돌려요.
            </p>
            <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="h-12 w-full rounded-xl text-sm font-semibold">
                  <Trash2 className="mr-2 h-4 w-4" />
                  모든 데이터 초기화
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="surface-elevated border-0">
                <AlertDialogHeader>
                  <AlertDialogTitle>데이터 초기화</AlertDialogTitle>
                  <AlertDialogDescription>
                    저장한 약, 분석 기록, 건강 정보가 모두 삭제돼요. 되돌릴 수 없어요.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="rounded-xl">초기화</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
}
