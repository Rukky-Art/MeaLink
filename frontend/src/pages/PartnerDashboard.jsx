import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, ShoppingBag, Clock, CheckCircle, Package } from 'lucide-react';
import { fetchAvailableFood, claimFood } from '../store/slices/partnerSlice';

const PartnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { availableFood, loading } = useSelector((state) => state.partner);

  useEffect(() => {
    dispatch(fetchAvailableFood());
  }, [dispatch]);

  const handleClaim = (foodId) => {
    dispatch(claimFood(foodId));
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-be-vietnam">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Food</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-brand-mint/30 text-brand-green px-3 py-1 rounded-full border border-brand-green/10">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Nearby: {user?.city || 'Your City'}</span>
            </div>
            <span className="text-gray-400 text-xs font-medium">Showing {availableFood.length} listings</span>
          </div>
        </div>

        <div className="flex gap-4">
          <StatCard icon={<Package className="text-brand-green" />} label="Available" value={availableFood.length} />
          <StatCard icon={<CheckCircle className="text-blue-500" />} label="My Claims" value="3" />
        </div>
      </div>

      {/* Grid Feed */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center font-bold text-gray-400 animate-pulse">
            Scanning for surplus food...
          </div>
        ) : availableFood.length > 0 ? (
          availableFood.map((food) => (
            <FoodCard 
              key={food.id} 
              food={food} 
              onClaim={() => handleClaim(food.id)} 
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No surplus food in {user?.city} right now</h3>
            <p className="text-gray-500 mt-2">Check back soon or try updating your location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components to keep it clean
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

const FoodCard = ({ food, onClaim }) => (
  <div className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
    {/* Image Container */}
    <div className="relative h-56 overflow-hidden">
      <img 
        src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        alt={food.food_type}
      />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-brand-green">
        {food.category || 'Surplus'}
      </div>
    </div>

    {/* Details */}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-black text-gray-900 leading-tight truncate">{food.food_type}</h3>
      </div>
      
      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin size={16} className="text-brand-green" />
          <span className="text-sm font-medium">{food.pickup_address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={16} className="text-brand-green" />
          <span className="text-sm font-medium">Until {new Date(food.pickup_end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Quantity</p>
          <p className="text-lg font-black text-brand-green">{food.quantity_estimated} <span className="text-xs font-bold text-gray-400 uppercase">{food.quantity_unit}</span></p>
        </div>
        <button 
          onClick={onClaim}
          className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-green/90 transition-all active:scale-95 shadow-lg shadow-brand-green/20"
        >
          Claim Now
        </button>
      </div>
    </div>
  </div>
);

export default PartnerDashboard;