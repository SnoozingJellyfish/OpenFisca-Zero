import { useState, useCallback } from 'react';
import type { Household, Member, BetaParams, OpenFiscaRequest, OpenFiscaResponse, CalculationResult } from '../types';

export const useHouseholdCalculation = (alpha: number, betaParams: BetaParams, gamma: number | null) => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (households: Household[]) => {
    if (!households.length || gamma === null) return;

    setLoading(true);
    setError(null);

    try {
      // 各世帯ごとに個別のリクエストを作成して送信
      const newResults: CalculationResult = {};

      for (const household of households) {
        // 全メンバーの情報が埋まっているかチェック
        const isComplete = household.members.every(member => {
          const age = member.age.trim();
          const income = member.income.trim();
          return age !== '' && income !== '' && !isNaN(parseInt(age, 10));
        });

        // 情報が不完全な世帯はスキップ
        if (!isComplete) {
          continue;
        }

        // 1. 世帯ごとのリクエストを準備
        const parents: string[] = [];
        const children: string[] = [];
        const grandparents: string[] = [];
        const personMap: { [apiId: string]: Member } = {};
        
        // ローカルカウンター（各世帯でリセット）
        let parentCount = 0;
        let childCount = 0;
        let grandparentCount = 0;
        let localParentCount = 0; // 役割判定用

        household.members.forEach(member => {
          const age = parseInt(member.age, 10);
          if (isNaN(age)) return;

          let apiId = '';
          if (age < 18) {
            childCount++;
            apiId = `子${childCount}`;
            children.push(apiId);
          } else {
            if (localParentCount < 2) {
              localParentCount++;
              parentCount++;
              apiId = `親${parentCount}`;
              parents.push(apiId);
            } else {
              grandparentCount++;
              apiId = `祖父母${grandparentCount}`;
              grandparents.push(apiId);
            }
          }
          personMap[apiId] = member;
        });

        // 世帯員情報を構築
        const 世帯員: OpenFiscaRequest['世帯員'] = {};
        Object.entries(personMap).forEach(([apiId, member]) => {
          const age = parseInt(member.age, 10);
          const birthYear = 2025 - age;
          const gender = member.gender === 'female' ? '女性' : member.gender === 'male' ? '男性' : 'その他';

          世帯員[apiId] = {
            誕生年月日: { "ETERNITY": `${birthYear}-01-01` },
            性別: { "2025-11-01": gender },
            収入: { "2025-11-01": 0 },
            控除後所得: { "2025-11-01": null }
          };
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
          世帯員
        };

        // 2. API呼び出し
        console.log(`OpenFisca Request for ${household.name}:`, JSON.stringify(request, null, 2));

        const response = await fetch('https://openfisca-japan-ijgkugdoka-uc.a.run.app/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to calculate BI for ${household.name}: ${response.status} ${errorText}`);
        }

        const data: OpenFiscaResponse = await response.json();
        const householdData = data.世帯一覧["世帯1"];
        
        // 3. BI計算（年額）
        const monthlyBi = (householdData.生活保護["2025-11-01"] || 0) + 
                          (householdData.児童手当["2025-11-01"] || 0) + 
                          (householdData.児童扶養手当_最小["2025-11-01"] || 0);
        const bi = monthlyBi * 12;

        // 4. 余剰額計算
        // 親の平均収入を計算
        let totalParentIncome = 0;
        let parentCountForIncome = 0;
        
        parents.forEach(id => {
          const member = personMap[id];
          const income = parseFloat(member.income) * 10000 || 0; // 万円 -> 円
          totalParentIncome += income;
          parentCountForIncome++;
        });
        
        const parentAverageIncome = parentCountForIncome > 0 ? totalParentIncome / parentCountForIncome : 0;

        let totalSurplus = 0;
        const alpha_offset = 1000000;
        const householdSize = household.members.length;

        // beta値の計算
        const beta_values = {
          "single_young": 1 * 1,
          "single_elder": betaParams.elder * 1,
          "couple_young": 1 * betaParams.couple,
          "couple_elder": betaParams.elder * betaParams.couple,
          "child": betaParams.child
        };

        household.members.forEach(member => {
          const age = parseInt(member.age, 10);
          if (isNaN(age)) return;
          
          let income = 0;
          // 子供の場合は親の平均収入を使用
          if (age < 18) {
            income = parentAverageIncome;
          } else {
            income = parseFloat(member.income) * 10000 || 0; // 万円 -> 円
          }

          // 世帯タイプの判定
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
            
            let surplus = 0;
            if (alpha_offset > 0 && income > 0) {
              surplus = gamma * beta * alpha_offset * Math.pow(income / alpha_offset, alpha);
            }
            totalSurplus += surplus;
          }
        });

        newResults[household.id] = {
          bi: bi / 10000, // 円 -> 万円
          surplus: totalSurplus / 10000, // 円 -> 万円
          total: (bi + totalSurplus) / 10000 // 円 -> 万円
        };
      }

      setResult(newResults);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  }, [alpha, betaParams, gamma]);

  return { calculate, result, loading, error };
};
