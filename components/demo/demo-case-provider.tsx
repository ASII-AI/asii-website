"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type CaseAction,
  createInitialDemoCase,
  type DemoCaseState,
  transitionCase,
} from "@/lib/demo/asii-tr-001";
import {
  DEMO_CASE_STORAGE_KEY,
  restoreDemoCase,
  serializeDemoCase,
} from "@/lib/demo/demo-case-storage";

type DispatchResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
    };

interface DemoCaseContextValue {
  state: DemoCaseState;
  hydrated: boolean;
  lastError: string | null;
  applyAction: (action: CaseAction) => DispatchResult;
  resetCase: () => void;
}

const DemoCaseContext = createContext<DemoCaseContextValue | null>(null);

export function DemoCaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoCaseState>(() =>
    createInitialDemoCase(),
  );
  const [hydrated, setHydrated] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const restored = restoreDemoCase(
      window.localStorage.getItem(DEMO_CASE_STORAGE_KEY),
    );
    if (restored) {
      setState(restored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      DEMO_CASE_STORAGE_KEY,
      serializeDemoCase(state),
    );
  }, [hydrated, state]);

  const applyAction = useCallback(
    (action: CaseAction): DispatchResult => {
      try {
        const next = transitionCase(state, action);
        setState(next);
        setLastError(null);
        return { ok: true };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Demo state transition failed";
        setLastError(message);
        return { ok: false, error: message };
      }
    },
    [state],
  );

  const resetCase = useCallback(() => {
    setState(createInitialDemoCase());
    setLastError(null);
  }, []);

  const value = useMemo(
    () => ({
      state,
      hydrated,
      lastError,
      applyAction,
      resetCase,
    }),
    [applyAction, hydrated, lastError, resetCase, state],
  );

  return (
    <DemoCaseContext.Provider value={value}>
      {children}
    </DemoCaseContext.Provider>
  );
}

export function useDemoCase(): DemoCaseContextValue {
  const value = useContext(DemoCaseContext);
  if (!value) {
    throw new Error("useDemoCase must be used inside DemoCaseProvider");
  }
  return value;
}
