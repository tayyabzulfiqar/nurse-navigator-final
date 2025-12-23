import React from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; 
import { HeroCard } from '../components/HeroCard';

// MUST be 'export const' to fix the white screen error
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Triggers Supabase logout
    navigate("/auth"); // Returns to the Sign-in page we built
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Good Morning, Tayyab</h1>
        </header>

        {/* We pass the handleLogout function here */}
        <HeroCard progress={44} onLogout={handleLogout} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
           {/* Your training modules remain here */}
        </div>
      </div>
    </div>
  );
};