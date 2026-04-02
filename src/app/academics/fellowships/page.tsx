import Link from "next/link";
import AcademicIntakeForm from "@/components/AcademicIntakeForm";

export default function FellowshipsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Academics / Fellowships
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Fellowship intake for serious research contributors.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">
              Fellowships are the deeper research track for people who want to work inside the institute&apos;s operating model. This route now accepts structured applications instead of staying in placeholder mode.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                {
                  title: "Research work",
                  body: "Ideal for paper development, analysis, framework synthesis, and institutional experimentation.",
                },
                {
                  title: "Applied output",
                  body: "Fellowships should produce deployable artifacts, not just credentials or decorative affiliation.",
                },
                {
                  title: "Institutional fit",
                  body: "This route supports the long-term talent pipeline for FCRI and should screen for credible contribution.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-gold/15 bg-white/5 p-6 backdrop-blur">
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-base leading-7 text-silver">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-gold/20 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Related paths</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link href="/academics" className="text-gold transition-colors hover:text-gold-light">
                  Academics
                </Link>
                <Link href="/research" className="text-gold transition-colors hover:text-gold-light">
                  Research
                </Link>
                <Link href="/participation" className="text-gold transition-colors hover:text-gold-light">
                  Participation
                </Link>
              </div>
            </div>
          </div>

          <AcademicIntakeForm
            type="fellowship"
            title="Submit a fellowship application"
            description="Use this for fellowships, long-horizon research collaboration, or institutional contributor entry into active FCRI workstreams."
            scopeLabel="Research scope or availability"
            scopePlaceholder="Research domain, time commitment, funding need, or operating scope"
            messageLabel="Why you fit the fellowship track"
            messagePlaceholder="Explain the research you want to pursue, the outputs you can produce, and why your contribution fits the institute's operating model."
            successMessage="Fellowship application received. FCRI now has your research profile in the institutional review queue."
          />
        </div>
      </section>
    </main>
  );
}
