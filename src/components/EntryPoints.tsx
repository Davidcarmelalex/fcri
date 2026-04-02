import Link from 'next/link';

export default function EntryPoints() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Your Entry Point
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Join the Civilization Engineering Mission
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            Choose your path to contribute to the future of human systems.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Explore Research */}
          <Link href="/research">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🔬</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Explore Research</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Dive into our 25+ frontier research papers and frameworks.
              </p>
            </a>
          </Link>
          {/* Join Movement */}
          <Link href="/movement">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">✊</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Join Movement</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Contribute to Broken Shield, Soulforge, and the civilizational mission.
              </p>
            </a>
          </Link>
          {/* Build With Us */}
          <Link href="/build">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🛠️</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Build With Us</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Developers, researchers, and builders: help deploy our systems.
              </p>
            </a>
          </Link>
          {/* Invest / Partner */}
          <Link href="/invest">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Invest / Partner</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Institutions, investors, and allies: support the civilization stack.
              </p>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}