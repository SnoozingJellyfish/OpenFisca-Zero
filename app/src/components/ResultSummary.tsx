import React from 'react';
import type { CalculationResult } from '../types';

interface ResultSummaryProps {
  result: CalculationResult | null;
  loading: boolean;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">計算結果 (年額)</h3>
      
      <div className="flex flex-col gap-4">
        {/* Total */}
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
          <div className="text-sm text-gray-600 mb-1">合計 (A)+(B)</div>
          <div className="text-3xl font-bold text-teal-600">
            {result ? formatCurrency(result.total) : '---'} <span className="text-base font-normal text-gray-500">万円</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* BI */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">最低生活保障 (A)</div>
            <div className="text-xl font-bold text-gray-800">
              {result ? formatCurrency(result.bi) : '---'} <span className="text-sm font-normal text-gray-500">万円</span>
            </div>
          </div>

          {/* Surplus */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">余剰額 (B)</div>
            <div className="text-xl font-bold text-gray-800">
              {result ? formatCurrency(result.surplus) : '---'} <span className="text-sm font-normal text-gray-500">万円</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
