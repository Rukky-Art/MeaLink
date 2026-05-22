import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllListings } from '../../store/slices/foodSlice';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import getCategoryStyles from './imgMapping';
import { Clock, MapPin, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';



const ListingCard = ({ listing, handleClaimClick }) => {
  // Use the mapper for images based on API category
  const { img: fallbackImg, label } = getCategoryStyles(listing.category);
  const displayImage = listing.image ? listing.image : fallbackImg;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={displayImage} 
          alt={listing.food_type} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`${
            listing.status === 'claimed' ? 'bg-gray-400' : 'bg-brand-green'
          } text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm`}>
            {listing.status || 'Available'}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md uppercase shadow-sm">
            {label}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div>
          <h4 className="text-xl font-bold text-gray-900 capitalize">{listing.food_type}</h4>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {listing.notes || "Freshly prepared and ready for pickup."}
          </p>
        </div>

        <div className="space-y-3 pt-2 text-sm font-medium text-gray-600 mt-auto">
          <div className="flex items-center gap-2">
            <Package size={16} className="text-brand-green" />
            {listing.quantity_estimated} {listing.quantity_unit}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-green" />
            {listing.pickup_city}
          </div>
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <Clock size={16} />
            Pickup by {listing.pickup_end_time
  ? new Date(listing.pickup_end_time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  : 'Time unavailable'}
          </div>
        </div>

        <button onClick={handleClaimClick} className="w-full py-3.5 bg-brand-green text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-sm active:scale-[0.98]">
          Sign up to claim
        </button>
      </div>
    </div>
  );
};


const AvailableListings = () => {
  const dispatch = useDispatch();
  const { listings, loading, error } = useSelector((state) => state.food);
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


  useEffect(() => {
    dispatch(fetchAllListings());
  }, [dispatch]);

  if (loading) return (
    <div className="py-24 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green mx-auto mb-4"></div>
      <p className="font-bold text-gray-500">Finding fresh food near you...</p>
    </div>
  );

  if (error) return (
    <div className="py-24 text-center text-red-500 font-medium">
      Unable to load listings. Please try again later.
    </div>
  );

  return (
    <section className="py-24 bg-brand-mint/20 font-be-vietnam" id='listing'>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-brand-green font-bold text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Now
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Real food. Available today.
            </h2>
          </div>
          <button className="text-brand-green font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-2">
            See all available listings <ArrowRight size={16} />
          </button>
        </div>

        {listings?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {listings.map((item) => (
              <ListingCard key={item.id} listing={item} handleClaimClick={handleClaimClick} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No active listings at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};
export default AvailableListings;