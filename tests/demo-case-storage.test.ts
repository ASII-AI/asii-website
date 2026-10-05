import { describe, expect, it } from "vitest";
import {
  createInitialDemoCase,
  getExportDecision,
  transitionCase,
} from "../lib/demo/asii-tr-001";
import {
  DEMO_CASE_STORAGE_KEY,
  restoreDemoCase,
  serializeDemoCase,
} from "../lib/demo/demo-case-storage";

describe("demo case persistence", () => {
  it("uses a versioned storage key", () => {
    expect(DEMO_CASE_STORAGE_KEY).toBe("asii.demo.asii-tr-001.v1");
  });

  it("round-trips canonical case progression across storage", () => {
    let state = createInitialDemoCase();
    state = transitionCase(state, {
      type: "SAVE_RATIONALE",
      actor: "demo-analyst",
      at: "2026-10-02T12:00:00Z",
      rationale: "Synthetic rationale for persistence test.",
    });
    state = transitionCase(state, {
      type: "ESCALATE_TO_MLRO",
      actor: "demo-analyst",
      at: "2026-10-02T12:01:00Z",
    });

    const restored = restoreDemoCase(serializeDemoCase(state));

    expect(restored).toMatchObject({
      caseId: "ASII-TR-001",
      synthetic: true,
      analystRationale: "Synthetic rationale for persistence test.",
      rationaleSavedAt: "2026-10-02T12:00:00Z",
      escalatedAt: "2026-10-02T12:01:00Z",
    });
    expect(restored?.auditEvents).toHaveLength(2);
  });

  it("restores legacy unversioned approvals as stale rather than current", () => {
    let state = createInitialDemoCase();
    state = transitionCase(state, {
      type: "SAVE_RATIONALE",
      actor: "demo-analyst",
      at: "2026-10-02T12:00:00Z",
      rationale: "Synthetic rationale for legacy storage test.",
    });
    state = transitionCase(state, {
      type: "ESCALATE_TO_MLRO",
      actor: "demo-analyst",
      at: "2026-10-02T12:01:00Z",
    });
    state = transitionCase(state, {
      type: "RUN_COMPLETENESS_CHECK",
      actor: "demo-analyst",
      at: "2026-10-02T12:02:00Z",
    });
    state = transitionCase(state, {
      type: "APPROVE_BY_MLRO",
      actor: "demo-mlro",
      at: "2026-10-02T12:03:00Z",
      rationale: "Approved before decision-context version binding existed.",
    });

    const legacyState = {
      ...state,
      decisionContextVersion: undefined,
      completenessCheckedDecisionContextVersion: undefined,
      mlroApproval: state.mlroApproval
        ? {
            ...state.mlroApproval,
            decisionContextVersion: undefined,
          }
        : null,
    };

    const restored = restoreDemoCase(
      JSON.stringify({ version: 1, state: legacyState }),
    );

    expect(restored).not.toBeNull();
    expect(getExportDecision(restored!)).toMatchObject({
      allowed: false,
      blockers: ["Completeness check is stale", "MLRO approval is stale"],
    });
  });

  it("rejects malformed or non-canonical stored state", () => {
    expect(restoreDemoCase(null)).toBeNull();
    expect(restoreDemoCase("not-json")).toBeNull();
    expect(
      restoreDemoCase(
        JSON.stringify({
          version: 1,
          state: {
            caseId: "OTHER-CASE",
            synthetic: true,
            signals: [],
            evidence: [],
            auditEvents: [],
          },
        }),
      ),
    ).toBeNull();
  });
});
