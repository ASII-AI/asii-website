import { describe, expect, it } from "vitest";
import {
  canExport,
  createInitialDemoCase,
  getCaseStage,
  getEvidenceCompleteness,
  getExportDecision,
  transitionCase,
} from "../lib/demo/asii-tr-001";

function readyForApproval() {
  let state = createInitialDemoCase();
  state = transitionCase(state, {
    type: "SAVE_RATIONALE",
    actor: "analyst-001",
    at: "2026-10-02T10:00:00Z",
    rationale: "Signals converge on the same entity and transfer chain.",
  });
  state = transitionCase(state, {
    type: "ESCALATE_TO_MLRO",
    actor: "analyst-001",
    at: "2026-10-02T10:05:00Z",
  });
  state = transitionCase(state, {
    type: "RUN_COMPLETENESS_CHECK",
    actor: "analyst-001",
    at: "2026-10-02T10:10:00Z",
  });
  return state;
}

describe("ASII-TR-001 canonical demo state", () => {
  it("invalidates downstream review and report gates when rationale is saved again", () => {
    let state = readyForApproval();
    state = transitionCase(state, {
      type: "APPROVE_BY_MLRO",
      actor: "mlro-001",
      at: "2026-10-02T10:15:00Z",
      rationale: "Approved for controlled demo output.",
    });
    state = transitionCase(state, {
      type: "GENERATE_REPORT",
      actor: "analyst-001",
      at: "2026-10-02T10:20:00Z",
    });
    const priorEvents = [...state.auditEvents];
    state = transitionCase(state, {
      type: "SAVE_RATIONALE",
      actor: "analyst-001",
      at: "2026-10-02T10:25:00Z",
      rationale: "New evidence changes the analyst assessment.",
    });

    expect(getCaseStage(state)).toBe("RATIONALE_SAVED");
    expect(state.escalatedAt).toBeNull();
    expect(state.completenessCheckedAt).toBeNull();
    expect(state.mlroApproval).toBeNull();
    expect(state.reportGeneratedAt).toBeNull();
    expect(canExport(state)).toBe(false);
    expect(state.auditEvents.slice(0, priorEvents.length)).toEqual(priorEvents);
    expect(state.auditEvents.at(-1)?.eventType).toBe("RATIONALE_SAVED");
    expect(() =>
      transitionCase(state, {
        type: "GENERATE_REPORT",
        actor: "analyst-001",
        at: "2026-10-02T10:26:00Z",
      }),
    ).toThrow("Report generation blocked");
    expect(() =>
      transitionCase(state, {
        type: "APPROVE_BY_MLRO",
        actor: "mlro-001",
        at: "2026-10-02T10:27:00Z",
        rationale: "Cannot reuse prior completeness check.",
      }),
    ).toThrow("Completeness check must be completed");
    state = transitionCase(state, {
      type: "ESCALATE_TO_MLRO",
      actor: "analyst-001",
      at: "2026-10-02T10:30:00Z",
    });
    state = transitionCase(state, {
      type: "RUN_COMPLETENESS_CHECK",
      actor: "analyst-001",
      at: "2026-10-02T10:35:00Z",
    });
    state = transitionCase(state, {
      type: "APPROVE_BY_MLRO",
      actor: "mlro-001",
      at: "2026-10-02T10:40:00Z",
      rationale: "Reviewed the updated assessment.",
    });
    expect(canExport(state)).toBe(true);
    expect(state.mlroApproval?.approvedAt).toBe("2026-10-02T10:40:00Z");
  });

  it("starts with seven synthetic signals and evidence completeness at 62%", () => {
    const state = createInitialDemoCase();

    expect(state.caseId).toBe("ASII-TR-001");
    expect(state.synthetic).toBe(true);
    expect(state.signals).toHaveLength(7);
    expect(state.signals.every((signal) => signal.synthetic)).toBe(true);
    expect(state.evidence).toHaveLength(7);
    expect(state.evidence.every((item) => item.synthetic)).toBe(true);
    expect(getCaseStage(state)).toBe("ANALYST_REVIEW");
    expect(getEvidenceCompleteness(state)).toBe(62);
    expect(canExport(state)).toBe(false);
  });

  it("blocks escalation until analyst rationale is saved", () => {
    const state = createInitialDemoCase();

    expect(() =>
      transitionCase(state, {
        type: "ESCALATE_TO_MLRO",
        actor: "analyst-001",
        at: "2026-10-02T10:05:00Z",
      }),
    ).toThrow("Analyst rationale must be saved before escalation");
  });

  it("enforces the rationale → escalation → completeness → approval sequence", () => {
    let state = createInitialDemoCase();

    state = transitionCase(state, {
      type: "SAVE_RATIONALE",
      actor: "analyst-001",
      at: "2026-10-02T10:00:00Z",
      rationale: "Escalation is warranted for human review.",
    });
    expect(getCaseStage(state)).toBe("RATIONALE_SAVED");
    expect(getEvidenceCompleteness(state)).toBe(78);

    state = transitionCase(state, {
      type: "ESCALATE_TO_MLRO",
      actor: "analyst-001",
      at: "2026-10-02T10:05:00Z",
    });
    expect(getCaseStage(state)).toBe("ESCALATED_TO_MLRO");

    state = transitionCase(state, {
      type: "RUN_COMPLETENESS_CHECK",
      actor: "analyst-001",
      at: "2026-10-02T10:10:00Z",
    });
    expect(getCaseStage(state)).toBe("COMPLETENESS_CHECKED");
    expect(canExport(state)).toBe(false);

    state = transitionCase(state, {
      type: "APPROVE_BY_MLRO",
      actor: "mlro-001",
      at: "2026-10-02T10:15:00Z",
      rationale:
        "Reviewed evidence and analyst rationale; approved for demo export.",
    });
    expect(getCaseStage(state)).toBe("MLRO_APPROVED");
    expect(getEvidenceCompleteness(state)).toBe(92);
    expect(canExport(state)).toBe(true);
    expect(state.mlroApproval).toMatchObject({
      reviewer: "mlro-001",
      approvedAt: "2026-10-02T10:15:00Z",
    });
  });

  it("returns explicit blockers before export is eligible", () => {
    const decision = getExportDecision(createInitialDemoCase());

    expect(decision.allowed).toBe(false);
    expect(decision.blockers).toEqual([
      "Analyst rationale is not saved",
      "Case is not escalated to MLRO",
      "Completeness check is not completed",
      "MLRO approval is not recorded",
    ]);
  });

  it("records evidence lineage changes with an attributable audit event", () => {
    let state = createInitialDemoCase();

    state = transitionCase(state, {
      type: "LINK_EVIDENCE",
      evidenceObjectId: "EV-005",
      actor: "analyst-001",
      at: "2026-10-02T09:55:00Z",
      analystAction: "confirmed-gap",
      rationale: "Beneficiary institution details remain incomplete.",
    });

    const evidence = state.evidence.find(
      (item) => item.evidenceObjectId === "EV-005",
    );

    expect(evidence).toMatchObject({
      evidenceObjectId: "EV-005",
      signalId: "SIG-105",
      synthetic: true,
      analystAction: "confirmed-gap",
      rationale: "Beneficiary institution details remain incomplete.",
      verificationState: "GAP",
      auditEventId: "AUD-001",
    });
    expect(state.auditEvents[0]).toMatchObject({
      auditEventId: "AUD-001",
      eventType: "EVIDENCE_LINKED",
      actor: "analyst-001",
    });
  });

  it("keeps the audit trail append-only and logs blocked export requests", () => {
    let state = createInitialDemoCase();

    state = transitionCase(state, {
      type: "OPEN_SIGNAL",
      signalId: "SIG-105",
      actor: "analyst-001",
      at: "2026-10-02T09:50:00Z",
    });
    state = transitionCase(state, {
      type: "REQUEST_EXPORT",
      actor: "analyst-001",
      at: "2026-10-02T09:51:00Z",
    });

    expect(state.auditEvents.map((event) => event.auditEventId)).toEqual([
      "AUD-001",
      "AUD-002",
    ]);
    expect(state.auditEvents[1]).toMatchObject({
      eventType: "EXPORT_REQUESTED",
      details: {
        allowed: false,
        mode: "DEMO_ONLY",
      },
    });
  });

  it("allows demo report generation only after all export gates pass", () => {
    let state = readyForApproval();

    expect(() =>
      transitionCase(state, {
        type: "GENERATE_REPORT",
        actor: "analyst-001",
        at: "2026-10-02T10:12:00Z",
      }),
    ).toThrow("Report generation blocked");

    state = transitionCase(state, {
      type: "APPROVE_BY_MLRO",
      actor: "mlro-001",
      at: "2026-10-02T10:15:00Z",
      rationale: "Approved for controlled demo output.",
    });
    state = transitionCase(state, {
      type: "GENERATE_REPORT",
      actor: "analyst-001",
      at: "2026-10-02T10:20:00Z",
    });
    state = transitionCase(state, {
      type: "REQUEST_EXPORT",
      actor: "analyst-001",
      at: "2026-10-02T10:21:00Z",
    });

    expect(state.reportGeneratedAt).toBe("2026-10-02T10:20:00Z");
    expect(state.auditEvents.at(-2)?.eventType).toBe("REPORT_GENERATED");
    expect(state.auditEvents.at(-1)).toMatchObject({
      eventType: "EXPORT_REQUESTED",
      details: {
        allowed: true,
        mode: "DEMO_ONLY",
      },
    });
  });
});
