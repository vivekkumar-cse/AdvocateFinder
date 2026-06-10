import { useState } from 'react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advocateId: string;
  advocateName: string;
  consultationFee: number;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const BookingDialog = ({ open, onOpenChange, advocateId, advocateName, consultationFee }: BookingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to book a consultation.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!date || !time) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date and time for your consultation.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledAt = setMinutes(setHours(date, hours), minutes);

      const { error } = await supabase.from('consultations').insert({
        user_id: user.id,
        advocate_id: advocateId,
        scheduled_at: scheduledAt.toISOString(),
        notes: notes.trim() || null,
      });

      if (error) throw error;

      toast({
        title: 'Consultation Booked!',
        description: `Your consultation with ${advocateName} has been scheduled for ${format(scheduledAt, 'PPP')} at ${time}.`,
      });

      onOpenChange(false);
      setDate(undefined);
      setTime('');
      setNotes('');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to book consultation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = addDays(new Date(), 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Book Consultation</DialogTitle>
          <DialogDescription>
            Schedule a consultation with {advocateName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Select Date
            </Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < minDate || date.getDay() === 0}
              className="rounded-md border mx-auto"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Select Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Briefly describe your legal matter..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Fee Display */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Consultation Fee</span>
              <span className="text-xl font-bold">₹{consultationFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !date || !time}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>

          {!user && (
            <p className="text-sm text-center text-muted-foreground">
              You'll need to log in to complete your booking.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
