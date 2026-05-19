import { AlertTriangle, AlertCircle, Clock, Info, HelpCircle } from 'lucide-react';
import type { Severity } from '@/types';

interface RiskBadgeProps {
  severity: Severity;
  className?: string;
}

const config: Record<
  Severity,
  { color: string; icon: React.ElementType; label: string }
> = {
  critical: {
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: AlertTriangle,
    label: '금기',
  },
  high: {
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: AlertCircle,
    label: '고위험 주의',
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: Clock,
    label: '시간 간격 필요',
  },
  low: {
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    icon: Info,
    label: '낮은 주의',
  },
  unknown: {
    color: 'bg-gray-100 text-gray-500 border-gray-300',
    icon: HelpCircle,
    label: '확인 정보 없음',
  },
};

export function RiskBadge({ severity, className = '' }: RiskBadgeProps) {
  const { color, icon: Icon, label } = config[severity];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color} ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
