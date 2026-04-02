import Link from 'next/link';

export default function VoltexBazar() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/ecosystem">
            <a className="text-gold/50 hover:text-gold text-sm">
              ← Back to Ecosystem
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            VoltexBazar
          </h1>
          <p className="text-silver max-w-xl">
            AI agent marketplace, automation economy, and intelligence-as-a-service.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Overview */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-silver">
              VoltexBazar is an AI agent marketplace where users can rent, deploy, and orchestrate intelligent agents for automation, decision-making, and task execution. It represents the intelligence layer of the FCRI ecosystem, enabling the automation economy.
            </p>
          </div>
          {/* Core Features */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Core Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Agent Marketplace</h3>
                  <p className="text-silver">Buy, sell, and rent AI agents for specific tasks and domains.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Orchestration Engine</h3>
                  <p className="text-silver">Compose complex workflows by chaining multiple AI agents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Custom Agent Development</h3>
                  <p className="text-silver">Build and deploy your own intelligent agents on the platform.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-4 h-4 bg-gold/20 rounded mt-1"></div>
                <div>
                  <h3 className="font-semibold text-white">Subscription Model</h3>
                  <p className="text-silver">Access agents via subscription or pay-per-use models.</p>
                </div>
              </div>
            </div>
          </div>
          {/* Research Foundation */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Research Foundation</h2>
            <p className="text-silver">
              Based on the Sentient Computing framework, which defines AI that adapts beyond static code with context-aware intelligence and emotional machines, enabling agents that learn and evolve with interaction.
            </p>
            <Link href="/research/papers/sentient-computing">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>Read Sentient Computing Paper →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
          {/* Real-world Impact */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Real-world Impact</h2>
            <p className="text-silver">
              Enables automation of complex business processes, provides access to specialized intelligence without hiring experts, and creates new economic opportunities in the AI agent economy.
            </p>
          </div>
          {/* Linked Systems */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Linked Systems</h2>
            <div className="space-y-2">
              <Link href="/financial-systems/voltexfinance">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>VoltexFinance</span>
                </a>
              </Link>
              <Link href="/financial-systems/fusion-veritas">
                <a className="flex items-center gap-2 text-gold hover:text-gold-light">
                  <span className="text-gold">🔗</span>
                  <span>Fusion Veritas Bank</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}