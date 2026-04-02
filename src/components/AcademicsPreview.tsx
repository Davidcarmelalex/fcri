import Link from 'next/link';

export default function AcademicsPreview() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Education & Programs
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Learn. Build. Deploy.
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            FCRI's academic model produces systems-level thinkers through courses, fellowships, and executive programs.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Courses */}
          <Link href="/academics/courses">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">📖</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Professional Courses</h3>
              <p className="mt-2 text-silver text-center text-sm">
                AI Governance, Blockchain, Behavioral Science, etc.
              </p>
            </a>
          </Link>
          {/* Fellowships */}
          <Link href="/academics/fellowships">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">🎓</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Fellowships</h3>
              <p className="mt-2 text-silver text-center text-sm">
                Research, Liberland, Applied Systems
              </p>
            </a>
          </Link>
          {/* Executive Programs */}
          <Link href="/academics/executive">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">💼</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Executive Programs</h3>
              <p className="mt-2 text-silver text-center text-sm">
                For policy makers, founders, institutions
              </p>
            </a>
          </Link>
          {/* Open Seminars */}
          <Link href="/academics/seminars">
            <a className="group flex flex-col items-center p-6 bg-black/50 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors hover:bg-black/70">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-gold text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-gold">Open Seminars</h3>
              <p className="mt-2 text-silver text-center text-sm">
                Entry layer: Awareness → Conversion → Programs
              </p>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}