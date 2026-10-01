import { CANONICAL_DEMO_CASE_ID, type DemoCaseState } from "./asii-tr-001";

export const DEMO_CASE_STORAGE_KEY = "asii.demo.asii-tr-001.v1";

interface StoredDemoCase {
  version: 1;
  state: DemoCaseState;
}

export function serializeDemoCase(state: DemoCaseState): string {
  const payload: StoredDemoCase = {
    version: 1,
    state,
  };
  return JSON.stringify(payload);
}

export function restoreDemoCase(raw: string | null): DemoCaseState | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredDemoCase>;
    if (parsed.version !== 1 || !parsed.state) return null;

    const state = parsed.state;
    if (
      state.caseId !== CANONICAL_DEMO_CASE_ID ||
      state.synthetic !== true ||
      !Array.isArray(state.signals) ||
      !Array.isArray(state.evidence) ||
      !Array.isArray(state.auditEvents)
    ) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}
