import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Coins,
  FlaskConical,
  GraduationCap,
  Landmark,
  Network,
  ScrollText,
} from "lucide-react";

const focusAreas = [
  {
    title: "Frontier science publications",
    description:
      "A public home for papers, research tracks, and a coherent body of work instead of scattered writing.",
    icon: ScrollText,
  },
  {
    title: "Courses and fellowships",
    description:
      "Structured programs that let researchers, builders, and serious learners enter the FCRI orbit with purpose.",
    icon: GraduationCap,
  },
  {
    title: "Institutional funding",
    description:
      "Donation and sponsorship paths, including crypto-native support, aligned with research continuity.",
    icon: Coins,
  },
];

const instituteSignals = [
  "Based out of Liberland with a frontier-civilization mandate.",
  "Focused on research that can move into systems, education, and institutional design.",
  "Operating within the wider Voltex Network ecosystem while retaining institutional identity.",
];

const programTracks = [
  {
    title: "Research",
    body: "Papers, laboratories, public notes, and frontier science programs that articulate what FCRI is actually discovering.",
  },
  {
    title: "Education",
    body: "Courses, fellowships, and guided learning tracks that turn advanced ideas into a curriculum people can enter.",
  },
  {
    title: "Institution building",
    body: "A serious institute has governance, funding, archives, and a visible operating philosophy. The site should communicate all four.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,175,55,0.22),transparent_24%),radial-gradient(circle_at_85%_22%,rgba(192,160,72,0.12),transparent_22%),linear-gradient(180deg,#090909_0%,#000_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 lg:px-8 lg:pt-28">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--gold-light)]">
                <Landmark className="h-4 w-4" />
                Fusion Civilization Research Institute
              </div>

              <h1 className="mt-8 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Frontier science deserves institutional form, not just isolated papers.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--silver)] sm:text-xl">
                FCRI is a research institute based out of Liberland, focused on frontier sciences,
                civilization engineering, publications, courses, fellowships, and institutional research.
                The site should communicate rigor, ambition, and a credible long-term mission.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/research"
                  className="inline-flex items-center justify-center gap-2 rounded-none bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)]"
                >
                  Explore Research
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-4 text-sm font-semibold tracking-[0.08em] text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
                >
                  Support FCRI
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[rgba(212,175,55,0.2)] bg-[rgba(17,17,17,0.78)] p-8 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-light)]">Institution brief</p>
              <div className="mt-6 space-y-4">
                {instituteSignals.map((signal) => (
                  <div key={signal} className="flex gap-4 border-b border-white/8 pb-4 last:border-b-0">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
                    <p className="text-sm leading-7 text-[var(--silver)]">{signal}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="border border-white/8 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-light)]">Papers</p>
                  <p className="mt-2 text-2xl font-semibold text-white">20+</p>
                </div>
                <div className="border border-white/8 bg-black/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-light)]">Mission</p>
                  <p className="mt-2 text-sm leading-6 text-white">Research, education, and institutional design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-light)]">Why the site matters</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            The institute needs a public presence that looks like a serious research institution, not a placeholder.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <div key={area.title} className="border border-[rgba(212,175,55,0.16)] bg-[rgba(20,20,20,0.65)] p-8">
              <div className="flex h-12 w-12 items-center justify-center border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.08)]">
                <area.icon className="h-6 w-6 text-[var(--gold-light)]" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">{area.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--silver)]">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[rgba(9,9,9,0.95)]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-light)]">Program architecture</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                Three layers the public institution must communicate clearly.
              </h2>
            </div>
            <div className="grid gap-5 lg:col-span-2">
              {programTracks.map((track, index) => (
                <div key={track.title} className="grid gap-4 border border-white/8 bg-black/30 p-6 md:grid-cols-[auto_1fr]">
                  <div className="flex h-12 w-12 items-center justify-center border border-[rgba(212,175,55,0.22)] text-lg font-semibold text-[var(--gold-light)]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{track.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--silver)]">{track.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="border border-white/8 bg-[rgba(16,16,16,0.72)] p-8">
            <FlaskConical className="h-6 w-6 text-[var(--gold-light)]" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Research stack</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--silver)]">
              Papers, experiments, laboratories, and long-horizon scientific inquiry grounded in a clear institutional voice.
            </p>
          </div>
          <div className="border border-white/8 bg-[rgba(16,16,16,0.72)] p-8">
            <BookOpenText className="h-6 w-6 text-[var(--gold-light)]" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Knowledge transmission</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--silver)]">
              Courses and fellowships should turn frontier science into a disciplined curriculum, not just a reading list.
            </p>
          </div>
          <div className="border border-white/8 bg-[rgba(16,16,16,0.72)] p-8">
            <Network className="h-6 w-6 text-[var(--gold-light)]" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Institutional continuity</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--silver)]">
              Donations, sponsors, and aligned supporters should see exactly how their contribution sustains the institute.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="border border-[rgba(212,175,55,0.2)] bg-[linear-gradient(180deg,rgba(17,17,17,0.96),rgba(7,7,7,0.98))] p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--gold-light)]">Next build step</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Build a site that can carry the full weight of FCRI research, education, and funding.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--silver)]">
                The next product pass should focus on papers, courses, fellowships, institute governance,
                donation rails, and a coherent archive for published work.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link
                href="/research"
                className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)]"
              >
                View Research
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-4 text-sm font-semibold tracking-[0.08em] text-white transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-light)]"
              >
                Support The Institute
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
