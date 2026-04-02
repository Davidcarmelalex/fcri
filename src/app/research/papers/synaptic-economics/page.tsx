import Link from 'next/link';

export default function SynapticEconomicsPaper() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/research">
            <a className="text-gold/50 hover:text-gold text-sm">
              ← Back to Research Archive
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Synaptic Economics
          </h1>
          <p className="text-silver max-w-xl">
            Economy modeled like neural networks with adaptive value flow and feedback-driven liquidity.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Abstract */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Abstract</h2>
            <p className="text-silver line-clamp-4">
              Synaptic Economics proposes that economic systems can be modeled after neural networks, where value flows like neurotransmitters, adapting based on feedback loops. This framework enables adaptive liquidity, predictive market behaviors, and resilient financial infrastructures that evolve with participation.
            </p>
          </div>
          {/* Problem Statement */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Problem Statement</h2>
            <p className="text-silver">
              Traditional economic models are static, extractive, and fail to adapt to rapid changes in technology and human behavior. They rely on centralized control and lack the feedback mechanisms necessary for true resilience.
            </p>
          </div>
          {/* Research Depth */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Depth</h2>
            <p className="text-silver">
              Drawing from neuroscience, complex systems theory, and decentralized finance, this paper presents mathematical models of value transfer in economic networks, simulation results showing adaptive responses to shocks, and preliminary implementations in VoltexFinance.
            </p>
          </div>
          {/* Visual Models */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Visual Models</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gold/20 rounded"></div>
                <span className="text-silver">Nodes = Economic Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gold/20 rounded"></div>
                <span className="text-silver">Edges = Value Transfer Channels</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gold/20 rounded"></div>
                <span className="text-silver">Activation Functions = Market Conditions</span>
              </div>
            </div>
          </div>
          {/* Real-world Applications */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Real-world Applications</h2>
            <p className="text-silver">
              Directly powers the adaptive financial engine of VoltexFinance, enabling autonomous liquidity provision, yield optimization, and cross-border transactions without traditional intermediaries.
            </p>
          </div>
          {/* Linked Projects */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Linked Projects</h2>
            <div className="space-y-2">
              <Link href="/financial-systems/voltexfinance">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>VoltexFinance</span>
                </a>
              </Link>
              <Link href="/financial-systems/fusion-veritas">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>Fusion Veritas Bank</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}