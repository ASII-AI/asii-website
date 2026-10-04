import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Public Contact Verification",
  description:
    "Verify ASII's official public domain, institutional email, and LinkedIn channel.",
  alternates: {
    canonical: "https://asii.site/verify",
  },
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen px-4 py-16 text-blue-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="rounded-2xl border border-blue-300/15 bg-panel/80 p-8 shadow-2xl shadow-cyan-900/20 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Public Contact Verification
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-white">
            Verify ASII public contact channels
          </h1>

          <p className="mt-5 max-w-3xl leading-relaxed text-blue-100/80">
            This page is published on the official ASII domain and is intended
            only to confirm the public contact channels listed below.
          </p>

          <dl className="mt-8 divide-y divide-blue-300/10 overflow-hidden rounded-xl border border-blue-300/15 bg-bg/35">
            <div className="grid gap-2 p-5 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-white">Official domain</dt>
              <dd>
                <a
                  href="https://asii.site"
                  className="break-words text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  asii.site
                </a>
              </dd>
            </div>

            <div className="grid gap-2 p-5 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-white">Corporate email</dt>
              <dd>
                <a
                  href="mailto:contact@asii.site"
                  className="break-words text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  contact@asii.site
                </a>
              </dd>
            </div>

            <div className="grid gap-2 p-5 sm:grid-cols-[10rem_1fr]">
              <dt className="font-medium text-white">LinkedIn</dt>
              <dd>
                <a
                  href="https://www.linkedin.com/company/asii-intelligence/"
                  className="break-words text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                  target="_blank"
                  rel="noreferrer"
                >
                  ASII on LinkedIn
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-8 rounded-xl border border-amber-300/15 bg-amber-300/5 p-5 text-sm leading-relaxed text-blue-100/70">
            This page does not verify regulatory status, partnerships, customer
            relationships, deployments, individuals, or third-party accounts. Do
            not send confidential case data, customer personal data, or
            sensitive investigative material to an unverified channel.
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link
              href="/contact"
              className="text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              Contact ASII →
            </Link>
            <Link
              href="/"
              className="text-blue-100/65 hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              Return to ASII home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
