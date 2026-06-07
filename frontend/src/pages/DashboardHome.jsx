import { useSelector } from 'react-redux';
import DonorDashboard from './donorFolder/DonorDashboard';
import PartnerDashboard from './PartnerDashboard';
import AdminDashboard from './adminFolder/AdminDashboard';

const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("Current User Role:", user?.role);
switch (user?.role) {
    case 'donor':
      return <DonorDashboard />;
    case 'partner':
      return <PartnerDashboard />;
    case 'receiver':
      return <div className="p-8 text-center">Receiver Dashboard coming soon!</div>;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div className="p-8 text-center text-red-500">Unauthorized role or data error.</div>;
  }

};

export default DashboardHome;