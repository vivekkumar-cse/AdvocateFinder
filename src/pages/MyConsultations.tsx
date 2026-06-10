import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Consultation {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  advocate: {
    id: string;
    user_id: string;
    city: string;
    consultation_fee: number;
    full_name?: string;
} | null;
}

const statusConfig = {
  pending: { label: 'Pending', icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, className: 'bg-green-100 text-green-800 border-green-200' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'bg-blue-100 text-blue-800 border-blue-200' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-200' },
};

const MyConsultations = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchConsultations();
    }
  }, [user, authLoading]);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
  .from('consultations')
  .select(`
    id,
    scheduled_at,
    duration_minutes,
    status,
    notes,
    created_at,
    advocate:advocates (
      id,
      user_id,
      city,
      consultation_fee
    )
  `)
  .order('scheduled_at', { ascending: false });

      if (error) throw error;

      const transformedData = await Promise.all(
      (data || []).map(async (item: any) => {
      if (!item.advocate?.user_id) return item;

      const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", item.advocate.user_id)
      .single();

    return {
      ...item,
      advocate: {
        ...item.advocate,
        full_name: profile?.full_name || "Advocate",
      },
    };
  })
);

      setConsultations(transformedData);
      console.log(
        "ADVOCATE DATA:",
      transformedData[0]?.advocate
    );
    
    } catch (error: any) {
      console.error('Error fetching consultations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load consultations.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'cancelled' as const } : c))
      );

      toast({
        title: 'Consultation Cancelled',
        description: 'Your consultation has been cancelled.',
      });
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel consultation.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl font-bold mb-6">My Consultations</h1>

          {consultations.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Consultations Yet</h2>
              <p className="text-muted-foreground mb-4">
                You haven't booked any consultations with advocates.
              </p>
              <Button onClick={() => navigate('/advocates')}>Find an Advocate</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => {
                const status = statusConfig[consultation.status];
                const StatusIcon = status.icon;
                const isPast = new Date(consultation.scheduled_at) < new Date();
                const canCancel = consultation.status === 'pending' && !isPast;

                return (
                  <div
                    key={consultation.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <span className="font-semibold text-lg">
                            {consultation.advocate?.full_name || "Advocate"}
                          </span>
                          <Badge className={status.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), 'PPP')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(consultation.scheduled_at), 'p')}
                            <span className="text-xs">
                              ({consultation.duration_minutes} min)
                            </span>
                          </div>
                        </div>

                        {consultation.notes && (
                          <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                            {consultation.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-bold">
                          ₹{consultation.advocate?.consultation_fee?.toLocaleString() || '—'}
                        </span>
                        {canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(consultation.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyConsultations;
