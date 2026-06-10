import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SpecializationFilter from '@/components/SpecializationFilter';
import AdvocateCard from '@/components/AdvocateCard';
import AdvocateProfile from '@/components/AdvocateProfile';
import CaseClassifier from '@/components/CaseClassifier';
import Footer from '@/components/Footer';
import { advocates, Advocate } from '@/data/advocates';
import { ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Classification {
  category: string;
  specialization: string;
  confidence: 'high' | 'medium' | 'low';
  keywords: string[];
  disclaimer: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [aiClassification, setAiClassification] = useState<Classification | null>(null);

  const filteredAdvocates = useMemo(() => {
    let filtered = advocates.filter((advocate) => {
      const cityMatch = selectedCity === 'all' || advocate.city === selectedCity;
      const specMatch =
        selectedSpecialization === 'all' ||
        advocate.specializations.includes(selectedSpecialization as any);
      return cityMatch && specMatch;
    });

    // If AI classification exists, prioritize matching advocates
    if (aiClassification && aiClassification.category !== 'unknown') {
      const matchingSpec = aiClassification.specialization || aiClassification.category;
      filtered = filtered.sort((a, b) => {
        const aMatch = a.specializations.includes(matchingSpec as any) ? 1 : 0;
        const bMatch = b.specializations.includes(matchingSpec as any) ? 1 : 0;
        if (bMatch !== aMatch) return bMatch - aMatch;
        // Secondary sort by experience
        return b.experience - a.experience;
      });
    }

    return filtered;
  }, [selectedCity, selectedSpecialization, aiClassification]);

  const featuredAdvocates = filteredAdvocates.slice(0, 4);

  const handleSearch = () => {
    navigate(`/advocates?city=${selectedCity}&specialization=${selectedSpecialization}`);
  };

  const handleViewProfile = (id: string) => {
    const advocate = advocates.find((a) => a.id === id);
    if (advocate) {
      setSelectedAdvocate(advocate);
    }
  };

  const handleClassification = (classification: Classification) => {
    setAiClassification(classification);
    // Auto-set specialization filter based on AI classification
    if (classification.category !== 'unknown') {
      setSelectedSpecialization(classification.specialization || classification.category);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          selectedCity={selectedCity}
          selectedSpecialization={selectedSpecialization}
          onCityChange={setSelectedCity}
          onSpecializationChange={setSelectedSpecialization}
          onSearch={handleSearch}
        />

        <div className="container mx-auto px-4">
          {/* AI Case Classifier */}
          <section className="py-8 -mt-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  AI-Powered Case Analysis
                </span>
              </div>
              <CaseClassifier onClassified={handleClassification} />
            </div>
          </section>

          {/* Specialization Filter */}
          <SpecializationFilter
            selected={selectedSpecialization}
            onChange={(spec) => {
              setSelectedSpecialization(spec);
              setAiClassification(null); // Clear AI classification when manually filtering
            }}
          />

          {/* Featured Advocates */}
          <section className="py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold">
                  {aiClassification && aiClassification.category !== 'unknown'
                    ? 'AI-Recommended Advocates'
                    : selectedCity !== 'all' || selectedSpecialization !== 'all'
                    ? 'Matching Advocates'
                    : 'Featured Advocates'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAdvocates.length} advocates found
                  {aiClassification && aiClassification.category !== 'unknown' && (
                    <span className="ml-2 text-primary">
                      • Sorted by relevance to your case
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleSearch}
                className="gap-1 text-primary hover:text-primary"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredAdvocates.map((advocate, index) => (
                <div
                  key={advocate.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <AdvocateCard
                    advocate={advocate}
                    onViewProfile={handleViewProfile}
                  />
                </div>
              ))}
            </div>

            {filteredAdvocates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No advocates found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCity('all');
                    setSelectedSpecialization('all');
                    setAiClassification(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </section>

          {/* How It Works */}
          <section className="py-12 border-t border-border">
            <h2 className="font-serif text-2xl font-semibold text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  step: '01',
                  title: 'Describe',
                  description: 'Tell AI about your legal issue for smart classification.',
                },
                {
                  step: '02',
                  title: 'Search',
                  description: 'Find advocates by city, area, or legal specialization.',
                },
                {
                  step: '03',
                  title: 'Compare',
                  description: 'Review AI summaries, experience, and consultation fees.',
                },
                {
                  step: '04',
                  title: 'Connect',
                  description: 'Get directions or request a consultation directly.',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative bg-card border border-border rounded-xl p-6 text-center card-shadow hover:elevated-shadow transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-secondary">{item.step}</span>
                  </div>
                  <h3 className="font-serif font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Advocate Profile Modal */}
      {selectedAdvocate && (
        <AdvocateProfile
          advocate={selectedAdvocate}
          onClose={() => setSelectedAdvocate(null)}
        />
      )}
    </div>
  );
};

export default Index;
