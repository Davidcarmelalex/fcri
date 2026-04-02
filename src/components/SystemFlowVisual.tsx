export default function SystemFlowVisual() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            How FCRI Works
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            The Civilization Engineering Flow
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            From research to real-world impact, FCRI follows a systems integration model.
          </p>
        </div>
        <div className="mt-16 flex flex-col items-center gap-12">
          <div className="relative w-full max-w-4xl">
            <div className="absolute inset-0 -z-10">
              <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                <path d="M0,100 Q200,50 400,100 T800,100" stroke="var(--gold)" strokeWidth="2" fill="none" className="animate-gridMove" />
              </svg>
            </div>
            <div className="flex justify-between items-center">
              {/* Sciences */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gold text-2xl">🔬</span>
                </div>
                <h3 className="font-semibold text-white">Frontier Sciences</h3>
                <p className="mt-2 text-silver text-center max-w-sm">
                  27+ post-disciplinary domains integrating intelligence, governance, economics, and culture.
                </p>
              </div>
              {/* Research */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gold text-2xl">📚</span>
                </div>
                <h3 className="font-semibold text-white">Research & Frameworks</h3>
                <p className="mt-2 text-silver text-center max-w-sm">
                  Original frameworks like Proof-of-Justice and Synaptic Economics.
                </p>
              </div>
              {/* Systems */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gold text-2xl">⚙️</span>
                </div>
                <h3 className="font-semibold text-white">System Architecture</h3>
                <p className="mt-2 text-silver text-center max-w-sm">
                  Integrated systems across finance, AI, governance, and culture.
                </p>
              </div>
              {/* Deployment */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gold text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-white">Real-World Deployment</h3>
                <p className="mt-2 text-silver text-center max-w-sm">
                  VoltexFinance, Broken Shield, Soulforge, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}