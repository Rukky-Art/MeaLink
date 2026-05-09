import { Outlet } from 'react-router';
import meal from '../assets/meal.png';
import logo1 from '../assets/logo1.png';

const AuthLayout = () => {
  return (
    // 1. Changed min-h-screen to h-screen and added overflow-hidden
    <div className="flex h-screen w-full overflow-hidden font-be-vietnam">
      
      {/* Left Panel: Branding & Illustration */}
      {/* Added shrink-0 to prevent this side from being squeezed */}
      <div className="hidden lg:flex w-1/2 bg-brand-mint items-center justify-center p-8 shrink-0">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
             <img src={logo1} alt="MeaLink Logo" className="w-10" />
             <h1 className="text-2xl font-bold text-gray-900">MeaLink</h1>
          </div>

          <div className="flex justify-center mb-6">
            <img 
              src={meal} 
              alt="MealLink Illustration" 
              className="w-full max-h-[380px] object-contain rounded-2xl" 
            />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">Reduce food waste</h2>
          <p className="text-brand-gray text-lg">
            Connect surplus food with people who need it.
          </p>
        </div>
      </div>

      {/* Right Panel: Dynamic Content (Forms/Selection) */}
      {/* 2. Added overflow-y-auto so ONLY this side scrolls when the form is long */}
      <div className="w-full lg:w-1/2 flex flex-col items-center overflow-y-auto p-8 lg:p-8 bg-white">
        {/* Show logo on mobile/tablet only */}
        <div className="lg:hidden mb-8 shrink-0">
           <img src={logo1} alt="MeaLink Logo" className="w-24 mx-auto" />   
        </div>
        
        {/* 3. Added my-auto to keep the form centered if it's short, or start from top if long */}
        <div className="w-full max-w-md my-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;