-- Create consultation status enum
CREATE TYPE public.consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  advocate_id UUID NOT NULL REFERENCES public.advocates(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status consultation_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Users can view their own consultations
CREATE POLICY "Users can view their own consultations"
ON public.consultations
FOR SELECT
USING (auth.uid() = user_id);

-- Advocates can view consultations for their profile
CREATE POLICY "Advocates can view their consultations"
ON public.consultations
FOR SELECT
USING (advocate_id IN (SELECT id FROM public.advocates WHERE user_id = auth.uid()));

-- Users can create consultations
CREATE POLICY "Users can create consultations"
ON public.consultations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can cancel their own consultations
CREATE POLICY "Users can update their own consultations"
ON public.consultations
FOR UPDATE
USING (auth.uid() = user_id);

-- Advocates can update consultation status
CREATE POLICY "Advocates can update their consultations"
ON public.consultations
FOR UPDATE
USING (advocate_id IN (SELECT id FROM public.advocates WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();