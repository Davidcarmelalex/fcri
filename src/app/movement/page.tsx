import Link from 'next/link';

export default function Movement() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Movement & Narrative
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            The Civilizational Movement
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI is not just an institute—it's a movement. Through Broken Shield and Soulforge, we protect justice and amplify culture in the fight for future civilizations.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {/* Broken Shield */}
          <Link href="/justice/broken-shield">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">The Broken Shield</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Decentralized legal protection and human rights infrastructure.
              </p>
            </a>
          </Link>
          {/* Soulforge */}
          <Link href="/culture/soulforge">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🎭</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Soulforge</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Artist economy & cultural resistance layer.
              </p>
            </a>
          </Link>
          {/* BBZ + Pangea */}
          <Link href="/ecosystem/bbz-pangea">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">BBZ + Pangea</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Cultural economy and community token.
              </p>
            </a>
          </Link>
          {/* Join Movement CTA */}
          <div className="flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
            <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gold text-2xl">✊</span>
            </div>
            <h3 className="font-semibold text-white group-hover:text-gold">Join the Movement</h3>
            <p className="mt-2 text-silver text-center max-w-sm">
              Contribute to Broken Shield, Soulforge, and the civilizational mission.
            </p>
            <Link href="/participation">
              <a className="mt-4 inline-block px-4 py-2 bg-gold text-black font-medium text-sm hover:bg-gold-light">
                Participate Now
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}