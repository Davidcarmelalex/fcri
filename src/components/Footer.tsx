import Link from "next/link";

const footerLinks = {
  Research: [
    { label: "Intelligence", href: "/research/intelligence" },
    { label: "Governance", href: "/research/governance" },
    { label: "Economics", href: "/research/economics" },
    { label: "Papers Archive", href: "/research/papers" },
  ],
  Academics: [
    { label: "Courses", href: "/academics/courses" },
    { label: "Fellowships", href: "/academics/fellowships" },
    { label: "Executive Programs", href: "/academics/executive" },
    { label: "Seminars", href: "/academics/seminars" },
  ],
  Systems: [
    { label: "Fusion Veritas", href: "/financial-systems/fusion-veritas" },
    { label: "VoltexFinance", href: "/financial-systems/voltexfinance" },
    { label: "NRLink", href: "/financial-systems/nrlink" },
    { label: "AZRAEL", href: "/azrael" },
  ],
  Institute: [
    { label: "About FCRI", href: "/about" },
    { label: "Grants", href: "/grants" },
    { label: "Partnerships", href: "/partnerships" },
    { label: "Support", href: "/support" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-gold/40 bg-gold/10 text-gold font-bold text-sm">
                FC
              </div>
              <span className="text-sm font-semibold tracking-wider text-white">FCRI</span>
            </div>
            <p className="text-sm text-silver leading-relaxed max-w-xs">
              Fusion Civilization Research Institute. Frontier science and civilization engineering. Based in Liberland.
            </p>
            <p className="mt-4 text-xs text-silver/50">
              Part of the{" "}
              <a href="https://voltexbazar.io" className="hover:text-gold transition-colors">
                Voltex Network
              </a>
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold tracking-wider text-white uppercase mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-silver hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-silver/50">
            © {new Date().getFullYear()} Fusion Civilization Research Institute. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/support" className="text-xs text-silver/50 hover:text-gold transition-colors">
              Support FCRI
            </Link>
            <Link href="/research/papers" className="text-xs text-silver/50 hover:text-gold transition-colors">
              Publications
            </Link>
            <a
              href="https://github.com/Davidcarmelalex/fcri"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-silver/50 hover:text-gold transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
