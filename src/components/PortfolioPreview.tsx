import Link from 'next/link';

export default function PortfolioPreview() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Systems Portfolio
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            From Theory to Deployment
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI builds interconnected systems that form a civilization stack.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* VoltexFinance */}
          <Link href="/financial-systems/voltexfinance">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">💳</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">VoltexFinance</h3>
              <p className="mt-2 text-silver text-center text-sm">
                Autonomous financial engine
              </p>
            </a>
          </Link>
          {/* Broken Shield */}
          <Link href="/justice/broken-shield">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Broken Shield</h3>
              <p className="mt-2 text-silver text-center text-sm">
                Decentralized justice system
              </p>
            </a>
          </Link>
          {/* Soulforge */}
          <Link href="/culture/soulforge">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">🎭</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Soulforge</h3>
              <p className="mt-2 text-silver text-center text-sm">
                Artist economy & cultural resistance
              </p>
            </a>
          </Link>
          {/* VoltexBazar */}
          <Link href="/ecosystem/voltexbazar">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">🛒</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">VoltexBazar</h3>
              <p className="mt-2 text-silver text-center text-sm">
                AI agent marketplace
              </p>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}