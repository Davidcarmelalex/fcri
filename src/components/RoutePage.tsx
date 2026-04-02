import Link from 'next/link';

type RoutePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: Array<{
    title: string;
    body: string;
  }>;
  links: Array<{
    href: string;
    label: string;
    body: string;
  }>;
  footer?: string;
};

export default function RoutePage({
  eyebrow,
  title,
  description,
  highlights,
  links,
  footer,
}: RoutePageProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-silver">
            {description}
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gold/15 bg-white/5 p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-3 leading-7 text-silver">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold">Related Paths</h2>
            <Link
              href="/"
              className="text-sm tracking-wide text-gold transition-colors hover:text-gold-light"
            >
              Back to Home
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-2xl border border-gold/15 bg-black/40 p-6 transition-all hover:border-gold/40 hover:bg-black/60"
              >
                <div className="text-sm uppercase tracking-[0.25em] text-gold">
                  {item.label}
                </div>
                <p className="mt-3 text-white transition-colors group-hover:text-gold">
                  {item.body}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {footer ? (
          <p className="mt-16 max-w-3xl text-sm leading-6 text-silver">
            {footer}
          </p>
        ) : null}
      </section>
    </main>
  );
}
