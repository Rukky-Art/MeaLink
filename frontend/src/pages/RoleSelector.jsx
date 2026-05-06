import { useNavigate } from 'react-router';
import { Utensils, Users, ArrowLeft } from 'lucide-react';
import RoleCard from '../components/RoleCard';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    // We'll navigate to the registration form and pass the role as a param
    navigate(`/register/details/${role}`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
  onClick={() => navigate('/login')}
  className="flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors mb-2 group"
>
  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
  <span className="text-sm font-medium">Back to login</span>
</button>
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your role</h2>
        <p className="text-gray-500">Select how you'd like to contribute</p>
      </div>

      <div className="space-y-4">
        <RoleCard
          icon={Utensils}
          title="Food Donor"
          description="Restaurants, bakeries, hotels, event centers"
          buttonText="Continue as Donor"
          onClick={() => handleSelect('donor')}
        />

        <RoleCard
          icon={Users}
          title="Distribution Partner"
          description="NGOs, food banks, community coordinators"
          buttonText="Continue as Partner"
          onClick={() => handleSelect('partner')}
        />
      </div>
    </div>
  );
};

export default RoleSelection;