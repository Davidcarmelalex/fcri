import Link from 'next/link';

export default function BrokenShield() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/justice">
            <a className="text-gold/50 hover:text-gold text-sm">
              ← Back to Justice Systems
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            The Broken Shield
          </h1>
          <p className="text-silver max-w-xl">
            Decentralized legal protection, human rights infrastructure, and crisis survival systems.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Overview */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-silver">
              The Broken Shield is a decentralized justice system that provides legal protection and human rights infrastructure independent of traditional jurisdictions. It implements the Proof-of-Justice framework, where outcomes are determined by verifiable evidence and logical inference rather than hierarchical authority.
            </p>
          </div>
          {/* Core Features */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Core Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Evidence-Based Justice</h3>
                  <p className="text-silver">Outcomes determined by verifiable evidence and logical inference.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Decentralized Arbitration</h3>
                  <p className="text-silver">Dispute resolution without centralized authorities or jurisdictions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Human Rights Protection</h3>
                  <p className="text-silver">Protection for activists, journalists, and individuals in crisis situations.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Crisis Response</h3>
                  <p className="text-silver">Rapid deployment legal infrastructure for emergency situations.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Research Foundation */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Foundation</h2>
            <p className="text-silver">
              Built upon the Proof-of-Justice (PoJ) framework, which redefines justice as a programmable system where evidence and logic supersede authority, enabling decentralized legal protection and algorithmic dispute resolution.
            </p>
            <Link href="/research/papers/proof-of-justice">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>Read Proof-of-Justice Paper →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
          {/* Real-world Impact */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Real-world Impact</h2>
            <p className="text-silver">
              Provides legal protection for individuals in jurisdictions where traditional systems fail or are compromised, enables decentralized arbitration for cross-border disputes, and offers a foundation for human rights infrastructure in emerging digital nations.
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