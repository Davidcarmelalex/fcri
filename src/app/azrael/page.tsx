"use client";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Eye, RefreshCw, Globe, Code } from "lucide-react";

const principles = [
  { icon: Shield, title: "Self-healing resilience", body: "AZRAEL doesn't just detect threats — it heals from them. Recovery is automatic, auditable, and sovereign." },
  { icon: Eye, title: "Machine-speed detection", body: "Threat detection operates at system speed. No human-in-the-loop delay for known patterns." },
  { icon: Globe, title: "Sovereign deployability", body: "Deploy on your infrastructure. No cloud lock-in. No third-party telemetry. Your defense stack, your keys." },
  { icon: Code, title: "Open governance", body: "All response playbooks are versioned, auditable, and publicly reviewable. Security through transparency." },
  { icon: Zap, title: "Autonomous agent mesh", body: "AZRAEL coordinates a swarm of specialized agents — sense, respond, heal — in parallel, at machine speed." },
  { icon: RefreshCw, title: "Continuous adaptation", body: "The system learns from every incident, updating its response models without requiring manual policy updates." },
];

const modules = [
  { name: "azrael-core", role: "Orchestration engine — routes decisions across the agent mesh", status: "building" },
  { name: "azrael-sense", role: "Threat detection — ingests telemetry, logs, network events", status: "planned" },
  { name: "azrael-response", role: "Automated response — containment, mitigation, playbook execution", status: "planned" },
  { name: "azrael-heal", role: "Self-healing — system state restoration and recovery validation", status: "planned" },
  { name: "azrael-intel", role: "Threat intelligence — external IOC feeds and signature updates", status: "planned" },
  { name: "azrael-swarm", role: "Multi-node deployment — distributed agent coordination", status: "planned" },
  { name: "azrael-console", role: "Operator dashboard — human oversight and incident review", status: "planned" },
  { name: "azrael-sdk", role: "Integration SDK — for connecting external security systems", status: "planned" },
];

const statusColors: Record<string, string> = {
  building: "bg-gold/20 text-gold border-gold/30",
  planned: "bg-white/10 text-silver border-white/10",
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function AzraelPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.07),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase mb-6">
            Open Initiative · FCRI Research
          </span>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            AZRAEL
          </h1>
          <p className="mt-4 text-xl text-gold font-medium">
            The Guardian You Don't Challenge.
          </p>
          <p className="mt-6 max-w-3xl text-lg text-silver leading-relaxed">
            The world's first self-healing autonomous cyber defense stack. Open. Sovereign. Relentless. AZRAEL is built for institutions that cannot afford failure.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://github.com/Davidcarmelalex/fcri/tree/main/azrael"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
            >
              View on GitHub <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/research/intelligence"
              className="inline-flex items-center gap-2 rounded border border-white/10 px-6 py-3 text-sm font-medium text-silver hover:border-white/30 transition-colors"
            >
              Research Foundation
            </Link>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-white/8 bg-white/2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Cybersecurity was built for a slower world
            </h2>
            <p className="mt-4 text-silver max-w-2xl mx-auto">
              AZRAEL exists to build adaptive, governed, resilient cyber defense infrastructure for the institutions that cannot afford failure.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="rounded-xl border border-white/8 bg-black p-6 hover:border-gold/20 transition-colors">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
                  <p.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-silver leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-4">System Architecture</h2>
        <p className="text-silver mb-10 max-w-2xl">
          AZRAEL operates as a coordinated mesh of specialized agents. Each module is independently deployable and governed by auditable policy rules.
        </p>
        <div className="rounded-xl border border-white/8 bg-white/3 p-8 mb-8 font-mono text-sm">
          <pre className="text-silver/80 leading-relaxed overflow-x-auto">{`┌─────────────────────────────────────────────────────────┐
│                    AZRAEL MESH                          │
│                                                         │
│  ┌────────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │azrael-sense│──▶│ azrael-core │──▶│azrael-response│  │
│  │ (detection)│   │(orchestrator│   │ (execution)  │  │
│  └────────────┘   └──────┬──────┘   └──────────────┘  │
│                           │                             │
│                    ┌──────▼──────┐                     │
│                    │azrael-heal  │                     │
│                    │ (recovery)  │                     │
│                    └─────────────┘                     │
└─────────────────────────────────────────────────────────┘
         │                          │
  ┌──────▼──────┐           ┌───────▼──────┐
  │azrael-intel │           │azrael-console│
  │  (threat    │           │  (operator   │
  │   feeds)    │           │  dashboard)  │
  └─────────────┘           └──────────────┘`}</pre>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div key={m.name} className="rounded-lg border border-white/8 bg-white/3 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-gold">{m.name}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColors[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-silver leading-relaxed">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Contribute to AZRAEL
          </h2>
          <p className="text-silver max-w-xl mx-auto mb-8">
            AZRAEL is an open research initiative. Security researchers, engineers, and institutional partners are welcome to contribute to the architecture and implementation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/Davidcarmelalex/fcri/tree/main/azrael"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
            >
              GitHub <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/academics/fellowships"
              className="inline-flex items-center gap-2 rounded border border-white/10 px-6 py-2.5 text-sm font-medium text-silver hover:border-white/30 transition-colors"
            >
              Research Fellowship
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
