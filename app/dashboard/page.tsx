"use client";

import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useDemoCase } from "@/components/demo/demo-case-provider";
import {
  getCaseStage,
  getEvidenceCompleteness,
  getExportDecision,
} from "@/lib/demo/asii-tr-001";

const stageLabels = {
  ANALYST_REVIEW: "Analyst Review",
  RATIONALE_SAVED: "Rationale Saved",
  ESCALATED_TO_MLRO: "Awaiting MLRO Review",
  COMPLETENESS_CHECKED: "Completeness Checked",
  MLRO_APPROVED: "MLRO Approved",
} as const;

export default function DashboardPage() {
  const { state, applyAction, resetCase, hydrated, lastError } = useDemoCase();
  const stage = getCaseStage(state);
  const evidenceCompleteness = getEvidenceCompleteness(state);
  const exportDecision = getExportDecision(state);

  const caseOpened = state.auditEvents.some(
    (event) => event.eventType === "SIGNAL_OPENED",
  );

  return (
    <Shell active="/dashboard">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl text-white">Travel Rule Queue</h1>
            <Badge>Canonical Demo Case</Badge>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>
              Selected case: <span className="text-accent">{state.caseId}</span>
            </p>
            <p>
              Case status:{" "}
              <span className="text-accent">{stageLabels[stage]}</span>
            </p>
            <p>
              Evidence completeness:{" "}
              <span className="text-accent">{evidenceCompleteness}%</span>
            </p>
            <p>
              Export eligibility:{" "}
              <span className="text-accent">
                {exportDecision.allowed ? "OPEN" : "BLOCKED"}
              </span>
            </p>
            <p>
              Report routing:{" "}
              <span className="text-accent">
                {state.reportGeneratedAt ? "Review pack generated" : "Pending"}
              </span>
            </p>
            <p>
              Persisted state:{" "}
              <span className="text-accent">
                {hydrated ? "Loaded" : "Loading"}
              </span>
            </p>
          </div>

          {lastError && (
            <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
              {lastError}
            </p>
          )}

          <h2 className="mb-2 mt-5 font-medium text-blue-100">
            Controlled Demo Journey
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                applyAction({
                  type: "OPEN_SIGNAL",
                  signalId: "SIG-105",
                  actor: "demo-analyst",
                  at: new Date().toISOString(),
                })
              }
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-left text-sm"
            >
              Open {state.caseId} case
            </button>
            <Link
              href="/signals"
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm"
            >
              Review fragmented signals
            </Link>
            <Link
              href="/continuity"
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm"
            >
              Inspect continuity + evidence
            </Link>
            <Link
              href="/review"
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm"
            >
              Complete human review gates
            </Link>
            <Link
              href="/report"
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm"
            >
              Open report preparation
            </Link>
            <button
              type="button"
              onClick={resetCase}
              className="rounded-lg border border-blue-300/25 px-3 py-2 text-left text-sm text-blue-100/75"
            >
              Reset synthetic case
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="font-medium text-white">Journey Checkpoints</h3>
          <ul className="mt-3 space-y-2 text-sm text-blue-100/75">
            <li>Case opened: {caseOpened ? "✅" : "Pending"}</li>
            <li>
              Analyst rationale saved:{" "}
              {state.rationaleSavedAt ? "✅" : "Pending"}
            </li>
            <li>Escalated to MLRO: {state.escalatedAt ? "✅" : "Pending"}</li>
            <li>
              Completeness checked:{" "}
              {state.completenessCheckedAt ? "✅" : "Pending"}
            </li>
            <li>
              MLRO approval recorded: {state.mlroApproval ? "✅" : "Pending"}
            </li>
            <li>
              Demo report generated:{" "}
              {state.reportGeneratedAt ? "✅" : "Pending"}
            </li>
          </ul>

          {!exportDecision.allowed && (
            <div className="mt-4 border-t border-blue-300/10 pt-3">
              <p className="text-xs font-medium text-amber-200">
                Open export gates
              </p>
              <ul className="mt-2 space-y-1 text-xs text-blue-100/65">
                {exportDecision.blockers.map((blocker) => (
                  <li key={blocker}>• {blocker}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
