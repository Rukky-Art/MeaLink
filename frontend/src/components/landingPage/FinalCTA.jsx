import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectIsAuthenticated } from "../../store/slices/authSlice";


const FinalCTA = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleClaimClick = () => {
    if (isAuthenticated) {
      // Send them to their specific dashboard
      if (user?.role === 'donor') {
        navigate('/dashboard/donor');
      } else if (user?.role === 'partner') {
        navigate('/dashboard/partner');
      } else {
        navigate('/');
      }
    } else {
      // If not logged in, send them to register but keep track of what they wanted to be
      // You could just do navigate('/login') or navigate('/register')
      navigate('/login'); 
    }
  };

  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto bg-brand-mint/20 rounded-[40px] py-20 px-8 text-center border border-brand-mint/30">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Join a growing network reducing food waste and supporting communities.
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Changed Link to button */}
          <button 
            onClick={() => handleClaimClick('donor')} 
            className="w-full sm:w-auto px-8 py-4 bg-brand-green text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20"
          >
            Become a Donor
          </button>
          
          <button 
            onClick={() => handleClaimClick('partner')} 
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-brand-green text-brand-green font-bold rounded-xl hover:bg-brand-green hover:text-white transition-all"
          >
            Become a Partner
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA