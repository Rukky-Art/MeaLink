import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice'; // Make sure the path is correct
import {  LogOut, LayoutDashboard } from 'lucide-react';
import logo1 from '../assets/logo1.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 1. Get auth state from Redux
  const { token, user } = useSelector((state) => state.auth);
  console.log("Current Token:", token);
  console.log("Current User Object:", user);

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

  return (
    <header className={`
      fixed top-0 left-0 w-full font-be-vietnam z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/90 border-b border-green-300/40 shadow-sm backdrop-blur-md text-gray-900' 
        : 'bg-transparent border-b border-transparent'}
    `}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo Identity Block */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo1} alt="MeaLink Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">MeaLink</span>
        </Link>

        {/* Informational Anchor Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors">How it works</a>
          <a href="#features" className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors">Features</a>
          <a href="#impact" className="text-sm font-medium text-gray-700 hover:text-brand-green transition-colors">Impact</a>
        </nav>

        {/* Action Controls Group */}
        <div className="flex items-center gap-4 sm:gap-6">
        {token && user ? (
  <div className="flex items-center gap-2 sm:gap-4">
    {/* 1. Dashboard Link - Always visible, but text hides on mobile */}
    <Link 
      to="/dashboard" 
      className="flex items-center gap-2 text-sm font-bold text-brand-green bg-brand-green/10 p-2 sm:px-4 sm:py-2 rounded-xl transition-all"
    >
      <LayoutDashboard size={20} />
      {/* 'hidden sm:inline' keeps the word Dashboard off small screens */}
      <span className="hidden sm:inline">Dashboard</span>
    </Link>

    {/* 2. Logout Button - Using icon only on mobile to save space */}
    <button 
      onClick={handleLogout}
      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
    >
      <LogOut size={20} />
      <span className="hidden sm:inline ml-2 text-sm font-bold">Logout</span>
    </button>
  </div>
) : (
            /* ================= LOGGED OUT VIEW (Guest) ================= */
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
    </header>
  );
};

export default Navbar;