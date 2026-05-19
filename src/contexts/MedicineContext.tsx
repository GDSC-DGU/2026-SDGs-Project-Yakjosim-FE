import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Medicine } from '@/types';

// ── State ──
interface MedicineState {
  selectedMedicines: Medicine[];
  searchResults: Medicine[];
  searchQuery: string;
  isSearching: boolean;
}

const initialState: MedicineState = {
  selectedMedicines: [],
  searchResults: [],
  searchQuery: '',
  isSearching: false,
};

// ── Actions ──
type MedicineAction =
  | { type: 'ADD_MEDICINE'; payload: Medicine }
  | { type: 'REMOVE_MEDICINE'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Medicine[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'CLEAR_SELECTION' };

// ── Reducer ──
function medicineReducer(state: MedicineState, action: MedicineAction): MedicineState {
  switch (action.type) {
    case 'ADD_MEDICINE':
      if (state.selectedMedicines.some((m) => m.id === action.payload.id)) {
        return state;
      }
      return { ...state, selectedMedicines: [...state.selectedMedicines, action.payload] };

    case 'REMOVE_MEDICINE':
      return {
        ...state,
        selectedMedicines: state.selectedMedicines.filter((m) => m.id !== action.payload),
      };

    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };

    case 'CLEAR_SELECTION':
      return { ...state, selectedMedicines: [], searchResults: [], searchQuery: '' };

    default:
      return state;
  }
}

// ── Context ──
interface MedicineContextValue {
  state: MedicineState;
  dispatch: React.Dispatch<MedicineAction>;
}

const MedicineContext = createContext<MedicineContextValue | null>(null);

// ── Provider ──
export function MedicineProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(medicineReducer, initialState);
  return (
    <MedicineContext.Provider value={{ state, dispatch }}>
      {children}
    </MedicineContext.Provider>
  );
}

// ── Hook ──
export function useMedicineContext() {
  const ctx = useContext(MedicineContext);
  if (!ctx) {
    throw new Error('useMedicineContext must be used within MedicineProvider');
  }
  return ctx;
}
