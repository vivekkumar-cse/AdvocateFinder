import { useState, useCallback } from 'react';
import { Advocate } from '@/data/advocates';

interface AdvocateSummary {
  shortBio: string;
  highlights: string[];
  expertiseAreas: string;
}

export const useAdvocateSummary = () => {
  const [summaries, setSummaries] = useState<Record<string, AdvocateSummary>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const getSummary = useCallback(
    async (advocate: Advocate): Promise<AdvocateSummary | null> => {
      // Return cached summary
      if (summaries[advocate.id]) {
        return summaries[advocate.id];
      }

      setLoadingIds((prev) => new Set(prev).add(advocate.id));

      try {
        const summary: AdvocateSummary = {
          shortBio:
            advocate.about ||
            `${advocate.experience} years of experience in legal practice.`,

          highlights: [
            `${advocate.experience} Years Experience`,
            `${advocate.casesHandled} Cases Handled`,
            `${advocate.consultationFee} Consultation Fee`,
          ],

          expertiseAreas:
            advocate.specializations.length > 0
              ? advocate.specializations.join(', ')
              : 'General Legal Practice',
        };

        setSummaries((prev) => ({
          ...prev,
          [advocate.id]: summary,
        }));

        return summary;
      } catch (error) {
        console.error('Failed to generate summary:', error);
        return null;
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(advocate.id);
          return next;
        });
      }
    },
    [summaries]
  );

  const isLoading = useCallback(
    (advocateId: string) => {
      return loadingIds.has(advocateId);
    },
    [loadingIds]
  );

  const getCachedSummary = useCallback(
    (advocateId: string): AdvocateSummary | undefined => {
      return summaries[advocateId];
    },
    [summaries]
  );

  return {
    getSummary,
    isLoading,
    getCachedSummary,
  };
};