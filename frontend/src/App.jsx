import { Routes, Route, Navigate } from 'react-router';
import AuthLayout from './layout/AuthLayout';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelector';
import RegisterDetails from './pages/RegisterDetails';
import VerificationPage from './pages/VerificationPage';

function App() {
  return (
    <Routes>
      {/* Auth Flow */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* Redirect empty path to login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register/select-role" element={<RoleSelection />} />
        <Route path="/register/details/:role" element={<RegisterDetails />} />
        <Route path="/verification-pending" element={<VerificationPage />} />
      </Route>
    </Routes>
  );
}

export default App;


// import { Routes, Route } from 'react-router';
// import AuthLayout from './layouts/AuthLayout';
// import Login from './pages/Login';
// import RoleSelection from './pages/RoleSelection';
// import Register from './pages/Register';

// function App() {
//   return (
//     <Routes>
//       <Route element={<AuthLayout />}>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register/select-role" element={<RoleSelection />} />
//         <Route path="/register/details/:role" element={<Register />} />
//       </Route>
//       {/* Add your dashboard routes here later */}
//     </Routes>
//   );
// }