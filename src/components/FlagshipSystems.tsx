import Link from 'next/link';

export default function FlagshipSystems() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Flagship Systems
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Deployed Systems Powering Future Civilizations
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            From financial infrastructure to justice systems, FCRI research translates into real-world deployment.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Fusion Veritas Bank */}
          <Link href="/financial-systems/fusion-veritas">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🏦</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Fusion Veritas Bank</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Global account system, borderless financial identity, and asset tokenization.
              </p>
            </a>
          </Link>
          {/* VoltexFinance */}
          <Link href="/financial-systems/voltexfinance">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">💳</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">VoltexFinance</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Autonomous financial engine, AI-driven capital flow, and yield optimization.
              </p>
            </a>
          </Link>
          {/* VoltexBazar */}
          <Link href="/ecosystem/voltexbazar">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🛒</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">VoltexBazar</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                AI agent marketplace, automation economy, and intelligence-as-a-service.
              </p>
            </a>
          </Link>
          {/* Broken Shield */}
          <Link href="/justice/broken-shield">
            <a className="group flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">The Broken Shield</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                Decentralized legal protection, human rights infrastructure, and crisis survival systems.
              </p>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}