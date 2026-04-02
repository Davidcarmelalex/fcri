import Link from "next/link";
import { treasuryConfig } from "@/lib/treasury";

export default function TokenPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
            Token
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Participation layer, not speculative marketing.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-silver">
            The FCRI token belongs inside the institute’s participation and access architecture. It should be framed through utility, contribution, and ecosystem entry, not investment hype.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gold/15 bg-black/40 p-6">
            <h2 className="text-2xl font-semibold text-white">Access</h2>
            <p className="mt-4 text-base leading-7 text-silver">
              Token-linked access can gate research archives, courses, institute releases, and later-stage participation tracks.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-black/40 p-6">
            <h2 className="text-2xl font-semibold text-white">Support</h2>
            <p className="mt-4 text-base leading-7 text-silver">
              Treasury support must map clearly into research continuity, infrastructure, and educational programming.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/15 bg-black/40 p-6">
            <h2 className="text-2xl font-semibold text-white">Governance horizon</h2>
            <p className="mt-4 text-base leading-7 text-silver">
              Any governance framing belongs to a later, disciplined phase after the institute’s operating model is stable.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Treasury references</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Initial support rails for mission-aligned contributors</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-silver">
              These references are limited to USDT and USDC on EVM-compatible chains for now and should be treated as institutional treasury routes, not retail trading prompts.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {treasuryConfig.walletReferences.map((wallet) => (
              <div key={wallet.label} className="rounded-2xl border border-gold/15 bg-black/40 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-gold">{wallet.label}</p>
                <p className="mt-3 break-all font-mono text-sm text-white">{wallet.address}</p>
                <p className="mt-3 text-sm leading-6 text-silver">{wallet.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {treasuryConfig.allocation.map((item) => (
            <div key={item.title} className="rounded-2xl border border-gold/15 bg-black/40 p-6">
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-base leading-7 text-silver">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/support"
            className="inline-flex items-center justify-center rounded-none bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)]"
          >
            Submit Support Inquiry
          </Link>
          <Link
            href="/use-of-funds"
            className="inline-flex items-center justify-center border border-white/20 px-6 py-4 text-sm font-semibold tracking-[0.08em] text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
          >
            Review Use Of Funds
          </Link>
        </div>
      </section>
    </main>
  );
}
