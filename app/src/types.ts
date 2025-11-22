export interface Person {
  person_id: string;
  household_id: string;
  '世帯タイプ': 'single_young' | 'single_elder' | 'couple_young' | 'couple_elder' | 'child';
  '収入_親': number;
  '年齢': number;
}

export interface ActualTotalData {
  actual_total: number;
  income_actual_total: number;
  allowance_actual_total: number;
  BI_total: number;
}

export interface BetaParams {
  child: number;
  elder: number;
  couple: number;
}
