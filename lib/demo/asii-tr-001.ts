import { signals as syntheticSignals } from "../../data/mock-data";

export const CANONICAL_DEMO_CASE_ID = "ASII-TR-001" as const;

export type CaseStage =
  | "ANALYST_REVIEW"
  | "RATIONALE_SAVED"
  | "ESCALATED_TO_MLRO"
  | "COMPLETENESS_CHECKED"
  | "MLRO_APPROVED";

export type AuditEventType =
  | "SIGNAL_OPENED"
  | "EVIDENCE_LINKED"
  | "RATIONALE_SAVED"
  | "CASE_ESCALATED"
  | "COMPLETENESS_CHECK_COMPLETED"
  | "MLRO_APPROVED"
  | "REPORT_GENERATED"
  | "EXPORT_REQUESTED"
  | "DOWNSTREAM_REVIEW_INVALIDATED";

export type VerificationState = "VERIFIED" | "NEEDS_REVIEW" | "GAP";

export interface DemoSignal {
  id: string;
  signal: string;
  source: string;
  timestamp: string;
  confidence: number;
  severity: string;
  explanation: string;
  synthetic: true;
}

export interface EvidenceObject {
  evidenceObjectId: string;
  signalId: string;
  source: string;
  sourceType: string;
  capturedAt: string;
  synthetic: true;
  analystAction: string | null;
  rationale: string | null;
  verificationState: VerificationState;
  auditEventId: string | null;
}

export interface AuditEvent {
  auditEventId: string;
  sequence: number;
  eventType: AuditEventType;
  occurredAt: string;
  actor: string;
  synthetic: true;
  details?: Record<string, string | number | boolean | null>;
}

export interface MlroApproval {
  reviewer: string;
  rationale: string;
  approvedAt: string;
  auditEventId: string;
}

export interface DemoCaseState {
  caseId: typeof CANONICAL_DEMO_CASE_ID;
  synthetic: true;
  signals: DemoSignal[];
  evidence: EvidenceObject[];
  analystRationale: string | null;
  rationaleSavedAt: string | null;
  escalatedAt: string | null;
  completenessCheckedAt: string | null;
  mlroApproval: MlroApproval | null;
  reportGeneratedAt: string | null;
  auditEvents: AuditEvent[];
}

export type CaseAction =
  | {
      type: "OPEN_SIGNAL";
      signalId: string;
      actor: string;
      at: string;
    }
  | {
      type: "LINK_EVIDENCE";
      evidenceObjectId: string;
      actor: string;
      at: string;
      analystAction?: string;
      rationale?: string;
    }
  | {
      type: "SAVE_RATIONALE";
      actor: string;
      at: string;
      rationale: string;
    }
  | {
      type: "ESCALATE_TO_MLRO";
      actor: string;
      at: string;
    }
  | {
      type: "RUN_COMPLETENESS_CHECK";
      actor: string;
      at: string;
    }
  | {
      type: "APPROVE_BY_MLRO";
      actor: string;
      at: string;
      rationale: string;
    }
  | {
      type: "GENERATE_REPORT";
      actor: string;
      at: string;
    }
  | {
      type: "REQUEST_EXPORT";
      actor: string;
      at: string;
    };

export interface ExportDecision {
  allowed: boolean;
  blockers: string[];
}

const evidenceBlueprint: Array<{
  evidenceObjectId: string;
  signalId: string;
  sourceType: string;
  verificationState: VerificationState;
}> = [
  {
    evidenceObjectId: "EV-001",
    signalId: "SIG-101",
    sourceType: "transaction-monitoring-alert",
    verificationState: "VERIFIED",
  },
  {
    evidenceObjectId: "EV-002",
    signalId: "SIG-102",
    sourceType: "sanctions-screening-result",
    verificationState: "NEEDS_REVIEW",
  },
  {
    evidenceObjectId: "EV-003",
    signalId: "SIG-103",
    sourceType: "adverse-media-record",
    verificationState: "VERIFIED",
  },
  {
    evidenceObjectId: "EV-004",
    signalId: "SIG-104",
    sourceType: "crypto-wallet-risk-record",
    verificationState: "VERIFIED",
  },
  {
    evidenceObjectId: "EV-005",
    signalId: "SIG-105",
    sourceType: "travel-rule-payload",
    verificationState: "GAP",
  },
  {
    evidenceObjectId: "EV-006",
    signalId: "SIG-106",
    sourceType: "jurisdiction-risk-record",
    verificationState: "VERIFIED",
  },
  {
    evidenceObjectId: "EV-007",
    signalId: "SIG-107",
    sourceType: "internal-investigation-note",
    verificationState: "VERIFIED",
  },
];

function nextAuditEvent(
  state: DemoCaseState,
  eventType: AuditEventType,
  actor: string,
  occurredAt: string,
  details?: AuditEvent["details"],
): AuditEvent {
  const sequence = state.auditEvents.length + 1;
  return {
    auditEventId: `AUD-${String(sequence).padStart(3, "0")}`,
    sequence,
    eventType,
    occurredAt,
    actor,
    synthetic: true,
    details,
  };
}

function appendAuditEvent(
  state: DemoCaseState,
  eventType: AuditEventType,
  actor: string,
  occurredAt: string,
  details?: AuditEvent["details"],
): { state: DemoCaseState; event: AuditEvent } {
  const event = nextAuditEvent(state, eventType, actor, occurredAt, details);
  return {
    state: {
      ...state,
      auditEvents: [...state.auditEvents, event],
    },
    event,
  };
}

function assertNonBlank(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${field} must not be blank`);
  }
  return normalized;
}

export function createInitialDemoCase(): DemoCaseState {
  const signals: DemoSignal[] = syntheticSignals.map((signal) => ({
    ...signal,
    synthetic: true as const,
  }));

  const evidence: EvidenceObject[] = evidenceBlueprint.map((blueprint) => {
    const sourceSignal = signals.find(
      (signal) => signal.id === blueprint.signalId,
    );

    if (!sourceSignal) {
      throw new Error(
        `Missing synthetic signal for evidence ${blueprint.evidenceObjectId}`,
      );
    }

    return {
      evidenceObjectId: blueprint.evidenceObjectId,
      signalId: blueprint.signalId,
      source: sourceSignal.source,
      sourceType: blueprint.sourceType,
      capturedAt: sourceSignal.timestamp,
      synthetic: true,
      analystAction: null,
      rationale: null,
      verificationState: blueprint.verificationState,
      auditEventId: null,
    };
  });

  return {
    caseId: CANONICAL_DEMO_CASE_ID,
    synthetic: true,
    signals,
    evidence,
    analystRationale: null,
    rationaleSavedAt: null,
    escalatedAt: null,
    completenessCheckedAt: null,
    mlroApproval: null,
    reportGeneratedAt: null,
    auditEvents: [],
  };
}

export function getCaseStage(state: DemoCaseState): CaseStage {
  if (state.mlroApproval) return "MLRO_APPROVED";
  if (state.completenessCheckedAt) return "COMPLETENESS_CHECKED";
  if (state.escalatedAt) return "ESCALATED_TO_MLRO";
  if (state.rationaleSavedAt) return "RATIONALE_SAVED";
  return "ANALYST_REVIEW";
}

export function getEvidenceCompleteness(state: DemoCaseState): number {
  if (state.mlroApproval) return 92;
  if (state.rationaleSavedAt) return 78;
  return 62;
}

export function getExportDecision(state: DemoCaseState): ExportDecision {
  const blockers: string[] = [];

  if (!state.rationaleSavedAt) blockers.push("Analyst rationale is not saved");
  if (!state.escalatedAt) blockers.push("Case is not escalated to MLRO");
  if (!state.completenessCheckedAt) {
    blockers.push("Completeness check is not completed");
  }
  if (!state.mlroApproval) blockers.push("MLRO approval is not recorded");

  return {
    allowed: blockers.length === 0,
    blockers,
  };
}

export function canExport(state: DemoCaseState): boolean {
  return getExportDecision(state).allowed;
}

export function transitionCase(
  state: DemoCaseState,
  action: CaseAction,
): DemoCaseState {
  switch (action.type) {
    case "OPEN_SIGNAL": {
      if (!state.signals.some((signal) => signal.id === action.signalId)) {
        throw new Error(`Unknown signal: ${action.signalId}`);
      }

      return appendAuditEvent(state, "SIGNAL_OPENED", action.actor, action.at, {
        signalId: action.signalId,
      }).state;
    }

    case "LINK_EVIDENCE": {
      const evidenceIndex = state.evidence.findIndex(
        (item) => item.evidenceObjectId === action.evidenceObjectId,
      );
      if (evidenceIndex === -1) {
        throw new Error(`Unknown evidence: ${action.evidenceObjectId}`);
      }

      const audit = nextAuditEvent(
        state,
        "EVIDENCE_LINKED",
        action.actor,
        action.at,
        { evidenceObjectId: action.evidenceObjectId },
      );

      const evidence = [...state.evidence];
      evidence[evidenceIndex] = {
        ...evidence[evidenceIndex],
        analystAction: action.analystAction?.trim() || "linked-to-case",
        rationale: action.rationale?.trim() || null,
        auditEventId: audit.auditEventId,
      };

      const hadDownstreamReview = Boolean(
        state.escalatedAt ||
          state.completenessCheckedAt ||
          state.mlroApproval ||
          state.reportGeneratedAt,
      );

      const withEvidence = {
        ...state,
        evidence,
        auditEvents: [...state.auditEvents, audit],
      };

      if (!hadDownstreamReview) {
        return withEvidence;
      }

      const invalidated = {
        ...withEvidence,
        escalatedAt: null,
        completenessCheckedAt: null,
        mlroApproval: null,
        reportGeneratedAt: null,
      };

      return appendAuditEvent(
        invalidated,
        "DOWNSTREAM_REVIEW_INVALIDATED",
        action.actor,
        action.at,
        {
          reason: "evidence-updated",
          evidenceObjectId: action.evidenceObjectId,
        },
      ).state;
    }

    case "SAVE_RATIONALE": {
      const rationale = assertNonBlank(action.rationale, "Analyst rationale");
      const { state: audited } = appendAuditEvent(
        state,
        "RATIONALE_SAVED",
        action.actor,
        action.at,
        { rationale },
      );

      return {
        ...audited,
        analystRationale: rationale,
        rationaleSavedAt: action.at,
        escalatedAt: null,
        completenessCheckedAt: null,
        mlroApproval: null,
        reportGeneratedAt: null,
      };
    }

    case "ESCALATE_TO_MLRO": {
      if (!state.rationaleSavedAt || !state.analystRationale) {
        throw new Error("Analyst rationale must be saved before escalation");
      }

      const { state: audited } = appendAuditEvent(
        state,
        "CASE_ESCALATED",
        action.actor,
        action.at,
      );

      return {
        ...audited,
        escalatedAt: action.at,
      };
    }

    case "RUN_COMPLETENESS_CHECK": {
      if (!state.escalatedAt) {
        throw new Error(
          "Case must be escalated before completeness check can run",
        );
      }

      const { state: audited } = appendAuditEvent(
        state,
        "COMPLETENESS_CHECK_COMPLETED",
        action.actor,
        action.at,
        { evidenceCompleteness: getEvidenceCompleteness(state) },
      );

      return {
        ...audited,
        completenessCheckedAt: action.at,
      };
    }

    case "APPROVE_BY_MLRO": {
      if (!state.completenessCheckedAt) {
        throw new Error(
          "Completeness check must be completed before MLRO approval",
        );
      }

      const rationale = assertNonBlank(action.rationale, "MLRO rationale");
      const audit = nextAuditEvent(
        state,
        "MLRO_APPROVED",
        action.actor,
        action.at,
        { rationale },
      );

      return {
        ...state,
        mlroApproval: {
          reviewer: action.actor,
          rationale,
          approvedAt: action.at,
          auditEventId: audit.auditEventId,
        },
        auditEvents: [...state.auditEvents, audit],
      };
    }

    case "GENERATE_REPORT": {
      const decision = getExportDecision(state);
      if (!decision.allowed) {
        throw new Error(
          `Report generation blocked: ${decision.blockers.join("; ")}`,
        );
      }

      const { state: audited } = appendAuditEvent(
        state,
        "REPORT_GENERATED",
        action.actor,
        action.at,
        { mode: "DEMO_ONLY" },
      );

      return {
        ...audited,
        reportGeneratedAt: action.at,
      };
    }

    case "REQUEST_EXPORT": {
      const decision = getExportDecision(state);
      return appendAuditEvent(
        state,
        "EXPORT_REQUESTED",
        action.actor,
        action.at,
        {
          allowed: decision.allowed,
          blockers: decision.blockers.join(" | ") || null,
          mode: "DEMO_ONLY",
        },
      ).state;
    }
  }
}
