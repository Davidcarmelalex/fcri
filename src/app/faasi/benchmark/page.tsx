export default function BenchmarkPage() {
  const dimensions = ['Task Success','Tool Reliability','Recovery Intelligence','Memory Integrity','Safety Compliance','Ambiguity Handling','Stability','Efficiency'];
  return (
    <main className='min-h-screen bg-black text-white px-6 py-20'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-5xl font-semibold'>FAASI-CORE Benchmark</h1>
        <p className='mt-6 text-xl text-[var(--silver)]'>Benchmark framework for autonomous agent reliability.</p>
        <div className='mt-10 grid gap-4 md:grid-cols-2'>
          {dimensions.map((d)=><div key={d} className='border border-white/10 p-5'>{d}</div>)}
        </div>
      </div>
    </main>
  );
}
