import Link from "next/link";
import AcademicIntakeForm from "@/components/AcademicIntakeForm";

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Academics / Courses
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Professional courses with a real intake path.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">
              FCRI courses should enroll serious students into systems thinking, applied research, and operational design. This route now accepts structured student interest instead of acting like placeholder copy.
            </p>

            <div className="mt-10 grid gap-4">
              {[
                {
                  title: "Applied learning",
                  body: "Courses should map to systems thinking, implementation, and real operational outcomes.",
                },
                {
                  title: "Audience fit",
                  body: "Built for practitioners, founders, and researchers who need more than surface-level education.",
                },
                {
                  title: "Enrollment use",
                  body: "Use this intake to capture demand before final schedules, syllabi, and cohort dates are published.",
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
                <Link href="/participation" className="text-gold transition-colors hover:text-gold-light">
                  Participation
                </Link>
                <Link href="/research" className="text-gold transition-colors hover:text-gold-light">
                  Research
                </Link>
              </div>
            </div>
          </div>

          <AcademicIntakeForm
            type="course"
            title="Submit a course enrollment inquiry"
            description="Use this for course interest, cohort updates, or structured academic onboarding into FCRI teaching tracks."
            scopeLabel="Course interest or domain"
            scopePlaceholder="AI, governance, economics, culture, executive systems, or another domain"
            messageLabel="Why you want to enroll"
            messagePlaceholder="Explain the course path you want, your background, and the kind of learning or institutional outcome you are looking for."
            successMessage="Course inquiry received. FCRI now has your academic interest in the intake queue."
          />
        </div>
      </section>
    </main>
  );
}
