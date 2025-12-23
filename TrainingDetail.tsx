import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, CheckCircle2, Play, Loader2, AlertTriangle, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.webp';

interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  category: string;
  duration_minutes: number | null;
  is_mandatory: boolean | null;
  priority: string | null;
}

interface UserProgress {
  id: string;
  status: string | null;
  progress_percentage: number | null;
  started_at: string | null;
  completed_at: string | null;
}

export default function TrainingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [module, setModule] = useState<TrainingModule | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchModuleAndProgress();
    }
  }, [id, user]);

  const fetchModuleAndProgress = async () => {
    if (!id || !user) return;

    try {
      // Fetch module
      const { data: moduleData, error: moduleError } = await supabase
        .from('training_modules')
        .select('*')
        .eq('id', id)
        .single();

      if (moduleError) throw moduleError;
      setModule(moduleData);

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('module_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching module:', error);
      toast({
        title: 'Error',
        description: 'Failed to load training module.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const startTraining = async () => {
    if (!module || !user) return;

    setActionLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          module_id: module.id,
          status: 'in_progress',
          progress_percentage: 0,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setProgress(data);
      toast({
        title: 'Training Started',
        description: `You've started "${module.title}"`,
      });
    } catch (error) {
      console.error('Error starting training:', error);
      toast({
        title: 'Error',
        description: 'Failed to start training.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const continueTraining = async () => {
    if (!progress) return;

    setActionLoading(true);
    try {
      // Simulate progress increment (in a real app, this would track actual course completion)
      const newProgress = Math.min((progress.progress_percentage || 0) + 25, 100);
      const isComplete = newProgress >= 100;

      const { data, error } = await supabase
        .from('user_progress')
        .update({
          progress_percentage: newProgress,
          status: isComplete ? 'completed' : 'in_progress',
          completed_at: isComplete ? new Date().toISOString() : null,
        })
        .eq('id', progress.id)
        .select()
        .single();

      if (error) throw error;

      setProgress(data);

      if (isComplete) {
        toast({
          title: 'Training Complete!',
          description: `Congratulations! You've completed "${module?.title}"`,
        });
      } else {
        toast({
          title: 'Progress Saved',
          description: `You're now at ${newProgress}% completion.`,
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to update progress.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold mb-2">Module Not Found</h1>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </div>
    );
  }

  const isCompleted = progress?.status === 'completed';
  const isInProgress = progress?.status === 'in_progress';
  const progressPercent = progress?.progress_percentage || 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="gradient-hero px-5 pt-12 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <div className="flex-1">
            <img src={logo} alt="Flexible Healthcare" className="h-8 w-auto bg-white rounded-lg px-2 py-1" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
            {module.category}
          </span>
          {module.is_mandatory && (
            <span className="px-3 py-1 rounded-full bg-destructive/80 text-white text-xs font-semibold">
              Mandatory
            </span>
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">{module.title}</h1>
        
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {module.duration_minutes} min
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-16">
        <motion.div
          className="bg-card rounded-2xl shadow-lg p-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Status Badge */}
          {isCompleted ? (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-success/10">
              <Award className="w-5 h-5 text-success" />
              <span className="text-sm font-semibold text-success">Completed</span>
            </div>
          ) : isInProgress ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Your Progress</span>
                <span className="text-sm font-bold text-primary">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ) : null}

          {/* Description */}
          <h3 className="font-semibold text-foreground mb-2">About This Training</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {module.description || 'Complete this training module to enhance your professional skills and maintain compliance.'}
          </p>

          {/* Learning Objectives */}
          <h3 className="font-semibold text-foreground mb-3">What You'll Learn</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <span>Core concepts and best practices</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <span>Practical applications in healthcare settings</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <span>Compliance requirements and documentation</span>
            </li>
          </ul>

          {/* Action Button */}
          {isCompleted ? (
            <Button className="w-full" variant="outline" onClick={continueTraining} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Retake Training
            </Button>
          ) : isInProgress ? (
            <Button className="w-full" onClick={continueTraining} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Continue Training
            </Button>
          ) : (
            <Button className="w-full" onClick={startTraining} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Start Training
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
