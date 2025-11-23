import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface IncomeGraphProps {
  alpha: number;
}

interface TaxInfo {
  min: number;
  max: number;
  rate: number;
  deduction: number;
}

const INCOME_TAX_LIST: TaxInfo[] = [
  { min: 1000, max: 1949000, rate: 0.05, deduction: 0 },
  { min: 1950000, max: 3299000, rate: 0.1, deduction: 97500 },
  { min: 3300000, max: 6949000, rate: 0.2, deduction: 427500 },
  { min: 6950000, max: 8999000, rate: 0.23, deduction: 636000 },
  { min: 9000000, max: 17999000, rate: 0.33, deduction: 1536000 },
  { min: 18000000, max: 39999000, rate: 0.4, deduction: 2796000 },
  { min: 40000000, max: Infinity, rate: 0.45, deduction: 4796000 },
];

const calculateAfterTaxIncome = (income: number): number => {
  for (const taxInfo of INCOME_TAX_LIST) {
    if (income >= taxInfo.min && income <= taxInfo.max) {
      const tax = income * taxInfo.rate - taxInfo.deduction;
      return income - Math.max(0, tax);
    }
  }
  return income;
};

export const IncomeGraph: React.FC<IncomeGraphProps> = React.memo(({ alpha }) => {
  const [maxIncome, setMaxIncome] = useState<number>(50000000); // Default 50 million

  const data = useMemo(() => {
    const points = 100;
    const step = maxIncome / points;
    const result = [];

    for (let i = 0; i <= points; i++) {
      const income = i * step;
      
      // Conventional after-tax income
      const conventional = calculateAfterTaxIncome(income);

      // Proposed after-tax income (Alpha based)
      // 100万 * (値 / 100万) ** α
      const proposed = income > 0 
        ? 1000000 * Math.pow(income / 1000000, alpha)
        : 0;

      result.push({
        income: income / 10000, // Convert to Man-yen for display
        conventional: conventional / 10000,
        proposed: proposed / 10000,
        original: income / 10000
      });
    }
    return result;
  }, [maxIncome, alpha]);

  const formatTick = (value: number) => {
    return `${value.toLocaleString()}`;
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-800">所得税引き後の金額</h3>
      
      <div className="flex-1 min-h-[400px] aspect-square mx-auto w-full max-w-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="income" 
              type="number"
              domain={[0, maxIncome / 10000]}
              tickFormatter={formatTick}
              label={{ value: '所得（万円）', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              domain={[0, maxIncome / 10000]}
              tickFormatter={formatTick}
              label={{ value: '金額（万円）', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString(undefined, {maximumFractionDigits: 0})} 万円`, '']}
              labelFormatter={(label: number) => `所得: ${label.toLocaleString()} 万円`}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line 
              type="monotone" 
              dataKey="conventional" 
              stroke="#0d9488" 
              name="従来制度" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="proposed" 
              stroke="#ef4444" 
              name={`提案制度 (α=${alpha})`} 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="original" 
              stroke="#9ca3af" 
              name="所得（比較用）" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 px-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          表示範囲（最大所得）: {(maxIncome / 10000).toLocaleString()} 万円
        </label>
        <input
          type="range"
          min="1000000" // 100万円
          max="500000000" // 5億円
          step="1000000" // 100万円刻み
          value={maxIncome}
          onChange={(e) => setMaxIncome(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>100万円</span>
          <span>5億円</span>
        </div>
      </div>
    </div>
  );
});
