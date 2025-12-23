import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ProfileCompletionIndicator } from '@/components/ProfileCompletionIndicator';
import { ArrowLeft, Loader2, Save, Camera, Bell, Target, UserCircle, ShieldCheck } from 'lucide-react';
import { format, startOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import logo from '@/assets/logo.webp';

interface Profile { first_name: string | null; last_name: string | null; department: string | null; job_title: string | null; avatar_url: string | null; email_training_reminders: boolean; email_deadline_alerts: boolean; email_completion_summary: boolean; reminder_days_before: number; }
interface WeeklyGoals { target_modules: number; target_minutes: number; }

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile>({ first_name: '', last_name: '', department: '', job_title: '', avatar_url: null, email_training_reminders: true, email_deadline_alerts: true, email_completion_summary: false, reminder_days_before: 3 });
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoals>({ target_modules: 3, target_minutes: 60 });

  useEffect(() => { if (user) { fetchProfile(); fetchWeeklyGoals(); } }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (data) setProfile(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchWeeklyGoals = async () => {
    if (!user) return;
    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const { data } = await supabase.from('weekly_goals').select('*').eq('user_id', user.id).eq('week_start', format(weekStart, 'yyyy-MM-dd')).maybeSingle();
      if (data) setWeeklyGoals({ target_modules: data.target_modules, target_minutes: data.target_minutes });
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update(profile).eq('user_id', user.id);
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      await supabase.from('weekly_goals').upsert({ user_id: user.id, week_start: format(weekStart, 'yyyy-MM-dd'), ...weeklyGoals });
      toast({ title: 'Profile synchronized' });
    } catch (e) { toast({ title: 'Error', variant: 'destructive' }); } finally { setSaving(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const filePath = `${user.id}/avatar-${Date.now()}`;
      await supabase.storage.from('avatars').upload(filePath, file);
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('user_id', user.id);
      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (err) { console.error(err); } finally { setUploading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-hero px-8 pt-10 pb-24">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="p-3 rounded-2xl bg-white/10 text-white"><ArrowLeft /></button>
            <h1 className="text-4xl font-black text-white">Account Settings</h1>
          </div>
          <img src={logo} className="h-10 bg-white rounded-xl px-4 py-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card className="rounded-[2rem] border-none shadow-2xl">
            <CardContent className="pt-10 px-8 pb-10 flex flex-col items-center">
              <div className="relative mb-6">
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <span className="text-4xl text-white font-bold">U</span>}
                </div>
                <Button onClick={() => fileInputRef.current?.click()} size="icon" className="absolute bottom-0 right-0 rounded-full">{uploading ? <Loader2 className="animate-spin" /> : <Camera />}</Button>
              </div>
              <p className="font-black text-xl mb-6">{user?.email}</p>
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">First Name</Label>
                    <Input className="h-14 rounded-xl" value={profile.first_name || ''} onChange={e => setProfile({...profile, first_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">Last Name</Label>
                    <Input className="h-14 rounded-xl" value={profile.last_name || ''} onChange={e => setProfile({...profile, last_name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Job Title</Label>
                  <Input className="h-14 rounded-xl" value={profile.job_title || ''} onChange={e => setProfile({...profile, job_title: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card className="rounded-[2rem] border-none shadow-xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="text-primary" /> Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                <div><Label className="font-bold">Training Reminders</Label><p className="text-xs text-muted-foreground">Alerts for upcoming modules</p></div>
                <Switch checked={profile.email_training_reminders} onCheckedChange={v => setProfile({...profile, email_training_reminders: v})} />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                <div><Label className="font-bold">Deadline Alerts</Label><p className="text-xs text-muted-foreground">Critical notifications</p></div>
                <Switch checked={profile.email_deadline_alerts} onCheckedChange={v => setProfile({...profile, email_deadline_alerts: v})} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full h-16 rounded-2xl text-lg font-black shadow-xl" disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Sync Profile
          </Button>
        </div>
      </div>
    </div>
  );
}