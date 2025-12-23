import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrainingCard } from "./TrainingCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ListTodo, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// [Interfaces remain the same as your provided code]
interface TrainingModule { id: string; title: string; category: string; duration_minutes: number | null; is_mandatory: boolean | null; priority: string | null; }
interface UserProgress { module_id: string; status: string | null; progress_percentage: number | null; due_date: string | null; }
type CardVariant = "urgent" | "new" | "progress" | "completed";

export const TrainingFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: modulesData } = await supabase.from('training_modules').select('*').order('priority', { ascending: false });
      const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', user.id);
      
      setModules(modulesData || []);
      const map: Record<string, UserProgress> = {};
      progressData?.forEach(p => { map[p.module_id] = p; });
      setProgressMap(map);
    } catch (error) { console.error('Error:', error);
    } finally { setLoading(false); }
  };

  const getCardVariant = (module: TrainingModule, progress?: UserProgress): CardVariant => {
    if (progress?.status === 'completed') return 'completed';
    if (progress?.status === 'in_progress') return 'progress';
    if (module.priority === 'high' || module.is_mandatory) return 'urgent';
    return 'new';
  };

  const getTag = (module: TrainingModule, progress?: UserProgress): string => {
    if (progress?.status === 'completed') return 'Completed';
    if (progress?.status === 'in_progress') return `${progress.progress_percentage || 0}% Complete`;
    if (module.priority === 'high') return 'High Priority';
    if (module.is_mandatory) return 'Mandatory';
    return 'Not Started';
  };

  // Keep your excellent sorting logic
  const sortedModules = [...modules].sort((a, b) => {
    const pA = progressMap[a.id]; const pB = progressMap[b.id];
    if (pA?.status === 'completed' && pB?.status !== 'completed') return 1;
    if (pB?.status === 'completed' && pA?.status !== 'completed') return -1;
    if (pA?.status === 'in_progress' && pB?.status !== 'in_progress') return -1;
    if (pB?.status === 'in_progress' && pA?.status !== 'in_progress') return 1;
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    return 0;
  }).slice(0, 6); // Show top 6 for the grid

  if (loading) {
    return (
      <section className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  return (
    <section className="px-6 py-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
             <ListTodo className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-foreground tracking-tight">Priority Action Items</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {modules.filter(m => progressMap[m.id]?.status !== 'completed').length} Tasks Pending
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/learn')}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-muted transition-all text-sm font-black text-primary"
        >
          View Full Library
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
      
      {/* 10/10 Wide Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedModules.map((module, index) => {
          const progress = progressMap[module.id];
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:scale-[1.02] transition-transform duration-300"
            >
              <TrainingCard
                id={module.id}
                title={module.title}
                variant={getCardVariant(module, progress)}
                tag={getTag(module, progress)}
                progress={progress?.progress_percentage || undefined}
                duration={`${module.duration_minutes || 30} min`}
                index={index}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};