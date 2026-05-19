import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { UserProfile, SavedMedicine, SavedSession, Medicine, AnalysisSession } from '@/types';

// ── State ──
interface UserState {
  profile: UserProfile;
  hasCompletedOnboarding: boolean;
  savedMedicines: SavedMedicine[];
  savedSessions: SavedSession[];
  seniorMode: boolean;
}

const initialState: UserState = {
  profile: {
    isPregnant: false,
    isElderly: false,
    chronicConditions: [],
  },
  hasCompletedOnboarding: false,
  savedMedicines: [],
  savedSessions: [],
  seniorMode: false,
};

// ── Actions ──
type UserAction =
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SAVE_MEDICINE'; payload: Medicine }
  | { type: 'REMOVE_SAVED_MEDICINE'; payload: string }
  | { type: 'SAVE_SESSION'; payload: AnalysisSession }
  | { type: 'TOGGLE_SENIOR_MODE' };

// ── Reducer ──
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };

    case 'SAVE_MEDICINE': {
      if (state.savedMedicines.some((sm) => sm.medicine.id === action.payload.id)) {
        return state;
      }
      const newSaved: SavedMedicine = {
        id: `saved-med-${Date.now()}`,
        medicine: action.payload,
        addedAt: new Date(),
      };
      return { ...state, savedMedicines: [...state.savedMedicines, newSaved] };
    }

    case 'REMOVE_SAVED_MEDICINE':
      return {
        ...state,
        savedMedicines: state.savedMedicines.filter((sm) => sm.id !== action.payload),
      };

    case 'SAVE_SESSION': {
      const newSession: SavedSession = {
        id: `saved-sess-${Date.now()}`,
        session: action.payload,
        savedAt: new Date(),
      };
      return { ...state, savedSessions: [...state.savedSessions, newSession] };
    }

    case 'TOGGLE_SENIOR_MODE':
      return { ...state, seniorMode: !state.seniorMode };

    default:
      return state;
  }
}

// ── Context ──
interface UserContextValue {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const UserContext = createContext<UserContextValue | null>(null);

// ── Provider ──
export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

// ── Hook ──
export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return ctx;
}
