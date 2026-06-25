import { useEffect, useRef, useState } from 'react';
import { Camera, Plus, Check, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ROUTES } from '@/routes';
import { Button } from '@/app/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchInput } from '@/components/common/SearchInput';
import { MedicineCard } from '@/components/common/MedicineCard';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { useMedicineSearch } from '@/hooks/useMedicineSearch';
import { uploadPrescription, type OcrResult } from '@/services/ocrService';
import type { Medicine } from '@/types';

export default function AddMedicinePage() {
  const navigate = useNavigate();
  const { state: medicineState, dispatch: medicineDispatch } = useMedicineContext();
  const { query, results, isSearching, setQuery } = useMedicineSearch();

  useEffect(() => () => { setQuery(''); }, [setQuery]);

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
    <PageContainer title="약 추가" showBackButton showBottomNav={false}>
      <div className="space-y-6 pb-4">
        {medicineState.selectedMedicines.length > 0 && (
          <div className="animate-fade-in space-y-3">
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              분석 목록 ({medicineState.selectedMedicines.length}개)
            </p>
            {medicineState.selectedMedicines.map((med, i) => (
              <div key={med.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <MedicineCard
                  medicine={med}
                  onRemove={(id) => medicineDispatch({ type: 'REMOVE_MEDICINE', payload: id })}
                  selected
                />
              </div>
            ))}
          </div>
        )}

        <div className="animate-fade-in space-y-3" style={{ animationDelay: '0.1s' }}>
          <SearchInput
            value={query}
            onChange={setQuery}
            results={results}
            onSelect={handleSelect}
            isLoading={isSearching}
            placeholder="추가할 약 이름으로 검색"
          />

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
            className="flex w-full items-center gap-2.5 rounded-2xl border border-dashed border-border px-4 py-3 text-[15px] text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground hover:shadow-[var(--shadow-sm)] disabled:opacity-50"
          >
            {ocrLoading
              ? <><Loader2 className="h-4 w-4 animate-spin text-primary" />처방전 인식 중...</>
              : <>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                    <Camera className="h-4 w-4 text-primary" />
                  </div>
                  처방전 촬영으로 추가하기
                </>
            }
          </button>
        </div>

        {ocrError && (
          <div className="animate-fade-in flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
            <p className="text-sm font-medium text-destructive">인식하지 못했어요. 다시 시도해봐요.</p>
          </div>
        )}

        {ocrResults.length > 0 && (
          <div className="animate-slide-up space-y-2">
            <p className="px-1 text-xs font-semibold text-muted-foreground">촬영으로 인식한 약 — 탭해서 추가해요</p>
            <div className="surface-card divide-y divide-border/50 overflow-hidden">
              {ocrResults.map((result, i) => {
                const isAdded = selectedIds.has(result.medicine.id);
                return (
                  <button
                    key={result.medicine.id}
                    type="button"
                    disabled={isAdded}
                    onClick={() => addOcrMedicine(result.medicine)}
                    className={`animate-slide-up flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors ${
                      isAdded ? 'opacity-40' : 'hover:bg-muted/50'
                    }`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-foreground">
                        {result.medicine.productName}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{result.medicine.manufacturer}</p>
                    </div>
                    {isAdded
                      ? <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10"><Check className="h-4 w-4 shrink-0 text-primary" /></div>
                      : <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted"><Plus className="h-4 w-4 shrink-0 text-muted-foreground" /></div>
                    }
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {query && !isSearching && results.length === 0 && (
          <div className="animate-fade-in flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">다른 키워드로 찾아봐요</p>
              <p className="mt-1 text-sm text-muted-foreground">약품명, 제조사, 성분명을 바꿔서 다시 검색해봐요</p>
            </div>
          </div>
        )}

        {!query && medicineState.selectedMedicines.length === 0 && ocrResults.length === 0 && !ocrLoading && (
          <div className="animate-slide-up flex flex-col items-center gap-4 py-20 text-center" style={{ animationDelay: '0.2s' }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Plus className="h-7 w-7 text-primary/60" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">추가할 약을 검색해봐요</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">검색 후 선택하면 분석 목록에 바로 추가돼요</p>
            </div>
          </div>
        )}

        {medicineState.selectedMedicines.length > 0 && (
          <div className="glass sticky bottom-0 -mx-5 border-t border-border/40 p-4">
            <Button className="w-full rounded-2xl py-3 text-[15px] font-semibold shadow-[var(--shadow-sm)]" size="lg" onClick={() => navigate(ROUTES.ANALYZE)}>
              분석 화면으로 돌아가기
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
