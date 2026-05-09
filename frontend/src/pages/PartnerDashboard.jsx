import { Search, MapPin, Clock } from 'lucide-react';

const PartnerDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Meals Near You</h1>
        <p className="text-gray-500">Explore surplus food listings from donors in Lagos.</p>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {['All', 'Restaurant', 'Bakery', 'Hotel', 'Grocery'].map((cat) => (
          <button key={cat} className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-brand-green hover:text-white transition-colors whitespace-nowrap">
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <FoodListingCard 
          title="20 Packs of Jollof Rice"
          donor="Mama Put Express"
          distance="1.2 km"
          expiry="2 hours left"
          image="https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&q=80&w=400"
        />
        <FoodListingCard 
          title="Assorted Pastries"
          donor="The French Bakery"
          distance="0.8 km"
          expiry="4 hours left"
          image="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400"
        />
      </div>
    </div>
  );
};

const FoodListingCard = ({ title, donor, distance, expiry, image }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="p-5 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-900 leading-tight">{title}</h3>
        <span className="bg-brand-mint text-brand-green text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          Available
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Search size={14} className="text-brand-green" />
          <span>{donor}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{distance} away</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
          <Clock size={14} />
          <span>{expiry}</span>
        </div>
      </div>

      <button className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all mt-2">
        Request Pickup
      </button>
    </div>
  </div>
);

export default PartnerDashboard;