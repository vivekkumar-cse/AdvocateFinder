import { useEffect, useState } from 'react';
import { X, MapPin, Star, CheckCircle, Clock, Navigation, Phone, Calendar, GraduationCap, Languages, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import BookingDialog from './BookingDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Advocate, specializations } from '@/data/advocates';
import { useAdvocateSummary } from '@/hooks/useAdvocateSummary';

interface AdvocateProfileProps {
  advocate: Advocate;
  onClose: () => void;
}

const AdvocateProfile = ({ advocate, onClose }: AdvocateProfileProps) => {
  const { getSummary, isLoading, getCachedSummary } = useAdvocateSummary();
  const [summary, setSummary] = useState<{ shortBio: string; highlights: string[]; expertiseAreas: string } | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const cached = getCachedSummary(advocate.id);
    if (cached) {
      setSummary(cached);
    } else {
      getSummary(advocate).then((result) => {
        if (result) setSummary(result);
      });
    }
  }, [advocate.id]);

  const getSpecializationClass = (spec: string) => {
    const classes: Record<string, string> = {
      criminal: 'specialization-criminal',
      civil: 'specialization-civil',
      family: 'specialization-family',
      corporate: 'specialization-corporate',
      cyber: 'specialization-cyber',
      property: 'specialization-property',
    };
    return classes[spec] || '';
  };

  const getSpecLabel = (value: string) => {
    return specializations.find((s) => s.value === value)?.label || value;
  };

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${advocate.latitude},${advocate.longitude}&travelmode=driving`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-2xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in">
        {/* Header */}
        <div className="relative hero-gradient p-6 pb-20 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{advocate.city}</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="relative px-6 -mt-14">
          <div className="bg-card rounded-xl border border-border shadow-card p-5">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={advocate.imageUrl}
                  alt={advocate.name}
                  className="w-28 h-28 rounded-xl object-cover ring-4 ring-card shadow-lg"
                />
                {advocate.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-card rounded-full p-1 shadow">
                    <CheckCircle className="w-6 h-6 text-green-500 fill-green-500/20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      {advocate.name}
                    </h2>
                    {advocate.verified && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified Advocate
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-secondary/10 px-3 py-1.5 rounded-lg mx-auto sm:mx-0">
                    <Star className="w-5 h-5 text-secondary fill-secondary" />
                    <span className="font-bold text-lg">{advocate.rating}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span><strong className="text-foreground">{advocate.experience}</strong> years exp.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span><strong className="text-foreground">{advocate.casesHandled}</strong> cases</span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                  {advocate.specializations.map((spec) => (
                    <Badge
                      key={spec}
                      variant="outline"
                      className={`${getSpecializationClass(spec)}`}
                    >
                      {getSpecLabel(spec)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Summary */}
          {(summary || isLoading(advocate.id)) && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Generated Summary</span>
              </div>
              
              {isLoading(advocate.id) ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating summary...</span>
                </div>
              ) : summary ? (
                <div className="space-y-3">
                  <p className="text-sm text-foreground leading-relaxed">{summary.shortBio}</p>
                  
                  {summary.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {summary.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground italic">
                    Expertise: {summary.expertiseAreas}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* About */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">{advocate.about}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Education</span>
              </div>
              <p className="text-sm text-foreground">{advocate.education}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Languages className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">Languages</span>
              </div>
              <p className="text-sm text-foreground">{advocate.languages.join(', ')}</p>
            </div>
          </div>

          {/* Office Location */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Office Location</span>
            </div>
            <p className="text-sm text-foreground mb-3">{advocate.address}</p>
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button variant="directions" className="w-full">
                <Navigation className="w-4 h-4" />
                Get Directions to Office
              </Button>
            </a>
          </div>

          {/* Fee & Actions */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Consultation Fee</span>
                <p className="text-3xl font-bold text-foreground">
                  ₹{advocate.consultationFee.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
                <Button variant="consultation" size="lg" className="gap-2" onClick={() => setBookingOpen(true)}>
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        advocateId={advocate.id}
        advocateName={advocate.name}
        consultationFee={advocate.consultationFee}
      />
    </div>
  );
};

export default AdvocateProfile;
