import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard"; 
import { AuthForm as Auth } from "./pages/Auth";

// This is the main controller of your website
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. When you first open the site, go to the Login page */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* 2. The Professional Login/Signup page you created */}
        <Route path="/auth" element={<Auth />} />
        
        {/* 3. The Private Dashboard for your Nurse Training */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 4. If someone types a wrong address, send them back to Login */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;