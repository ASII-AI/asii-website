"use client";

import { Card } from "@/components/ui/card";
import { useDemoCase } from "@/components/demo/demo-case-provider";
import { getCaseStage, getEvidenceCompleteness } from "@/lib/demo/asii-tr-001";
import { timeline } from "@/data/mock-data";

export function ContinuityWorkspace() {
  const { state } = useDemoCase();
  const stage = getCaseStage(state);
  const completeness = getEvidenceCompleteness(state);

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-white">
        Case Continuity Engine
      </h1>
      <p className="mb-4 text-sm text-blue-100/70">
        Canonical case <span className="text-accent">{state.caseId}</span> ·{" "}
        {stage} · evidence completeness {completeness}%.
      </p>

      <Card>
        <div className="grid gap-3 text-sm text-blue-100/80 md:grid-cols-3">
          <p>
            <strong>Entity resolution:</strong> Unified customer, wallet, and
            counterparty identities.
          </p>
          <p>
            <strong>Event clustering:</strong> Linked events by temporal and
            relationship proximity.
          </p>
          <p>
            <strong>Duplicate detection:</strong> Merged repeated alerts across
            TM and sanctions layers.
          </p>
          <p>
            <strong>Context enrichment:</strong> Added ownership, corridor, and
            media context.
          </p>
          <p>
            <strong>Risk logic:</strong> Weighted rule + graph +
            analyst-confirmed evidence.
          </p>
          <p>
            <strong>Continuity score:</strong>{" "}
            <span className="text-accent">91/100</span>
          </p>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {timeline.map((item) => (
            <Card key={item.time}>
              <p className="font-medium text-white">
                {item.time} — {item.event}
              </p>
              <p className="mt-1 text-sm text-blue-100/75">
                Why this belongs in the same case: {item.reasoning}
              </p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="font-medium text-white">Evidence lineage</h2>
          <div className="mt-3 space-y-3">
            {state.evidence.map((item) => (
              <div
                key={item.evidenceObjectId}
                className="rounded-lg border border-blue-300/15 bg-blue-500/5 p-3 text-xs text-blue-100/75"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-white">
                    {item.evidenceObjectId} · {item.signalId}
                  </p>
                  <span className="text-accent">{item.verificationState}</span>
                </div>
                <p className="mt-2">Source: {item.source}</p>
                <p>Type: {item.sourceType}</p>
                <p>Captured: {item.capturedAt}</p>
                <p>Synthetic: yes</p>
                <p>
                  Analyst action: {item.analystAction ?? "Not yet recorded"}
                </p>
                <p>Audit event: {item.auditEventId ?? "Not yet recorded"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
