import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { ReviewWorkspace } from "@/components/demo/review-workspace";

export const metadata: Metadata = {
  title: "Analyst Review Demo",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <Shell active="/review">
      <ReviewWorkspace />
    </Shell>
  );
}
