"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useDemoCase } from "@/components/demo/demo-case-provider";
import {
  getCaseStage,
  getEvidenceCompleteness,
  getExportDecision,
} from "@/lib/demo/asii-tr-001";

const sections = [
  "Case summary",
  "Risk rationale",
  "Evidence table",
  "Timeline of events",
  "Sources reviewed",
  "Analyst decisions",
  "Explainability section",
  "Audit log",
  "Recommended next action",
];

export function ReportWorkspace() {
  const { state, applyAction, lastError } = useDemoCase();
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const decision = getExportDecision(state);
  const stage = getCaseStage(state);
  const completeness = getEvidenceCompleteness(state);

  const generateReport = () => {
    const result = applyAction({
      type: "GENERATE_REPORT",
      actor: "demo-analyst",
      at: new Date().toISOString(),
    });
    if (result.ok) {
      setExportNotice(
        "DEMO-ONLY review pack generated. No production filing artifact was created.",
      );
    }
  };

  const requestExport = (format: "PDF" | "DOCX") => {
    const result = applyAction({
      type: "REQUEST_EXPORT",
      actor: "demo-analyst",
      at: new Date().toISOString(),
    });
    if (result.ok) {
      setExportNotice(
        `${format} export request recorded in the demo audit trail. File generation remains MOCK / DEMO-ONLY.`,
      );
    }
  };

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-white">
        Human-Reviewed Reporting Preparation Demo
      </h1>
      <p className="mb-2 max-w-3xl text-sm leading-relaxed text-blue-100/70">
        Synthetic demonstration only. The output is reviewable working material
        for reporting preparation and does not represent regulator approval,
        acceptance, filing readiness, or a production reporting state.
      </p>
      <p className="mb-6 text-xs text-blue-100/60">
        {state.caseId} · {stage} · evidence completeness {completeness}%.
      </p>

      {(lastError || exportNotice) && (
        <div className="mb-4 space-y-2">
          {lastError && (
            <p className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
              {lastError}
            </p>
          )}
          {exportNotice && (
            <p className="rounded-lg border border-cyan-300/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
              {exportNotice}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <ul className="space-y-2 text-sm text-blue-100/80">
            {sections.map((section) => (
              <li key={section}>• {section}</li>
            ))}
          </ul>

          <div className="mt-5 border-t border-blue-300/10 pt-4">
            <h2 className="font-medium text-white">Audit trail</h2>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto text-xs text-blue-100/70">
              {state.auditEvents.length === 0 ? (
                <p>No audit events recorded yet.</p>
              ) : (
                state.auditEvents.map((event) => (
                  <div
                    key={event.auditEventId}
                    className="rounded-lg border border-blue-300/10 bg-blue-500/5 p-2"
                  >
                    <p className="text-white">
                      {event.auditEventId} · {event.eventType}
                    </p>
                    <p>
                      {event.actor} · {event.occurredAt}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-medium text-white">Export gate</h3>
          <p className="mt-2 text-xs text-blue-100/70">
            canExport = rationale saved + escalation completed + completeness
            check completed + MLRO approval recorded.
          </p>

          {!decision.allowed && (
            <ul className="mt-3 space-y-1 text-xs text-amber-200">
              {decision.blockers.map((blocker) => (
                <li key={blocker}>• {blocker}</li>
              ))}
            </ul>
          )}

          <button
            type="button"
            disabled={!decision.allowed || Boolean(state.reportGeneratedAt)}
            onClick={generateReport}
            className="mt-4 w-full rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state.reportGeneratedAt
              ? "MLRO Review Pack Generated"
              : "Generate MLRO Review Pack"}
          </button>

          <div className="mt-3 space-y-2">
            <button
              type="button"
              disabled={!decision.allowed || !state.reportGeneratedAt}
              onClick={() => requestExport("PDF")}
              className="w-full rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export PDF (Mock)
            </button>
            <button
              type="button"
              disabled={!decision.allowed || !state.reportGeneratedAt}
              onClick={() => requestExport("DOCX")}
              className="w-full rounded-lg border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Export DOCX (Mock)
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-blue-300/10 bg-bg/40 p-3 text-xs text-blue-100/65">
            <p>
              Eligibility:{" "}
              <span className={decision.allowed ? "text-emerald-300" : "text-amber-300"}>
                {decision.allowed ? "OPEN" : "BLOCKED"}
              </span>
            </p>
            <p>
              Report generated:{" "}
              {state.reportGeneratedAt ?? "Not yet"}
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
