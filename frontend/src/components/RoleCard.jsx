import { ArrowRight } from 'lucide-react';

const RoleCard = ({ icon: Icon, title, description, onClick, buttonText }) => (
  <div className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white">
    <div className="bg-brand-mint w-12 h-12 rounded-xl flex items-center justify-center mb-4">
      <Icon className="text-brand-green" size={24} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-brand-gray text-sm mb-6">{description}</p>
    <button 
      onClick={onClick}
      className="w-full py-3 px-4 bg-brand-mint text-brand-green font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
    >
      {buttonText} <ArrowRight size={18} />
    </button>
  </div>
);

export default RoleCard;