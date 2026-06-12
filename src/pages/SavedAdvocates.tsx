import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdvocateCard from "@/components/AdvocateCard";
import AdvocateProfile from "@/components/AdvocateProfile";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SavedAdvocates = () => {
  const { user } = useAuth();

  const [savedAdvocates, setSavedAdvocates] = useState<any[]>([]);
  const [selectedAdvocate, setSelectedAdvocate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedAdvocates = async () => {
      if (!user) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("saved_advocates")
        .select(`
          advocate_id,
          advocates (
            *,
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const formatted = (data || []).map((item: any) => ({
        id: item.advocates.id,
        user_id: item.advocates.user_id,
        
        name:
          item.advocates.profiles?.full_name ||
          "Advocate",

        imageUrl:
          item.advocates.profiles?.avatar_url ||
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",

        specializations:
          item.advocates.specializations || [],

        experience:
          item.advocates.experience_years || 0,

        city:
          item.advocates.city || "",

        area:
          item.advocates.city || "",

        address:
          item.advocates.address || "",

        latitude:
          item.advocates.latitude || 0,

        longitude:
          item.advocates.longitude || 0,

        rating:
          item.advocates.rating || 0,

        consultationFee:
          item.advocates.consultation_fee || 0,

        verified:
          item.advocates.verification_status === "approved",

        about:
          item.advocates.about || "",

        languages:
          item.advocates.languages || [],

        education:
          item.advocates.education || "",

        casesHandled:
          item.advocates.review_count || 0,
      }));

      setSavedAdvocates(formatted);
      setLoading(false);
    };

    fetchSavedAdvocates();
  }, [user]);

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">
          Saved Advocates
        </h1>

        <p className="text-muted-foreground mb-8">
          Your bookmarked advocates.
        </p>

        {loading && (
          <p>Loading...</p>
        )}

        {!loading && savedAdvocates.length === 0 && (
          <p>No saved advocates found.</p>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {savedAdvocates.map((advocate) => (
            <AdvocateCard
              key={advocate.id}
              advocate={advocate}
              onViewProfile={(id) => {
                const selected =
                  savedAdvocates.find(
                    (a) => a.id === id
                  );

                setSelectedAdvocate(selected);
              }}
            />
          ))}
        </div>
      </div>

      <Footer />

      {selectedAdvocate && (
        <AdvocateProfile
          advocate={selectedAdvocate}
          onClose={() =>
            setSelectedAdvocate(null)
          }
        />
      )}
    </>
  );
};

export default SavedAdvocates;