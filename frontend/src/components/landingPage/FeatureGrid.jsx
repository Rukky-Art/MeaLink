import FT1 from '../../assets/LandingPage/FT1.jpg'
import FT2 from '../../assets/LandingPage/FT2.jpg'
import FT3 from '../../assets/LandingPage/FT3.jpg'
import FT4 from '../../assets/LandingPage/FT4.jpg'


const FeatureGrid = () => {
  const features = [
    {
      title: "Verified partners only",
      desc: "Every NGO and food bank is reviewed before joining the network.",
      img: FT1
    },
    {
      title: "Real-time status tracking",
      desc: "Live updates from posting to pickup to distribution.",
      img: FT2
    },
    {
      title: "Fast, simple coordination",
      desc: "Match a donation to a partner in minutes, not hours.",
      img: FT3
    },
    {
      title: "Community-centered distribution",
      desc: "Built around the people doing the work on the ground.",
      img: FT4
    }
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-brand-green font-bold text-sm uppercase tracking-widest mb-4">Built on Trust</h2>
      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 max-w-2xl">
        Built for Trust. Designd for Speed.
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={f.img} 
                alt={f.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureGrid