import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(1, 'This field is required');

interface AuthFormProps {
  onSuccess?: () => void;
  onVerificationSent?: () => void;
}

export function AuthForm({ onSuccess, onVerificationSent }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) newErrors.email = emailResult.error.errors[0].message;
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) newErrors.password = passwordResult.error.errors[0].message;
    
    if (!isLogin) {
      if (!nameSchema.safeParse(firstName).success) newErrors.firstName = "Required";
      if (!nameSchema.safeParse(lastName).success) newErrors.lastName = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
        } else {
          onSuccess?.();
        }
      } else {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
        } else {
          onVerificationSent?.(); 
        }
      }
    } catch (err) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="w-full">
        <button onClick={() => setIsForgotPassword(false)} className="flex items-center gap-1 text-white/80 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>
        <h2 className="text-xl font-semibold text-white mb-2 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Email Address</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 h-12" />
          </div>
          <Button type="submit" className="w-full bg-white text-primary h-14 font-bold shadow-xl">Send Reset Link</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-8">
        <Button 
          variant={isLogin ? 'default' : 'ghost'} 
          className={`flex-1 h-12 rounded-xl ${!isLogin ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-primary shadow-lg'}`} 
          onClick={() => setIsLogin(true)}
        >
          Log In
        </Button>
        <Button 
          variant={!isLogin ? 'default' : 'ghost'} 
          className={`flex-1 h-12 rounded-xl ${isLogin ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white text-primary shadow-lg'}`} 
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white font-medium ml-1">First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-white/10 border-white/20 h-12 rounded-lg focus:bg-white/20 transition-all" />
            </div>
            <div className="space-y-2">
              <Label className="text-white font-medium ml-1">Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-white/10 border-white/20 h-12 rounded-lg focus:bg-white/20 transition-all" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-white font-medium ml-1">Email Address</Label>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="jane.smith@nhs.net" 
            className="bg-white/10 border-white/20 h-12 rounded-lg focus:bg-white/20 transition-all" 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white font-medium ml-1 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 opacity-70" /> Password
            </Label>
            {isLogin && (
              <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-white/60 hover:text-white underline-offset-4 hover:underline">Forgot password?</button>
            )}
          </div>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="bg-white/10 border-white/20 h-12 rounded-lg focus:bg-white/20 transition-all" 
          />
        </div>

        {isLogin ? (
          <div className="flex items-center space-x-3 py-1">
            <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(c === true)} className="w-5 h-5 border-white/40 rounded-md" />
            <label htmlFor="remember" className="text-sm text-white/80 cursor-pointer font-medium">Remember me for 30 days</label>
          </div>
        ) : (
          <div className="flex items-start space-x-3 py-1">
            <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(c) => setAgreeToTerms(c === true)} className="w-5 h-5 mt-0.5 border-white/40 rounded-md" />
            <label htmlFor="terms" className="text-sm text-white/80 leading-snug">
              I agree to the <a href="/terms" className="underline font-bold text-white">Terms</a> and <a href="/privacy" className="underline font-bold text-white">Privacy Policy</a>
            </label>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading || (!isLogin && !agreeToTerms)} 
          className="w-full bg-white text-primary hover:bg-white/90 h-[56px] text-lg font-bold rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all active:scale-[0.98] mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Log In' : 'Create Account')}
        </Button>

        <div className="pt-6">
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-white/40 uppercase tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant="outline" className="bg-white/5 border-white/10 text-white h-12 rounded-xl hover:bg-white/10 transition-colors" onClick={() => {}}>
            Google
          </Button>
          <Button type="button" variant="outline" className="bg-white/5 border-white/10 text-white h-12 rounded-xl hover:bg-white/10 transition-colors" onClick={() => {}}>
            <ShieldCheck className="mr-2 w-4 h-4 text-white/70" /> Secure ID
          </Button>
        </div>
      </form>
    </div>
  );
}