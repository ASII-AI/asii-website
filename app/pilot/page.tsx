import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/layout/shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { workflowSteps } from "@/data/mock-data";

export const metadata: Metadata = {
  title: "Interactive Pilot Demo",
  description:
    "A synthetic demonstration of the ASII continuity workflow. No live institutional or customer data is used.",
  robots: { index: false, follow: false },
};

export default function PilotPage() {
  return (
    <Shell active="/pilot">
      <section className="mb-8">
        <Badge>Controlled Institutional Demo</Badge>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          ASII Continuity Pilot
        </h1>
        <p className="mt-2 text-lg text-blue-100/85">
          ASII-TR-001 is the canonical controlled-demo case. Start the primary
          journey at /dashboard.
        </p>
        <p className="mt-4 max-w-4xl text-sm text-blue-100/70">
          ASII is being developed as continuity-native financial crime
          intelligence infrastructure for regulated institutions. The current
          Tajikistan evaluation track demonstrates how fragmented signals can
          retain evidence lineage, investigation context, accountable human
          review, and reporting preparation using synthetic data.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex items-center justify-center rounded-md border border-blue-300/25 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Start ASII-TR-001 controlled demo
        </Link>
        <p className="mt-4 max-w-4xl text-sm text-blue-100/70">
          Demo persistence is browser-local (localStorage). Completeness is
          simulated and milestone-driven, rather than institutionally validated
          evidence completeness. Report generation records a demo milestone;
          PDF/DOCX exports are mocked, not a production document-generation
          service.
        </p>
        <p className="mt-3 max-w-4xl break-words text-sm text-blue-100/70">
          ASII-AI/asii-website owns this canonical controlled-demo workflow.
          ASII-AI/asii-pilot-demo-service- remains a separate controlled
          rehearsal and synthetic scenario sandbox, with potential for future
          component reuse. The two applications do not share executable case
          state.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {workflowSteps.map((step, i) => (
          <Card key={step.title}>
            <p className="text-xs text-accent">Step {i + 1}</p>
            <h3 className="mt-1 text-lg font-medium text-white">
              {i === 3 ? "Reporting Preparation" : step.title}
            </h3>
            <p className="mt-2 text-sm text-blue-100/70">
              {i === 3
                ? "Simulated report milestone and mocked PDF/DOCX export requests, subject to demo human-review gates."
                : step.description}
            </p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Proof", "Continuity, evidence lineage, reviewable output"],
          ["Trust", "Human review, auditability, explicit decision context"],
          [
            "Evaluation Entry",
            "Scoped assessment, synthetic data, no rip-and-replace",
          ],
        ].map(([title, copy]) => (
          <Card key={title}>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <p className="mt-2 text-sm text-blue-100/70">{copy}</p>
          </Card>
        ))}
      </section>
    </Shell>
  );
}
