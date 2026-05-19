import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

interface DisclaimerBannerProps {
  className?: string;
}

export function DisclaimerBanner({ className = '' }: DisclaimerBannerProps) {
  return (
    <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-xs text-amber-700">
        본 서비스는 의료 진단을 대체하지 않습니다. 복용 관련 결정은 반드시
        의사·약사와 상담하세요.
      </AlertDescription>
    </Alert>
  );
}
