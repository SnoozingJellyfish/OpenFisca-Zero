import React from 'react';
import type { Household } from '../types';

interface ResultSummarySingleProps {
  household: Household;
  result: { bi: number; surplus: number; total: number } | null;
  loading: boolean;
}

export const ResultSummarySingle: React.FC<ResultSummarySingleProps> = ({ household, result, loading }) => {
  if (loading) {
    return (
      <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 animate-pulse h-full">
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
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 h-full">
      <h4 className="font-bold text-gray-700 mb-3">{household.name}</h4>
      
      <div className="flex flex-col gap-4">
        {/* Total */}
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
          <div className="text-sm text-gray-600 mb-1">合計 (A)+(B)</div>
          <div className="text-3xl font-bold text-teal-600">
            {result ? formatCurrency(result.total) : '---'} <span className="text-base font-normal text-gray-500">万円</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* BI */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex-1">
            <div className="text-xs text-gray-600 mb-1">最低生活保障 (A)</div>
            <div className="text-lg font-bold text-gray-800">
              {result ? formatCurrency(result.bi) : '---'} <span className="text-xs font-normal text-gray-500">万円</span>
            </div>
          </div>

          {/* Surplus */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex-1">
            <div className="text-xs text-gray-600 mb-1">余剰額 (B)</div>
            <div className="text-lg font-bold text-gray-800">
              {result ? formatCurrency(result.surplus) : '---'} <span className="text-xs font-normal text-gray-500">万円</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
