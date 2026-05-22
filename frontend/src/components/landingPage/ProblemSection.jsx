import croissant from '../../assets/LandingPage/croissants.jpg'

const ProblemSection = () => {
  return (
    <section className="w-full bg-brand-mint/30 py-20 lg:py-32 overflow-hidden" id='problem'>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Large Rounded Image */}
        <div className="relative group">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src={croissant}
              alt="Wasted pastries" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Subtle accent blob */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-amber-200/40 rounded-full blur-3xl -z-10" />
        </div>

        {/* Right Side: Copy */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="text-amber-600 font-bold tracking-widest text-xs uppercase">The problem</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Perfectly edible food <br /> is wasted every day.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Millions of meals are thrown away by businesses while communities nearby go without. 
              The food exists. The need exists. <span className="font-bold text-brand-green">MeaLink closes the gap.</span>
            </p>
          </div>

          <div className="pt-8 border-t border-gray-200/60">
            <h3 className="text-6xl md:text-7xl font-black text-brand-green tracking-tighter">30–40%</h3>
            <p className="text-gray-500 font-medium mt-2">of all food produced globally is never eaten.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;