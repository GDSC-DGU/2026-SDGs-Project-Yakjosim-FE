import type { AnalysisItem, AnalysisResult, AnalysisSession, Severity, InteractionRuleDef } from '@/types';
import { apiFetch } from './api';
import { interactionRules } from '@/mock';
import { getRiskDisplayLabel, getRiskDisplaySeverity } from '@/utils/risk';

interface ApiAnalyzeItem {
  type: 'drug' | 'food' | 'supplement';
  productId?: string | null;
  foodId?: string | null;
  supplementIngredientId?: string | null;
}

interface ApiInteractionResult {
  severity: string;
  combination: string[];
  interactionType: string;
  summary: string;
  explanation: string;
  recommendation: string;
  source: string;
  disclaimer?: string;
}

interface ApiAnalyzeResponse {
  overallSeverity: string;
  results: ApiInteractionResult[];
}

function mapSeverity(s: string): Severity {
  const map: Record<string, Severity> = {
    critical: 'critical', high: 'high', medium: 'medium', low: 'low', unknown: 'unknown',
    contraindication: 'critical', caution: 'medium', safe: 'low',
  };
  return map[s.toLowerCase()] ?? 'unknown';
}

function toAnalysisResult(r: ApiInteractionResult, index: number): AnalysisResult {
  const severity = mapSeverity(r.severity);
  const rule: InteractionRuleDef = {
    id: `api-rule-${index}`,
    subjectType: 'drug',
    subjectId: r.combination[0] ?? '',
    subjectName: r.combination[0] ?? '',
    objectType: 'drug',
    objectId: r.combination[1] ?? '',
    objectName: r.combination[1] ?? '',
    interactionType: (r.interactionType as InteractionRuleDef['interactionType']) ?? 'caution',
    severity,
    mechanism: r.explanation,
    recommendation: r.recommendation,
    evidenceSource: r.source,
  };

  return {
    id: `result-${index + 1}`,
    rule,
    severity,
    summary: r.summary,
    explanation: r.explanation,
    recommendation: r.recommendation,
  };
}

function toApiItem(item: AnalysisItem): ApiAnalyzeItem {
  const base: ApiAnalyzeItem = { type: item.type };
  if (item.type === 'drug') base.productId = item.originalId;
  else if (item.type === 'food') base.foodId = item.originalId;
  else if (item.type === 'supplement') base.supplementIngredientId = item.originalId;
  return base;
}

const severityOrder: Record<Severity, number> = {
  critical: 4, high: 3, medium: 2, low: 1, unknown: 0,
};

function getHighestSeverity(results: AnalysisResult[]): Severity {
  if (results.length === 0) return 'unknown';
  return results.reduce<Severity>((highest, r) => {
    const current = getRiskDisplaySeverity(r.severity) === 'caution' ? 'high' : r.severity;
    const previous = getRiskDisplaySeverity(highest) === 'caution' ? 'high' : highest;
    return severityOrder[current] > severityOrder[previous] ? r.severity : highest;
  }, 'unknown');
}

function mockAnalyze(items: AnalysisItem[]): AnalysisSession {
  const results: AnalysisResult[] = [];
  let resultIndex = 0;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      for (const rule of interactionRules) {
        const matchForward = rule.subjectId === a.originalId && rule.objectId === b.originalId;
        const matchReverse = rule.subjectId === b.originalId && rule.objectId === a.originalId;
        if (matchForward || matchReverse) {
          resultIndex++;
          results.push({
            id: `result-${resultIndex}`,
            rule,
            severity: rule.severity,
            summary: `${rule.subjectName} + ${rule.objectName}: ${getRiskDisplayLabel(rule.severity)}`,
            explanation: rule.mechanism,
            recommendation: rule.recommendation,
          });
        }
      }
    }
  }

  return {
    id: `session-${Date.now()}`,
    items,
    results,
    overallSeverity: getHighestSeverity(results),
    createdAt: new Date(),
  };
}

export async function analyzeInteractions(
  items: AnalysisItem[],
): Promise<AnalysisSession> {
  try {
    const apiItems = items.map(toApiItem);
    const data = await apiFetch<ApiAnalyzeResponse>('/interactions/analyze', {
      method: 'POST',
      body: JSON.stringify({ items: apiItems }),
    });

    if (data.results.length > 0) {
      const results = data.results.map(toAnalysisResult);
      return {
        id: `session-${Date.now()}`,
        items,
        results,
        overallSeverity: mapSeverity(data.overallSeverity),
        createdAt: new Date(),
      };
    }

    return mockAnalyze(items);
  } catch {
    return mockAnalyze(items);
  }
}

export async function getSessionResults(
  _sessionId: string,
): Promise<AnalysisSession | null> {
  return null;
}
