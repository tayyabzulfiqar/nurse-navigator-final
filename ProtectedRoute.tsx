import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Check current session immediately
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAuthenticated(true);
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuthenticated(true);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
        navigate("/auth");
      }
    });

    // 3. SAFETY TIMEOUT: If it takes more than 3 seconds, stop spinning
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Connecting to Clinical Database...</p>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
};

export default ProtectedRoute;