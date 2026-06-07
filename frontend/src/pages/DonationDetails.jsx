import { useEffect} from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, MapPin, Clock, Phone, User, ShieldCheck, Info } from 'lucide-react';
import { fetchFoodDetails, claimFood } from '../store/slices/partnerSlice';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentFood, loading, claimLoading } = useSelector((state) => state.partner);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFoodDetails(id));
  }, [dispatch, id]);

  const handleClaim = async () => {
    const result = await dispatch(claimFood(id));
    if (claimFood.fulfilled.match(result)) {
      // Logic for success (maybe a toast or redirect)
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Loading donation details...</div>;
  if (!currentFood) return <div className="p-20 text-center text-red-500">Donation not found.</div>;

  const isClaimedByMe = currentFood.claimed_by === user?.id;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-be-vietnam">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green mb-6 transition-all"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Back to Feed</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm">
              <div className="h-80 bg-brand-mint/20 relative">
                <img 
                  src={currentFood.image_url || '/placeholder-food.png'} 
                  className="w-full h-full object-cover"
                  alt={currentFood.food_type}
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-brand-green uppercase">
                  {currentFood.is_claimed ? 'Reserved' : 'Available'}
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900">{currentFood.food_type} — {currentFood.quantity_estimated} {currentFood.quantity_unit}</h1>
                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                      <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {currentFood.donor_name?.[0]}
                      </div>
                      <span className="text-sm font-medium">Posted by <span className="font-bold text-gray-900">{currentFood.donor_name}</span> • Verified Donor</span>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs font-medium">Posted 2 hours ago</span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 my-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quantity</p>
                    <p className="font-bold text-gray-900">{currentFood.quantity_estimated} portions</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</p>
                    <p className="font-bold text-gray-900">{currentFood.category || 'General'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup Zone</p>
                    <p className="font-bold text-gray-900">{currentFood.city}, {currentFood.country}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pickup Deadline</p>
                    <p className="font-bold text-red-500">Today • {new Date(currentFood.pickup_end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 flex items-center gap-2">
                    <Info size={18} className="text-brand-green" />
                    Condition & Notes
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {currentFood.description || "No specific notes provided for this donation."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar (Right) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
              {!currentFood.is_claimed ? (
                <>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
                    <Clock size={20} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 leading-tight">
                      Pickup closes soon — claim now to secure this donation.
                    </p>
                  </div>
                  <button 
                    onClick={handleClaim}
                    disabled={claimLoading}
                    className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl hover:bg-opacity-90 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-50"
                  >
                    {claimLoading ? 'Processing...' : 'Claim this donation'}
                  </button>
                  <button className="w-full bg-white text-gray-500 border border-gray-200 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-all">
                    Save for later
                  </button>
                </>
              ) : (
                <div className={`p-4 rounded-2xl border flex gap-3 ${isClaimedByMe ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                   <ShieldCheck size={20} className={isClaimedByMe ? 'text-blue-500' : 'text-gray-400'} />
                   <p className={`text-xs font-bold ${isClaimedByMe ? 'text-blue-600' : 'text-gray-500'}`}>
                     {isClaimedByMe ? 'You have reserved this listing.' : 'This listing has already been claimed.'}
                   </p>
                </div>
              )}
            </div>

            {/* Contact Card (Only visible if claimed or public) */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-4 uppercase text-[10px] tracking-widest text-gray-400">Pickup Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><User size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Person</p>
                    <p className="text-sm font-bold text-gray-900">{currentFood.donor_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Phone size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                    <p className="text-sm font-bold text-gray-900">
                      {currentFood.is_claimed ? currentFood.donor_phone : '+234 ••• ••• •••'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><MapPin size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Address</p>
                    <p className="text-sm font-bold text-gray-900">{currentFood.pickup_address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonationDetails;