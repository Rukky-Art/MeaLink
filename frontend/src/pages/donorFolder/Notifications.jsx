// import { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   ChevronLeft, 
//   Bell,
//   Clock, 
//   UserCheck, 
//   Truck, 
//   AlertTriangle, 
//   Package 
// } from 'lucide-react';
// import { fetchMyListings } from '../../store/slices/foodSlice';

// const NOTIFICATION_TYPES = {
//   claimed: { icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-100', title: 'Listing Claimed' },
//   picked_up: { icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100', title: 'Pickup Confirmed' },
//   expired: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', title: 'Listing Expired' },
//   default: { icon: Package, color: 'text-gray-600', bg: 'bg-gray-100', title: 'Update' }
// };

// const Notifications = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { myListings } = useSelector((state) => state.food);
//   const [activeTab, setActiveTab] = useState('all');
//   const [readIds, setReadIds] = useState([]);

//   // Fetch listings on mount
//   useEffect(() => {
//     dispatch(fetchMyListings());
//   }, [dispatch]);

//   // Derived Notifications Logic
//   const notifications = useMemo(() => {
//     if (!myListings) return [];
    
//     // Convert listings into notification objects
//     return myListings
//       .filter(l => ['claimed', 'picked_up', 'expired'].includes(l.status))
//       .map((listing,) => ({
//         id: `notif-${listing.id}`,
//         listingId: listing.id,
//         type: listing.status,
//         title: NOTIFICATION_TYPES[listing.status]?.title || 'Update',
//         message: `${listing.food_type} has status: ${listing.status.replace('_', ' ')}.`,
//         time: new Date(listing.created_at).toLocaleDateString(),
//         read: readIds.includes(`notif-${listing.id}`)
//       }));
//   }, [myListings, readIds]);

//   const filtered = activeTab === 'unread' ? notifications.filter(n => !n.read) : notifications;

//   const markAsRead = (id) => {
//     setReadIds(prev => [...prev, id]);
//   };

//   const markAllAsRead = () => {
//     setReadIds(notifications.map(n => n.id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
//               <ChevronLeft size={22} />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
//           </div>

//           {notifications.some(n => !n.read) && (
//             <button
//               onClick={markAllAsRead}
//               className="text-sm font-medium text-brand-green hover:underline"
//             >
//               Mark all as read
//             </button>
//           )}
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-6 border-b border-gray-200">
//           {['all', 'unread'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`pb-3 px-1 text-sm font-semibold capitalize transition-all ${
//                 activeTab === tab
//                   ? 'text-brand-green border-b-2 border-brand-green'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {tab} ({tab === 'all' ? notifications.length : notifications.filter(n => !n.read).length})
//             </button>
//           ))}
//         </div>

//         {/* List */}
//         <div className="space-y-3">
//           {filtered.length > 0 ? (
//             filtered.map((notif) => {
//               const typeCfg = NOTIFICATION_TYPES[notif.type] || NOTIFICATION_TYPES.default;
//               const Icon = typeCfg.icon;

//               return (
//                 <div
//                   key={notif.id}
//                   onClick={() => {
//                     markAsRead(notif.id);
//                     navigate(`/listings/${notif.listingId}`);
//                   }}
//                   className={`flex gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all ${
//                     !notif.read ? 'ring-1 ring-brand-green/20' : ''
//                   }`}
//                 >
//                   <div className={`mt-1 p-3 rounded-2xl ${typeCfg.bg}`}>
//                     <Icon size={20} className={typeCfg.color} />
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between">
//                       <p className="font-semibold text-gray-900">{notif.title}</p>
//                       {!notif.read && (
//                         <div className="w-2 h-2 bg-brand-green rounded-full shrink-0" />
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1 pr-4">{notif.message}</p>
//                     <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
//                       <Clock size={13} /> {notif.time}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="p-4 bg-gray-100 rounded-full mb-4">
//                 <Bell size={28} className="text-gray-400" />
//               </div>
//               <p className="font-semibold text-gray-700">No updates yet</p>
//               <p className="text-sm text-gray-500 mt-1 max-w-xs">
//                 When your listings are claimed or picked up, you'll see them here.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notifications;

import { useState, useMemo } from 'react';
import { Bell, Package, ShoppingBag, CheckCircle, X, Inbox } from 'lucide-react';

// ── Mock data — replace with api.get('notifications/') when backend is ready ──
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'claim',
    title: 'Someone claimed your food',
    message: 'A partner just claimed your "Jollof Rice" listing.',
    time: '2 mins ago',
    read: false,
  },
  {
    id: 2,
    type: 'status',
    title: 'Claim picked up',
    message: 'Your claim on "Fried Rice" has been marked as picked up.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'available',
    title: 'New food near you',
    message: 'A new listing "Beans & Plantain" is available 1.2km from you.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'status',
    title: 'Claim distributed',
    message: 'Your claim on "Cooked Egusi" has been marked as distributed.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 5,
    type: 'claim',
    title: 'Someone claimed your food',
    message: 'A partner just claimed your "Bread & Stew" listing.',
    time: '2 days ago',
    read: true,
  },
];

const TYPE_CONFIG = {
  claim: {
    icon: ShoppingBag,
    bg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    dot: 'bg-amber-400',
  },
  status: {
    icon: CheckCircle,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    dot: 'bg-blue-400',
  },
  available: {
    icon: Package,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    dot: 'bg-emerald-400',
  },
};

const TABS = ['All', 'Unread', 'Claims', 'Status', 'Available'];

const Notifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('All');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = useMemo(() => {
    switch (activeTab) {
      case 'Unread':    return notifications.filter(n => !n.read);
      case 'Claims':    return notifications.filter(n => n.type === 'claim');
      case 'Status':    return notifications.filter(n => n.type === 'status');
      case 'Available': return notifications.filter(n => n.type === 'available');
      default:          return notifications;
    }
  }, [notifications, activeTab]);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const dismiss = (id) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 font-be-vietnam">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green/10 rounded-2xl flex items-center justify-center">
              <Bell size={20} className="text-brand-green" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-400 font-medium">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-brand-green hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border-2 transition-all
                ${activeTab === tab
                  ? 'bg-brand-green text-white border-brand-green shadow-sm'
                  : 'bg-white text-slate-500 border-transparent hover:border-slate-200'}`}
            >
              {tab}
              {tab === 'Unread' && unreadCount > 0 && (
                <span className="ml-1.5 bg-white/30 text-white px-1.5 py-0.5 rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Inbox size={24} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-700">No notifications here</p>
            <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.status;
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`relative flex items-start gap-4 bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-sm
                    ${n.read ? 'border-slate-100' : 'border-brand-green/20 shadow-sm shadow-brand-green/5'}`}
                >
                  {/* unread dot */}
                  {!n.read && (
                    <span className={`absolute top-4 right-10 w-2 h-2 rounded-full ${cfg.dot}`} />
                  )}

                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon size={18} className={cfg.iconColor} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${n.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[11px] text-slate-300 font-medium mt-1.5">{n.time}</p>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                    className="shrink-0 p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-300 hover:text-slate-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Backend ready note */}
        <p className="text-center text-[11px] text-slate-300 mt-8 font-medium">
          Live notifications will appear here once the backend is connected.
        </p>
      </div>
    </div>
  );
};

export default Notifications;