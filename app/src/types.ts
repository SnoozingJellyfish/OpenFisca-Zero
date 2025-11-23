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

export interface Member {
  id: number;
  name: string;
  age: string;
  income: string;
  gender: string;
}

export interface Household {
  id: number;
  name: string;
  members: Member[];
}

export interface OpenFiscaRequest {
  世帯一覧: {
    [key: string]: {
      親一覧: string[];
      子一覧: string[];
      祖父母一覧: string[];
      居住都道府県: { [key: string]: string };
      居住市区町村: { [key: string]: string };
      生活保護: { [key: string]: null };
      児童手当: { [key: string]: null };
      児童扶養手当_最小: { [key: string]: null };
    };
  };
  世帯員: {
    [key: string]: {
      誕生年月日: { [key: string]: string };
      性別: { [key: string]: string };
      収入: { [key: string]: number };
      控除後所得: { [key: string]: null };
    };
  };
}

export interface OpenFiscaResponse {
  世帯一覧: {
    [key: string]: {
      生活保護: { [key: string]: number };
      児童手当: { [key: string]: number };
      児童扶養手当_最小: { [key: string]: number };
    };
  };
}

export interface CalculationResult {
  [householdId: number]: {
    bi: number;
    surplus: number;
    total: number;
  };
}
