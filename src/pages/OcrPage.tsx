import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ROUTES } from '@/routes';
import { Camera, Upload, Check, AlertTriangle, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { PageContainer } from '@/components/layout/PageContainer';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { uploadPrescription, type OcrResult } from '@/services/ocrService';

export default function OcrPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dispatch } = useMedicineContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResults, setOcrResults] = useState<OcrResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mode = searchParams.get('mode');
  const isSearchMode = mode === 'search';

  const pageTitle = isSearchMode ? '처방전으로 약 검색' : '처방전 인식';
  const helperText = isSearchMode
    ? '촬영 후 인식된 약을 확인하고 약 정보를 볼 수 있어요.'
    : '촬영 후 인식된 약을 분석 목록에 추가할 수 있어요.';

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('JPG 또는 PNG 이미지 파일만 지원해요.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      const results = await uploadPrescription(file);
      clearInterval(progressInterval);
      setProgress(100);
      setOcrResults(results);
    } catch {
      clearInterval(progressInterval);
      setError('처방전을 인식하지 못했어요. 다시 시도해봐요.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveResult = (index: number) => {
    if (!ocrResults) return;
    setOcrResults(ocrResults.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (!ocrResults) return;

    if (isSearchMode) {
      navigate(ROUTES.SEARCH, {
        replace: true,
        state: {
          recognizedMedicines: ocrResults.map((result) => result.medicine),
          viewedMedicine: ocrResults[0]?.medicine ?? null,
        },
      });
      return;
    }

    for (const result of ocrResults) {
      dispatch({ type: 'ADD_MEDICINE', payload: result.medicine });
    }
    navigate(ROUTES.ANALYZE);
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-risk-safe-bg px-2.5 py-1 text-xs font-semibold text-risk-safe-fg">
          <Check className="h-3 w-3" /> 인식 완료
        </span>
      );
    }
    if (confidence >= 0.7) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-risk-warning-bg px-2.5 py-1 text-xs font-semibold text-risk-warning-fg">
          <AlertTriangle className="h-3 w-3" /> 확인 필요
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-risk-critical-bg px-2.5 py-1 text-xs font-semibold text-risk-critical-fg">
        <AlertTriangle className="h-3 w-3" /> 수정 필요
      </span>
    );
  };

  return (
    <PageContainer title={pageTitle} showBackButton showBottomNav={false}>
      <div className="space-y-6">
        {/* Helper text */}
        <div
          className="animate-fade-in rounded-2xl bg-primary/[0.06] px-5 py-4"
          style={{ animationDelay: '0.1s' }}
        >
          <p className="text-sm leading-relaxed text-primary font-medium">{helperText}</p>
        </div>

        {/* Upload area */}
        {!ocrResults && !isUploading && (
          <div
            className="animate-slide-up flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-border bg-card p-10 text-center transition-colors hover:border-primary/40 shadow-[var(--shadow-sm)]"
            style={{ animationDelay: '0.2s' }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                처방전 또는 약봉투 사진을 업로드해요
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">JPG, PNG 지원</p>
            </div>
            <Button
              variant="outline"
              className="h-12 rounded-xl px-6 text-sm font-semibold shadow-[var(--shadow-sm)]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              파일 선택
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>
        )}

        {/* Loading state */}
        {isUploading && (
          <div
            className="animate-scale-in surface-card flex flex-col items-center gap-5 p-10"
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-[15px] font-semibold text-foreground">인식 중...</p>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">{progress}%</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className="animate-scale-in rounded-2xl bg-risk-critical-bg p-5 shadow-[var(--shadow-sm)]"
          >
            <p className="text-sm font-medium text-risk-critical-fg">{error}</p>
            <Button
              variant="outline"
              className="mt-3 h-10 rounded-xl text-sm font-semibold"
              onClick={() => {
                setError(null);
                fileInputRef.current?.click();
              }}
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* OCR Results */}
        {ocrResults && (
          <>
            <p
              className="animate-fade-in px-1 text-sm font-semibold text-foreground"
              style={{ animationDelay: '0.1s' }}
            >
              인식 결과 ({ocrResults.length}개)
            </p>
            <div className="space-y-3">
              {ocrResults.map((result, index) => (
                <div
                  key={result.medicine.id}
                  className="animate-slide-up surface-card flex items-center justify-between p-4"
                  style={{ animationDelay: `${0.15 + index * 0.06}s` }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[15px] font-semibold text-foreground">
                        {result.medicine.productName}
                      </p>
                      {getConfidenceBadge(result.confidence)}
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {result.medicine.manufacturer}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">
                      신뢰도: {Math.round(result.confidence * 100)}%
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveResult(index)}
                    className="ml-2 h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:bg-risk-critical-bg hover:text-risk-critical-fg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div
              className="animate-slide-up flex gap-3"
              style={{ animationDelay: '0.4s' }}
            >
              <Button
                variant="outline"
                className="h-12 flex-1 rounded-xl text-sm font-semibold shadow-[var(--shadow-sm)]"
                onClick={() => {
                  setOcrResults(null);
                  setProgress(0);
                }}
              >
                다시 촬영
              </Button>
              <Button
                className="h-12 flex-1 rounded-xl text-sm font-semibold shadow-[var(--shadow-sm)]"
                onClick={handleConfirm}
                disabled={ocrResults.length === 0}
              >
                {isSearchMode
                  ? `약 정보 확인 (${ocrResults.length}개)`
                  : `약 목록 확정 (${ocrResults.length}개)`}
              </Button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
