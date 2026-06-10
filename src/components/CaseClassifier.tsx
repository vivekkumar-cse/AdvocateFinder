import { useState } from 'react';
import { Brain, Loader2, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { specializations } from '@/data/advocates';

interface Classification {
  category: string;
  specialization: string;
  confidence: 'high' | 'medium' | 'low';
  keywords: string[];
  disclaimer: string;
}

interface CaseClassifierProps {
  onClassified?: (classification: Classification) => void;
}

const CaseClassifier = ({ onClassified }: CaseClassifierProps) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classification, setClassification] = useState<Classification | null>(null);
  const { toast } = useToast();

  const getSpecializationLabel = (value: string) => {
    return specializations.find((s) => s.value === value)?.label || value;
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default: return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const handleClassify = async () => {
    if (description.trim().length < 10) {
      toast({
        title: 'Description Too Short',
        description: 'Please provide at least 10 characters describing your legal issue.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setClassification(null);

    try {
      const { data, error } = await supabase.functions.invoke('classify-case', {
        body: { description }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast({
          title: 'Classification Error',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      setClassification(data);
      onClassified?.(data);
    } catch (error: any) {
      toast({
        title: 'Classification Failed',
        description: error.message || 'Unable to classify your case. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-serif font-semibold text-lg text-foreground">AI Case Classifier</h3>
          <p className="text-xs text-muted-foreground">Describe your issue to find the right advocate</p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Describe your legal issue in a few sentences. For example: 'My landlord is refusing to return my security deposit after I moved out...' or 'I received a traffic violation notice that I believe is incorrect...'"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="resize-none"
        />

        <Button 
          onClick={handleClassify} 
          disabled={isLoading || description.trim().length < 10}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Scale className="w-4 h-4 mr-2" />
              Classify My Case
            </>
          )}
        </Button>

        {classification && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium text-foreground">Classification Result</span>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Legal Category</span>
                <Badge variant="secondary" className="capitalize">
                  {getSpecializationLabel(classification.category)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Recommended Specialization</span>
                <Badge className="capitalize bg-primary/10 text-primary border-primary/20">
                  {getSpecializationLabel(classification.specialization)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Confidence</span>
                <Badge className={`capitalize ${getConfidenceColor(classification.confidence)}`}>
                  {classification.confidence}
                </Badge>
              </div>

              {classification.keywords.length > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground block mb-2">Keywords Detected</span>
                  <div className="flex flex-wrap gap-1">
                    {classification.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                {classification.disclaimer}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseClassifier;
