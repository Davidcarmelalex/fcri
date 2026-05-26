"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  {
    label: "Research",
    href: "/research",
    children: [
      { label: "Intelligence & Cognition", href: "/research/intelligence" },
      { label: "Governance & Law", href: "/research/governance" },
      { label: "Economics & Finance", href: "/research/economics" },
      { label: "Civilization", href: "/research/civilization" },
      { label: "Culture", href: "/research/culture" },
      { label: "AI Systems", href: "/research/ai" },
      { label: "Papers Archive", href: "/research/papers" },
    ],
  },
  {
    label: "FAASI",
    href: "/faasi",
    children: [
      { label: "Benchmark", href: "/faasi/benchmark" },
      { label: "Whitepaper", href: "/faasi/whitepaper" }
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Courses", href: "/academics/courses" },
      { label: "Fellowships", href: "/academics/fellowships" },
      { label: "Executive Programs", href: "/academics/executive" },
      { label: "Seminars", href: "/academics/seminars" },
    ],
  },
  {
    label: "Systems",
    href: "/financial-systems",
    children: [
      { label: "Fusion Veritas", href: "/financial-systems/fusion-veritas" },
      { label: "VoltexFinance", href: "/financial-systems/voltexfinance" },
      { label: "NRLink", href: "/financial-systems/nrlink" },
    ],
  },
  {
    label: "Ecosystem",
    href: "/ecosystem",
    children: [
      { label: "Overview", href: "/ecosystem" },
      { label: "VoltexBazar", href: "/ecosystem/voltexbazar" },
      { label: "AZRAEL", href: "/azrael" },
      { label: "MR NOTHING", href: "/mr-nothing" },
    ],
  },
  { label: "Grants", href: "/grants" },
  { label: "About", href: "/about" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-gold/40 bg-gold/10 text-gold font-bold text-sm transition-colors group-hover:bg-gold/20">FC</div>
          <span className="text-sm font-semibold tracking-wider text-white">FCRI</span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.label} className="relative" onMouseEnter={() => item.children && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
              <Link href={item.href} className="flex items-center gap-1 rounded px-3 py-2 text-sm text-silver hover:text-white transition-colors">{item.label}</Link>
              {item.children && activeDropdown === item.label && (
                <div className="absolute left-0 top-full mt-1 min-w-[220px] rounded-lg border border-white/10 bg-zinc-950 p-2 shadow-2xl">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} className="block rounded px-3 py-2 text-sm text-silver hover:bg-gold/10 hover:text-gold transition-colors">{child.label}</Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/support" className="rounded border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/20 transition-colors">Support FCRI</Link>
        </div>
        <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </nav>
  );
}
