import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { 
  ChevronLeft, 
  Bell,
  Clock, 
  UserCheck, 
  Truck, 
  AlertTriangle, 
  Package 
} from 'lucide-react';
import { fetchMyListings } from '../../store/slices/foodSlice';

const NOTIFICATION_TYPES = {
  claimed: { icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-100', title: 'Listing Claimed' },
  picked_up: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', title: 'Pickup Confirmed' },
  expired: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', title: 'Listing Expired' },
  default: { icon: Package, color: 'text-gray-600', bg: 'bg-gray-100', title: 'Update' }
};

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { myListings } = useSelector((state) => state.food);
  const [activeTab, setActiveTab] = useState('all');
  const [readIds, setReadIds] = useState([]);

  // Fetch listings on mount
  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  // Derived Notifications Logic
  const notifications = useMemo(() => {
    if (!myListings) return [];
    
    // Convert listings into notification objects
    return myListings
      .filter(l => ['claimed', 'picked_up', 'expired'].includes(l.status))
      .map((listing,) => ({
        id: `notif-${listing.id}`,
        listingId: listing.id,
        type: listing.status,
        title: NOTIFICATION_TYPES[listing.status]?.title || 'Update',
        message: `${listing.food_type} has status: ${listing.status.replace('_', ' ')}.`,
        time: new Date(listing.created_at).toLocaleDateString(),
        read: readIds.includes(`notif-${listing.id}`)
      }));
  }, [myListings, readIds]);

  const filtered = activeTab === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAsRead = (id) => {
    setReadIds(prev => [...prev, id]);
  };

  const markAllAsRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-brand-green hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['all', 'unread'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'text-brand-green border-b-2 border-brand-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} ({tab === 'all' ? notifications.length : notifications.filter(n => !n.read).length})
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((notif) => {
              const typeCfg = NOTIFICATION_TYPES[notif.type] || NOTIFICATION_TYPES.default;
              const Icon = typeCfg.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    navigate(`/listings/${notif.listingId}`);
                  }}
                  className={`flex gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                    !notif.read ? 'ring-1 ring-brand-green/20' : ''
                  }`}
                >
                  <div className={`mt-1 p-3 rounded-2xl ${typeCfg.bg}`}>
                    <Icon size={20} className={typeCfg.color} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{notif.title}</p>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-brand-green rounded-full shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 pr-4">{notif.message}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                      <Clock size={13} /> {notif.time}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Bell size={28} className="text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700">No updates yet</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                When your listings are claimed or picked up, you'll see them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
