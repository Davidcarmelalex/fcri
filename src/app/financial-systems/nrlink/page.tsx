"use client";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Zap, BarChart3, Lock, Network } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Cross-border liquidity orchestration",
    body: "Move institutional capital across jurisdictions without correspondent banking bottlenecks. Direct settlement paths between sovereign and institutional actors.",
  },
  {
    icon: Shield,
    title: "Compliance-native architecture",
    body: "Compliance workflows are built into the settlement layer, not bolted on. Every transaction carries a verifiable compliance envelope.",
  },
  {
    icon: Zap,
    title: "Machine-speed settlement",
    body: "The settlement engine operates at system speed. Beneficiary verification, quote generation, and execution happen in milliseconds, not days.",
  },
  {
    icon: BarChart3,
    title: "Real-time treasury visibility",
    body: "Full ledger transparency for institutional operators. Every hold, fee, and settlement event is visible in real time.",
  },
  {
    icon: Lock,
    title: "Sovereign deployability",
    body: "NRLink is designed for sovereign and institutional deployment. No third-party custody requirements. Your infrastructure, your keys, your settlement.",
  },
  {
    icon: Network,
    title: "AI agent layer",
    body: "An embedded AI operations layer handles routing intelligence, anomaly detection, and automated compliance checks across all settlement flows.",
  },
];

const modules = [
  { label: "Auth & Identity", status: "building", desc: "KYC/AML-compatible identity layer for institutional actors" },
  { label: "Quote Engine", status: "planned", desc: "Real-time FX and liquidity routing intelligence" },
  { label: "Transaction Engine", status: "building", desc: "Core settlement orchestration and ledger management" },
  { label: "Beneficiary Registry", status: "planned", desc: "Verified recipient management and compliance screening" },
  { label: "Compliance Hooks", status: "planned", desc: "Pluggable regulatory compliance workflows" },
  { label: "Webhook System", status: "building", desc: "Real-time event streaming for institutional integrators" },
  { label: "Admin Dashboard", status: "planned", desc: "Ops, treasury monitoring, and compliance review interface" },
  { label: "AI Agent Layer", status: "planned", desc: "Intelligent routing, anomaly detection, automated ops" },
];

const statusColors: Record<string, string> = {
  building: "bg-gold/20 text-gold border-gold/30",
  planned: "bg-white/10 text-silver border-white/10",
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function NRLinkPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase mb-6">
            Financial Infrastructure · FCRI Initiative
          </span>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            NRLink
          </h1>
          <p className="mt-4 text-xl text-gold font-medium">
            Premium cross-border settlement infrastructure.
          </p>
          <p className="mt-6 max-w-3xl text-lg text-silver leading-relaxed">
            NRLink is a flagship financial infrastructure initiative under FCRI — a sovereign-grade liquidity orchestration platform for institutions that operate where traditional banking cannot follow.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
            >
              Partner with NRLink <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/financial-systems"
              className="inline-flex items-center gap-2 rounded border border-white/10 px-6 py-3 text-sm font-medium text-silver hover:border-white/30 transition-colors"
            >
              All Financial Systems
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/8 bg-white/2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Infrastructure for where banking breaks
            </h2>
            <p className="mt-4 text-silver max-w-2xl mx-auto">
              Built for sovereign projects, cross-border operators, and institutions that need settlement reliability without correspondent bank dependency.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/8 bg-black p-6 hover:border-gold/20 transition-colors">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
                  <f.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-silver leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture modules */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white">System Architecture</h2>
          <p className="mt-3 text-silver">
            NRLink is built as a modular backend system. Each layer is independently deployable and composable.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div key={m.label} className="rounded-lg border border-white/8 bg-white/3 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">{m.label}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[m.status]}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-silver leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Institutional partnership inquiries
          </h2>
          <p className="text-silver max-w-xl mx-auto mb-8">
            NRLink is in active development. We are working with select institutional partners on the initial deployment layer.
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-8 py-3 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
