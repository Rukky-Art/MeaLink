// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { ChevronLeft, ShieldCheck, Clock, MapPin, Package, X, User, Phone, Info } from 'lucide-react';
// import { useNavigate } from 'react-router';
// import { fetchMyClaims } from '../store/slices/partnerSlice';

// const STATUS_COLORS = {
//   claimed:     'bg-blue-100 text-blue-700',
//   picked_up:   'bg-green-100 text-green-700',
//   distributed: 'bg-purple-100 text-purple-700',
//   cancelled:   'bg-red-100 text-red-700',
// };

// const MyClaims = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { myClaims, loading } = useSelector((state) => state.partner);
//   const [selectedClaim, setSelectedClaim] = useState(null);

//   useEffect(() => {
//     dispatch(fetchMyClaims());
//   }, [dispatch]);

//   // The claim object from GET /api/claims/ should contain the food details nested
//   // e.g. claim.food_details or claim.food (as object). Adjust field names below
//   // to match exactly what your backend returns.
//   const food = selectedClaim?.food_details || selectedClaim?.food_data || null;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-be-vietnam">
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-3 mb-8">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
//             <ChevronLeft size={22} />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
//             <p className="text-sm text-gray-500">{myClaims.length} claim{myClaims.length !== 1 ? 's' : ''} total</p>
//           </div>
//         </div>

//         {/* List */}
//         {loading ? (
//           <div className="space-y-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
//             ))}
//           </div>
//         ) : myClaims.length === 0 ? (
//           <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
//             <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
//             <h3 className="text-xl font-bold text-gray-900">No claims yet</h3>
//             <p className="text-gray-500 mt-2 mb-6">Browse available food and claim a donation to get started.</p>
//             <button
//               onClick={() => navigate('/dashboard/browse')}
//               className="bg-brand-green text-white font-bold px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all"
//             >
//               Browse Food
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {myClaims.map((claim) => {
//               // Handle both flat and nested food data shapes from backend
//               const foodName = claim.food_type || claim.food?.food_type || claim.food_details?.food_type || `Claim #${claim.id}`;
//               const address  = claim.pickup_address || claim.food?.pickup_address || claim.food_details?.pickup_address || '';

//               return (
//                 <div
//                   key={claim.id}
//                   onClick={() => setSelectedClaim(claim)}
//                   className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
//                       <Package size={22} />
//                     </div>
//                     <div>
//                       <p className="font-bold text-gray-900">{foodName}</p>
//                       <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
//                         {address && (
//                           <span className="flex items-center gap-1">
//                             <MapPin size={11} /> {address}
//                           </span>
//                         )}
//                         {claim.created_at && (
//                           <span className="flex items-center gap-1">
//                             <Clock size={11} />
//                             {new Date(claim.created_at).toLocaleDateString('en-NG', {
//                               day: 'numeric', month: 'short', year: 'numeric'
//                             })}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${STATUS_COLORS[claim.status] || 'bg-blue-100 text-blue-700'}`}>
//                     {claim.status?.replace('_', ' ') || 'claimed'}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Drawer: claim detail ── */}
//       {selectedClaim && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
//             onClick={() => setSelectedClaim(null)}
//           />

//           <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-300">

//             {/* Drawer header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div>
//                 <h2 className="font-black text-gray-900 text-lg">Claim Details</h2>
//                 <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mt-1 inline-block ${STATUS_COLORS[selectedClaim.status] || 'bg-blue-100 text-blue-700'}`}>
//                   {selectedClaim.status?.replace('_', ' ') || 'claimed'}
//                 </span>
//               </div>
//               <button
//                 onClick={() => setSelectedClaim(null)}
//                 className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Drawer body */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-5">

//               {/* Food image if available */}
//               {(food?.image_url || selectedClaim.image_url) && (
//                 <div className="h-48 rounded-2xl overflow-hidden">
//                   <img
//                     src={food?.image_url || selectedClaim.image_url}
//                     className="w-full h-full object-cover"
//                     alt="Food"
//                   />
//                 </div>
//               )}

//               {/* Food name + quantity */}
//               <div>
//                 <h3 className="text-xl font-black text-gray-900">
//                   {food?.food_type || selectedClaim.food_type || `Claim #${selectedClaim.id}`}
//                 </h3>
//                 {(food?.quantity_estimated || selectedClaim.quantity_estimated) && (
//                   <p className="text-brand-green font-bold text-sm mt-1">
//                     {food?.quantity_estimated || selectedClaim.quantity_estimated}{' '}
//                     {food?.quantity_unit || selectedClaim.quantity_unit}
//                   </p>
//                 )}
//               </div>

//               {/* Claim info */}
//               <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
//                 <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Claim Info</p>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Claim ID</span>
//                   <span className="font-bold text-gray-900">#{selectedClaim.id}</span>
//                 </div>
//                 {selectedClaim.created_at && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Claimed on</span>
//                     <span className="font-bold text-gray-900">
//                       {new Date(selectedClaim.created_at).toLocaleDateString('en-NG', {
//                         day: 'numeric', month: 'short', year: 'numeric'
//                       })}
//                     </span>
//                   </div>
//                 )}
//                 {selectedClaim.pickup_code && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Pickup code</span>
//                     <span className="font-black text-brand-green tracking-widest">{selectedClaim.pickup_code}</span>
//                   </div>
//                 )}
//               </div>

//               {/* Pickup location */}
//               <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
//                 <MapPin size={18} className="text-brand-green shrink-0 mt-0.5" />
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Address</p>
//                   <p className="text-sm font-bold text-gray-900 mt-0.5">
//                     {food?.pickup_address || selectedClaim.pickup_address || '—'}
//                   </p>
//                 </div>
//               </div>

//               {/* Pickup window */}
//               {(food?.pickup_start_time || selectedClaim.pickup_start_time) && (
//                 <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
//                   <Clock size={18} className="text-brand-green shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Window</p>
//                     <p className="text-sm font-bold text-gray-900 mt-0.5">
//                       {new Date(food?.pickup_start_time || selectedClaim.pickup_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       {' → '}
//                       {new Date(food?.pickup_end_time || selectedClaim.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Donor contact — always visible since they've claimed */}
//               <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Donor Contact</p>
//                 <div className="flex items-center gap-3">
//                   <User size={16} className="text-gray-400" />
//                   <span className="text-sm font-bold text-gray-900">
//                     {food?.donor_name || selectedClaim.donor_name || selectedClaim.contact_person_name || '—'}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Phone size={16} className="text-gray-400" />
//                   <span className="text-sm font-bold text-gray-900">
//                     {food?.contact_person_phone || selectedClaim.contact_person_phone || selectedClaim.donor_phone || '—'}
//                   </span>
//                 </div>
//               </div>

//               {/* Notes */}
//               {(food?.notes || selectedClaim.notes) && (
//                 <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
//                   <Info size={18} className="text-brand-green shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Notes</p>
//                     <p className="text-sm text-gray-700 mt-0.5">{food?.notes || selectedClaim.notes}</p>
//                   </div>
//                 </div>
//               )}

//               {/* What to do next */}
//               {selectedClaim.status === 'claimed' && (
//                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
//                   <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Next Steps</p>
//                   <p className="text-xs text-amber-700 leading-relaxed">
//                     Go to the pickup address within the pickup window. The donor will give you a code to confirm collection and change the status to picked up.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MyClaims;

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ShieldCheck, MapPin, Package, X, User,} from 'lucide-react';
import { useNavigate } from 'react-router';
import { fetchMyClaims } from '../store/slices/partnerSlice';

const STATUS_COLORS = {
  claimed:     'bg-blue-100 text-blue-700',
  picked_up:   'bg-green-100 text-green-700',
  distributed: 'bg-purple-100 text-purple-700',
  cancelled:   'bg-red-100 text-red-700',
};

const MyClaims = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myClaims, loading } = useSelector((state) => state.partner);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    dispatch(fetchMyClaims());
  }, [dispatch]);

  // Extract food data safely regardless of nesting
  const getFoodData = (claim) => {
    return claim?.food_details || claim?.food_data || claim?.food || {};
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-be-vietnam">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-colors">
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
            <p className="text-sm text-gray-500">Items you have reserved for pickup</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
            ))}
          </div>
        ) : myClaims.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No active claims</h3>
            <p className="text-gray-500 mt-2 mb-6">You haven't claimed any food yet.</p>
            <button
              onClick={() => navigate('/dashboard/browse')}
              className="bg-brand-green text-white font-bold px-6 py-3 rounded-2xl hover:shadow-lg transition-all"
            >
              Browse Available Food
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {myClaims.map((claim) => {
              const food = getFoodData(claim);
              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:border-brand-green/30 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                  
                    <div>
                      <h4 className="font-bold text-gray-900">{food.food_type || 'Food Donation'}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={12} /> {food.city || 'Local Pickup'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Package size={12} /> {food.quantity_estimated} {food.quantity_unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                     <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${STATUS_COLORS[claim.status] || 'bg-blue-100 text-blue-700'}`}>
                      {claim.status?.replace('_', ' ') || 'claimed'}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium">Ref: #{claim.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Drawer - Opens when a claim is clicked */}
      {selectedClaim && (
        <ClaimDetailDrawer 
          claim={selectedClaim} 
          food={getFoodData(selectedClaim)} 
          onClose={() => setSelectedClaim(null)} 
        />
      )}
    </div>
  );
};

// Sub-component for the Drawer to keep code clean
const ClaimDetailDrawer = ({ claim, food, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="font-black text-xl">Claim Information</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
      </div>
      
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        <div className="bg-brand-mint/20 rounded-2xl p-6 text-center border border-brand-green/10">
          <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] mb-2">Pickup Code</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-widest">
            {claim.pickup_code || '----'}
          </h3>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Present this code to the donor when you arrive at the location to verify your collection.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Listing Details</h4>
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
               <img src={food.image_url} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900">{food.food_type}</p>
              <p className="text-sm text-brand-green font-bold">{food.quantity_estimated} {food.quantity_unit}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Address</p>
              <p className="text-sm font-bold text-gray-900">{food.pickup_address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="text-gray-400 mt-1" size={18} />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Donor Contact</p>
              <p className="text-sm font-bold text-gray-900">{food.donor_name || 'Verified Donor'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50">
        <button 
          className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all"
          onClick={onClose}
        >
          Close Details
        </button>
      </div>
    </div>
  </>
);

export default MyClaims;