"use client";

import { useState } from "react";
import Link from "next/link";

const lanes = [
  {
    title: "Researcher",
    body: "Contribute to frontier research, paper production, and framework development.",
  },
  {
    title: "Builder",
    body: "Help translate institute work into systems, interfaces, archives, and deployable infrastructure.",
  },
  {
    title: "Partner or patron",
    body: "Support FCRI with institutional backing, aligned collaboration, or long-horizon sponsorship.",
  },
];

export default function ParticipationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "fellowship",
          name,
          email,
          organization,
          budget,
          message,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Failed to submit participation inquiry");
      }

      setStatus("success");
      setFeedback("Participation inquiry received. FCRI now has your profile in the fellowship and contributor intake queue.");
      setName("");
      setEmail("");
      setOrganization("");
      setBudget("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Failed to submit participation inquiry");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Participation
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Join the institute through a real intake path.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">
              Participation should work like an organization, not just a landing page. This route is for researchers, builders, fellows, and aligned contributors entering the FCRI orbit.
            </p>

            <div className="mt-10 grid gap-4">
              {lanes.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gold/15 bg-white/5 p-6 backdrop-blur">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-silver">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gold/20 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Entry expectation</p>
              <p className="mt-3 text-base leading-7 text-silver">
                Strong applicants should describe their domain, the contribution they want to make, and the institutional role they believe they can credibly sustain.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8 backdrop-blur">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Contributor intake</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Submit a participation inquiry</h2>
              <p className="mt-3 text-base leading-7 text-silver">
                Use this for fellowship, contributor, researcher, or builder entry into the institute.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold" placeholder="Your full name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold" placeholder="you@domain.org" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Organization or background</label>
                  <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold" placeholder="Institution, lab, company, or personal background" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Availability or scope</label>
                  <input value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold" placeholder="Time commitment, scope, or resources" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Why you want to join</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                  placeholder="Explain the contribution you want to make, which part of the institute you fit into, and why your entry path makes sense."
                />
              </div>

              <button type="submit" disabled={status === "loading"} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)] disabled:opacity-70">
                {status === "loading" ? "Submitting inquiry..." : "Submit participation inquiry"}
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
                <Link href="/academics/fellowships" className="text-gold transition-colors hover:text-gold-light">Fellowships</Link>
                <Link href="/partnerships" className="text-gold transition-colors hover:text-gold-light">Partnerships</Link>
                <Link href="/build" className="text-gold transition-colors hover:text-gold-light">Build</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
