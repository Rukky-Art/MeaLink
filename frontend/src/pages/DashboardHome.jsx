import { useSelector } from 'react-redux';
import DonorDashboard from './DonorDashboard';
import PartnerDashboard from './PartnerDashboard';

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
      return <div className="p-8 text-center">Welcome, Admin.</div>;
    default:
      return <div className="p-8 text-center text-red-500">Unauthorized role or data error.</div>;
  }

};

export default DashboardHome;