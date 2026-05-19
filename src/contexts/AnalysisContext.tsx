import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { FoodItem, SupplementIngredient, AnalysisSession } from '@/types';

// ── State ──
interface AnalysisState {
  selectedFoods: FoodItem[];
  selectedSupplements: SupplementIngredient[];
  currentSession: AnalysisSession | null;
  isAnalyzing: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  selectedFoods: [],
  selectedSupplements: [],
  currentSession: null,
  isAnalyzing: false,
  error: null,
};

// ── Actions ──
type AnalysisAction =
  | { type: 'TOGGLE_FOOD'; payload: FoodItem }
  | { type: 'TOGGLE_SUPPLEMENT'; payload: SupplementIngredient }
  | { type: 'SET_SESSION'; payload: AnalysisSession }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ANALYSIS' };

// ── Reducer ──
function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'TOGGLE_FOOD': {
      const exists = state.selectedFoods.some((f) => f.id === action.payload.id);
      return {
        ...state,
        selectedFoods: exists
          ? state.selectedFoods.filter((f) => f.id !== action.payload.id)
          : [...state.selectedFoods, action.payload],
      };
    }

    case 'TOGGLE_SUPPLEMENT': {
      const exists = state.selectedSupplements.some((s) => s.id === action.payload.id);
      return {
        ...state,
        selectedSupplements: exists
          ? state.selectedSupplements.filter((s) => s.id !== action.payload.id)
          : [...state.selectedSupplements, action.payload],
      };
    }

    case 'SET_SESSION':
      return { ...state, currentSession: action.payload, isAnalyzing: false, error: null };

    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isAnalyzing: false };

    case 'CLEAR_ANALYSIS':
      return { ...initialState };

    default:
      return state;
  }
}

// ── Context ──
interface AnalysisContextValue {
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

// ── Provider ──
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);
  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
}

// ── Hook ──
export function useAnalysisContext() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error('useAnalysisContext must be used within AnalysisProvider');
  }
  return ctx;
}
