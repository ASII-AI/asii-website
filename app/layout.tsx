import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DemoCaseProvider } from "@/components/demo/demo-case-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://asii.site"),
  title: {
    default: "ASII | Financial Crime Intelligence Infrastructure",
    template: "%s | ASII",
  },
  description:
    "Continuity-native financial crime intelligence infrastructure being developed for regulated institutions, with human-reviewed investigation and regulator-ready reporting workflows.",
  applicationName: "ASII",
  keywords: [
    "financial crime intelligence",
    "AML/CFT",
    "investigation continuity",
    "evidence lineage",
    "human review",
    "regulator-ready reporting",
    "Tajikistan",
  ],
  openGraph: {
    type: "website",
    siteName: "ASII",
    title: "ASII | Financial Crime Intelligence Infrastructure",
    description:
      "Infrastructure for preserving investigative context, evidence continuity, and regulator-ready reporting workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASII | Financial Crime Intelligence Infrastructure",
    description:
      "Infrastructure for preserving investigative context, evidence continuity, and regulator-ready reporting workflows.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#site-content">
          Skip to main content
        </a>
        <SiteHeader />
        <DemoCaseProvider>
          <div id="site-content" tabIndex={-1}>
            {children}
          </div>
        </DemoCaseProvider>
        <SiteFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
