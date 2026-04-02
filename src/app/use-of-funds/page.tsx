import Link from "next/link";
import { treasuryConfig } from "@/lib/treasury";

export default function UseOfFundsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
            Use of Funds
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Contributions should map clearly into research, programs, and infrastructure.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-silver">
            A credible institute needs contribution clarity. This page should make it obvious how funding sustains publications, teaching, infrastructure, and the continuity required for serious work.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {treasuryConfig.allocation.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gold/15 bg-black/40 p-6">
              <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-base leading-7 text-silver">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-gold">Funding posture</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-gold/10 bg-black/30 p-5">
              <h2 className="text-xl font-semibold text-white">Research continuity first</h2>
              <p className="mt-3 text-base leading-7 text-silver">
                Contributions should preserve the ability to publish, refine, archive, and extend the institute’s frontier science body of work over time.
              </p>
            </div>
            <div className="rounded-2xl border border-gold/10 bg-black/30 p-5">
              <h2 className="text-xl font-semibold text-white">Institution building, not vanity spend</h2>
              <p className="mt-3 text-base leading-7 text-silver">
                Design, hosting, educational systems, and operational infrastructure matter because they translate ideas into a durable institutional presence.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/support"
            className="inline-flex items-center justify-center rounded-none bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)]"
          >
            Support FCRI
          </Link>
          <Link
            href="/token"
            className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-semibold tracking-[0.08em] text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
          >
            View Token Positioning
          </Link>
        </div>
      </section>
    </main>
  );
}
