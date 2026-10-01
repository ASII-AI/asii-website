"use client";

import { Card } from "@/components/ui/card";
import { useDemoCase } from "@/components/demo/demo-case-provider";

export function SignalsWorkspace() {
  const { state, applyAction, lastError } = useDemoCase();

  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold text-white">
        Fragmented Signals Module
      </h1>
      <p className="mb-4 text-sm text-blue-100/70">
        Canonical synthetic case: <span className="text-accent">{state.caseId}</span>.
        Opening a signal appends an attributable audit event.
      </p>

      {lastError && (
        <p className="mb-4 rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-200">
          {lastError}
        </p>
      )}

      <div className="space-y-3">
        {state.signals.map((signal) => {
          const evidence = state.evidence.find(
            (item) => item.signalId === signal.id,
          );

          return (
            <Card key={signal.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-white">{signal.signal}</h3>
                <span className="text-xs text-blue-100/75">{signal.id}</span>
              </div>
              <p className="mt-2 text-sm text-blue-100/80">
                {signal.explanation}
              </p>
              <div className="mt-3 grid gap-2 text-xs text-blue-100/70 sm:grid-cols-2 xl:grid-cols-4">
                <p>Source: {signal.source}</p>
                <p>Timestamp: {signal.timestamp}</p>
                <p>Confidence: {Math.round(signal.confidence * 100)}%</p>
                <p>Severity: {signal.severity}</p>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-blue-300/10 pt-3 text-xs">
                <p className="text-blue-100/70">
                  Evidence:{" "}
                  <span className="text-accent">
                    {evidence?.evidenceObjectId ?? "Not linked"}
                  </span>
                  {evidence ? ` · ${evidence.verificationState}` : ""}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    applyAction({
                      type: "OPEN_SIGNAL",
                      signalId: signal.id,
                      actor: "demo-analyst",
                      at: new Date().toISOString(),
                    })
                  }
                  className="rounded-md border border-blue-300/25 bg-blue-500/10 px-3 py-2 text-blue-100 hover:bg-blue-500/20"
                >
                  Open signal
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
