import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import AdvocateCard from '@/components/AdvocateCard';
import AdvocateProfile from '@/components/AdvocateProfile';
import Footer from '@/components/Footer';
import { Advocate, specializations } from '@/data/advocates';
import { supabase } from '@/integrations/supabase/client';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'rating' | 'experience' | 'fee-low' | 'fee-high';

const Advocates = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get('specialization') || 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);

  const [advocatesList, setAdvocatesList] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const city = searchParams.get('city');
    const spec = searchParams.get('specialization');
    if (city) setSelectedCity(city);
    if (spec) setSelectedSpecialization(spec);
  }, [searchParams]);

  useEffect(() => {
  const fetchAdvocates = async () => {
    setLoading(true);

    const { data, error, count } = await supabase
  .from("advocates")
  .select(`
    *,
    profiles (
      full_name,
      avatar_url
    )
  `, { count: "exact" });


    console.log(
  "RAW DATA FULL:",
  JSON.stringify(data, null, 2)
);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const formattedAdvocates = (data || []).map((advocate: any) => ({
  id: advocate.id,

  name:
    advocate.profiles?.full_name ||
    "Advocate",

  imageUrl:
    advocate.profiles?.avatar_url ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",

  specializations:
    advocate.specializations || [],

  experience:
    advocate.experience_years || 0,

  city:
    advocate.city || "",

  area:
    advocate.city || "",

  address:
    advocate.address || "",

  latitude:
    advocate.latitude || 0,

  longitude:
    advocate.longitude || 0,

  rating:
    advocate.rating || 0,

  consultationFee:
    advocate.consultation_fee || 0,

  verified:
    advocate.verification_status === "approved",

  about:
    advocate.about || "",

  languages:
    advocate.languages || [],

  education:
    advocate.education || "",

  casesHandled:
    advocate.review_count || 0,
}));

setAdvocatesList(formattedAdvocates);
setLoading(false);
};

fetchAdvocates();
}, []);

  const filteredAndSortedAdvocates = useMemo(() => {
    let result = advocatesList.filter((advocate) => {
      const cityMatch = selectedCity === 'all' || advocate.city === selectedCity;
      const specMatch =
        selectedSpecialization === 'all' ||
        advocate.specializations.includes(selectedSpecialization as any);
      return cityMatch && specMatch;
      
    })
    
    console.log("ADVOCATES LIST:", advocatesList);
console.log("RESULT:", result);
    

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        result.sort((a, b) => b.experience - a.experience);
        break;
      case 'fee-low':
        result.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case 'fee-high':
        result.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
    }

    return result;
  }, [advocatesList, selectedCity, selectedSpecialization, sortBy]);

  const handleSearch = () => {
    setSearchParams({
      city: selectedCity,
      specialization: selectedSpecialization,
    });
  };

  const handleViewProfile = (id: string) => {
    const advocate = advocatesList.find((a) => a.id === id);
    if (advocate) {
      setSelectedAdvocate(advocate);
    }
  };

  const getSpecLabel = (value: string) => {
    if (value === 'all') return 'All Specializations';
    return specializations.find((s) => s.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Search Header */}
        <div className="bg-card border-b border-border py-6">
          <div className="container mx-auto px-4">
            <SearchBar
              selectedCity={selectedCity}
              selectedSpecialization={selectedSpecialization}
              onCityChange={setSelectedCity}
              onSpecializationChange={setSelectedSpecialization}
              onSearch={handleSearch}
              compact
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-2xl font-semibold">
                {selectedCity !== 'all' ? `Advocates in ${selectedCity}` : 'All Advocates'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredAndSortedAdvocates.length} results
                {selectedSpecialization !== 'all' && (
                  <span className="ml-1">
                    for <strong>{getSpecLabel(selectedSpecialization)}</strong>
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="fee-low">Fee: Low to High</SelectItem>
                    <SelectItem value="fee-high">Fee: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {loading && (
            <div className="text-center py-10">
              Loading advocates...
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {!loading && filteredAndSortedAdvocates.map((advocate, index) => (
              <div
                key={advocate.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <AdvocateCard
                  advocate={advocate}
                  onViewProfile={handleViewProfile}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedAdvocates.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">No advocates found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters to find more results.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedSpecialization('all');
                  setSearchParams({});
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
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

export default Advocates;
