import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { SignalsWorkspace } from "@/components/demo/signals-workspace";

export const metadata: Metadata = {
  title: "Synthetic Signals Demo",
  robots: { index: false, follow: false },
};

export default function SignalsPage() {
  return (
    <Shell active="/signals">
      <SignalsWorkspace />
    </Shell>
  );
}
