import { Search, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cities, specializations } from '@/data/advocates';

interface SearchBarProps {
  selectedCity: string;
  selectedSpecialization: string;
  onCityChange: (city: string) => void;
  onSpecializationChange: (spec: string) => void;
  onSearch: () => void;
  compact?: boolean;
}

const SearchBar = ({
  selectedCity,
  selectedSpecialization,
  onCityChange,
  onSpecializationChange,
  onSearch,
  compact = false,
}: SearchBarProps) => {
  return (
    <div
      className={`bg-card rounded-xl shadow-elevated border border-border ${
        compact ? 'p-3' : 'p-4 md:p-6'
      }`}
    >
      <div className={`flex flex-col ${compact ? 'md:flex-row gap-3' : 'lg:flex-row gap-4'}`}>
        {/* City Select */}
        <div className={`flex-1 ${compact ? '' : 'min-w-[200px]'}`}>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            <MapPin className="inline w-3 h-3 mr-1" />
            Location
          </label>
          <Select value={selectedCity} onValueChange={onCityChange}>
            <SelectTrigger className={compact ? 'h-10' : 'h-12'}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specialization Select */}
        <div className={`flex-1 ${compact ? '' : 'min-w-[200px]'}`}>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            <Briefcase className="inline w-3 h-3 mr-1" />
            Specialization
          </label>
          <Select value={selectedSpecialization} onValueChange={onSpecializationChange}>
            <SelectTrigger className={compact ? 'h-10' : 'h-12'}>
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec.value} value={spec.value}>
                  <span className="flex items-center gap-2">
                    <span>{spec.icon}</span>
                    <span>{spec.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className={`flex items-end ${compact ? '' : 'min-w-[140px]'}`}>
          <Button
            onClick={onSearch}
            variant="hero"
            className={`w-full ${compact ? 'h-10' : 'h-12'}`}
            size={compact ? 'default' : 'lg'}
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
