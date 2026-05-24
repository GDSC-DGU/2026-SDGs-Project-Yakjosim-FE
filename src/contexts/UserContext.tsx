import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { UserProfile } from '@/types';

// ── State ──
interface UserState {
  profile: UserProfile;
  hasCompletedOnboarding: boolean;
  seniorMode: boolean;
}

const USER_STORAGE_KEY = 'yak-josim-user-state';

const initialState: UserState = {
  profile: {
    birthDate: undefined,
    birthYear: undefined,
    sex: undefined,
    isPregnant: false,
    isElderly: false,
    chronicConditions: [],
  },
  hasCompletedOnboarding: false,
  seniorMode: false,
};

// ── Actions ──
type UserAction =
  | { type: 'SET_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_SENIOR_MODE'; payload: boolean }
  | { type: 'TOGGLE_SENIOR_MODE' };

function hydrateUserState(): UserState {
  if (typeof window === 'undefined') {
    return initialState;
  }

  const storedState = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!storedState) {
    return initialState;
  }

  try {
    const parsedState = JSON.parse(storedState) as Partial<UserState>;

    return {
      ...initialState,
      ...parsedState,
      profile: {
        ...initialState.profile,
        ...parsedState.profile,
      },
      seniorMode: Boolean(parsedState.seniorMode),
      hasCompletedOnboarding: Boolean(parsedState.hasCompletedOnboarding),
    };
  } catch {
    return initialState;
  }
}

function getAgeFromBirthDate(birthDate?: string): number | null {
  if (!birthDate) {
    return null;
  }

  const today = new Date();
  const date = new Date(birthDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

function deriveProfile(profile: UserProfile): UserProfile {
  const age = getAgeFromBirthDate(profile.birthDate);
  const birthYear = profile.birthDate
    ? new Date(profile.birthDate).getFullYear()
    : profile.birthYear;

  return {
    ...profile,
    birthYear,
    isElderly: age !== null ? age >= 65 : profile.isElderly,
  };
}

// ── Reducer ──
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        profile: deriveProfile({ ...state.profile, ...action.payload }),
      };

    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };

    case 'SET_SENIOR_MODE':
      return { ...state, seniorMode: action.payload };

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
  const [state, dispatch] = useReducer(userReducer, initialState, hydrateUserState);

  useEffect(() => {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 시크릿 모드 또는 저장 용량 초과 시 무시
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.senior = String(state.seniorMode);

    return () => {
      delete document.documentElement.dataset.senior;
    };
  }, [state.seniorMode]);

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
