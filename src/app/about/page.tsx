import Link from 'next/link';

export default function About() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            About FCRI
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            The Institution
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI is a non-profit, civilization-scale research institute building systems across technology, governance, justice, and culture.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {/* Mission & Vision */}
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Mission */}
            <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
              <h3 className="text-xl font-semibold text-white mb-4">Mission</h3>
              <p className="text-silver">
                To design, develop, and deploy civilization-scale systems that integrate intelligence, governance, economics, justice, and culture into unified architectures for future human systems.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
              <h3 className="text-xl font-semibold text-white mb-4">Vision</h3>
              <p className="text-silver">
                A world where human systems are resilient, just, and adaptive — engineered through integrated research and real-world deployment.
              </p>
            </div>
          </div>

          {/* Institutional Model */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-semibold text-white mb-4">Institutional Model</h3>
            <p className="text-silver">
              FCRI operates as a research-driven systems engine: Research → Frameworks → Systems → Deployment.
              Unlike traditional institutions, we do not stop at publication; we build and deploy.
            </p>
          </div>

          {/* Non-profit Structure */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-semibold text-white mb-4">Non-profit Structure</h3>
            <p className="text-silver">
              FCRI is organized as a non-profit institution, ensuring that our work serves the mission of civilization engineering rather than extractive motives.
              Funding comes from program fees, crypto treasury support, and a participation layer (token) aligned with our goals.
            </p>
          </div>

          {/* Research to Deployment Philosophy */}
          <div className="bg-black/50 p-6 rounded-lg border border-gold/20">
            <h3 className="text-xl font-semibold text-white mb-4">Research → Deployment Philosophy</h3>
            <p className="text-silver">
              <strong>FCRI integrates research with real-world deployment.</strong> Every framework we develop is intended to become a system, and every system we build is intended to have real-world impact.
            </p>
            <p className="mt-2 text-silver">
              This philosophy ensures that our work is not just theoretical but actively shapes the infrastructure of future civilizations.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white md:text-4xl text-center mb-8">
            Founder & Origin
          </h2>
          <div className="bg-black/50 p-8 rounded-lg border border-gold/20 max-w-4xl mx-auto">
            <p className="text-silver">
              FCRI originates from the direct experience of systemic failure and the development of real-world systems under constraint.
              The Principal Architect, David Carmel Alex, has published 25+ working papers in 2025 alone, forming the foundation of FCRI's research.
            </p>
            <p className="mt-4 text-silver">
              FCRI exists because existing systems failed to protect, evolve, and integrate. We build new ones where the old ones collapse.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
