import React from 'react';
import { Shield, ArrowRight, LogOut, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// This part tells the computer that 'onLogout' is allowed
interface HeroCardProps {
  progress: number;
  onLogout: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ progress, onLogout }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-gradient-to-br from-purple-600 to-purple-800 rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/10">
      <div className="absolute top-6 right-8 flex gap-4 z-20">
        <button onClick={() => navigate("/profile")} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-all border border-white/10">
          <User className="w-5 h-5" />
        </button>
        <button onClick={onLogout} className="p-2 bg-white/20 rounded-full text-white hover:bg-red-500/40 transition-all border border-white/10">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="relative p-8 lg:p-12 grid lg:grid-cols-[1fr,auto] gap-8 items-center text-white text-left">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"><Shield className="w-6 h-6" /></div>
            <div>
              <p className="text-purple-200 text-xs font-black uppercase tracking-widest">Training Status</p>
              <h2 className="text-4xl font-black mt-1">You're On Track</h2>
            </div>
          </div>
          <button onClick={() => navigate("/learn")} className="group inline-flex items-center gap-3 bg-white text-purple-700 font-bold px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all">
            <span>Continue Training</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="bg-white/10 p-8 rounded-[2rem] border border-white/10 flex items-center justify-center text-4xl font-bold">
           {progress}%
        </div>
      </div>
    </div>
  );
};