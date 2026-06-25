export const ROUTES = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  SEARCH: '/search',
  SEARCH_ADD: '/search/add',
  SEARCH_OCR: '/search/ocr',
  ANALYZE: '/analyze',
  ANALYZE_RESULTS: '/analyze/results',
  ANALYZE_DETAIL: '/analyze/detail',
  ANALYZE_SHARE: '/analyze/share',
  SETTINGS: '/settings',
} as const;

export function analyzeDetailPath(resultId: string) {
  return `${ROUTES.ANALYZE_DETAIL}/${resultId}`;
}

export function analyzeSharePath(sessionId: string) {
  return `${ROUTES.ANALYZE_SHARE}/${sessionId}`;
}
