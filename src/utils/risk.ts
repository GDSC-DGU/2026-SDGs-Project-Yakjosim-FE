import type { AnalysisResult, Severity } from '@/types';

export type RiskDisplaySeverity = 'critical' | 'caution' | 'unknown';

export function getRiskDisplaySeverity(severity: Severity): RiskDisplaySeverity {
  if (severity === 'critical') {
    return 'critical';
  }

  if (severity === 'unknown') {
    return 'unknown';
  }

  return 'caution';
}

export function getRiskDisplayLabel(severity: Severity): string {
  const displaySeverity = getRiskDisplaySeverity(severity);

  switch (displaySeverity) {
    case 'critical':
      return '금기';
    case 'caution':
      return '주의';
    case 'unknown':
      return '확인 정보 없음';
  }
}

export function getRiskSupportTags(result: AnalysisResult): string[] {
  const tags: string[] = [];

  if (result.rule.minIntervalHours) {
    tags.push(`${result.rule.minIntervalHours}시간 간격`);
  }

  if (
    result.severity === 'critical' ||
    result.severity === 'high' ||
    result.recommendation.includes('상담')
  ) {
    tags.push('상담 권장');
  }

  return tags;
}

export function needsConsultation(result: AnalysisResult): boolean {
  return getRiskSupportTags(result).includes('상담 권장');
}
