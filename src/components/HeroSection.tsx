import { Shield, Users, Award, Clock } from 'lucide-react';
import SearchBar from './SearchBar';

interface HeroSectionProps {
  selectedCity: string;
  selectedSpecialization: string;
  onCityChange: (city: string) => void;
  onSpecializationChange: (spec: string) => void;
  onSearch: () => void;
}

const HeroSection = ({
  selectedCity,
  selectedSpecialization,
  onCityChange,
  onSpecializationChange,
  onSearch,
}: HeroSectionProps) => {
  const stats = [
    { icon: Users, value: 'N/A', label: 'Verified Advocates' },
    { icon: Award, value: 'N/A', label: 'Cases Handled' },
    { icon: Shield, value: 'N/A', label: 'Cities Covered' },
    { icon: Clock, value: '24/7', label: 'Support Available' },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm text-white/90">Trusted Legal Discovery Platform</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-up">
            Find the Right
            <span className="block text-secondary mt-1">Legal Advocate</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect with verified advocates near you.
          </p>

          {/* Search Bar */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              selectedCity={selectedCity}
              selectedSpecialization={selectedSpecialization}
              onCityChange={onCityChange}
              onSpecializationChange={onSpecializationChange}
              onSearch={onSearch}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/15 transition-colors"
              >
                <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C240 90 480 100 720 70C960 40 1200 60 1440 80V100H0V50Z"
            fill="hsl(210, 20%, 98%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
