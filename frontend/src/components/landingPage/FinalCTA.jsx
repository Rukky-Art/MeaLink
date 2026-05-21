import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectIsAuthenticated } from "../../store/slices/authSlice";

const FinalCTA = () => {
      const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()

  const handleClaimClick = () => {
    if (isAuthenticated) {
      // If they are logged in, check their role to send them to the right dashboard
    if (user?.role === 'donor') {
  navigate('/dashboard/donor');
} else if (user?.role === 'partner') {
  navigate('/dashboard/partner');
} else {
  navigate('/');
}
    } else {
      // Not logged in? Send to login
      navigate('/login');
    }
  };
  return (
    <section className="px-6 py-12">
      <div className="max-w-7xl mx-auto bg-brand-mint/20 rounded-[40px] py-20 px-8 text-center border border-brand-mint/30">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Join a growing network reducing food waste and supporting communities.
        </h2>
        <p className="text-gray-600 mb-10 max-w-xl mx-auto text-lg">
          Whether you have food to give or the capacity to distribute — MeaLink connects you to where you're needed.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link onClick={handleClaimClick} className="w-full sm:w-auto px-8 py-4 bg-brand-green text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20">
            Become a Donor
          </Link>
          <Link onClick={handleClaimClick} className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-brand-green text-brand-green font-bold rounded-xl hover:bg-brand-green hover:text-white transition-all">
            Become a Partner
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA