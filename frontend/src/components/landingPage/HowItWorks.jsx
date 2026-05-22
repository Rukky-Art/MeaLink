import step1 from '../../assets/LandingPage/step1.jpg'
import step2 from '../../assets/LandingPage/step2.jpg'
import step3 from '../../assets/LandingPage/step3.jpg'
import step4 from '../../assets/LandingPage/step4.jpg'

const StepCard = ({ number, title, desc, img, delay }) => (
  <div 
    className={`bg-white p-4 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 delay-[${delay}ms]`}
  >
    <div className="rounded-[24px] overflow-hidden h-64 mb-6">
      <img src={img} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="px-2 pb-4">
      <span className="text-brand-green font-bold text-sm mb-2 block">{number}</span>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    { n: "01", t: "Donor posts food", d: "Restaurants and kitchens list surplus in under a minute.", i: step1 },
    { n: "02", t: "Partner claims listing", d: "Verified NGOs and food banks claim what's nearby.", i: step2 },
    { n: "03", t: "Pickup completed", d: "Coordinated handoff with live status updates.", i: step3 },
    { n: "04", t: "Food distributed", d: "Meals reach community members with dignity.", i: step4 }
  ];

  return (
    <section className="py-24 bg-white" id='how'>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-brand-green font-bold tracking-widest text-xs uppercase">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
            From surplus to served in four steps.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <StepCard key={idx} number={step.n} title={step.t} desc={step.d} img={step.i} delay={idx * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks