import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-xl">M</div>
            <span className="text-2xl font-bold text-gray-900">MeaLink</span>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed">
            Connecting food businesses with verified community partners to redistribute surplus food.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><Link to="/" className="hover:text-brand-green">Home</Link></li>
            <li><Link to="/how-it-works" className="hover:text-brand-green">How it works</Link></li>
            <li><Link to="/sign-up" className="hover:text-brand-green">Sign up</Link></li>
            <li><Link to="/contact" className="hover:text-brand-green">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-gray-900 mb-6">Social</h4>
          <div className="flex gap-4">
             {/* Use your Lucide icons here (Twitter, Instagram, Linkedin) */}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        © 2026 MeaLink. Built to reduce waste and feed communities.
      </div>
    </footer>
  );
};

export default Footer