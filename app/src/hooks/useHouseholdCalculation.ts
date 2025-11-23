import { useState, useCallback } from 'react';
import type { Member, BetaParams, OpenFiscaRequest, OpenFiscaResponse, CalculationResult } from '../types';

export const useHouseholdCalculation = (alpha: number, betaParams: BetaParams, gamma: number | null) => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (members: Member[]) => {
    if (!members.length || gamma === null) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Prepare request for OpenFisca API
      const parents: string[] = [];
      const children: string[] = [];
      const grandparents: string[] = [];
      const personMap: { [key: string]: Member } = {};

      // Assign IDs based on role
      let parentCount = 0;
      let childCount = 0;
      let grandparentCount = 0;

      members.forEach(member => {
        const age = parseInt(member.age, 10);
        if (isNaN(age)) return;

        let id = '';
        if (age < 18) {
          childCount++;
          id = `子${childCount}`;
          children.push(id);
        } else {
          if (parentCount < 2) {
            parentCount++;
            id = `親${parentCount}`;
            parents.push(id);
          } else {
            grandparentCount++;
            id = `祖父母${grandparentCount}`;
            grandparents.push(id);
          }
        }
        personMap[id] = member;
      });

      const request: OpenFiscaRequest = {
        世帯一覧: {
          "世帯1": {
            親一覧: parents,
            子一覧: children,
            祖父母一覧: grandparents,
            居住都道府県: { "2025-11-01": "神奈川県" },
            居住市区町村: { "2025-11-01": "横浜市" },
            生活保護: { "2025-11-01": null },
            児童手当: { "2025-11-01": null },
            児童扶養手当_最小: { "2025-11-01": null }
          }
        },
        世帯員: {}
      };

      Object.entries(personMap).forEach(([id, member]) => {
        const age = parseInt(member.age, 10);
        const birthYear = 2025 - age;
        const gender = member.gender === 'female' ? '女性' : member.gender === 'male' ? '男性' : 'その他';

        request.世帯員[id] = {
          誕生年月日: { "ETERNITY": `${birthYear}-01-01` },
          性別: { "2025-11-01": gender },
          収入: { "2025-11-01": 0 },
          控除後所得: { "2025-11-01": null }
        };
      });

      // 2. Call OpenFisca API
      //console.log('OpenFisca Request:', JSON.stringify(request, null, 2));

      const response = await fetch('https://openfisca-japan-ijgkugdoka-uc.a.run.app/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text();
        // console.error('OpenFisca Error Status:', response.status);
        // console.error('OpenFisca Error Body:', errorText);
        throw new Error(`Failed to calculate BI: ${response.status} ${errorText}`);
      }

      const data: OpenFiscaResponse = await response.json();
      const householdData = data.世帯一覧["世帯1"];
      
      // 3. Calculate BI (Annual)
      const monthlyBi = (householdData.生活保護["2025-11-01"] || 0) + 
                        (householdData.児童手当["2025-11-01"] || 0) + 
                        (householdData.児童扶養手当_最小["2025-11-01"] || 0);
      const bi = monthlyBi * 12;

      // 4. Calculate Surplus
      // Calculate parent average income for children
      let totalParentIncome = 0;
      let parentCountForIncome = 0;
      
      // Parents and grandparents are considered "parents" for income calculation purposes in this context?
      // The prompt says "親のユーザー入力された収入の平均". Let's assume "parents" list members.
      parents.forEach(id => {
        const member = personMap[id];
        const income = parseFloat(member.income) * 10000 || 0; // 万円 -> 円
        totalParentIncome += income;
        parentCountForIncome++;
      });
      
      // If 2 parents, average. If 1, just that income.
      const parentAverageIncome = parentCountForIncome > 0 ? totalParentIncome / parentCountForIncome : 0;

      let totalSurplus = 0;
      const alpha_offset = 1000000;
      const householdSize = members.length;

      // Calculate beta values
      const beta_values = {
        "single_young": 1 * 1,
        "single_elder": betaParams.elder * 1,
        "couple_young": 1 * betaParams.couple,
        "couple_elder": betaParams.elder * betaParams.couple,
        "child": betaParams.child // Using the simplified formula as per previous instruction
      };

      Object.entries(personMap).forEach(([id, member]) => {
        const age = parseInt(member.age, 10);
        let income = 0;

        if (children.includes(id)) {
          income = parentAverageIncome;
        } else {
          income = parseFloat(member.income) * 10000 || 0; // 万円 -> 円
        }

        // Determine household type
        let household_type: keyof typeof beta_values | null = null;
        if (age < 18) {
          household_type = "child";
        } else if (age < 65) {
          household_type = householdSize === 1 ? "single_young" : "couple_young";
        } else {
          household_type = householdSize === 1 ? "single_elder" : "couple_elder";
        }

        if (household_type) {
          const beta = beta_values[household_type];
          
          // surplus = gamma * beta * alpha_offset * ((parent_income / alpha_offset) ** alpha)
          // Note: "parent_income" in the formula refers to the income used for calculation (own or parent's average)
          let surplus = 0;
          if (alpha_offset > 0 && income > 0) {
            surplus = gamma * beta * alpha_offset * Math.pow(income / alpha_offset, alpha);
          }
          totalSurplus += surplus;
        }
      });

      setResult({
        bi: bi / 10000, // 円 -> 万円
        surplus: totalSurplus / 10000, // 円 -> 万円
        total: (bi + totalSurplus) / 10000 // 円 -> 万円
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  }, [alpha, betaParams, gamma]);

  return { calculate, result, loading, error };
};
