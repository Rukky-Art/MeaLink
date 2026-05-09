import { useSelector } from 'react-redux';
import { 
  Package, 
  Plus 
} from 'lucide-react';
import ImpactChart from '../components/dashboard/ImpactChart';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isDonor = user?.role === 'donor';

  return (
    <div className="flex h-screen bg-gray-50 font-be-vietnam">
    

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Partner'}!</h1>
            <p className="text-gray-500 text-sm">Here is what is happening with your donations today.</p>
          </div>
          
          {isDonor && (
            <button className="bg-brand-green text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
              <Plus size={20} />
              <span>Donate Food</span>
            </button>
          )}
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Meals Shared" value="1,284" trend="+12%" />
          <StatCard title="Active Listings" value="12" />
          <StatCard title="CO2 Saved (kg)" value="45.2" trend="+5.4%" />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Impact Over Time</h3>
            <ImpactChart />
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
            {/* List of recent donations/claims */}
            <div className="space-y-4">
               <ActivityItem title="Fresh Bread" status="Claimed" time="2h ago" />
               <ActivityItem title="Mixed Vegetables" status="Available" time="4h ago" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};



const StatCard = ({ title, value, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <div className="flex items-end gap-3">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      {trend && <span className="text-xs text-green-500 font-bold mb-1.5">{trend}</span>}
    </div>
  </div>
);

const ActivityItem = ({ title, status, time }) => (
  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-brand-mint rounded-full flex items-center justify-center text-brand-green">
        <Package size={18} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${status === 'Claimed' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
      {status}
    </span>
  </div>
);

export default Dashboard;