import { MapPin, Star, CheckCircle, Clock, Navigation, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Advocate, specializations } from '@/data/advocates';

interface AdvocateCardProps {
  advocate: Advocate;
  onViewProfile: (id: string) => void;
}

const AdvocateCard = ({ advocate, onViewProfile }: AdvocateCardProps) => {
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
    <div className="bg-card rounded-xl border border-border card-shadow hover:elevated-shadow transition-all duration-300 overflow-hidden group">
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={advocate.imageUrl}
              alt={advocate.name}
              className="w-20 h-20 rounded-xl object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
            />
            {advocate.verified && (
              <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-0.5">
                <CheckCircle className="w-5 h-5 text-green-500 fill-green-500/20" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-serif font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {advocate.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{advocate.city}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                <span className="font-semibold text-sm">{advocate.rating}</span>
              </div>
            </div>

            {/* Experience & Cases */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{advocate.experience} years exp.</span>
              </div>
              <div>
                <span className="font-medium text-foreground">{advocate.casesHandled}</span> cases
              </div>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {advocate.specializations.map((spec) => (
                <Badge
                  key={spec}
                  variant="outline"
                  className={`text-xs ${getSpecializationClass(spec)}`}
                >
                  {getSpecLabel(spec)}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">Consultation Fee</span>
            <p className="font-semibold text-foreground">₹{advocate.consultationFee.toLocaleString()}</p>
          </div>

          <div className="flex gap-2">
            <a
              href={getDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="directions"
                size="sm"
                className="gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                Directions
              </Button>
            </a>
            <Button
              variant="consultation"
              size="sm"
              onClick={() => onViewProfile(advocate.id)}
              className="gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateCard;
