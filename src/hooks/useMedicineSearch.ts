import { useEffect, useCallback } from 'react';
import { useMedicineContext } from '@/contexts/MedicineContext';
import { searchMedicines } from '@/services/medicineService';
import { useDebounce } from './useDebounce';
import type { Medicine } from '@/types';

export function useMedicineSearch() {
  const { state, dispatch } = useMedicineContext();
  const debouncedQuery = useDebounce(state.searchQuery, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      dispatch({ type: 'SET_SEARCHING', payload: false });
      return;
    }

    let cancelled = false;
    dispatch({ type: 'SET_SEARCHING', payload: true });

    searchMedicines(debouncedQuery).then((results) => {
      if (!cancelled) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
        dispatch({ type: 'SET_SEARCHING', payload: false });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, dispatch]);

  const setQuery = useCallback(
    (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      if (query.trim()) {
        dispatch({ type: 'SET_SEARCHING', payload: true });
      }
    },
    [dispatch],
  );

  const selectMedicine = useCallback(
    (medicine: Medicine) => {
      dispatch({ type: 'ADD_MEDICINE', payload: medicine });
      dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    },
    [dispatch],
  );

  const removeMedicine = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_MEDICINE', payload: id });
    },
    [dispatch],
  );

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, [dispatch]);

  return {
    query: state.searchQuery,
    results: state.searchResults,
    isSearching: state.isSearching,
    selectedMedicines: state.selectedMedicines,
    setQuery,
    selectMedicine,
    removeMedicine,
    clearSelection,
  };
}
