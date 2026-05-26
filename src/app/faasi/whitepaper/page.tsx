export const metadata = {
  title: 'FAASI Whitepaper',
  description: 'Publication draft for FAASI-CORE autonomous agent benchmark methodology.',
};

import Link from 'next/link';

export default function WhitepaperPage() {
  return (
    <main className='min-h-screen bg-black text-white px-6 py-20'>
      <article className='mx-auto max-w-4xl border border-white/10 bg-[rgba(15,15,15,0.75)] p-12'>
        <p className='text-sm uppercase tracking-[0.24em] text-[var(--gold-light)]'>Research Publication Draft</p>
        <h1 className='mt-6 text-6xl font-semibold tracking-[-0.04em]'>FAASI-CORE Whitepaper</h1>
        <p className='mt-8 text-xl leading-9 text-[var(--silver)]'>A benchmark framework for evaluating autonomous AI agent reliability in long-horizon tool-augmented workflows.</p>
        <div className='mt-10 flex gap-4 flex-wrap'>
          <Link href='https://github.com/Davidcarmelalex/fcri-faasi-core/tree/main/paper' className='border border-[var(--gold)] px-6 py-3 text-[var(--gold-light)]'>Research Package</Link>
          <Link href='https://github.com/Davidcarmelalex/fcri-faasi-core/tree/main/paper/figures' className='border border-white/20 px-6 py-3'>Architecture Assets</Link>
          <Link href='https://github.com/Davidcarmelalex/fcri-faasi-core/tree/main/examples' className='border border-white/20 px-6 py-3'>Benchmark Samples</Link>
        </div>
      </article>
    </main>
  );
}
