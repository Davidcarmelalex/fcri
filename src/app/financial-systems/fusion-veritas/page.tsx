import Link from 'next/link';

export default function FusionVeritasBank() {
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
            Fusion Veritas Bank
          </h1>
          <p className="text-silver max-w-xl">
            Global account system, borderless financial identity, and asset tokenization.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Overview */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-silver">
              Fusion Veritas Bank is a decentralized financial institution providing global account services, borderless financial identity, and asset tokenization. It operates as the banking layer of the FCRI financial stack, enabling sovereign financial interactions without traditional intermediaries.
            </p>
          </div>
          {/* Core Features */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Core Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Global Accounts</h3>
                  <p className="text-silver">Multi-currency accounts accessible anywhere with cryptographic identity.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Borderless Identity</h3>
                  <p className="text-silver">Financial sovereignty through self-custodied identity verification.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Asset Tokenization</h3>
                  <p className="text-silver">Real-world assets represented as programmable tokens on-chain.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Institutional Grade</h3>
                  <p className="text-silver">APIs and infrastructure designed for institutional adoption.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Research Foundation */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Foundation</h2>
            <p className="text-silver">
              Built upon the Synaptic Economics framework, which models economic value flow like neural networks, enabling adaptive financial systems that respond to participation and market conditions.
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
              Enables cross-border transactions for the unbanked, provides financial infrastructure for emerging economies, and offers institutions a pathway to tokenize assets while maintaining regulatory compliance.
            </p>
          </div>
          {/* Linked Systems */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Linked Systems</h2>
            <div className="space-y-2">
              <Link href="/financial-systems/voltexfinance">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>VoltexFinance</span>
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