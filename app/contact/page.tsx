"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    setError("");

    const form = new FormData(formElement);

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      organisation: form.get("organisation"),
      role: form.get("role"),
      institutionType: form.get("institutionType"),
      useCase: form.get("useCase"),
      timeframe: form.get("timeframe"),
      message: form.get("message"),
      website: form.get("website"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to submit the form.");
      }

      setStatus("success");
      formElement.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Unable to submit the form.",
      );
    }
  }

  return (
    <main className="min-h-screen px-4 py-16 text-blue-50 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-2xl border border-blue-300/15 bg-panel/80 p-8 shadow-2xl shadow-cyan-900/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            ASII Continuity Pilot
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-white">
            Start a pilot conversation
          </h1>

          <p className="mt-5 leading-relaxed text-blue-100/80">
            Discuss how ASII can help your institution improve financial crime
            intelligence continuity across Travel Rule, crypto risk,
            investigations, sanctions, and regulator-ready workflows.
          </p>

          <div className="mt-8 space-y-4 text-sm text-blue-100/75">
            <div>
              <strong className="text-white">Founder & CEO</strong>
              <br />
              Sukhrob Ziyovuddinov
            </div>

            <div>
              <strong className="text-white">Email</strong>
              <br />
              <a
                href="mailto:contact@asii.site"
                className="break-words text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                contact@asii.site
              </a>
            </div>

            <div>
              <strong className="text-white">WhatsApp</strong>
              <br />
              <a
                href="https://wa.me/971547590101"
                className="break-words text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
              >
                +971 54 759 01 01
              </a>
            </div>

            <div>
              <strong className="text-white">LinkedIn</strong>
              <br />
              <a
                href="https://www.linkedin.com/company/asii-intelligence/"
                className="text-cyan-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                target="_blank"
                rel="noreferrer"
              >
                ASII on LinkedIn
              </a>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/pilot"
              className="text-sm text-cyan-300 hover:text-cyan-200"
            >
              Review the Continuity Pilot →
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-300/15 bg-panel/80 p-8">
          <h2 className="text-2xl font-semibold text-white">
            Request a pilot discussion
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-blue-100/70">
            For regulated institutions, VASPs, fintechs, and strategic partners
            exploring an ASII pilot or integration conversation.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {[
              {
                name: "name",
                label: "Full name",
                placeholder: "Your full name",
                type: "text",
                autoComplete: "name",
              },
              {
                name: "email",
                label: "Work email",
                placeholder: "you@company.com",
                type: "email",
                autoComplete: "email",
              },
              {
                name: "organisation",
                label: "Organisation",
                placeholder: "Your institution",
                type: "text",
                autoComplete: "organization",
              },
              {
                name: "role",
                label: "Job title",
                placeholder: "MLRO / Compliance / Risk",
                type: "text",
                autoComplete: "organization-title",
              },
            ].map(({ name, label, placeholder, type, autoComplete }) => (
              <label key={name} className="block">
                <span className="mb-2 block text-sm text-blue-100/80">
                  {label}
                </span>
                <input
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  required={name !== "role"}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-blue-300/20 bg-bg/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
                />
              </label>
            ))}

            <label className="block">
              <span className="mb-2 block text-sm text-blue-100/80">
                Institution type
              </span>
              <select
                name="institutionType"
                className="w-full rounded-lg border border-blue-300/20 bg-bg/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                <option value="">Select</option>
                <option>Bank</option>
                <option>VASP / Crypto</option>
                <option>Fintech</option>
                <option>Payment Institution</option>
                <option>RegTech / Technology Partner</option>
                <option>Consulting / Advisory</option>
                <option>Other</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-blue-100/80">
                Primary use case
              </span>
              <select
                name="useCase"
                className="w-full rounded-lg border border-blue-300/20 bg-bg/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                <option value="">Select</option>
                <option>Travel Rule</option>
                <option>Crypto Risk</option>
                <option>Investigations</option>
                <option>Sanctions</option>
                <option>Adverse Media</option>
                <option>Cross-border Intelligence</option>
                <option>Regulator-ready Reporting</option>
                <option>Integrated Pilot</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-blue-100/80">
                Pilot timeframe
              </span>
              <select
                name="timeframe"
                className="w-full rounded-lg border border-blue-300/20 bg-bg/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              >
                <option value="">Select</option>
                <option>Immediate</option>
                <option>Within 30 days</option>
                <option>Within 90 days</option>
                <option>Exploring</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-blue-100/80">
                Message
              </span>
              <textarea
                name="message"
                required
                minLength={10}
                rows={6}
                placeholder="Tell us what you are trying to solve..."
                className="w-full rounded-lg border border-blue-300/20 bg-bg/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50"
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg border border-cyan-300/40 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:cursor-wait disabled:opacity-50"
            >
              {status === "sending"
                ? "Submitting..."
                : "Request Pilot Conversation"}
            </button>

            <div aria-live="polite" aria-atomic="true">
              {status === "success" ? (
                <p className="text-sm text-emerald-300">
                  Thank you. Your request has been submitted successfully.
                </p>
              ) : null}
              {status === "error" ? (
                <p className="text-sm text-red-300">{error}</p>
              ) : null}
            </div>

            <p className="text-xs leading-relaxed text-blue-100/55">
              Information submitted through this form is used to respond to your
              enquiry. Please do not include confidential case data, personal
              data relating to customers, or other sensitive investigative
              material.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
