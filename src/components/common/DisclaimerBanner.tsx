import { Info } from 'lucide-react';

interface DisclaimerBannerProps {
  className?: string;
}

export function DisclaimerBanner({ className = '' }: DisclaimerBannerProps) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl bg-disclaimer-bg p-4 ${className}`}>
      <Info className="h-4 w-4 shrink-0 text-disclaimer-icon mt-0.5" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-disclaimer-fg">
        이 서비스는 의료 진단을 대체하지 않아요. 복용 관련 결정은 반드시 의사·약사와 상담해 주세요.
      </p>
    </div>
  );
}
