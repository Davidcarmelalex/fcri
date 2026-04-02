"use client";

import { useState } from "react";
import Link from "next/link";

const partnershipTracks = [
  {
    title: "Research institutions",
    body: "Universities, labs, and sovereign or frontier research programs that want to collaborate on papers, pilots, or frameworks.",
  },
  {
    title: "Deployment partners",
    body: "Organizations capable of piloting systems, publishing outcomes, or helping translate research into durable infrastructure.",
  },
  {
    title: "Strategic patrons",
    body: "Aligned supporters who can fund, sponsor, or institutionally support the long-horizon mission without diluting it.",
  },
];

export default function PartnershipsPage() {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "partnership",
          name,
          email,
          organization,
          budget,
          message,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Failed to submit partnership inquiry");
      }

      setStatus("success");
      setFeedback("Partnership inquiry received. FCRI now has your organization in the intake queue.");
      setName("");
      setEmail("");
      setOrganization("");
      setBudget("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Failed to submit partnership inquiry");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Partnerships
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Institutional alignment should start with a serious intake channel.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">
              This route is for collaborators, institutions, and operators that want to deploy FCRI frameworks into external systems without reducing the institute to vague “innovation” language.
            </p>

            <div className="mt-10 grid gap-4">
              {partnershipTracks.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gold/15 bg-white/5 p-6 backdrop-blur">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-silver">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gold/20 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Good partnership criteria</p>
              <p className="mt-3 text-base leading-7 text-silver">
                Good partners can host pilots, validate frameworks, support public research credibility, or extend the institute’s reach without extracting the mission into generic consulting.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8 backdrop-blur">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Partnership intake</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Submit a partnership inquiry</h2>
              <p className="mt-3 text-base leading-7 text-silver">
                Use this for institutional collaboration, pilots, hosting, sponsorship, or strategic ecosystem alignment.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="Lead contact"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="you@institution.org"
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
                    placeholder="Institution, project, or company"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">Scope or budget</label>
                  <input
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                    placeholder="Optional pilot size, budget, or timeline"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">Proposal</label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border border-gold/15 bg-black/40 px-4 py-3 text-white outline-none transition-colors focus:border-gold"
                  placeholder="Describe the collaboration, what systems or research are involved, and why the alignment makes sense."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)] disabled:opacity-70"
              >
                {status === "loading" ? "Submitting inquiry..." : "Submit partnership inquiry"}
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
                <Link href="/support" className="text-gold transition-colors hover:text-gold-light">
                  Support
                </Link>
                <Link href="/build" className="text-gold transition-colors hover:text-gold-light">
                  Build
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
