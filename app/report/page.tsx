import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { ReportWorkspace } from "@/components/demo/report-workspace";

export const metadata: Metadata = {
  title: "Reporting Workflow Demo",
  robots: { index: false, follow: false },
};

export default function ReportPage() {
  return (
    <Shell active="/report">
      <ReportWorkspace />
    </Shell>
  );
}
