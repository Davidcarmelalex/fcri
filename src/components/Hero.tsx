export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(ellipse_at_80%_20%,rgba(212,175,55,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(20,20,25,1)_0%,var(--black)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-gridMove" aria-hidden="true"></div>
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-[rgba(212,175,55,0.15)] rounded-full animate-orbFloat" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-20 right-16 w-[300px] h-[300px] bg-[rgba(212,175,55,0.1)] rounded-full animate-orbFloat" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-6 z-10">
        <div className="text-center max-w-4xl">
          <span className="inline-block px-4 py-1 border border-gold text-gold text-xs font-medium tracking-wider animate-fadeInUp animation-delay-200">
            Engineering Systems Beyond Nations
          </span>
          <h1 className="mt-4 text-5xl font-bold text-white leading-tight md:text-6xl lg:text-7xl animate-fadeInUp animation-delay-400">
            Fusion Civilization <span className="gradient-text">Research Institute</span>
          </h1>
          <p className="mt-6 text-xl text-silver max-w-2xl animate-fadeInUp animation-delay-600">
            We are not studying the future. We are engineering it.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fadeInUp animation-delay-800">
            <a href="/research" className="px-6 py-3 bg-gold text-black font-medium text-sm tracking-wide transition-all hover:bg-gold-light hover:text-black">
              Explore Research
            </a>
            <a href="/ecosystem" className="px-6 py-3 border border-silver text-white font-medium text-sm tracking-wide hover:border-gold hover:text-gold">
              Enter Network
            </a>
          </div>
          <div className="mt-16 flex flex-col items-center gap-2 animate-fadeInUp animation-delay-1000 text-silver text-xs tracking-wider">
            <span className="w-[1px] h-[60px] bg-[linear-gradient(to_bottom,var(--gold),transparent)]"></span>
            <span>Scroll Down</span>
          </div>
        </div>
      </div>
    </section>
  );
}
