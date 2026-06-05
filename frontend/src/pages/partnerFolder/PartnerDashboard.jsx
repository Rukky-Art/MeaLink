// import { useEffect, useMemo, useState } from 'react';
// import {
//   MapPin,
//   Clock,
//   CheckCircle,
//   Package,
//   ShoppingBag,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Search,
// } from 'lucide-react';
// import { fetchAvailableFood, fetchMyClaims,  } from '../../store/slices/partnerSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router';

// const ITEMS_PER_PAGE = 10;

// const PartnerDashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.auth);
//   const { availableFood, myClaims, loading } = useSelector((state) => state.partner);
// console.log('Available Food:', availableFood);
// console.log('My Claims:', myClaims);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeFilter, setActiveFilter] = useState('all'); // all, available, claimed, taken

 


// // Only count claims that aren't cancelled
//   const activeClaims = useMemo(() => {
//     return myClaims.filter((c) => c.status !== 'cancelled');
//   }, [myClaims]);

//   const availableCount = availableFood.filter((f) => !f.is_claimed).length;
//   const myClaimsCount = activeClaims.length; // Uses updated active claims count

//   // Filter food based on search and filter chips
//   const filteredFood = useMemo(() => {
//     let list = [...availableFood];
    
//     // Apply search
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       list = list.filter(
//         (f) =>
//           f.food_type?.toLowerCase().includes(q) ||
//           f.category?.toLowerCase().includes(q) ||
//           f.pickup_address?.toLowerCase().includes(q) ||
//           String(f.id).includes(q)
//       );
//     }
    
//     // Apply filter chips
//     if (activeFilter !== 'all') {
//       list = list.filter((f) => {
//         // Find if this food has an ACTIVE claim belonging to me
//         const myActiveClaim = myClaims.find(
//           (c) => (c.food === f.id || c.food?.id === f.id) && c.status !== 'cancelled'
//         );
        
//         const isMine = !!myActiveClaim;
//         // If it's claimed globally but NOT an active claim of mine, someone else has it
//         const isClaimedByOthers = f.is_claimed && !isMine;
        
//         if (activeFilter === 'available') {
//           // It's available if it's not globally claimed OR if my claim on it was cancelled
//           return !f.is_claimed || (f.is_claimed && myClaims.some(c => (c.food === f.id || c.food?.id === f.id) && c.status === 'cancelled'));
//         }
//         if (activeFilter === 'claimed') {
//           return isMine;
//         }
//         if (activeFilter === 'taken') {
//           return isClaimedByOthers;
//         }
//         return true;
//       });
//     }
    
//     return list;
//   }, [availableFood, myClaims, searchQuery, activeFilter]);

//   // Calculate pagination
//   const totalPagesFiltered = useMemo(() => {
//     return Math.max(1, Math.ceil(filteredFood.length / ITEMS_PER_PAGE));
//   }, [filteredFood.length]);

//   // Derive effective page (clamped) without setting state in effect
//   const effectivePage = useMemo(() => {
//     return Math.min(currentPage, totalPagesFiltered);
//   }, [currentPage, totalPagesFiltered]);

//   // Paginated food using effective page
//   const paginatedFood = useMemo(() => {
//     const start = (effectivePage - 1) * ITEMS_PER_PAGE;
//     return filteredFood.slice(start, start + ITEMS_PER_PAGE);
//   }, [filteredFood, effectivePage]);

//   // Effects for data fetching
//   useEffect(() => {
//     dispatch(fetchAvailableFood());
//     dispatch(fetchMyClaims());
//   }, [dispatch]);

//   // Handlers to reset page on search/filter change
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (key) => {
//     setActiveFilter(key);
//     setCurrentPage(1);
//   };

//   const goToPreviousPage = () => {
//     setCurrentPage((page) => Math.max(1, page - 1));
//   };

//   const goToNextPage = () => {
//     setCurrentPage((page) => Math.min(totalPagesFiltered, page + 1));
//   };

//   const filterChips = [
//     { key: 'all', label: 'All' },
//     { key: 'available', label: 'Available' },
//     { key: 'claimed', label: 'Claimed' },
//     { key: 'taken', label: 'Taken' },
//   ];

//   return (
//     <div className="p-4 sm:p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 min-h-screen">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8 md:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//         <div>
//           <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 text-emerald-600 px-4 py-2 rounded-full shadow-sm mb-4">
//             <MapPin size={15} />
//             <span className="text-xs font-bold uppercase tracking-widest">
//               {user?.city || 'Your City'}
//             </span>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
//             Welcome, {user?.name || 'Partner'}
//           </h1>

//           <p className="text-slate-500 font-medium mt-2">
//             Browse available surplus food listings around your city.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <StatCard
//             icon={<Package className="text-emerald-500" />}
//             label="Available"
//             value={availableCount}
//           />
//           <StatCard
//             icon={<CheckCircle className="text-blue-500" />}
//             label="My Claims"
//             value={myClaimsCount}
//           />
//         </div>
//       </div>

//       {/* Table/Card Container */}
//       <div className="max-w-7xl mx-auto bg-white rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
//         {/* Search and Filters */}
//         <div className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 bg-white">
//           <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
//             <div className="relative flex-1 max-w-xl">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 placeholder="Search by food, category, location, or ID..."
//                 className="w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
//               />
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               {filterChips.map((chip) => (
//                 <button
//                   key={chip.key}
//                   onClick={() => handleFilterChange(chip.key)}
//                   className={`px-3 sm:px-4 h-10 rounded-2xl text-xs sm:text-sm font-semibold border transition-all duration-200 ${
//                     activeFilter === chip.key
//                       ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
//                       : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
//                   }`}
//                 >
//                   {chip.label}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Header Info */}
//         <div className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//           <div>
//             <h2 className="text-lg md:text-xl font-bold text-slate-800">Food Listings</h2>
//             <p className="text-xs sm:text-sm text-slate-500 mt-1">
//               Showing{' '}
//               <span className="font-semibold text-slate-700">
//                 {filteredFood.length === 0 ? 0 : (effectivePage - 1) * ITEMS_PER_PAGE + 1}
//               </span>{' '}
//               to{' '}
//               <span className="font-semibold text-slate-700">
//                 {Math.min(effectivePage * ITEMS_PER_PAGE, filteredFood.length)}
//               </span>{' '}
//               of{' '}
//               <span className="font-semibold text-slate-700">{filteredFood.length}</span>{' '}
//               listings
//             </p>
//           </div>

//           <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 sm:px-4 py-2 rounded-2xl">
//             <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
//               Page
//             </span>
//             <span className="text-xs sm:text-sm font-bold text-slate-700">
//               {effectivePage} of {totalPagesFiltered}
//             </span>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px]">
//               <TableHead />
//               <tbody className="divide-y divide-slate-100">
//                 {[...Array(10)].map((_, i) => (
//                   <SkeletonRow key={i} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : filteredFood.length > 0 ? (
//           <>
//             {/* Desktop Table View */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full min-w-[1000px]">
//                 <TableHead />
//                 <tbody className="divide-y divide-slate-100">
//                 {paginatedFood.map((food, index) => {
//   // Find the exact claim object for this food
//   const matchingClaim = myClaims.find(
//     (c) => c.food === food.id || c.food?.id === food.id
//   );
//   return (
//     <FoodRow
//       key={food.id}
//       food={food}
//       isMyClaim={matchingClaim} // Passing the full object now!
//       onClick={() => navigate(`/dashboard/browse`)}
//       index={index}
//     />
//   );
// })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Card View */}
//             <div className="block md:hidden p-4 space-y-3">
//               {paginatedFood.map((food) => {
//                 const matchingClaim = myClaims.find(
//                   (c) => c.food === food.id || c.food?.id === food.id
//                 );
//                 return (
//                   <MobileFoodCard
//                     key={food.id}
//                     food={food}
//                     isMyClaim={matchingClaim}
//                     onClick={() => navigate(`/dashboard/browse`)}
//                   />
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             <div className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
//               <p className="text-xs sm:text-sm text-slate-500 font-medium">
//                 Displaying{' '}
//                 <span className="font-semibold text-slate-700">{ITEMS_PER_PAGE}</span>{' '}
//                 items per page
//               </p>

//               <div className="flex items-center gap-2 sm:gap-3">
//                 <button
//                   onClick={goToPreviousPage}
//                   disabled={effectivePage === 1}
//                   className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   <ChevronLeft size={16} />
//                   Prev
//                 </button>

//                 <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-semibold text-xs sm:text-sm shadow-sm">
//                   {effectivePage} / {totalPagesFiltered}
//                 </div>

//                 <button
//                   onClick={goToNextPage}
//                   disabled={effectivePage === totalPagesFiltered}
//                   className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
//                 >
//                   Next
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="p-12 md:p-24 text-center">
//             <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-5">
//               <ShoppingBag size={42} className="text-slate-300" />
//             </div>

//             <h3 className="text-lg md:text-xl font-bold text-slate-800">
//               {searchQuery || activeFilter !== 'all'
//                 ? 'No results match your search/filter'
//                 : `No surplus food in ${user?.city || 'your city'} right now`}
//             </h3>

//             <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">
//               {searchQuery || activeFilter !== 'all'
//                 ? 'Try adjusting your search or filters.'
//                 : 'Check back soon.'}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const TableHead = () => (
//   <thead>
//     <tr className="bg-slate-50/80 border-b border-slate-100">
//       <th className="px-6 md:px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Food
//       </th>
//       <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Category
//       </th>
//       <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Quantity
//       </th>
//       <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Pickup Location
//       </th>
//       <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Pickup Time
//       </th>
//       <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Status
//       </th>
//       <th className="px-6 md:px-8 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">
//         Action
//       </th>
//     </tr>
//   </thead>
// );

// const FoodRow = ({ food, isMyClaim, onClick, index }) => {
//   const isClaimedByOthers = food.is_claimed && !isMyClaim;

// // 1. Determine if the current claim is actually active or cancelled
// const isCancelled = isMyClaim?.status === 'cancelled';

// // 2. Adjust your conditional checks to account for the cancellation
// const status = (isMyClaim && !isCancelled)
//   ? 'Claimed by you'
//   : (isClaimedByOthers && !isCancelled)
//     ? 'Taken'
//     : 'Available';

// const statusType = (isMyClaim && !isCancelled) 
//   ? 'mine' 
//   : (isClaimedByOthers && !isCancelled) 
//     ? 'taken' 
//     : 'available';

//   return (
//     <tr
//       onClick={onClick}
//       className={`group transition-all duration-200 cursor-pointer ${
//         index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
//       } hover:bg-emerald-50/30`}
//     >
//       <td className="px-6 md:px-8 py-5">
//         <div className="flex items-center gap-4">
//           <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm ring-1 ring-slate-100">
//             <img
//               src={
//                 food.image_url ||
//                 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
//               }
//               alt={food.food_type}
//               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//             />
//           </div>

//           <div className="min-w-0">
//             <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[220px]">
//               {food.food_type}
//             </h3>
//             <p className="text-xs text-slate-400 font-medium mt-1">
//               ID #{food.id}
//             </p>
//           </div>
//         </div>
//       </td>

//       <td className="px-6 py-5">
//         <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold uppercase tracking-wider">
//           {food.category || 'Surplus'}
//         </span>
//       </td>

//       <td className="px-6 py-5">
//         <div className="text-sm font-semibold text-slate-800">
//           {food.quantity_estimated}{' '}
//           <span className="text-xs font-medium text-slate-500 uppercase">
//             {food.quantity_unit}
//           </span>
//         </div>
//       </td>

//       <td className="px-6 py-5">
//         <div className="flex items-center gap-2 text-slate-600 max-w-[260px]">
//           <MapPin size={16} className="text-emerald-500 shrink-0" />
//           <span className="text-sm font-medium truncate">
//             {food.pickup_address}
//           </span>
//         </div>
//       </td>

//       <td className="px-6 py-5">
//         <div className="flex items-center gap-2 text-slate-600">
//           <Clock size={16} className="text-emerald-500 shrink-0" />
//           <span className="text-sm font-medium whitespace-nowrap">
//             Until{' '}
//             {new Date(food.pickup_end_time).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </span>
//         </div>
//       </td>

//       <td className="px-6 py-5">
//         <StatusBadge status={status} type={statusType} />
//       </td>

//       <td className="px-6 md:px-8 py-5 text-right">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onClick();
//           }}
//           className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-2xl bg-slate-800 text-white hover:bg-emerald-500 transition-all duration-200 font-semibold text-xs shadow-sm hover:shadow-md"
//         >
//           <Eye size={15} />
//           View
//         </button>
//       </td>
//     </tr>
//   );
// };

// const MobileFoodCard = ({ food, isMyClaim, onClick }) => {
// const isCancelled = isMyClaim?.status === 'cancelled';
//   const hasActiveClaim = isMyClaim && !isCancelled;
//   const isClaimedByOthers = food.is_claimed && !hasActiveClaim;

//   const statusType = hasActiveClaim ? 'mine' : isClaimedByOthers ? 'taken' : 'available';
//   const statusLabel = hasActiveClaim
//     ? 'Claimed by you'
//     : isClaimedByOthers
//       ? 'Taken'
//       : 'Available';

//   const statusStyles = {
//     available: 'bg-emerald-50 text-emerald-600 border-emerald-100',
//     mine: 'bg-blue-50 text-blue-600 border-blue-100',
//     taken: 'bg-slate-100 text-slate-500 border-slate-200',
//   };

//   const dotStyles = {
//     available: 'bg-emerald-500',
//     mine: 'bg-blue-500',
//     taken: 'bg-slate-400',
//   };

//   return (
//    <div
//       onClick={onClick}
//       className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
//     >
//       <div className="flex gap-3">
//         <img
//           src={
//             food.image_url ||
//             'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
//           }
//           alt={food.food_type}
//           className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-slate-100"
//         />
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <h3 className="text-sm font-semibold text-slate-800 truncate">
//               {food.food_type}
//             </h3>
//             <span
//               className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusStyles[statusType]}`}
//             >
//               <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[statusType]}`} />
//               {statusLabel}
//             </span>
//           </div>
//           <p className="text-xs text-slate-500 mt-1 truncate flex items-center gap-1">
//             <MapPin size={12} className="text-emerald-500 shrink-0" />
//             {food.pickup_address}
//           </p>
//           <div className="flex items-center justify-between mt-3">
//             <div className="text-xs text-slate-600">
//               <span className="font-semibold text-slate-800">
//                 {food.quantity_estimated}
//               </span>{' '}
//               {food.quantity_unit}
//             </div>
//             <div className="flex items-center gap-1 text-xs text-slate-600">
//               <Clock size={12} className="text-emerald-500" />
//               {new Date(food.pickup_end_time).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatusBadge = ({ status, type }) => {
//   const styles = {
//     mine: 'bg-blue-50 text-blue-600 border-blue-100',
//     taken: 'bg-slate-100 text-slate-500 border-slate-200',
//     available: 'bg-emerald-50 text-emerald-600 border-emerald-100',
//   };

//   const dotStyles = {
//     mine: 'bg-blue-500',
//     taken: 'bg-slate-400',
//     available: 'bg-emerald-500',
//   };

//   return (
//     <span
//       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${styles[type]}`}
//     >
//       <span className={`w-2 h-2 rounded-full ${dotStyles[type]}`} />
//       {status}
//     </span>
//   );
// };

// const StatCard = ({ icon, label, value }) => (
//   <div className="bg-white px-5 md:px-6 py-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4 min-w-[150px]">
//     <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
//     <div>
//       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//         {label}
//       </p>
//       <p className="text-2xl font-bold text-slate-800">{value}</p>
//     </div>
//   </div>
// );

// const SkeletonRow = () => (
//   <tr className="animate-pulse">
//     <td className="px-6 md:px-8 py-5">
//       <div className="flex items-center gap-4">
//         <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
//         <div className="space-y-2">
//           <div className="h-4 w-36 bg-slate-200 rounded" />
//           <div className="h-3 w-20 bg-slate-200 rounded" />
//         </div>
//       </div>
//     </td>
//     <td className="px-6 py-5">
//       <div className="h-8 w-24 bg-slate-200 rounded-full" />
//     </td>
//     <td className="px-6 py-5">
//       <div className="h-4 w-20 bg-slate-200 rounded" />
//     </td>
//     <td className="px-6 py-5">
//       <div className="h-4 w-48 bg-slate-200 rounded" />
//     </td>
//     <td className="px-6 py-5">
//       <div className="h-4 w-28 bg-slate-200 rounded" />
//     </td>
//     <td className="px-6 py-5">
//       <div className="h-8 w-28 bg-slate-200 rounded-full" />
//     </td>
//     <td className="px-6 md:px-8 py-5 text-right">
//       <div className="h-10 w-20 bg-slate-200 rounded-2xl ml-auto" />
//     </td>
//   </tr>
// );

// export default PartnerDashboard;

import { useEffect, useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle,
  Package,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { 
  fetchAvailableFood, 
  fetchMyClaims,
  setSearchQuery,
  setCategoryFilter,
  selectMyClaims,
  selectIsLoading,
  selectVisibleFood,
  selectAvailableCount,
  selectMyClaimsCount
} from '../../store/slices/partnerSlice';

const ITEMS_PER_PAGE = 10;

const PartnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. Core State Subscriptions
  const { user } = useSelector((state) => state.auth);
  const loading = useSelector(selectIsLoading);
  const myClaims = useSelector(selectMyClaims);
  
  // 2. Extract Pre-Computed Derived State & Metrics directly from Redux Selectors
  const filteredFood = useSelector(selectVisibleFood);
  const availableCount = useSelector(selectAvailableCount);
  const myClaimsCount = useSelector(selectMyClaimsCount);

  // 3. Local Layout State Control
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // Handles UI chip visual highlighting

  // 4. Pure Pagination Mathematics
  const totalPagesFiltered = Math.max(1, Math.ceil(filteredFood.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPagesFiltered);
  
  const startOffset = (effectivePage - 1) * ITEMS_PER_PAGE;
  const paginatedFood = filteredFood.slice(startOffset, startOffset + ITEMS_PER_PAGE);

  // Load backend database records on Mount
  useEffect(() => {
    dispatch(fetchAvailableFood());
    dispatch(fetchMyClaims());
  }, [dispatch]);

  // Handle live keyword search tracking
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    dispatch(setSearchQuery(value)); // Update centralized filter selector instantly
    setCurrentPage(1);
  };

  // Synchronize category selection arrays
  const handleFilterChange = (key) => {
    setActiveFilter(key);
    dispatch(setCategoryFilter(key)); // Update centralized filter selector instantly
    setCurrentPage(1);
  };

  const goToPreviousPage = () => setCurrentPage((page) => Math.max(1, page - 1));
  const goToNextPage = () => setCurrentPage((page) => Math.min(totalPagesFiltered, page + 1));

  const filterChips = [
    { key: 'all', label: 'All' },
    { key: 'Surplus', label: 'Surplus' },
    { key: 'Perishable', label: 'Perishable' }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 text-emerald-600 px-4 py-2 rounded-full shadow-sm mb-4">
            <MapPin size={15} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {user?.city || 'Your City'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Welcome, {user?.name || 'Partner'}
          </h1>

          <p className="text-slate-500 font-medium mt-2">
            Browse available surplus food listings around your city.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Package className="text-emerald-500" />}
            label="Available"
            value={availableCount}
          />
          <StatCard
            icon={<CheckCircle className="text-blue-500" />}
            label="My Claims"
            value={myClaimsCount}
          />
        </div>
      </div>

      {/* Table/Card Container */}
      <div className="max-w-7xl mx-auto bg-white rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden">
        {/* Search and Filters */}
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 bg-white">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder="Search by food name, or pickup location..."
                className="w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {filterChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => handleFilterChange(chip.key)}
                  className={`px-3 sm:px-4 h-10 rounded-2xl text-xs sm:text-sm font-semibold border transition-all duration-200 ${
                    activeFilter === chip.key
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Header Info */}
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Food Listings</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {filteredFood.length === 0 ? 0 : startOffset + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-700">
                {Math.min(effectivePage * ITEMS_PER_PAGE, filteredFood.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700">{filteredFood.length}</span>{' '}
              listings
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 sm:px-4 py-2 rounded-2xl">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
              Page
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-700">
              {effectivePage} of {totalPagesFiltered}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <TableHead />
              <tbody className="divide-y divide-slate-100">
                {[...Array(6)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredFood.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <TableHead />
                <tbody className="divide-y divide-slate-100">
                  {paginatedFood.map((food, index) => {
                    const matchingClaim = myClaims.find(
                      (c) => c.food === food.id || c.food?.id === food.id
                    );
                    return (
                      <FoodRow
                        key={food.id}
                        food={food}
                        isMyClaim={matchingClaim}
                        onClick={() => navigate(`/dashboard/browse`)}
                        index={index}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden p-4 space-y-3">
              {paginatedFood.map((food) => {
                const matchingClaim = myClaims.find(
                  (c) => c.food === food.id || c.food?.id === food.id
                );
                return (
                  <MobileFoodCard
                    key={food.id}
                    food={food}
                    isMyClaim={matchingClaim}
                    onClick={() => navigate(`/dashboard/browse`)}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 md:px-8 py-4 md:py-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Displaying{' '}
                <span className="font-semibold text-slate-700">{ITEMS_PER_PAGE}</span>{' '}
                items per page
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={goToPreviousPage}
                  disabled={effectivePage === 1}
                  className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="h-10 sm:h-11 px-4 sm:px-5 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-semibold text-xs sm:text-sm shadow-sm">
                  {effectivePage} / {totalPagesFiltered}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={effectivePage === totalPagesFiltered}
                  className="h-10 sm:h-11 px-3 sm:px-4 rounded-2xl border border-slate-200 bg-white text-slate-600 font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 md:p-24 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mb-5">
              <ShoppingBag size={42} className="text-slate-300" />
            </div>

            <h3 className="text-lg md:text-xl font-bold text-slate-800">
              {localSearch || activeFilter !== 'all'
                ? 'No results match your search/filter'
                : `No surplus food in ${user?.city || 'your city'} right now`}
            </h3>

            <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">
              {localSearch || activeFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Check back soon.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TableHead = () => (
  <thead>
    <tr className="bg-slate-50/80 border-b border-slate-100">
      <th className="px-6 md:px-8 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Food</th>
      <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
      <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Quantity</th>
      <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pickup Location</th>
      <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pickup Time</th>
      <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
      <th className="px-6 md:px-8 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
    </tr>
  </thead>
);

const FoodRow = ({ food, isMyClaim, onClick, index }) => {
  const isClaimedByOthers = food.is_claimed && !isMyClaim;
  const isCancelled = isMyClaim?.status === 'cancelled';

  const status = (isMyClaim && !isCancelled)
    ? 'Claimed by you'
    : (isClaimedByOthers && !isCancelled)
      ? 'Taken'
      : 'Available';

  const statusType = (isMyClaim && !isCancelled) 
    ? 'mine' 
    : (isClaimedByOthers && !isCancelled) 
      ? 'taken' 
      : 'available';

  return (
    <tr
      onClick={onClick}
      className={`group transition-all duration-200 cursor-pointer ${
        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
      } hover:bg-emerald-50/30`}
    >
      <td className="px-6 md:px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm ring-1 ring-slate-100">
            <img
              src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
              alt={food.food_type}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[220px]">
              {food.food_type}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1">ID #{food.id}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold uppercase tracking-wider">
          {food.category || 'Surplus'}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="text-sm font-semibold text-slate-800">
          {food.quantity_estimated}{' '}
          <span className="text-xs font-medium text-slate-500 uppercase">{food.quantity_unit}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-600 max-w-[260px]">
          <MapPin size={16} className="text-emerald-500 shrink-0" />
          <span className="text-sm font-medium truncate">{food.pickup_address}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={16} className="text-emerald-500 shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">
            Until {new Date(food.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={status} type={statusType} />
      </td>

      <td className="px-6 md:px-8 py-5 text-right">
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-2xl bg-slate-800 text-white hover:bg-emerald-500 transition-all duration-200 font-semibold text-xs shadow-sm hover:shadow-md"
        >
          <Eye size={15} />
          View
        </button>
      </td>
    </tr>
  );
};

const MobileFoodCard = ({ food, isMyClaim, onClick }) => {
  const isCancelled = isMyClaim?.status === 'cancelled';
  const hasActiveClaim = isMyClaim && !isCancelled;
  const isClaimedByOthers = food.is_claimed && !hasActiveClaim;

  const statusType = hasActiveClaim ? 'mine' : isClaimedByOthers ? 'taken' : 'available';
  const statusLabel = hasActiveClaim ? 'Claimed by you' : isClaimedByOthers ? 'Taken' : 'Available';

  const statusStyles = {
    available: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    mine: 'bg-blue-50 text-blue-600 border-blue-100',
    taken: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  const dotStyles = {
    available: 'bg-emerald-500',
    mine: 'bg-blue-500',
    taken: 'bg-slate-400',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex gap-3">
        <img
          src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
          alt={food.food_type}
          className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-slate-100"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-800 truncate">{food.food_type}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusStyles[statusType]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[statusType]}`} />
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate flex items-center gap-1">
            <MapPin size={12} className="text-emerald-500 shrink-0" />
            {food.pickup_address}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{food.quantity_estimated}</span> {food.quantity_unit}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Clock size={12} className="text-emerald-500" />
              {new Date(food.pickup_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, type }) => {
  const styles = {
    mine: 'bg-blue-50 text-blue-600 border-blue-100',
    taken: 'bg-slate-100 text-slate-500 border-slate-200',
    available: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  const dotStyles = { mine: 'bg-blue-500', taken: 'bg-slate-400', available: 'bg-emerald-500' };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${styles[type]}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyles[type]}`} />
      {status}
    </span>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white px-5 md:px-6 py-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4 min-w-[150px]">
    <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 md:px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
        <div className="space-y-2">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-5"><div className="h-8 w-24 bg-slate-200 rounded-full" /></td>
    <td className="px-6 py-5"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
    <td className="px-6 py-5"><div className="h-4 w-48 bg-slate-200 rounded" /></td>
    <td className="px-6 py-5"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
    <td className="px-6 py-5"><div className="h-8 w-28 bg-slate-200 rounded-full" /></td>
    <td className="px-6 md:px-8 py-5 text-right"><div className="h-10 w-20 bg-slate-200 rounded-2xl ml-auto" /></td>
  </tr>
);

export default PartnerDashboard;