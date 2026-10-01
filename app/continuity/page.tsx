import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { ContinuityWorkspace } from "@/components/demo/continuity-workspace";

export const metadata: Metadata = {
  title: "Case Continuity Demo",
  robots: { index: false, follow: false },
};

export default function ContinuityPage() {
  return (
    <Shell active="/continuity">
      <ContinuityWorkspace />
    </Shell>
  );
}
