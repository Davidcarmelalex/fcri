"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const highlights = [
  "Institutional-grade cross-border settlement",
  "Sovereign deployable — no third-party custody",
  "Real-time ledger and treasury visibility",
  "AI-powered routing and compliance layer",
  "Built under FCRI research mandate",
];

export default function NRLinkLanding() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_40%),linear-gradient(180deg,#080808_0%,#000_100%)] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/8 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-gold/40 bg-gold/10 text-gold font-bold text-xs">
              NR
            </div>
            <span className="text-sm font-semibold tracking-wide text-white">NRLink</span>
          </div>
          <nav className="hidden gap-6 md:flex">
            <a href="#architecture" className="text-sm text-silver hover:text-white transition-colors">Architecture</a>
            <a href="#modules" className="text-sm text-silver hover:text-white transition-colors">Modules</a>
            <a href="https://fcri.science" target="_blank" rel="noopener noreferrer" className="text-sm text-silver hover:text-white transition-colors">FCRI</a>
          </nav>
          <a
            href="https://fcri.science/support"
            className="rounded border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium text-gold hover:bg-gold/20 transition-colors"
          >
            Partner with us
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-28 text-center">
        <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-gold uppercase mb-8">
          A Fusion Civilization Research Institute Initiative
        </span>
        <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
          NRLink
        </h1>
        <p className="mt-4 text-xl font-medium text-gold">
          Cross-border settlement, reimagined.
        </p>
        <p className="mt-6 mx-auto max-w-2xl text-lg text-silver leading-relaxed">
          Premium liquidity orchestration infrastructure for sovereign projects, institutional operators, and cross-border businesses that need settlement reliability without correspondent bank dependency.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="https://fcri.science/support"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-8 py-3.5 font-medium text-gold hover:bg-gold/20 transition-colors"
          >
            Request Early Access <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://fcri.science/financial-systems/nrlink"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-8 py-3.5 font-medium text-silver hover:border-white/30 transition-colors"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Highlights */}
      <section id="architecture" className="border-t border-white/8 bg-white/2">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-3 max-w-xl mx-auto">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                <span className="text-silver">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 text-center">
        <p className="text-xs text-silver/40">
          NRLink is an initiative of{" "}
          <a href="https://fcri.science" className="hover:text-gold transition-colors">
            Fusion Civilization Research Institute
          </a>
          {" "}· Part of the{" "}
          <a href="https://voltexbazar.io" className="hover:text-gold transition-colors">
            Voltex Network
          </a>
        </p>
      </footer>
    </main>
  );
}
