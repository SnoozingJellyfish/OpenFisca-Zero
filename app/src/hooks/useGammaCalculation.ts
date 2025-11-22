import { useState, useEffect } from 'react';
import type { Person, ActualTotalData, BetaParams } from '../types';

export const useGammaCalculation = (alpha: number, betaParams: BetaParams) => {
  const [gamma, setGamma] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [actualTotalData, setActualTotalData] = useState<ActualTotalData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [personsRes, actualTotalRes] = await Promise.all([
          fetch('/data/persons_10k_preprocessed.json'),
          fetch('/data/actual_total_dict.json')
        ]);

        if (!personsRes.ok || !actualTotalRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const personsData = await personsRes.json();
        const actualTotalData = await actualTotalRes.json();

        // Convert object to array if necessary, assuming personsData is an object with person_id keys
        const personsArray = Object.values(personsData) as Person[];
        
        setPersons(personsArray);
        setActualTotalData(actualTotalData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!persons.length || !actualTotalData) return;

    const calculateGamma = () => {
      const { actual_total: current_total, BI_total } = actualTotalData;
      
      const beta_values = {
        "single_young": 1 * 1,
        "single_elder": betaParams.elder * 1,
        "couple_young": 1 * betaParams.couple,
        "couple_elder": betaParams.elder * betaParams.couple,
        "child": betaParams.child
      };

      let beta_deduct_income_total = 0.0;
      const alpha_offset = 1_000_000;

      for (const person of persons) {
        const parent_income = Number(person['収入_親'] || 0);
        const household_id = String(person.household_id || '');
        
        if (!household_id) continue;

        const household_type = person['世帯タイプ'];
        if (!household_type || !(household_type in beta_values)) continue;

        const beta = beta_values[household_type];

        let deduct_income = 0.0;
        if (alpha_offset > 0 && parent_income > 0) {
          deduct_income = alpha_offset * Math.pow(parent_income / alpha_offset, alpha);
        }

        const beta_deduct_income = deduct_income * beta;
        beta_deduct_income_total += beta_deduct_income;
      }

      if (beta_deduct_income_total === 0) {
        setGamma(0);
        return;
      }

      const calculatedGamma = (current_total - BI_total) / beta_deduct_income_total;
      setGamma(calculatedGamma);
    };

    calculateGamma();
  }, [persons, actualTotalData, alpha, betaParams]);

  return { gamma, loading, error };
};
