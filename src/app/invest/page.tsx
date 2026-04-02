import Link from 'next/link';

export default function Invest() {
  const cards = [
    {
      href: "/support",
      icon: "💝",
      title: "Donations & Patronage",
      body: "One-time contributions, recurring patronage, and institutional support.",
    },
    {
      href: "/token",
      icon: "🪙",
      title: "FCRI Token",
      body: "Participation layer in the research ecosystem - access, governance, and support.",
    },
    {
      href: "/partnerships",
      icon: "🏢",
      title: "Institutional Partnerships",
      body: "Collaborate with FCRI on research, systems, and deployment initiatives.",
    },
    {
      href: "/ecosystem/invest",
      icon: "📈",
      title: "Ecosystem Investment",
      body: "Direct investment in FCRI systems like VoltexFinance, Fusion Veritas, and more.",
    },
    {
      href: "/grants",
      icon: "📄",
      title: "Grants & Funding",
      body: "Apply for research grants or funding for aligned initiatives.",
    },
    {
      href: "/use-of-funds",
      icon: "📊",
      title: "Use of Funds",
      body: "Transparent allocation of resources across research, systems, and mission.",
    },
  ];

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
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group flex flex-col items-center rounded-lg border border-gold/20 bg-black/50 p-8 transition-colors hover:border-gold/40 hover:bg-black/70"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-gold text-2xl">{card.icon}</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">{card.title}</h3>
              <p className="mt-2 text-silver text-center max-w-sm">
                {card.body}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
