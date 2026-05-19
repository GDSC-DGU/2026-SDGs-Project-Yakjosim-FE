import { useNavigate } from 'react-router';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionCard } from '@/components/common/SectionCard';
import { MedicineCard } from '@/components/common/MedicineCard';
import { Chip } from '@/components/common/Chip';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { useAnalysis } from '@/hooks/useAnalysis';
import { foods } from '@/mock/foods';
import { supplements } from '@/mock/supplements';

export default function CombinationPage() {
  const navigate = useNavigate();
  const { state: medicineState, dispatch: medicineDispatch } = useMedicineContext();
  const {
    selectedFoods,
    selectedSupplements,
    isAnalyzing,
    error,
    toggleFood,
    toggleSupplement,
    runAnalysis,
  } = useAnalysis();

  const selectedMedicines = medicineState.selectedMedicines;

  const canAnalyze =
    selectedMedicines.length >= 1 &&
    (selectedFoods.length >= 1 ||
      selectedSupplements.length >= 1 ||
      selectedMedicines.length >= 2);

  const handleAnalyze = async () => {
    await runAnalysis();
    navigate('/results');
  };

  return (
    <PageContainer title="조합 선택" showBackButton showBottomNav={false}>
      <div className="space-y-4 pb-24">
        {/* Selected medicines */}
        <SectionCard title="복용 중인 약">
          {selectedMedicines.length === 0 ? (
            <p className="text-sm text-gray-400">
              선택된 약이 없습니다. 약을 추가해 주세요.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedMedicines.map((med) => (
                <MedicineCard
                  key={med.id}
                  medicine={med}
                  onRemove={(id) =>
                    medicineDispatch({ type: 'REMOVE_MEDICINE', payload: id })
                  }
                  selected
                />
              ))}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => navigate('/search')}
          >
            <Plus className="mr-1 h-4 w-4" />
            약 추가
          </Button>
        </SectionCard>

        {/* Food selection */}
        <SectionCard title="함께 먹는 음식">
          <div className="flex flex-wrap gap-2">
            {foods.map((food) => (
              <Chip
                key={food.id}
                label={food.name}
                selected={selectedFoods.some((f) => f.id === food.id)}
                onToggle={() => toggleFood(food)}
                variant="food"
              />
            ))}
          </div>
        </SectionCard>

        {/* Supplement selection */}
        <SectionCard title="복용 중인 영양제">
          <div className="flex flex-wrap gap-2">
            {supplements.map((sup) => (
              <Chip
                key={sup.id}
                label={sup.nameKo}
                selected={selectedSupplements.some((s) => s.id === sup.id)}
                onToggle={() => toggleSupplement(sup)}
                variant="supplement"
              />
            ))}
          </div>
        </SectionCard>

        {/* Error */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-sm text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Bottom fixed button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="mx-auto max-w-lg">
          <Button
            className="w-full"
            size="lg"
            disabled={!canAnalyze || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 중...
              </>
            ) : (
              '상호작용 분석하기'
            )}
          </Button>
          {!canAnalyze && (
            <p className="mt-2 text-center text-xs text-gray-400">
              약 1개 이상 + 음식/영양제 1개 이상 또는 약 2개 이상을 선택하세요
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
