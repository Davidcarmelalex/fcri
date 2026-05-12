"use client";
import { useState } from "react";
import Link from "next/link";

type Paper = {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  category: string;
  date: string;
  status: "published" | "preprint" | "working";
  tags: string[];
};

const papers: Paper[] = [
  {
    id: "p001",
    title: "Synaptic Economics: A Neural-Network Model for Adaptive Capital Flow",
    authors: ["FCRI Research Division"],
    abstract:
      "This paper introduces a framework for modeling economic systems using principles derived from neural network architecture, proposing dynamic feedback loops as replacements for static market equilibria. We argue that capital flow in complex economies behaves analogously to weighted signal propagation in adaptive networks.",
    category: "Economics & Finance",
    date: "2026-03",
    status: "preprint",
    tags: ["economics", "neural-networks", "capital-flow", "systems"],
  },
  {
    id: "p002",
    title: "Computational Governance: Reducing Legal Ambiguity Through Formal Systems",
    authors: ["FCRI Governance Lab"],
    abstract:
      "We propose a formal methodology for encoding legal rules as executable specifications, enabling automated consistency checking and reducing the semantic gap between legislative intent and operational interpretation. Applied to Liberland governance as a living testbed.",
    category: "Governance & Law",
    date: "2026-02",
    status: "preprint",
    tags: ["governance", "computational-law", "Liberland", "formal-methods"],
  },
  {
    id: "p003",
    title: "Civilization Stack Architecture: Toward Unified Infrastructure for Human Systems",
    authors: ["David Carmel Alex", "FCRI Core Team"],
    abstract:
      "A foundational paper articulating the theoretical basis for FCRI's civilization stack model — an integrated architecture spanning intelligence, governance, economics, justice, and culture. We argue these five domains are not independent policy silos but interdependent system layers requiring co-design.",
    category: "Civilization",
    date: "2026-01",
    status: "published",
    tags: ["civilization", "systems-design", "governance", "economics", "intelligence"],
  },
  {
    id: "p004",
    title: "Autonomous Cyber Resilience: Self-Healing Defense Architectures for Sovereign Infrastructure",
    authors: ["AZRAEL Research Group, FCRI"],
    abstract:
      "This paper presents the theoretical and architectural foundations for AZRAEL — an autonomous, self-healing cyber defense initiative. We formalize the notion of machine-speed defense meshes and analyze governance requirements for open, auditable automated response systems.",
    category: "Intelligence & AI",
    date: "2026-05",
    status: "preprint",
    tags: ["cybersecurity", "autonomous-defense", "AZRAEL", "self-healing"],
  },
  {
    id: "p005",
    title: "Post-Banking Finance: Cross-Border Liquidity Orchestration at Civilization Scale",
    authors: ["NRLink Research Group, FCRI"],
    abstract:
      "We examine the structural failures of correspondent banking and propose a liquidity orchestration model optimized for sovereign and institutional actors operating across multiple jurisdictions. Introduces the NRLink settlement architecture as a working implementation.",
    category: "Economics & Finance",
    date: "2026-04",
    status: "working",
    tags: ["finance", "cross-border", "settlement", "NRLink", "banking"],
  },
  {
    id: "p006",
    title: "Cultural Resistance as Civilization Infrastructure: The Soulforge Framework",
    authors: ["FCRI Culture Division"],
    abstract:
      "Culture is not soft infrastructure. This paper frames cultural production, artistic autonomy, and collective narrative as foundational components of any resilient civilization architecture. Introduces the Soulforge model for supporting creator economies under sovereign frameworks.",
    category: "Culture",
    date: "2026-03",
    status: "working",
    tags: ["culture", "artist-economy", "Soulforge", "civilization"],
  },
];

const categories = ["All", ...Array.from(new Set(papers.map((p) => p.category)))];
const statusColors = {
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  preprint: "bg-gold/20 text-gold border-gold/30",
  working: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function PapersPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = papers.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.abstract.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.06),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
            Publications
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Research Papers
          </h1>
          <p className="mt-6 text-lg text-silver leading-relaxed">
            FCRI publishes working papers, preprints, and formal research across all five civilization domains. Every paper ties directly to a system, product, or operational framework.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "border-gold bg-gold/20 text-gold"
                    : "border-white/10 text-silver hover:border-gold/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search papers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-silver/50 outline-none focus:border-gold/40 w-full sm:w-64"
          />
        </div>

        {/* Papers list */}
        <div className="space-y-6">
          {filtered.length === 0 && (
            <p className="text-silver text-center py-16">No papers match your filters.</p>
          )}
          {filtered.map((paper) => (
            <article
              key={paper.id}
              className="rounded-xl border border-white/8 bg-white/3 p-6 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[paper.status]}`}>
                      {paper.status}
                    </span>
                    <span className="text-xs text-silver/60">{paper.category}</span>
                    <span className="text-xs text-silver/40">{paper.date}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white leading-snug mb-2">
                    {paper.title}
                  </h2>
                  <p className="text-sm text-silver/70 mb-1">
                    {paper.authors.join(", ")}
                  </p>
                  <p className="mt-3 text-sm text-silver leading-relaxed">
                    {paper.abstract}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {paper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-white/5 px-2 py-0.5 text-xs text-silver/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-gold/20 bg-gold/5 p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Submit a paper or collaborate on research
          </h2>
          <p className="text-silver text-sm mb-6">
            FCRI welcomes submissions, co-authorship proposals, and research collaborations aligned with the civilization stack.
          </p>
          <Link
            href="/academics/fellowships"
            className="inline-block rounded border border-gold/40 bg-gold/10 px-6 py-2.5 text-sm font-medium text-gold hover:bg-gold/20 transition-colors"
          >
            Apply for a Fellowship
          </Link>
        </div>
      </section>
    </main>
  );
}
