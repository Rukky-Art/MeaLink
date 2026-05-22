import { useNavigate } from 'react-router';
import { ArrowRight, ShieldCheck} from 'lucide-react';
import heroImage from '../../assets/LandingPage/HeroImage.svg'

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id='hero' className="w-full bg-white font-be-vietnam pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* ================= LEFT COLUMN: CONTENT (Takes 5 cols on desktop) ================= */}
        <div className="space-y-6 lg:col-span-5 max-w-xl">
          
          {/* Live Pulse Badge & Rescued Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex items-center gap-1.5 bg-brand-mint/10 border border-brand-mint/30 px-3 py-1 rounded-full text-brand-green text-xs font-semibold tracking-wide w-fit">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Food redistribution platform
            </div>
            <p className="text-xs font-medium text-gray-400 pl-1">
              🔥 <span className="text-gray-600 font-bold">142 kg</span> of surplus food rescued today
            </p>
          </div>

          {/* Core Typography Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] lg:leading-[1.1] font-bold text-gray-900 tracking-tight">
            Good food shouldn't <br />
            <span className="text-brand-green relative inline-block">
              go to waste.
              <span className="absolute bottom-1 left-0 w-full h-[4px] bg-brand-mint/40 rounded" />
            </span>
          </h1>

          {/* Descriptive Copy Text */}
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-normal">
            MeaLink helps restaurants, bakeries, hotels, and community organizations redistribute 
            surplus food quickly and responsibly to people who need it most.
          </p>

          {/* Micro-Interactive Action Buttons Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/register/details/donor')}
              className="relative bg-brand-green text-white font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group shadow-[0_4px_14px_0_rgba(16,185,129,0.3)] hover:shadow-[0_6px_20px_0_rgba(16,185,129,0.4)]"
            >
              Become a Donor
              <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            
            <button 
              onClick={() => navigate('/register/details/partner')}
              className="bg-white border border-gray-200 text-gray-800 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-200 text-center shadow-sm"
            >
              Become a Partner
            </button>
          </div>

          {/* Grayscale Local Ecosystem Social Proof Section */}
          <div className="pt-8 border-t border-gray-100 space-y-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trusted by local food leaders:</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-50 font-semibold text-xs text-gray-500 tracking-wide">
              <span className="flex items-center gap-1">🛡️ Lagos Food Bank</span>
              <span className="flex items-center gap-1">🍞 Corporate Bakeries</span>
              <span className="flex items-center gap-1">🏨 Eko Hotels Group</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: DEPTH IMAGE CANVAS (Takes 7 cols on desktop) ================= */}
        <div className="lg:col-span-7 w-full relative min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-start mt-8 lg:mt-0 pl-4">
          
          {/* Main Hero Photo (Slightly smaller width to give floating cards layout space) */}
          <div className="w-[88%] h-[85%] rounded-[28px] overflow-hidden shadow-2xl border border-gray-100 relative group z-10">
            <img 
              src={heroImage} 
              alt="Community kitchen preparing hot meals for redistribution" 
              className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            />
            {/* Subtle Gradient overlay over image to tie it to the white canvas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* 💡 FLOATING ELEMENT 1: Verified Partner Badge (Floating at top right) */}
          <div className="absolute top-4 right-2 sm:right-6 bg-white/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-4 rounded-2xl border border-gray-100 flex items-center gap-3 animate-float-slow z-20 max-w-[230px]">
            <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Verified Partner</p>
              <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">Food Bank Network</p>
            </div>
          </div>

          {/* 💡 FLOATING ELEMENT 2: Active Dispatch Stat (Floating at bottom left) */}
          <div className="absolute bottom-2 left-0 bg-white/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.08)] p-4 rounded-2xl border border-gray-100 flex items-center gap-3.5 z-20 max-w-[260px] animate-float-delayed">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">12 Active Dispatches</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Local Bakeries ➔ Care Shelters</p>
            </div>
          </div>

          {/* Decorative Backsplash Graphic element to break up geometric boxes */}
          <div className="absolute top-12 left-12 w-64 h-64 bg-brand-mint/10 rounded-full filter blur-3xl -z-0 pointer-events-none" />

        </div>

      </div>
    </section>
  );
};

export default HeroSection;