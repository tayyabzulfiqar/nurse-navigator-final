import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, Download, Award, Calendar, CheckCircle, AlertCircle, ShieldCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.webp';
import { format, isBefore, addDays } from 'date-fns';

// [Interface remains the same as your provided code]
interface ComplianceRecord {
  id: string;
  module_id: string;
  expiry_date: string | null;
  is_valid: boolean;
  created_at: string;
  certificate_url: string | null;
  module: { title: string; category: string; } | null;
}

export default function Certificates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  useEffect(() => { if (user) fetchComplianceRecords(); }, [user]);

  const fetchComplianceRecords = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('compliance_records')
        .select(`id, module_id, expiry_date, is_valid, created_at, certificate_url, module:training_modules(title, category)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const transformedData = (data || []).map(record => ({
        ...record,
        module: Array.isArray(record.module) ? record.module[0] : record.module
      }));
      setRecords(transformedData);
    } catch (error) { console.error('Error fetching compliance records:', error);
    } finally { setLoading(false); }
  };

  const handleDownload = (certificateUrl: string | null, moduleTitle: string) => {
    if (certificateUrl) { window.open(certificateUrl, '_blank'); } 
    else {
      const certificateContent = `CERTIFICATE OF COMPLETION\n\nRecipient: ${user?.email}\nModule: ${moduleTitle}\nDate: ${format(new Date(), 'MMMM d, yyyy')}\n\nFlexible Healthcare Training Platform`;
      const blob = new Blob([certificateContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${moduleTitle.replace(/\s+/g, '_')}_Certificate.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* 10/10 Wide Hero Header */}
      <div className="gradient-hero px-8 pt-12 pb-24 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <motion.button onClick={() => navigate('/')} className="p-3 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-10 h-10 opacity-80" />
                Compliance Records
              </h1>
              <p className="text-white/80 text-lg">Official training certifications and validity status</p>
            </div>
          </div>
          <img src={logo} alt="Flexible Healthcare" className="h-10 w-auto bg-white rounded-xl px-4 py-2 shadow-lg" />
        </div>
      </div>

      {/* 10/10 Wide Certificate Grid */}
      <div className="max-w-7xl mx-auto px-8 -mt-12">
        {records.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-[2.5rem] p-20 text-center shadow-xl border-2 border-dashed border-muted">
            <Award className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-2">No Certificates Issued</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Complete mandatory modules to earn your professional compliance certifications.</p>
            <Button onClick={() => navigate('/learn')} size="lg" className="rounded-xl px-8 h-14 text-lg font-bold">Browse Modules</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {records.map((record, index) => {
              const isExpired = record.expiry_date && isBefore(new Date(record.expiry_date), new Date());
              const isExpiringSoon = record.expiry_date && isBefore(new Date(record.expiry_date), addDays(new Date(), 30)) && !isExpired;

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-3xl p-1 shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-primary/20"
                >
                  <div className="bg-white rounded-[1.4rem] p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-4 rounded-2xl ${isExpired ? 'bg-red-50 text-red-500' : 'bg-primary/5 text-primary'}`}>
                        <Award className="w-8 h-8" />
                      </div>
                      <Badge className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        isExpired ? 'bg-red-100 text-red-600' : isExpiringSoon ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid'}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-black leading-tight mb-2 group-hover:text-primary transition-colors">
                      {record.module?.title || 'Certification'}
                    </h3>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">
                      {record.module?.category || 'Clinical'}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-muted/50">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Issued</p>
                          <p className="text-sm font-black">{format(new Date(record.created_at), 'MMM d, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Expires</p>
                          <p className={`text-sm font-black ${isExpired ? 'text-red-500' : ''}`}>
                            {record.expiry_date ? format(new Date(record.expiry_date), 'MMM d, yyyy') : 'No Expiry'}
                          </p>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full h-12 rounded-xl border-2 font-bold group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                        onClick={() => handleDownload(record.certificate_url, record.module?.title || 'Certificate')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}