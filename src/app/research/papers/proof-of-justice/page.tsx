import Link from 'next/link';

export default function ProofOfJusticePaper() {
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
            Proof-of-Justice (PoJ)
          </h1>
          <p className="text-silver max-w-xl">
            Justice as a programmable system where evidence and logic supersede authority.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Abstract */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Abstract</h2>
            <p className="text-silver line-clamp-4">
              Proof-of-Justice (PoJ) redefines justice as a programmable system where outcomes are determined by verifiable evidence and logical inference rather than hierarchical authority. This framework enables decentralized legal protection, algorithmic dispute resolution, and human rights infrastructure that operates independently of traditional jurisdictions.
            </p>
          </div>
          {/* Problem Statement */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Problem Statement</h2>
            <p className="text-silver">
              Current justice systems are slow, expensive, inaccessible, and often corrupted by power dynamics. They rely on human judgment that can be biased, inconsistent, and manipulated, leaving vulnerable populations without protection.
            </p>
          </div>
          {/* Research Depth */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Depth</h2>
            <p className="text-silver">
              This paper presents formal logic models for justice computation, case studies in decentralized arbitration, and the architectural specification for The Broken Shield system, which implements PoJ principles in practice.
            </p>
          </div>
          {/* Visual Models */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Visual Models</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gold/20 rounded"></div>
                <span className="text-silver">Input = Evidence & Claims</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gold/20 rounded"></div>
                <span className="text-silver">Process = Logical Inference Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gold/20 rounded"></div>
                <span className="text-silver">Output = Justice Determination</span>
              </div>
            </div>
          </div>
          {/* Real-world Applications */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Real-world Applications</h2>
            <p className="text-silver">
              Directly powers The Broken Shield, providing decentralized legal protection for activists, journalists, and individuals in crisis situations where traditional systems fail or are compromised.
            </p>
          </div>
          {/* Linked Projects */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Linked Projects</h2>
            <div className="space-y-2">
              <Link href="/justice/broken-shield">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>The Broken Shield</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}