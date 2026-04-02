import Link from 'next/link';

export default function Soulforge() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/culture">
            <a className="text-gold/50 hover:text-gold text-sm">
              ← Back to Culture
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Soulforge
          </h1>
          <p className="text-silver max-w-xl">
            Artist economy & cultural resistance layer.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Overview */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-silver">
              Soulforge is FCRI's cultural system that empowers artists, preserves cultural heritage, and fosters resistance through creative expression. It provides economic infrastructure for artists to monetize their work, tools for cultural preservation, and platforms for narrative warfare in the battle for future civilizations.
            </p>
          </div>
          {/* Core Features */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Core Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Artist Economy</h3>
                  <p className="text-silver">Monetize creative work through NFTs, subscriptions, and direct support.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Cultural Preservation</h3>
                  <p className="text-silver">Tools and platforms to document, archive, and disseminate cultural heritage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Narrative Infrastructure</h3>
                  <p className="text-silver">Platforms for creating and distributing counter-narratives and independent media.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Community Governance</h3>
                  <p className="text-silver">Artist-led governance of the cultural economy and platforms.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Research Foundation */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Foundation</h2>
            <p className="text-silver">
              Based on the Information Ecology framework, which defines information as an ecosystem rather than a resource, enabling adaptive cultural systems that evolve with participation and context.
            </p>
            <Link href="/research/papers/information-ecology">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>Read Information Ecology Paper →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
          {/* Real-world Impact */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Real-world Impact</h2>
            <p className="text-silver">
              Enables artists to earn sustainable incomes from their work, protects endangered cultural knowledge from erasure, and provides tools for communities to defend their narratives against misinformation and propaganda.
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