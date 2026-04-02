export default function LiveMetrics() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Ecosystem Vital Signs
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Live Metrics
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            Real-time data reflecting the growth and impact of the FCRI ecosystem.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Projects Built */}
          <div className="flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gold text-3xl">🏗️</span>
            </div>
            <p className="text-4xl font-bold text-gold">12+</p>
            <p className="mt-2 text-silver text-center">Systems Built</p>
          </div>
          {/* Research Papers */}
          <div className="flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gold text-3xl">📚</span>
            </div>
            <p className="text-4xl font-bold text-gold">25+</p>
            <p className="mt-2 text-silver text-center">Research Papers</p>
          </div>
          {/* Active Contributors */}
          <div className="flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gold text-3xl">👥</span>
            </div>
            <p className="text-4xl font-bold text-gold">47+</p>
            <p className="mt-2 text-silver text-center">Contributors</p>
          </div>
          {/* Capital Flowing */}
          <div className="flex flex-col items-center p-8 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
            <div className="flex-shrink-0 w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gold text-3xl">💧</span>
            </div>
            <p className="text-4xl font-bold text-gold">$8.2M+</p>
            <p className="mt-2 text-silver text-center">Capital Deployed</p>
          </div>
        </div>
      </div>
    </section>
  );
}