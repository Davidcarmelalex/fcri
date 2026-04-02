import Link from 'next/link';

export default function Media() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-medium tracking-wider">
            Media & Publications
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Press, Publications, and Announcements
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            Stay updated with FCRI's latest press coverage, research publications, and announcements.
          </p>
        </div>
        <div className="mt-16 space-y-8">
          {/* Press Coverage */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Press Coverage</h3>
            <p className="text-silver">
              FCRI's work has been featured in various media outlets discussing the future of civilization, decentralized systems, and research-driven innovation.
            </p>
            <Link href="/media/press">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>View Press Coverage →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
          {/* Publications */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Research Publications</h3>
            <p className="text-silver">
              Access FCRI's full archive of research papers, frameworks, and technical reports through the Research Intelligence Hub.
            </p>
            <Link href="/research">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>Explore Research Archive →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
          {/* Announcements */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Announcements</h3>
            <p className="text-silver">
              Official announcements regarding new systems, partnerships, and milestones in the FCRI ecosystem.
            </p>
            <Link href="/media/announcements">
              <a className="mt-4 inline-flex items-center gap-2 text-gold hover:text-gold-light">
                <span>View Announcements →</span>
                <span className="text-gold">→</span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}