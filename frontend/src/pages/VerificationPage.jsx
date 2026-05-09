import { useNavigate } from 'react-router';
import { Clock } from 'lucide-react';
import logo1 from '../assets/logo1.png';

// const Logo = ({ className }) => (  
//     <div className={`flex items-center justify-center gap-2 ${className}`}>
//          <img src={logo1} alt="MeaLink Logo" className="w-10" />    
//             <h1 className="text-2xl font-bold text-gray-900">MeaLink</h1>
//     </div>
// );

const VerificationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
      {/* Branding Logo */}
      {/* <Logo className="mb-12" /> */}
<img src={logo1} alt="MeaLink Logo" className="w-10 mb-12" />
      {/* Animated Clock Icon */}
      <div className="w-20 h-20 bg-brand-mint rounded-full flex items-center justify-center mb-8 animate-pulse">
        <Clock className="text-brand-green" size={40} strokeWidth={1.5} />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Verification in progress
      </h2>
      
      <p className="text-gray-500 max-w-sm mb-10">
        We're reviewing your organization. You'll be notified once approved.
      </p>

      {/* Back to Home / Logout Button */}
      <button
        onClick={() => navigate('/login')}
        className="px-8 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
      >
        <span className="text-sm">← Back to Home</span>
      </button>
    </div>
  );
};

export default VerificationPending;