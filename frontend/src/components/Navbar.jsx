import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LogOut, LayoutDashboard, X, Menu } from 'lucide-react';
import logo1 from '../assets/logo1.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get auth state from Redux
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`
      fixed top-0 left-0 w-full font-be-vietnam z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/90 border-b border-green-300/40 shadow-sm backdrop-blur-md text-gray-900' 
        : 'bg-transparent border-b border-transparent'}
    `}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden p-2 text-gray-700" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo1} alt="MeaLink Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">MeaLink</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a 
            href="#how" 
            onClick={(e) => { e.preventDefault(); scrollToSection('how'); }} 
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            How it works
          </a>
          <a 
            href="#feature" 
            onClick={(e) => { e.preventDefault(); scrollToSection('feature'); }} 
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            Features
          </a>
          <a 
            href="#impact" 
            onClick={(e) => { e.preventDefault(); scrollToSection('impact'); }} 
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            Impact
          </a>
          <a 
            href="#listing" 
            onClick={(e) => { e.preventDefault(); scrollToSection('listing'); }} 
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            Live Listing
          </a>
        </nav>

        {/* Auth Actions (Login/Dashboard/Logout) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {token && user ? (
            // Logged In View
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-sm font-bold text-brand-green bg-brand-green/10 p-2 sm:px-4 sm:py-2 rounded-xl transition-all hover:bg-brand-green/20"
              >
                <LayoutDashboard size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-gray-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline text-sm font-bold">Logout</span>
              </button>
            </div>
          ) : (
            // Logged Out View
            <>
              <Link 
                to="/login" 
                className="text-sm font-bold text-gray-700 hover:text-brand-green transition-colors"
              >
                Sign in
              </Link>
              <button 
                onClick={() => navigate('/register/select-role')}
                className="bg-brand-green text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all shadow-sm active:scale-[0.98]"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-gray-100 flex flex-col p-6 gap-4 md:hidden shadow-lg">
          <a 
            href="#how" 
            onClick={(e) => { 
              e.preventDefault(); 
              setIsMenuOpen(false); 
              scrollToSection('how'); 
            }}
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            How it works
          </a>
          <a 
            href="#feature" 
            onClick={(e) => { 
              e.preventDefault(); 
              setIsMenuOpen(false); 
              scrollToSection('feature'); 
            }}
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            Features
          </a>
          <a 
            href="#impact" 
            onClick={(e) => { 
              e.preventDefault(); 
              setIsMenuOpen(false); 
              scrollToSection('impact'); 
            }}
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            Impact
          </a>
          <a 
            href="#listing" 
            onClick={(e) => { 
              e.preventDefault(); 
              setIsMenuOpen(false); 
              scrollToSection('listing'); 
            }}
            className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors"
          >
            Live Listing
          </a>
          
          <hr className="my-2" />
          
          {/* Mobile Auth Actions */}
          {!token && !user && (
            <div className="flex flex-col gap-3">
              <Link 
                to="/login" 
                className="text-center text-sm font-bold text-gray-700 hover:text-brand-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/register/select-role');
                }}
                className="bg-brand-green text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;