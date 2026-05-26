export const metadata = {
  title: 'FAASI Documentation',
  description: 'Technical documentation for FAASI benchmark framework.',
};

const docs = [
  'Quick Start',
  'Benchmark Methodology',
  'Task Taxonomy',
  'Scoring Framework',
  'Reproducibility',
  'Contribution Guide'
];

export default function DocsPage() {
  return (
    <main className='min-h-screen bg-black text-white px-6 py-20'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-6xl font-semibold'>FAASI Documentation</h1>
        <p className='mt-6 text-xl text-[var(--silver)]'>Technical documentation portal for the FAASI benchmark initiative.</p>
        <div className='mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {docs.map((d)=><div key={d} className='border border-white/10 p-6'>{d}</div>)}
        </div>
      </div>
    </main>
  );
}
