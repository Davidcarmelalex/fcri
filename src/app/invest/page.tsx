import Link from 'next/link';

export default function Invest() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Capital & Partnership
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Invest in the Future of Civilization
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI offers multiple avenues for investment and partnership, from direct support to ecosystem participation.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Donations */}
          <Link href="/support">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">💝</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Donations & Patronage</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                One-time contributions, recurring patronage, and institutional support.
              </p>
            </a>
          </Link>
          {/* FCRI Token */}
          <Link href="/token">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🪙</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">FCRI Token</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Participation layer in the research ecosystem - access, governance, and support.
              </p>
            </a>
          </Link>
          {/* Institutional Partnerships */}
          <Link href="/partnerships">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🏢</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Institutional Partnerships</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Collaborate with FCRI on research, systems, and deployment initiatives.
              </p>
            </a>
          </Link>
          {/* Ecosystem Investment */}
          <Link href="/ecosystem/invest">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Ecosystem Investment</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Direct investment in FCRI systems like VoltexFinance, Fusion Veritas, and more.
              </p>
            </a>
          </Link>
          {/* Grants & Funding */}
          <Link href="/grants">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">📄</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Grants & Funding</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Apply for research grants or funding for aligned initiatives.
              </p>
            </a>
          </Link>
          {/* Use of Funds */}
          <Link href="/use-of-funds">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Use of Funds</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Transparent allocation of resources across research, systems, and mission.
              </p>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}