import Link from 'next/link';

export default function Research() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Research Intelligence
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Research Archive
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI's research forms the foundation of our civilization stack. Each paper maps to frameworks, systems, and real-world impact.
          </p>
        </div>
        <div className="mt-16 space-y-12">
          {/* Research Categories */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-white">Research Categories</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Intelligence & Cognition */}
              <Link href="/research/intelligence">
                <a className="group flex flex-col items-start p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gold text-2xl">🧠</span>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-gold">Intelligence & Cognition</h4>
                  <p className="mt-2 text-silver max-w-sm">
                    Sentient computing, cognitive systems, human-AI symbiosis.
                  </p>
                </a>
              </Link>
              {/* Governance & Law */}
              <Link href="/research/governance">
                <a className="group flex flex-col items-start p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gold text-2xl">⚖️</span>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-gold">Governance & Law</h4>
                  <p className="mt-2 text-silver max-w-sm">
                    Algorithmic governance, computational law, decentralized justice.
                  </p>
                </a>
              </Link>
              {/* Economics & Finance */}
              <Link href="/research/economics">
                <a className="group flex flex-col items-start p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gold text-2xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-gold">Economics & Finance</h4>
                  <p className="mt-2 text-silver max-w-sm">
                    Synaptic economics, post-banking finance, adaptive liquidity.
                  </p>
                </a>
              </Link>
              {/* Culture & Human Systems */}
              <Link href="/research/culture">
                <a className="group flex flex-col items-start p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gold text-2xl">🎭</span>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-gold">Culture & Human Systems</h4>
                  <p className="mt-2 text-silver max-w-sm">
                    Information ecology, cultural systems, artist economies.
                  </p>
                </a>
              </Link>
              {/* Civilization Architecture */}
              <Link href="/research/civilization">
                <a className="group flex flex-col items-start p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gold text-2xl">🌍</span>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-gold">Civilization Architecture</h4>
                  <p className="mt-2 text-silver max-w-sm">
                    Fusion civilization theory, emergent systems, meta-political theory.
                  </p>
                </a>
              </Link>
              {/* AI & Machine Systems */}
              <Link href="/research/ai">
                <a className="group flex flex-col items-start p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gold text-2xl">🤖</span>
                  </div>
                  <h4 className="font-semibold text-white group-hover:text-gold">AI & Machine Systems</h4>
                  <p className="mt-2 text-silver max-w-sm">
                    Sentient computing, algorithmic ethics, autonomous individuals.
                  </p>
                </a>
              </Link>
            </div>
          </div>

          {/* Latest Papers */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">Latest Research Papers</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Paper 1 */}
              <Link href="/research/papers/synaptic-economics">
                <a className="group flex h-[200px] bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-semibold text-white group-hover:text-gold">Synaptic Economics</h4>
                    <p className="mt-2 text-silver line-clamp-3">
                      Economy modeled like neural networks with adaptive value flow and feedback-driven liquidity.
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gold">
                      <span>• 2025 • Finance Systems</span>
                    </div>
                  </div>
                </a>
              </Link>
              {/* Paper 2 */}
              <Link href="/research/papers/proof-of-justice">
                <a className="group flex h-[200px] bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-semibold text-white group-hover:text-gold">Proof-of-Justice (PoJ)</h4>
                    <p className="mt-2 text-silver line-clamp-3">
                      Justice as a programmable system where evidence and logic supersede authority.
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gold">
                      <span>• 2025 • Governance Systems</span>
                    </div>
                  </div>
                </a>
              </Link>
              {/* Paper 3 */}
              <Link href="/research/papers/sentient-computing">
                <a className="group flex h-[200px] bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-semibold text-white group-hover:text-gold">Sentient Computing</h4>
                    <p className="mt-2 text-silver line-clamp-3">
                      AI that adapts beyond static code with context-aware intelligence and emotional machines.
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gold">
                      <span>• 2025 • AI Systems</span>
                    </div>
                  </div>
                </a>
              </Link>
              {/* Paper 4 */}
              <Link href="/research/papers/information-ecology">
                <a className="group flex h-[200px] bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-semibold text-white group-hover:text-gold">Information Ecology</h4>
                    <p className="mt-2 text-silver line-clamp-3">
                      Information as an ecosystem, not a resource, defining adaptive data systems.
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gold">
                      <span>• 2025 • Data Systems</span>
                    </div>
                  </div>
                </a>
              </Link>
              {/* Paper 5 */}
              <Link href="/research/papers/fusion-civilization">
                <a className="group flex h-[200px] bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-semibold text-white group-hover:text-gold">Fusion Civilization Theory</h4>
                    <p className="mt-2 text-silver line-clamp-3">
                      Integrated human-machine governance system combining AI, governance, economy, and culture.
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gold">
                      <span>• 2025 • Civilization Architecture</span>
                    </div>
                  </div>
                </a>
              </Link>
              {/* Paper 6 */}
              <Link href="/research/papers/cognitive-metaphysics">
                <a className="group flex h-[200px] bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70 overflow-hidden">
                  <div className="p-6">
                    <h4 className="font-semibold text-white group-hover:text-gold">Cognitive Metaphysics</h4>
                    <p className="mt-2 text-silver line-clamp-3">
                      How intelligence forms and how machines can replicate or extend it under pressure.
                    </p>
                    <div className="mt-4 flex items-center text-xs text-gold">
                      <span>• 2025 • Cognition Systems</span>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}