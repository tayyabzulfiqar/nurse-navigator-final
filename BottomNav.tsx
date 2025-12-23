import { Home, BookOpen, Award, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "Learn", path: "/learn" },
    { icon: Award, label: "Certs", path: "/certificates" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button 
          key={item.label}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? 'text-primary' : 'text-slate-400'}`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};