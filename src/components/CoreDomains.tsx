export default function CoreDomains() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Core Domains
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            The Pillars of Civilization Engineering
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI operates across five interconnected domains, each feeding into the next to create a unified civilization stack.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Intelligence */}
          <div className="relative flex items-start gap-4 p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <span className="text-gold text-2xl">🧠</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Intelligence & Cognition</h3>
              <p className="mt-2 text-silver">
                Sentient computing, cognitive systems, human-AI symbiosis, and decision architectures.
              </p>
            </div>
          </div>
          {/* Finance */}
          <div className="relative flex items-start gap-4 p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <span className="text-gold text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Financial Systems</h3>
              <p className="mt-2 text-silver">
                Adaptive economic models, autonomous liquidity, post-banking finance, and synaptic economics.
              </p>
            </div>
          </div>
          {/* Governance */}
          <div className="relative flex items-start gap-4 p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <span className="text-gold text-2xl">⚖️</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Governance & Law</h3>
              <p className="mt-2 text-silver">
                Algorithmic governance, computational law, decentralized justice, and Proof-of-Justice.
              </p>
            </div>
          </div>
          {/* Culture */}
          <div className="relative flex items-start gap-4 p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <span className="text-gold text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Culture & Expression</h3>
              <p className="mt-2 text-silver">
                Artist economies, cultural resistance, narrative infrastructure, and information ecology.
              </p>
            </div>
          </div>
          {/* Civilization */}
          <div className="relative flex items-start gap-4 p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
              <span className="text-gold text-2xl">🌍</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Civilization Architecture</h3>
              <p className="mt-2 text-silver">
                Integrated human-machine systems, fusion civilization theory, and emergent governance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}