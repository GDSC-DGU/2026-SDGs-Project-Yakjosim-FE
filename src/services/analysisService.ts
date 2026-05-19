import type { AnalysisItem, AnalysisResult, AnalysisSession, Severity } from '@/types';
import { interactionRules } from '@/mock';

const ANALYSIS_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const severityOrder: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  unknown: 0,
};

function getHighestSeverity(results: AnalysisResult[]): Severity {
  if (results.length === 0) return 'unknown';
  return results.reduce<Severity>((highest, r) => {
    return severityOrder[r.severity] > severityOrder[highest] ? r.severity : highest;
  }, 'unknown');
}

export async function analyzeInteractions(
  items: AnalysisItem[],
): Promise<AnalysisSession> {
  await delay(ANALYSIS_DELAY_MS);

  const results: AnalysisResult[] = [];
  let resultIndex = 0;

  // items의 각 쌍에 대해 interaction rules 매칭
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      for (const rule of interactionRules) {
        const matchForward =
          rule.subjectId === a.originalId && rule.objectId === b.originalId;
        const matchReverse =
          rule.subjectId === b.originalId && rule.objectId === a.originalId;

        if (matchForward || matchReverse) {
          resultIndex++;
          results.push({
            id: `result-${resultIndex}`,
            rule,
            severity: rule.severity,
            summary: `${rule.subjectName} + ${rule.objectName}: ${getSeverityLabel(rule.severity)}`,
            explanation: rule.mechanism,
            recommendation: rule.recommendation,
          });
        }
      }
    }
  }

  const session: AnalysisSession = {
    id: `session-${Date.now()}`,
    items,
    results,
    overallSeverity: getHighestSeverity(results),
    createdAt: new Date(),
  };

  return session;
}

export async function getSessionResults(
  sessionId: string,
): Promise<AnalysisSession | null> {
  // mock에서는 세션 저장을 하지 않으므로 null 반환
  await delay(200);
  void sessionId;
  return null;
}

function getSeverityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    critical: '병용금기',
    high: '고위험 주의',
    medium: '시간 간격 필요',
    low: '낮은 주의',
    unknown: '정보 없음',
  };
  return labels[severity];
}
