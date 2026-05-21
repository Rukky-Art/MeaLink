import community from '../../assets/LandingPage/community.jpg'

const QuoteHero = () => {
  return (
    <section className="px-6 py-10">
      <div className="max-w-7xl mx-auto relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src={community}
            className="w-full h-full object-cover"
            alt="Volunteers loading food"
          />
          <div className="absolute inset-0 bg-black/50" /> 
        </div>

    
        <div className="relative h-full flex flex-col justify-center px-10 md:px-20 max-w-4xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            "Every successful pickup means more meals reach people instead of landfills."
          </h2>
          <p className="text-white/80 text-lg font-medium">
            Powered by MeaLink — connecting donors and communities since day one.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuoteHero;