import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { OverlayProvider } from 'overlay-kit';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { MedicineProvider } from '@/contexts/MedicineContext';
import { AnalysisProvider } from '@/contexts/AnalysisContext';
import { UserProvider, useUserContext } from '@/contexts/UserContext';
import { ROUTES } from '@/routes';

const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const AddMedicinePage = lazy(() => import('@/pages/AddMedicinePage'));
const OcrPage = lazy(() => import('@/pages/OcrPage'));
const CombinationPage = lazy(() => import('@/pages/CombinationPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const DetailPage = lazy(() => import('@/pages/DetailPage'));
const SharePage = lazy(() => import('@/pages/SharePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function OnboardingGuard() {
  const { state } = useUserContext();
  if (!state.hasCompletedOnboarding) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }
  return <Outlet />;
}

function OnboardingRedirect() {
  const { state } = useUserContext();
  if (state.hasCompletedOnboarding) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return <OnboardingPage />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public — onboarding */}
      <Route path={ROUTES.ONBOARDING} element={<OnboardingRedirect />} />

      {/* Protected — requires completed onboarding */}
      <Route element={<OnboardingGuard />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* Search flow */}
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
        <Route path={ROUTES.SEARCH_ADD} element={<AddMedicinePage />} />
        <Route path={ROUTES.SEARCH_OCR} element={<OcrPage />} />

        {/* Analysis flow */}
        <Route path={ROUTES.ANALYZE} element={<CombinationPage />} />
        <Route path={`${ROUTES.ANALYZE_RESULTS}`} element={<ResultsPage />} />
        <Route path={`${ROUTES.ANALYZE_DETAIL}/:resultId`} element={<DetailPage />} />
        <Route path={`${ROUTES.ANALYZE_SHARE}/:sessionId`} element={<SharePage />} />

        {/* Settings */}
        <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <OverlayProvider>
        <BrowserRouter>
          <UserProvider>
            <MedicineProvider>
              <AnalysisProvider>
                <Suspense fallback={<PageFallback />}>
                  <AppRoutes />
                </Suspense>
                <Toaster
                  position="top-center"
                  richColors
                  toastOptions={{
                    classNames: {
                      toast: 'surface-elevated border-0',
                      title: 'text-sm font-semibold text-foreground',
                      description: 'text-sm text-muted-foreground',
                    },
                  }}
                />
              </AnalysisProvider>
            </MedicineProvider>
          </UserProvider>
        </BrowserRouter>
      </OverlayProvider>
    </ErrorBoundary>
  );
}
