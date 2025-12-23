import { LogOut, Bell } from "lucide-react";

// This MUST be a NAMED EXPORT to match your Dashboard
export const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Nurse Navigator</p>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Clinical Portal</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-full text-slate-400">
          <Bell className="w-5 h-5" />
        </div>
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          NS
        </div>
      </div>
    </header>
  );
};