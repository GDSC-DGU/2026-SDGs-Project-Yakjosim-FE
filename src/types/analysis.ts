export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unknown';

export type InteractionType =
  | 'contraindication'
  | 'caution'
  | 'absorption_decrease'
  | 'effect_increase'
  | 'effect_decrease'
  | 'duplicate';

export type ItemType = 'drug' | 'food' | 'supplement';

export interface InteractionRuleDef {
  id: string;
  subjectType: ItemType;
  subjectId: string;
  subjectName: string;
  objectType: ItemType;
  objectId: string;
  objectName: string;
  interactionType: InteractionType;
  severity: Severity;
  mechanism: string;
  recommendation: string;
  minIntervalHours?: number;
  evidenceSource: string;
  evidenceUrl?: string;
}

export interface AnalysisItem {
  id: string;
  type: ItemType;
  name: string;
  originalId: string;
}

export interface AnalysisResult {
  id: string;
  rule: InteractionRuleDef;
  severity: Severity;
  summary: string;
  explanation: string;
  recommendation: string;
}

export interface AnalysisSession {
  id: string;
  items: AnalysisItem[];
  results: AnalysisResult[];
  overallSeverity: Severity;
  createdAt: Date;
}
