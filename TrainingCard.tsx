import { motion } from "framer-motion";
import { Clock, AlertTriangle, Sparkles, TrendingUp, ChevronRight, CheckCircle2, Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type CardVariant = "urgent" | "new" | "progress" | "completed";

interface TrainingCardProps {
  id: string;
  title: string;
  variant: CardVariant;
  tag: string;
  progress?: number;
  duration?: string;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const variantStyles: Record<CardVariant, {
  icon: typeof AlertTriangle;
  themeColor: string;
  bgGradient: string;
  iconBg: string;
}> = {
  urgent: {
    icon: AlertTriangle,
    themeColor: "text-red-600",
    bgGradient: "from-red-50/50 to-transparent",
    iconBg: "bg-red-100 text-red-600",
  },
  new: {
    icon: Sparkles,
    themeColor: "text-primary",
    bgGradient: "from-primary/5 to-transparent",
    iconBg: "bg-primary/10 text-primary",
  },
  progress: {
    icon: TrendingUp,
    themeColor: "text-amber-600",
    bgGradient: "from-amber-50/50 to-transparent",
    iconBg: "bg-amber-100 text-amber-600",
  },
  completed: {
    icon: CheckCircle2,
    themeColor: "text-green-600",
    bgGradient: "from-green-50/50 to-transparent",
    iconBg: "bg-green-100 text-green-600",
  },
};

export const TrainingCard = ({ 
  id, title, variant, tag, progress, duration = "15 min", index, isFavorite = false, onToggleFavorite,
}: TrainingCardProps) => {
  const navigate = useNavigate();
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <motion.div
      onClick={() => navigate(`/training/${id}`)}
      className={cn(
        "relative group card-premium p-6 cursor-pointer border-none overflow-hidden h-full flex flex-col justify-between",
        "bg-gradient-to-br transition-all duration-500 hover:shadow-2xl",
        styles.bgGradient
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/40 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div>
        <div className="flex items-start justify-between mb-6">
          <div className={cn("p-3 rounded-2xl shadow-sm", styles.iconBg)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm">
            <span className={cn("text-[10px] font-black uppercase tracking-widest", styles.themeColor)}>
              {tag}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            CNE Accredited
          </span>
        </div>
      </div>
      
      <div className="mt-8">
        {(variant === "progress" || variant === "urgent") && progress !== undefined ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Syncing Progress</span>
              <span className={styles.themeColor}>{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <motion.div 
                className={cn("h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", 
                  variant === "urgent" ? "bg-red-500" : "bg-amber-500")}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full pt-2 border-t border-slate-100/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">
              Begin Session
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
               <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};