export const metadata = {
  title: 'FAASI Whitepaper',
  description: 'Publication draft for FAASI-CORE autonomous agent benchmark methodology.',
};

export default function WhitepaperPage() {
  return (
    <main className='min-h-screen bg-black text-white px-6 py-20'>
      <article className='mx-auto max-w-4xl border border-white/10 bg-[rgba(15,15,15,0.75)] p-12'>
        <p className='text-sm uppercase tracking-[0.24em] text-[var(--gold-light)]'>Research Publication Draft</p>
        <h1 className='mt-6 text-6xl font-semibold tracking-[-0.04em]'>FAASI-CORE Whitepaper</h1>
        <p className='mt-8 text-xl leading-9 text-[var(--silver)]'>A benchmark framework for evaluating autonomous AI agent reliability in long-horizon tool-augmented workflows, with emphasis on recovery intelligence, memory integrity, ambiguity governance, and safety compliance.</p>
        <section className='mt-12 space-y-8 text-[var(--silver)] leading-8'>
          <div><h2 className='text-2xl text-white font-semibold'>Abstract</h2><p className='mt-3'>Autonomous AI systems require rigorous evaluation frameworks that extend beyond narrow task completion.</p></div>
          <div><h2 className='text-2xl text-white font-semibold'>Methodology</h2><p className='mt-3'>FAASI introduces category-aware benchmark evaluation for autonomous reliability.</p></div>
        </section>
      </article>
    </main>
  );
}
