import { useRef, useState } from 'react';
import { Camera, Pill, ChevronRight, Plus, Check, Loader2, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchInput } from '@/components/common/SearchInput';
import { MedicineCard } from '@/components/common/MedicineCard';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { useMedicineSearch } from '@/hooks/useMedicineSearch';
import { uploadPrescription, type OcrResult } from '@/services/ocrService';
import type { Medicine } from '@/types';

// ── 약 검색 (정보 탐색) ──────────────────────────────────────────
function InfoSearchPage({ onOcr }: { onOcr: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ocrState = location.state as
    | { recognizedMedicines?: Medicine[]; viewedMedicine?: Medicine | null }
    | null;
  const { state: medicineState, dispatch: medicineDispatch } = useMedicineContext();
  const { query, results, isSearching, setQuery } = useMedicineSearch();
  const [viewedMedicine, setViewedMedicine] = useState<Medicine | null>(
    () => ocrState?.viewedMedicine ?? ocrState?.recognizedMedicines?.[0] ?? null,
  );
  const [ocrMedicines, setOcrMedicines] = useState<Medicine[]>(
    () => ocrState?.recognizedMedicines ?? [],
  );

  const handleAddToAnalysis = (medicine: Medicine) => {
    const alreadyAdded = medicineState.selectedMedicines.some((m) => m.id === medicine.id);
    if (alreadyAdded) {
      toast('이미 분석 목록에 있는 약이에요.');
      return;
    }
    medicineDispatch({ type: 'ADD_MEDICINE', payload: medicine });
    toast('분석 목록에 추가했어요.', {
      description: `${medicine.productName}을(를) 조합 분석에 넣었습니다.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          results={results}
          onSelect={(medicine) => { setViewedMedicine(medicine); setQuery(''); }}
          isLoading={isSearching}
          placeholder="약품명, 제조사, 성분명으로 검색"
        />
        <button
          type="button"
          onClick={onOcr}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        >
          <Camera className="h-4 w-4" />
          처방전 촬영으로 검색하기
        </button>
      </div>

      {ocrMedicines.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              촬영으로 인식된 약 ({ocrMedicines.length}개)
            </p>
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-gray-600"
              onClick={() => setOcrMedicines([])}
            >
              닫기
            </button>
          </div>
          {ocrMedicines.map((medicine) => (
            <Card key={medicine.id} className="border-gray-200">
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{medicine.productName}</p>
                  <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setViewedMedicine(medicine)}>
                  정보 보기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewedMedicine ? (
        <Card className="border-gray-200">
          <CardContent className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-gray-900">{viewedMedicine.productName}</p>
                <p className="mt-0.5 text-sm text-gray-500">{viewedMedicine.manufacturer}</p>
              </div>
              <button
                type="button"
                className="shrink-0 text-xs text-gray-400 hover:text-gray-600"
                onClick={() => setViewedMedicine(null)}
              >
                닫기
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">제형</p>
                <p className="mt-1 text-sm text-gray-900">{viewedMedicine.dosageForm}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">구분</p>
                <p className="mt-1 text-sm text-gray-900">{viewedMedicine.classification}</p>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">성분 정보</p>
              <div className="mt-2 space-y-1">
                {viewedMedicine.ingredients.map((ingredient) => (
                  <p key={ingredient.ingredient.id} className="text-sm text-gray-900">
                    {ingredient.ingredient.nameKo} {ingredient.amount}{ingredient.unit}
                    {ingredient.isMain && <span className="ml-1 text-xs text-blue-600">주성분</span>}
                  </p>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={() => handleAddToAnalysis(viewedMedicine)}>
              분석에 추가
            </Button>
          </CardContent>
        </Card>
      ) : !query && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Pill className="h-7 w-7 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">약 이름으로 검색해보세요</p>
            <p className="mt-1 text-xs text-gray-400">성분, 제형 등 상세 정보를 확인할 수 있어요</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/combine')}
            className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            분석 화면으로 이동
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── 약 추가 (분석용 선택) ─────────────────────────────────────────
function AddMedicinePage() {
  const navigate = useNavigate();
  const { state: medicineState, dispatch: medicineDispatch } = useMedicineContext();
  const { query, results, isSearching, setQuery } = useMedicineSearch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
  const [ocrError, setOcrError] = useState(false);

  const selectedIds = new Set(medicineState.selectedMedicines.map((m) => m.id));

  const handleSelect = (medicine: Medicine) => {
    if (selectedIds.has(medicine.id)) {
      toast('이미 추가된 약이에요.');
      return;
    }
    medicineDispatch({ type: 'ADD_MEDICINE', payload: medicine });
    setQuery('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setOcrLoading(true);
    setOcrError(false);
    setOcrResults([]);
    try {
      const results = await uploadPrescription(file);
      setOcrResults(results);
    } catch {
      setOcrError(true);
    } finally {
      setOcrLoading(false);
    }
  };

  const addOcrMedicine = (medicine: Medicine) => {
    if (selectedIds.has(medicine.id)) return;
    medicineDispatch({ type: 'ADD_MEDICINE', payload: medicine });
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 현재 분석 목록 */}
      {medicineState.selectedMedicines.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            분석 목록 ({medicineState.selectedMedicines.length}개)
          </p>
          {medicineState.selectedMedicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onRemove={(id) => medicineDispatch({ type: 'REMOVE_MEDICINE', payload: id })}
              selected
            />
          ))}
        </div>
      )}

      {/* 검색 */}
      <SearchInput
        value={query}
        onChange={setQuery}
        results={results}
        onSelect={handleSelect}
        isLoading={isSearching}
        placeholder="추가할 약 이름으로 검색"
      />

      {/* 촬영 버튼 (인라인) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={ocrLoading}
        className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 disabled:opacity-50"
      >
        {ocrLoading
          ? <><Loader2 className="h-4 w-4 animate-spin" />처방전 인식 중...</>
          : <><Camera className="h-4 w-4" />처방전 촬영으로 추가하기</>
        }
      </button>

      {/* OCR 오류 */}
      {ocrError && (
        <p className="flex items-center gap-1.5 text-sm text-red-500">
          <AlertTriangle className="h-4 w-4" />
          인식에 실패했어요. 다시 시도해 주세요.
        </p>
      )}

      {/* OCR 인식 결과 */}
      {ocrResults.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">촬영으로 인식된 약 — 탭해서 추가하세요</p>
          {ocrResults.map((result) => {
            const isAdded = selectedIds.has(result.medicine.id);
            return (
              <button
                key={result.medicine.id}
                type="button"
                disabled={isAdded}
                onClick={() => addOcrMedicine(result.medicine)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                  isAdded ? 'opacity-40' : 'hover:bg-gray-50'
                }`}
              >
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {result.medicine.productName}
                  </p>
                  <p className="text-xs text-gray-500">{result.medicine.manufacturer}</p>
                </div>
                {isAdded
                  ? <Check className="h-4 w-4 shrink-0 text-blue-500" />
                  : <Plus className="h-4 w-4 shrink-0 text-gray-400" />
                }
              </button>
            );
          })}
        </div>
      )}

      {/* 빈 상태 */}
      {!query && medicineState.selectedMedicines.length === 0 && ocrResults.length === 0 && !ocrLoading && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Plus className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">추가할 약을 검색하세요</p>
            <p className="mt-1 text-xs text-gray-400">검색 후 선택하면 분석 목록에 바로 추가돼요</p>
          </div>
        </div>
      )}

      {/* 하단 CTA */}
      {medicineState.selectedMedicines.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
          <div className="mx-auto max-w-lg">
            <Button className="w-full" size="lg" onClick={() => navigate('/combine')}>
              분석 화면으로 돌아가기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 라우트 진입점 ────────────────────────────────────────────────
export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAddMode = searchParams.get('mode') === 'add';

  return (
    <PageContainer
      title={isAddMode ? '약 추가' : '약 검색'}
      showBackButton
      showBottomNav={!isAddMode}
    >
      {isAddMode
        ? <AddMedicinePage />
        : <InfoSearchPage onOcr={() => navigate('/ocr?mode=search')} />
      }
    </PageContainer>
  );
}
