import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Plus } from 'lucide-react';
import ImpactChart from './ImpactChart';
import { fetchMyListings } from '../../store/slices/foodSlice';
import { useNavigate } from 'react-router';

const DonorDashboard = () => {
  const dispatch = useDispatch();
  const { myListings = [], loading } = useSelector((state) => state.food);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const stats = {
    total: myListings.length,
    claimed: myListings.filter(l => l.status === 'claimed').length,
    meals: myListings.reduce((acc, curr) => acc + (Number(curr.quantity_estimated) || 0), 0),
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen font-be-vietnam">
      {/* Header - Always visible */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome, {user?.name || 'Friend'}!
          </h1>
          <p className="text-gray-500 text-sm">
            {loading ? (
              <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
            ) : (
              `You have ${stats.total} active listings.`
            )}
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard/create-listing')}
          className="bg-brand-green text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Post Surplus Food
        </button>
      </div>

      {/* Stats Cards - Show skeleton while loading */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {loading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard title="Total Listings" value={stats.total} />
            <StatCard title="Successfully Claimed" value={stats.claimed} />
            <StatCard title="Meals Redistributed" value={stats.meals} />
            <StatCard title="Unclaimed" value={myListings.filter(l => l.status === 'available').length} />
          </>
        )}
      </div>

      {/* Recent Listings - Show skeleton while loading */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6">Recent Listings</h3>
        <div className="space-y-2">
          {loading ? (
            <>
              <SkeletonActivityItem />
              <SkeletonActivityItem />
              <SkeletonActivityItem />
            </>
          ) : myListings.length > 0 ? (
            myListings.slice(0, 5).map((listing) => (
              <ActivityItem 
                key={listing.id}
                title={listing.food_type}
                status={listing.status}
                time={`Pickup by ${new Date(listing.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-2">No listings yet</p>
              <p className="text-gray-400 text-sm mb-4">Start sharing your surplus food with the community</p>
       
            </div>
          )}
        </div>
      </div>

      {/* Impact Chart - Show with empty data while loading */}
      <div className="bg-brand-green rounded-[40px] p-10 text-white shadow-2xl shadow-brand-green/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h3 className="text-2xl font-bold">Your Impact</h3>
            <p className="text-brand-mint opacity-70 text-sm italic">
              Tracking meals shared in {new Date().getFullYear()}
            </p>
          </div>
          
          <div className="flex gap-12">
            {loading ? (
              <>
                <SkeletonImpactStat />
                <SkeletonImpactStat />
              </>
            ) : (
              <>
                <ImpactStat label="Total Meals" value={stats.meals} />
                <ImpactStat label="Donations" value={stats.total} />
              </>
            )}
          </div>
        </div>

        <div className="w-full bg-white/5 rounded-3xl p-6 backdrop-blur-sm border border-white/10">
          {loading ? (
            <div className="h-80 w-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white mx-auto mb-4" />
                <p className="text-white/70 text-sm">Loading your impact data...</p>
              </div>
            </div>
          ) : (
            <ImpactChart data={getMonthlyData(myListings)} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Components ---

const SkeletonStatCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
    <div className="h-8 bg-gray-200 rounded w-16" />
  </div>
);

const SkeletonActivityItem = () => (
  <div className="flex justify-between items-center p-4 rounded-xl animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
    <div className="h-6 bg-gray-200 rounded-full w-20" />
  </div>
);

const SkeletonImpactStat = () => (
  <div className="text-center animate-pulse">
    <div className="h-10 bg-white/20 rounded w-16 mx-auto mb-2" />
    <div className="h-3 bg-white/20 rounded w-20 mx-auto" />
  </div>
);

// --- Original Sub-Components ---

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <span className="text-3xl font-bold text-gray-900">{value}</span>
  </div>
);

const ImpactStat = ({ label, value }) => (
  <div className="text-center">
    <p className="text-4xl font-bold mb-1">{value}</p>
    <p className="text-brand-mint text-sm opacity-80 uppercase tracking-widest">{label}</p>
  </div>
);

const ActivityItem = ({ title, status, time }) => (
  <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-brand-mint/20 rounded-xl flex items-center justify-center text-brand-green">
        <Package size={22} />
      </div>
      <div>
        <p className="font-bold text-gray-900 capitalize">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
    <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
      status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    }`}>
      {status}
    </span>
  </div>
);

const getMonthlyData = (listings) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  
  const chartData = months.map((month, index) => ({ 
    name: month, 
    meals: 0,
    monthIndex: index
  }));

  if (!listings || !Array.isArray(listings)) {
    return chartData;
  }

  listings.forEach(listing => {
    try {
      const date = new Date(listing.created_at);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in listing:', listing);
        return;
      }
      
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        const quantity = Number(listing.quantity_estimated) || 0;
        
        if (quantity > 0) {
          chartData[monthIndex].meals += quantity;
        }
      }
    } catch (error) {
      console.error('Error processing listing:', listing, error);
    }
  });

  return chartData.map(({ name, meals }) => ({ name, meals }));
};

export default DonorDashboard;