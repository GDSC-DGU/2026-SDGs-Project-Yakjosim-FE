import { useEffect, useState } from 'react';
import { Camera, Pill, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/routes';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchInput } from '@/components/common/SearchInput';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { useMedicineSearch } from '@/hooks/useMedicineSearch';
import type { Medicine } from '@/types';

function InfoSearchPage({ onOcr }: { onOcr: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ocrState = location.state as
    | { recognizedMedicines?: Medicine[]; viewedMedicine?: Medicine | null }
    | null;
  const { state: medicineState, dispatch: medicineDispatch } = useMedicineContext();
  const { query, results, isSearching, setQuery } = useMedicineSearch();

  useEffect(() => () => { setQuery(''); }, [setQuery]);

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
      description: `${medicine.productName}을(를) 조합 분석에 넣었어요.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in space-y-3">
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
          className="flex w-full items-center gap-2.5 rounded-2xl border border-dashed border-border px-4 py-3 text-[15px] text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:shadow-[var(--shadow-sm)]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Camera className="h-4 w-4 text-primary" />
          </div>
          처방전 촬영으로 검색하기
        </button>
      </div>

      {ocrMedicines.length > 0 && (
        <div className="animate-slide-up space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[15px] font-semibold tracking-tight text-foreground">
              촬영으로 인식된 약 ({ocrMedicines.length}개)
            </p>
            <button
              type="button"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOcrMedicines([])}
            >
              닫기
            </button>
          </div>
          {ocrMedicines.map((medicine, i) => (
            <div
              key={medicine.id}
              className="animate-slide-up surface-card surface-card-hover flex items-center justify-between gap-3 p-4"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-foreground">{medicine.productName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{medicine.manufacturer}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setViewedMedicine(medicine)}>
                정보 보기
              </Button>
            </div>
          ))}
        </div>
      )}

      {viewedMedicine ? (
        <div className="animate-scale-in surface-card space-y-5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold tracking-tight text-foreground">{viewedMedicine.productName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{viewedMedicine.manufacturer}</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setViewedMedicine(null)}
            >
              닫기
            </button>
          </div>
          {viewedMedicine.indication && (
            <div className="rounded-2xl bg-primary/[0.06] p-4">
              <p className="text-xs font-semibold text-primary">주요 용도</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-foreground">{viewedMedicine.indication}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs font-semibold text-muted-foreground">제형</p>
              <p className="mt-1.5 text-[15px] font-medium text-foreground">{viewedMedicine.dosageForm}</p>
            </div>
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-xs font-semibold text-muted-foreground">구분</p>
              <p className="mt-1.5 text-[15px] font-medium text-foreground">{viewedMedicine.classification}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-muted/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground">성분 정보</p>
            <div className="mt-2.5 space-y-1.5">
              {viewedMedicine.ingredients.map((ingredient) => (
                <p key={ingredient.ingredient.id} className="text-[15px] text-foreground">
                  {ingredient.ingredient.nameKo} {ingredient.amount}{ingredient.unit}
                  {ingredient.isMain && <span className="ml-1.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">주성분</span>}
                </p>
              ))}
            </div>
          </div>
          <Button className="w-full rounded-2xl py-3 text-[15px] font-semibold shadow-[var(--shadow-sm)]" onClick={() => handleAddToAnalysis(viewedMedicine)}>
            분석에 추가
          </Button>
        </div>
      ) : query && !isSearching && results.length === 0 ? (
        <div className="animate-fade-in flex flex-col items-center gap-3 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <Pill className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">다른 키워드로 찾아봐요</p>
            <p className="mt-1 text-sm text-muted-foreground">약품명, 제조사, 성분명을 바꿔서 다시 검색해봐요</p>
          </div>
        </div>
      ) : !query && (
        <div className="animate-slide-up flex flex-col items-center gap-4 py-20 text-center" style={{ animationDelay: '0.15s' }}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Pill className="h-7 w-7 text-primary/60" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-foreground">약 이름으로 검색해봐요</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">성분, 제형 등 상세 정보를 확인할 수 있어요</p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ANALYZE)}
            className="mt-1 flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            분석 화면으로 이동
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();

  return (
    <PageContainer title="약 검색" showBackButton showBottomNav>
      <InfoSearchPage onOcr={() => navigate(`${ROUTES.SEARCH_OCR}?mode=search`)} />
    </PageContainer>
  );
}
