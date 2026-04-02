import Link from 'next/link';

export default function VoltexFinance() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/financial-systems">
            <a className="text-gold/50 hover:text-gold text-sm">
              ← Back to Financial Systems
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            VoltexFinance
          </h1>
          <p className="text-silver max-w-xl">
            Autonomous financial engine, AI-driven capital flow, and yield optimization.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Overview */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-silver">
              VoltexFinance is an autonomous financial engine that leverages AI and adaptive economic models to optimize capital allocation, provide yield strategies, and enable programmable financial interactions. It serves as the execution layer of the FCRI financial stack.
            </p>
          </div>
          {/* Core Features */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Core Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Autonomous Engine</h3>
                  <p className="text-silver">AI-driven financial decision making and execution.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Adaptive Yield</h3>
                  <p className="text-silver">Dynamic yield optimization based on market conditions and participation.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Programmable Finance</h3>
                  <p className="text-silver">Financial operations defined by smart contracts and AI agents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Cross-Border Flow</h3>
                  <p className="text-silver">Seamless value transfer across jurisdictions and asset types.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Research Foundation */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Foundation</h2>
            <p className="text-silver">
              Powered by the Synaptic Economics framework, which models economic value flow like neural networks, enabling adaptive financial systems that respond to participation and market conditions.
            </p>
            <Link href="/research/papers/synaptic-economics">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>Read Synaptic Economics Paper →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
          {/* Real-world Impact */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Real-world Impact</h2>
            <p className="text-silver">
              Provides autonomous liquidity for decentralized economies, enables yield generation for crypto assets, and offers institutions a programmable financial infrastructure for innovative products.
            </p>
          </div>
          {/* Linked Systems */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Linked Systems</h2>
            <div className="space-y-2">
              <Link href="/financial-systems/fusion-veritas">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>Fusion Veritas Bank</span>
                </a>
              </Link>
              <Link href="/ecosystem/voltexbazar">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>VoltexBazar</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}