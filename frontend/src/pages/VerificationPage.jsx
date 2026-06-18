// import { useNavigate } from 'react-router';
// import { Mail } from 'lucide-react'; // Swapped Clock for Mail since they need to check email first!

// const VerificationPending = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
//       <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
        
//         {/* Animated Mail/Inbox Icon */}
//         <div className="w-20 h-20 bg-mealink-orange/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
//           <Mail className="text-mealink-orange" size={40} strokeWidth={1.5} />
//         </div>

//         <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
//           Check your email inbox
//         </h2>
        
//         <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
//           We've sent an activation link to your email address. Please click the link to verify your account and initialize your logistics dashboard.
//         </p>

//         {/* Back to Home / Login Button */}
//          <button
//           onClick={() => navigate('/login')}
//           className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-xs flex items-center gap-2"
//         >
//           <span>← Back to Login</span>
//         </button> 
//       </div>
//     </div>
//   );
// };

// export default VerificationPending;

import { useNavigate } from 'react-router';
import { CheckCircle2, ArrowRight } from 'lucide-react';

// 1. Move a static configuration array OUTSIDE of the component entirely.
// This is an array of 24 pieces using deterministic math, keeping the component 100% pure.
const CONFETTI_PARTICLES = Array.from({ length: 24 }).map((_, i) => {
  const colors = ['bg-mealink-orange', 'bg-brand-green', 'bg-amber-400', 'bg-rose-400'];
  
  // Fake pseudo-randomness using the index (i) so they look spread out naturally
  const pseudoSeed1 = (i * 17) % 100; // Left position (0 to 100)
  const pseudoSeed2 = (i * 23) % 360; // Rotation angle (0 to 360)
  const pseudoSeed3 = (i * 7) % 5;    // Delay in seconds (0 to 5)
  const pseudoSeed4 = (i * 13) % 4;    // Extra duration offset (0 to 4)

  return {
    id: i,
    rotation: pseudoSeed2,
    leftPosition: pseudoSeed1,
    delay: pseudoSeed3,
    duration: 4 + pseudoSeed4, // Ranges from 4s to 8s
    size: 8 + ((i * 3) % 12),  // Size variations between 8px and 20px
    colorClass: colors[i % colors.length]
  };
});

const VerificationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-be-vietnam relative overflow-hidden">
      
      {/* ── Falling Confetti / Flower Petals Effect ── */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {CONFETTI_PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full opacity-60 ${particle.colorClass}`}
            style={{
              top: '-20px',
              left: `${particle.leftPosition}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              transform: `rotate(${particle.rotation}deg)`,
              animation: `fall ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Main Content Card ── */}
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Animated Checked Logo */}
        <div className="w-24 h-24 bg-brand-green/10 rounded-3xl flex items-center justify-center mb-6 animate-bounce duration-1000">
          <CheckCircle2 className="text-brand-green" size={52} strokeWidth={1.5} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
          Awesome!!! 🎉
        </h2>
        <p className="text-xl font-bold text-slate-700 mb-4">
          Your application is officially in! 🙌
        </p>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
          Our admin team is already reviewing your registration details. While we get everything verified behind the scenes, don't wait up! 
          <span className="block mt-3 text-slate-600 font-medium">
            Go ahead, log in, look around, and explore your fresh dashboard. Enjoy the platform! 💚
          </span>
        </p>

        {/* Primary Call to Action */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 group"
        >
          <span>Step Inside & Explore</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

      
      </div>

      {/* ── Pure CSS Keyframes for Falling Animation ── */}
      <style>{`
        @keyframes fall {
          0% {
            top: -5%;
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(30px) rotate(180deg);
          }
          100% {
            top: 105%;
            transform: translateX(-20px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default VerificationPending;