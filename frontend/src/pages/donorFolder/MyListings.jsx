import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Plus } from 'lucide-react';
import { fetchMyListings } from '../../store/slices/foodSlice';

const STATUS_COLORS = {
  available: 'bg-emerald-100 text-emerald-700',
  claimed: 'bg-amber-100 text-amber-700',
  picked_up: 'bg-blue-100 text-blue-700',
  distributed: 'bg-purple-100 text-purple-700',
  expired: 'bg-red-100 text-red-700',
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'claimed', label: 'Claimed' },
  { key: 'picked_up', label: 'Picked up' },
  { key: 'distributed', label: 'Distributed' },
  { key: 'expired', label: 'Expired' },
];

const MyListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myListings, loading, error } = useSelector((state) => state.food);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  // Filter logic
  const filteredListings =
    activeFilter === 'all'
      ? myListings
      : myListings.filter((item) => item.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My listings</h1>
          </div>

          <button
           onClick={() => navigate('/dashboard/create-listing')}
            className="flex items-center gap-2 bg-brand-green text-white font-bold px-5 py-2.5 rounded-2xl hover:shadow-lg transition-all"
          >
            <Plus size={18} /> New listing
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
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
                  px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2
                  ${
                    activeFilter === filter.key
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }
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

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading your listings...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-8 py-4 text-xs font-bold text-gray-500 tracking-wider">FOOD LISTING</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 tracking-wider">QUANTITY</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 tracking-wider">DEADLINE</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 tracking-wider">STATUS</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">{listing.food_type}</p>
                          <p className="text-sm text-gray-500">
                            {listing.pickup_city} • {listing.pickup_address}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-gray-700">
                        {listing.quantity_estimated} {listing.quantity_unit}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {new Date(listing.pickup_end_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[listing.status]}`}>
                          {listing.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => navigate(`/listings/${listing.id}`)}
                          className="px-4 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-12 text-center text-gray-500">
                      No listings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListings;