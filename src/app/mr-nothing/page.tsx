"use client";
import Link from "next/link";
import { ArrowRight, Smartphone, Brain, Mic, Shield, Cpu, Globe } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Android-native agent runtime",
    body: "MR NOTHING runs natively on Android — not a web wrapper. Jetpack Compose UI, Kotlin core, real device-level integration.",
  },
  {
    icon: Brain,
    title: "Persistent contextual memory",
    body: "The agent remembers. Tasks, preferences, relationships, patterns — all stored and retrieved across sessions using a vector memory layer.",
  },
  {
    icon: Mic,
    title: "Voice-first interaction",
    body: "Natural language is the primary interface. Speak to execute tasks, query memory, or trigger automations without touching a screen.",
  },
  {
    icon: Cpu,
    title: "Workflow orchestration",
    body: "Complex multi-step tasks are broken down, planned, delegated to sub-agents, and executed — transparently and reliably.",
  },
  {
    icon: Shield,
    title: "Secure by design",
    body: "Zero-trust architecture. On-device processing where possible. Explicit permission scopes. Open and auditable.",
  },
  {
    icon: Globe,
    title: "Open source & MIT licensed",
    body: "MR NOTHING is fully open. The codebase, roadmap, and architecture are public. Contributions are welcome.",
  },
];

const stack = [
  { layer: "Mobile", tech: "Android · Kotlin · Jetpack Compose" },
  { layer: "Agent Runtime", tech: "FastAPI · Python · async task engine" },
  { layer: "Memory", tech: "Qdrant · vector embeddings · persistent context" },
  { layer: "Voice", tech: "Whisper STT · TTS synthesis · wake word" },
  { layer: "Dashboard", tech: "Next.js · React · real-time WebSocket" },
  { layer: "Database", tech: "PostgreSQL · Redis · event sourcing" },
];

const roadmap = [
  { phase: "Phase 1", title: "Android MVP", status: "building", items: ["Core agent loop", "Voice input/output", "Basic task execution", "Local memory store"] },
  { phase: "Phase 2", title: "Intelligence Layer", status: "planned", items: ["Contextual memory (Qdrant)", "Multi-turn reasoning", "Task planning engine", "Workflow templates"] },
  { phase: "Phase 3", title: "Ecosystem", status: "planned", items: ["Launcher integration", "Third-party skill SDK", "Device automation hooks", "Community marketplace"] },
];

const statusColors: Record<string, string> = {
  building: "bg-gold/20 text-gold border-gold/30",
  planned: "bg-white/10 text-silver border-white/10",
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function MrNothingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.07),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase mb-6">
            Open Source · FCRI Project
          </span>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            MR NOTHING
          </h1>
          <p className="mt-4 text-xl text-gold font-medium">
            For Hustlers. Dreamers. Builders.
          </p>
          <p className="mt-6 max-w-3xl text-lg text-silver leading-relaxed">
            An open-source Android-native agentic computing platform. Built as a tribute to brotherhood, loyalty, and human belief — designed to transform your device from a passive tool into an intelligent execution partner.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://github.com/Davidcarmelalex/fcri/tree/main/projects/mr-nothing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-6 py-3 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
            >
              View on GitHub <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/academics/fellowships"
              className="inline-flex items-center gap-2 rounded border border-white/10 px-6 py-3 text-sm font-medium text-silver hover:border-white/30 transition-colors"
            >
              Contribute via Fellowship
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/8 bg-white/2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Human-first agentic computing
            </h2>
            <p className="mt-4 text-silver max-w-2xl mx-auto">
              MR NOTHING is built on one core belief: the greatest technology amplifies humans, it doesn't replace them.
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

      {/* Stack */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8">Technology Stack</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s) => (
            <div key={s.layer} className="flex gap-4 rounded-lg border border-white/8 bg-white/3 p-4">
              <span className="text-xs font-bold text-gold uppercase tracking-wider min-w-[90px]">{s.layer}</span>
              <span className="text-sm text-silver">{s.tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-t border-white/8 bg-white/2">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-12">Roadmap</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {roadmap.map((r) => (
              <div key={r.phase} className="rounded-xl border border-white/8 bg-black p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-silver/60 uppercase tracking-wider">{r.phase}</span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[r.status]}`}>
                    {r.status}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-4">{r.title}</h3>
                <ul className="space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-silver">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto quote */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <blockquote className="rounded-2xl border border-gold/20 bg-gold/5 p-10 text-center">
          <p className="text-xl font-medium text-white leading-relaxed italic max-w-3xl mx-auto">
            "The greatest investment is not capital. It is people. The strongest empire is not built with machines alone — it is built through trust, relationships, and humans who refuse to let each other fall."
          </p>
          <footer className="mt-6 text-sm text-gold">
            — MR NOTHING Manifesto
          </footer>
        </blockquote>
      </section>
    </main>
  );
}
