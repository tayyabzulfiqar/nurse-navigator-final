import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Account created!", description: "Please check your email for verification." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard"); // Redirect to the live dashboard
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">{isSignUp ? "Join Us" : "Welcome Back"}</h2>
        <p className="text-purple-200 text-sm">Professional Nurse Training Portal</p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <Input 
          type="email" placeholder="Email Address" value={email}
          onChange={(e) => setEmail(e.target.value)} required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl"
        />
        <Input 
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl"
        />
        <Button type="submit" disabled={loading} className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all">
          {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-purple-200 text-sm hover:text-white transition-colors">
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;