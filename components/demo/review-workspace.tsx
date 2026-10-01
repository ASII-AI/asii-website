"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useDemoCase } from "@/components/demo/demo-case-provider";
import { getCaseStage, getEvidenceCompleteness } from "@/lib/demo/asii-tr-001";

const defaultAnalystRationale =
  "Multiple independent synthetic signals converge on the same entity and transfer chain. Escalation is warranted for MLRO review, subject to confirmation of the missing beneficiary institution detail.";

const defaultMlroRationale =
  "Reviewed the synthetic evidence, analyst rationale, and completeness result. Approved for DEMO-ONLY reporting export.";

export function ReviewWorkspace() {
  const { state, applyAction, lastError } = useDemoCase();
  const [analystRationale, setAnalystRationale] = useState(
    state.analystRationale ?? defaultAnalystRationale,
  );
  const [reviewer, setReviewer] = useState(
    state.mlroApproval?.reviewer ?? "demo-mlro",
  );
  const [mlroRationale, setMlroRationale] = useState(
    state.mlroApproval?.rationale ?? defaultMlroRationale,
  );

  const stage = getCaseStage(state);
  const completeness = getEvidenceCompleteness(state);

  const now = () => new Date().toISOString();

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-white">
        Analyst Review Workspace
      </h1>
      <p className="mb-4 text-sm text-blue-100/70">
        {state.caseId} · {stage} · evidence completeness {completeness}%. Human
        actions below write attributable audit events to the canonical synthetic
        case.
      </p>

      {lastError && (
        <p className="mb-4 rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {lastError}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-medium text-white">Analyst rationale</h2>
          <p className="mt-2 text-sm text-blue-100/70">
            AI-assisted analysis is working material only. The analyst remains
            accountable for the rationale and escalation decision.
          </p>
          <textarea
            value={analystRationale}
            onChange={(event) => setAnalystRationale(event.target.value)}
            disabled={Boolean(state.escalatedAt)}
            className="mt-4 min-h-36 w-full rounded-lg border border-blue-300/20 bg-bg/70 p-3 text-sm text-blue-50 outline-none focus:border-cyan-300/60 disabled:opacity-60"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={Boolean(state.escalatedAt)}
              onClick={() =>
                applyAction({
                  type: "SAVE_RATIONALE",
                  actor: "demo-analyst",
                  at: now(),
                  rationale: analystRationale,
                })
              }
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Analyst Rationale
            </button>
            <button
              type="button"
              disabled={!state.rationaleSavedAt || Boolean(state.escalatedAt)}
              onClick={() =>
                applyAction({
                  type: "ESCALATE_TO_MLRO",
                  actor: "demo-analyst",
                  at: now(),
                })
              }
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Escalate to MLRO
            </button>
            <button
              type="button"
              disabled={
                !state.escalatedAt || Boolean(state.completenessCheckedAt)
              }
              onClick={() =>
                applyAction({
                  type: "RUN_COMPLETENESS_CHECK",
                  actor: "demo-analyst",
                  at: now(),
                })
              }
              className="rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Run Completeness Check
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="font-medium text-white">MLRO review</h2>
          <label className="mt-3 block text-xs text-blue-100/70">
            Reviewer
            <input
              value={reviewer}
              onChange={(event) => setReviewer(event.target.value)}
              disabled={Boolean(state.mlroApproval)}
              className="mt-1 w-full rounded-lg border border-blue-300/20 bg-bg/70 p-2 text-sm text-blue-50 outline-none focus:border-cyan-300/60 disabled:opacity-60"
            />
          </label>
          <label className="mt-3 block text-xs text-blue-100/70">
            Approval rationale
            <textarea
              value={mlroRationale}
              onChange={(event) => setMlroRationale(event.target.value)}
              disabled={Boolean(state.mlroApproval)}
              className="mt-1 min-h-28 w-full rounded-lg border border-blue-300/20 bg-bg/70 p-2 text-sm text-blue-50 outline-none focus:border-cyan-300/60 disabled:opacity-60"
            />
          </label>
          <button
            type="button"
            disabled={
              !state.completenessCheckedAt || Boolean(state.mlroApproval)
            }
            onClick={() =>
              applyAction({
                type: "APPROVE_BY_MLRO",
                actor: reviewer,
                at: now(),
                rationale: mlroRationale,
              })
            }
            className="mt-3 w-full rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Record MLRO Approval
          </button>

          {state.mlroApproval && (
            <div className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-500/10 p-3 text-xs text-emerald-100">
              <p>Reviewer: {state.mlroApproval.reviewer}</p>
              <p>Approved: {state.mlroApproval.approvedAt}</p>
              <p>Audit: {state.mlroApproval.auditEventId}</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
