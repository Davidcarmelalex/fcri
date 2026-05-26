import Link from 'next/link';

export default function FAASIPage() {
  return (
    <main className='min-h-screen bg-black text-white px-6 py-20'>
      <div className='mx-auto max-w-6xl'>
        <p className='text-sm uppercase tracking-[0.24em] text-[var(--gold-light)]'>FCRI Initiative</p>
        <h1 className='mt-6 text-6xl font-semibold tracking-[-0.04em]'>FAASI</h1>
        <p className='mt-6 max-w-3xl text-xl text-[var(--silver)]'>Fusion Autonomous Agent Standards Initiative — benchmark science for evaluating autonomous agent reliability across long-horizon operational workflows.</p>
        <div className='mt-10 flex gap-4'>
          <Link href='/faasi/benchmark' className='bg-[var(--gold)] px-6 py-4 text-black font-semibold'>Benchmark</Link>
          <Link href='/faasi/whitepaper' className='border border-white/20 px-6 py-4'>Whitepaper</Link>
        </div>
      </div>
    </main>
  );
}
