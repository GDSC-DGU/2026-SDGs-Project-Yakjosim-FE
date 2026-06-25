import { AlertTriangle, AlertCircle, HelpCircle, CheckCircle, Info, Stethoscope } from 'lucide-react';
import type { Severity } from '@/types';
import { getRiskDisplaySeverity, type RiskDisplaySeverity } from '@/utils/risk';

interface RiskBadgeProps {
  severity: Severity;
  className?: string;
}

const config: Record<
  RiskDisplaySeverity,
  { color: string; icon: React.ElementType; label: string; ariaPrefix: string }
> = {
  critical: {
    color: 'bg-badge-critical-bg text-badge-critical-fg border-badge-critical-border',
    icon: AlertTriangle,
    label: '금기',
    ariaPrefix: '위험',
  },
  caution: {
    color: 'bg-badge-warning-bg text-badge-warning-fg border-badge-warning-border',
    icon: AlertCircle,
    label: '주의',
    ariaPrefix: '주의',
  },
  safe: {
    color: 'bg-badge-safe-bg text-badge-safe-fg border-badge-safe-border',
    icon: CheckCircle,
    label: '안전',
    ariaPrefix: '안전',
  },
  info: {
    color: 'bg-badge-info-bg text-badge-info-fg border-badge-info-border',
    icon: Info,
    label: '참고',
    ariaPrefix: '정보',
  },
  consult: {
    color: 'bg-badge-consult-bg text-badge-consult-fg border-badge-consult-border',
    icon: Stethoscope,
    label: '상담 권장',
    ariaPrefix: '상담 필요',
  },
  unknown: {
    color: 'bg-badge-unknown-bg text-badge-unknown-fg border-badge-unknown-border',
    icon: HelpCircle,
    label: '확인 정보 없음',
    ariaPrefix: '미확인',
  },
};

export function RiskBadge({ severity, className = '' }: RiskBadgeProps) {
  const displaySeverity = getRiskDisplaySeverity(severity);
  const { color, icon: Icon, label, ariaPrefix } = config[displaySeverity];

  return (
    <span
      role="status"
      aria-label={`${ariaPrefix}: ${label}`}
      data-slot="risk-badge"
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${color} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
