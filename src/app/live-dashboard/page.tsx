import Link from "next/link";
import { listInquiries } from "@/lib/inquiryStore";

export default async function LiveDashboardPage() {
  const inquiries = await listInquiries();
  const counts = {
    total: inquiries.length,
    donations: inquiries.filter((item) => item.type === "donation").length,
    partnerships: inquiries.filter((item) => item.type === "partnership").length,
    fellowships: inquiries.filter((item) => item.type === "fellowship").length,
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_35%),linear-gradient(180deg,#09090b_0%,#000_100%)] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-block border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium tracking-[0.25em] text-gold uppercase">
              Operations Dashboard
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Intake visibility for institutional operations.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-silver">
              This is the first internal review layer for FCRI support, partnership, and fellowship inquiries. It replaces decorative “live metrics” with actual operating data.
            </p>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center justify-center rounded-none bg-[var(--gold)] px-6 py-4 text-sm font-semibold tracking-[0.08em] text-black transition-colors hover:bg-[var(--gold-light)]"
          >
            Open support intake
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total inquiries", value: counts.total },
            { label: "Donation inquiries", value: counts.donations },
            { label: "Partnership inquiries", value: counts.partnerships },
            { label: "Fellowship inquiries", value: counts.fellowships },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-gold/15 bg-black/40 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-gold">{item.label}</p>
              <p className="mt-4 text-4xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-gold/15 bg-[rgba(10,10,10,0.78)] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gold">Recent submissions</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Review queue</h2>
            </div>
            <Link href="/partnerships" className="text-sm text-gold transition-colors hover:text-gold-light">
              Partnership intake
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {inquiries.length ? inquiries.slice(0, 12).map((item) => (
              <div key={item.id} className="rounded-2xl border border-gold/10 bg-black/30 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-gold">{item.type}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-silver">{item.email}{item.organization ? ` • ${item.organization}` : ""}</p>
                  </div>
                  <p className="text-sm text-silver">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                {item.budget ? (
                  <p className="mt-3 text-sm text-silver">Scope/Budget: {item.budget}</p>
                ) : null}
                <p className="mt-4 text-base leading-7 text-silver">{item.message}</p>
              </div>
            )) : (
              <div className="rounded-2xl border border-gold/10 bg-black/30 p-5 text-base text-silver">
                No inquiries captured yet. Once support or partnership submissions arrive, they will appear here.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
