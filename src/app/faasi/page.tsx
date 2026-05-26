import Link from 'next/link';

export const metadata = {
  title: 'FAASI | Autonomous Agent Standards',
  description: 'Fusion Autonomous Agent Standards Initiative — benchmark science for reliable autonomous intelligence.',
};

const dimensions = [
  'Task Success', 'Tool Reliability', 'Recovery Intelligence', 'Memory Integrity',
  'Safety Compliance', 'Ambiguity Governance', 'Stability', 'Efficiency'
];

export default function FAASIPage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      <section className='relative overflow-hidden px-6 py-24'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.18),transparent_25%),linear-gradient(180deg,#050505_0%,#000_100%)]' />
        <div className='relative mx-auto max-w-7xl'>
          <p className='text-sm uppercase tracking-[0.28em] text-[var(--gold-light)]'>FCRI Flagship Initiative</p>
          <h1 className='mt-8 text-7xl font-semibold tracking-[-0.05em]'>FAASI</h1>
          <p className='mt-8 max-w-4xl text-2xl text-[var(--silver)]'>Standards and benchmark science for evaluating autonomous agent reliability across long-horizon, tool-augmented operational workflows.</p>
          <div className='mt-10 flex flex-wrap gap-4'>
            <Link href='/faasi/benchmark' className='bg-[var(--gold)] px-8 py-4 text-black font-semibold'>Explore Benchmark</Link>
            <Link href='/faasi/whitepaper' className='border border-white/20 px-8 py-4'>Read Whitepaper</Link>
            <Link href='https://github.com/Davidcarmelalex/fcri-faasi-core' className='border border-[var(--gold)] px-8 py-4 text-[var(--gold-light)]'>GitHub Repository</Link>
            <Link href='/faasi/docs' className='border border-white/20 px-8 py-4'>Documentation</Link>
          </div>
        </div>
      </section>
      <section className='mx-auto max-w-7xl px-6 py-20'>
        <h2 className='text-4xl font-semibold'>Benchmark Dimensions</h2>
        <div className='mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {dimensions.map((d) => (
            <div key={d} className='border border-[rgba(212,175,55,0.16)] bg-[rgba(20,20,20,0.65)] p-6 transition-transform hover:scale-105'>
              <h3 className='text-lg font-semibold'>{d}</h3>
            </div>
          ))}
        </div>
      </section>
      <section className='mx-auto max-w-7xl px-6 pb-24'>
        <div className='border border-white/10 bg-[rgba(15,15,15,0.7)] p-10'>
          <h2 className='text-3xl font-semibold'>Downloads & Evidence</h2>
          <div className='mt-6 flex flex-wrap gap-4'>
            <Link href='https://github.com/Davidcarmelalex/fcri-faasi-core/tree/main/paper' className='border border-[var(--gold)] px-6 py-3 text-[var(--gold-light)]'>Research Package</Link>
            <Link href='https://github.com/Davidcarmelalex/fcri-faasi-core/tree/main/examples' className='border border-white/20 px-6 py-3'>Benchmark Samples</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
