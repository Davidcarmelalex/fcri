export default function HomeCTA() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
            Join FCRI
          </h2>
          <p className="mt-6 text-silver max-w-2xl mx-auto">
            Become part of the civilization engineering mission.
          </p>
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <a href="/participation" className="group flex items-center px-8 py-4 bg-gold text-black font-medium text-sm tracking-wide transition-all hover:bg-gold-light hover:text-black">
            Join FCRI
          </a>
          <a href="/support" className="group flex items-center px-8 py-4 border border-silver text-white font-medium text-sm tracking-wide hover:border-gold hover:text-gold">
            Support Research
          </a>
        </div>
      </div>
    </section>
  );
}
