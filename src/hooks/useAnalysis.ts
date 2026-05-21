import { useCallback } from 'react';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { analyzeInteractions } from '@/services/analysisService';
import type { AnalysisItem, FoodItem, SupplementIngredient } from '@/types';

export function useAnalysis() {
  const { state: analysisState, dispatch: analysisDispatch } = useAnalysisContext();
  const { state: medicineState } = useMedicineContext();

  const toggleFood = useCallback(
    (food: FoodItem) => {
      analysisDispatch({ type: 'TOGGLE_FOOD', payload: food });
    },
    [analysisDispatch],
  );

  const toggleSupplement = useCallback(
    (supplement: SupplementIngredient) => {
      analysisDispatch({ type: 'TOGGLE_SUPPLEMENT', payload: supplement });
    },
    [analysisDispatch],
  );

  const runAnalysis = useCallback(async () => {
    const items: AnalysisItem[] = [];

    // 선택된 약물 추가
    for (const med of medicineState.selectedMedicines) {
      items.push({
        id: `item-${med.id}`,
        type: 'drug',
        name: med.productName,
        originalId: med.id,
      });
    }

    // 선택된 음식 추가
    for (const food of analysisState.selectedFoods) {
      items.push({
        id: `item-${food.id}`,
        type: 'food',
        name: food.name,
        originalId: food.id,
      });
    }

    // 선택된 영양제 추가
    for (const sup of analysisState.selectedSupplements) {
      items.push({
        id: `item-${sup.id}`,
        type: 'supplement',
        name: sup.nameKo,
        originalId: sup.id,
      });
    }

    const isFoodOnlySelection =
      analysisState.selectedFoods.length > 0 &&
      medicineState.selectedMedicines.length === 0 &&
      analysisState.selectedSupplements.length === 0;

    if (items.length < 2) {
      analysisDispatch({
        type: 'SET_ERROR',
        payload: '분석하려면 최소 2개 이상의 항목을 선택하세요.',
      });
      return false;
    }

    if (isFoodOnlySelection) {
      analysisDispatch({
        type: 'SET_ERROR',
        payload: '음식만으로는 분석할 수 없습니다. 약 또는 영양제를 함께 선택해 주세요.',
      });
      return false;
    }

    analysisDispatch({ type: 'SET_ANALYZING', payload: true });

    try {
      const session = await analyzeInteractions(items);
      analysisDispatch({ type: 'SET_SESSION', payload: session });
      return true;
    } catch {
      analysisDispatch({
        type: 'SET_ERROR',
        payload: '분석 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
      return false;
    }
  }, [medicineState.selectedMedicines, analysisState.selectedFoods, analysisState.selectedSupplements, analysisDispatch]);

  const clearAnalysis = useCallback(() => {
    analysisDispatch({ type: 'CLEAR_ANALYSIS' });
  }, [analysisDispatch]);

  return {
    selectedFoods: analysisState.selectedFoods,
    selectedSupplements: analysisState.selectedSupplements,
    currentSession: analysisState.currentSession,
    isAnalyzing: analysisState.isAnalyzing,
    error: analysisState.error,
    toggleFood,
    toggleSupplement,
    runAnalysis,
    clearAnalysis,
  };
}
