import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-subtle bg-bg">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-textMuted sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
        <div className="max-w-3xl">
          <p className="font-medium text-text">ASII</p>
          <p className="mt-2 leading-relaxed">
            Continuity-native financial crime intelligence infrastructure being
            developed for regulated institutions, preserving investigation
            context, evidence lineage, and human-reviewed decision history.
          </p>
          <p className="mt-2 text-xs leading-relaxed">
            ASII is intended to support human-reviewed workflows and
            regulator-ready reporting preparation. It does not provide legal
            advice or guarantee compliance outcomes.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          <Link className="transition hover:text-text" href="/platform">
            Platform
          </Link>
          <a
            className="transition hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            href="mailto:contact@asii.site"
          >
            contact@asii.site
          </a>
          <Link className="transition hover:text-text" href="/contact">
            Contact
          </Link>
          <a
            className="transition hover:text-text"
            href="https://www.linkedin.com/company/asii-intelligence/"
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
