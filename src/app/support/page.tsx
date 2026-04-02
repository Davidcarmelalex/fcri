"use client";

import { useState } from "react";
import Link from "next/link";
import { treasuryConfig } from "@/lib/treasury";

const supportLanes = [
  {
    title: "Research funding",
    body: "Direct support for publications, prototype systems, archives, and continuity of frontier science programs.",
  },
  {
    title: "Institutional partnerships",
    body: "For aligned labs, sovereign projects, education partners, and operators that want to deploy FCRI frameworks responsibly.",
  },
  {
    title: "Fellowship and participation",
    body: "For researchers, builders, and contributors who want to enter the institute through a structured path.",
  },
];

export default function SupportPage() {
  const [type, setType] = useState("donation");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function copyWallet(address: string) {
    await navigator.clipboard.writeText(address);
    setFeedback("Treasury wallet copied.");
    setStatus("success");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          name,
          email,
          organization,
          budget,
          message,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Failed to submit inquiry");
      }

      setStatus("success");
      setFeedback("Inquiry received. FCRI now has your message in the institute intake queue.");
      setName("");
      setEmail("");
      setOrganization("");
      setBudget("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Failed to submit inquiry");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Support
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Support FCRI with a real institutional intake path.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">
              FCRI support should work like an organization. Donors, partners, and aligned contributors need a serious channel that routes intent into a reviewable institutional process.
            </p>

            <div className="mt-10 grid gap-4">
              {supportLanes.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gold/15 bg-white/5 p-6 backdrop-blur">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-silver">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gold/20 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Operational note</p>
              <p className="mt-3 text-base leading-7 text-silver">
                Current treasury intake is crypto-only: USDT and USDC on EVM-compatible chains. This intake form gives the institute a clean operational pathway before funds are routed.
              </p>
            </div>

            <div className="mt-6 rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Published Treasury Rails</p>
              <div className="mt-5 grid gap-4">
                {treasuryConfig.walletReferences.map((wallet) => (
                  <div key={wallet.label} className="rounded-2xl border border-gold/10 bg-black/30 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-base font-semibold text-white">{wallet.label}</h2>
                        <p className="mt-2 break-all font-mono text-sm text-gold-light">{wallet.address}</p>
                        <p className="mt-3 text-sm leading-6 text-silver">{wallet.note}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyWallet(wallet.address)}
                        className="inline-flex items-center justify-center rounded-full border border-gold/20 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-white transition-colors hover:border-gold hover:text-gold-light"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8 backdrop-blur">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Institution Intake</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Submit a support inquiry</h2>
              <p className="mt-3 text-base leading-7 text-silver">
                Use this for donations, partnerships, fellowships, or mission-aligned general support. Direct treasury support is currently limited to USDT and USDC on EVM chains.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-white">Inquiry type</label>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                >
                  <option value="donation">Donation / Funding</option>
                  <option value="partnership">Partnership</option>
                  <option value="fellowship">Fellowship / Participation</option>
                  <option value="general">General Institutional Inquiry</option>
                </select>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="you@organization.com"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Organization</label>
                  <input
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="Institution, company, or project"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Budget or scope</label>
                  <input
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="Optional funding size or scope"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Message</label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={7}
                  className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                  placeholder="Describe your interest, funding intent, institutional fit, or the type of collaboration you want to explore."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)] disabled:opacity-70"
              >
                {status === "loading" ? "Submitting inquiry..." : "Submit institutional inquiry"}
              </button>
            </form>

            {feedback ? (
              <p className={`mt-5 text-sm leading-6 ${status === "success" ? "text-[var(--accent)]" : "text-[#ffb86c]"}`}>
                {feedback}
              </p>
            ) : null}

            <div className="mt-8 border-t border-gold/10 pt-6 text-sm leading-6 text-silver">
              <p>Related paths:</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <Link href="/participation" className="text-gold transition-colors hover:text-gold-light">
                  Participation
                </Link>
                <Link href="/partnerships" className="text-gold transition-colors hover:text-gold-light">
                  Partnerships
                </Link>
                <Link href="/research" className="text-gold transition-colors hover:text-gold-light">
                  Research
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
