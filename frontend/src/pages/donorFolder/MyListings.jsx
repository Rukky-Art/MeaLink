import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Plus, Package, Clock } from 'lucide-react';
import { fetchMyListings } from '../../store/slices/foodSlice';
import { formatDeadlineWithTime } from '../../utils/dateUtils';

const STATUS_COLORS = {
  available:   'bg-emerald-100 text-emerald-700',
  claimed:     'bg-amber-100 text-amber-700',
  picked_up:   'bg-blue-100 text-blue-700',
  distributed: 'bg-purple-100 text-purple-700',
  expired:     'bg-red-100 text-red-700',
};

const FILTERS = [
  { key: 'all',         label: 'All'         },
  { key: 'available',   label: 'Available'   },
  { key: 'claimed',     label: 'Claimed'     },
  { key: 'picked_up',   label: 'Picked up'   },
  { key: 'distributed', label: 'Distributed' },
  { key: 'expired',     label: 'Expired'     },
];

const MyListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myListings, loading, error } = useSelector((state) => state.food);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const filteredListings =
    activeFilter === 'all'
      ? myListings
      : myListings.filter((item) => item.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">My listings</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard/create-listing')}
            className="flex items-center gap-2 bg-brand-green text-white font-bold px-4 md:px-5 py-2.5 rounded-2xl hover:shadow-lg transition-all text-sm md:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New listing</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((filter) => {
            const count =
              filter.key === 'all'
                ? myListings.length
                : myListings.filter((l) => l.status === filter.key).length;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`
                  px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap
                  ${activeFilter === filter.key
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
                `}
              >
                {filter.label}
                <span className="px-1.5 py-px rounded-full text-[10px] font-bold bg-white/20">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-red-500 font-medium">
            {typeof error === 'string' ? error : 'Failed to load listings.'}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 md:p-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 mb-1">No listings found</p>
            <p className="text-sm text-gray-400 mb-6">
              {activeFilter === 'all' ? 'Start sharing your surplus food.' : `No ${activeFilter.replace('_', ' ')} listings.`}
            </p>
            <button
              onClick={() => navigate('/dashboard/create-listing')}
              className="bg-brand-green text-white font-bold px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all"
            >
              Post Food
            </button>
          </div>
        ) : (
          <>
            {/* ── DESKTOP: table (Visible from 1024px and up) ── */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-8 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">Food Listing</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">Quantity</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">Deadline</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 tracking-wider uppercase">Status</th>
                      <th className="w-24" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-semibold text-gray-900">{listing.food_type}</p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {listing.pickup_city} • {listing.pickup_address}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-700">
                          {listing.quantity_estimated} {listing.quantity_unit}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-700">
                          {formatDeadlineWithTime(listing.pickup_end_time)}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[listing.status] || 'bg-gray-100 text-gray-600'}`}>
                            {listing.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => navigate(`/dashboard/listings/${listing.id}`)}
                            className="px-4 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── MOBILE & TABLET: Card Grid (Visible below 1024px) ── */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Status */}
                    <div className="flex mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize whitespace-nowrap ${STATUS_COLORS[listing.status] || 'bg-gray-100 text-gray-600'}`}>
                        {listing.status?.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Name + city */}
                    <p className="font-bold text-gray-900 text-base truncate leading-tight">{listing.food_type}</p>
                    <p className="text-xs text-gray-400 truncate mt-1 mb-4">{listing.pickup_city}</p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Package size={14} className="text-brand-green shrink-0" />
                        <span className="truncate">{listing.quantity_estimated} {listing.quantity_unit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} className="text-brand-green shrink-0" />
                        <span className="truncate">{formatDeadlineWithTime(listing.pickup_end_time)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => navigate(`/dashboard/listings/${listing.id}`)}
                    className="w-full py-2.5 text-xs font-bold border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors text-gray-700"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyListings;