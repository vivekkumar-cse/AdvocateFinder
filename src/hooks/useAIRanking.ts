import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Advocate } from '@/data/advocates';

interface RankingParams {
  query?: string;
  category?: string;
  keywords?: string[];
}

export const useAIRanking = () => {
  const [isRanking, setIsRanking] = useState(false);

  const rankAdvocates = async (
    advocates: Advocate[],
    params: RankingParams
  ): Promise<Advocate[]> => {
    if (advocates.length === 0) return [];
    
    // Skip AI ranking if no search params
    if (!params.query && !params.category && (!params.keywords || params.keywords.length === 0)) {
      return advocates;
    }

    setIsRanking(true);

    try {
      const advocateData = advocates.map(a => ({
        id: a.id,
        name: a.name,
        specializations: a.specializations,
        experience: a.experience,
        rating: a.rating,
        city: a.city,
      }));

      const { data, error } = await supabase.functions.invoke('rank-advocates', {
        body: { 
          advocates: advocateData,
          query: params.query,
          category: params.category,
          keywords: params.keywords,
        }
      });

      if (error || data.error) {
        console.error('Ranking error:', error || data.error);
        return advocates;
      }

      const rankedIds: string[] = data.rankedIds;
      
      // Reorder advocates based on AI ranking
      const rankedAdvocates = rankedIds
        .map(id => advocates.find(a => a.id === id))
        .filter((a): a is Advocate => a !== undefined);

      // Add any advocates not in the ranked list at the end
      const unranked = advocates.filter(a => !rankedIds.includes(a.id));
      
      return [...rankedAdvocates, ...unranked];
    } catch (error) {
      console.error('AI ranking failed:', error);
      return advocates;
    } finally {
      setIsRanking(false);
    }
  };

  return { rankAdvocates, isRanking };
};
