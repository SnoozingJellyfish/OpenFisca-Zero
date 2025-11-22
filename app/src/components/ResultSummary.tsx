import React from 'react';

export const ResultSummary: React.FC = () => {
  return (
    <div className="flex justify-around p-5 bg-gray-50 rounded-lg mt-5 gap-2.5 sm:gap-5">
      <div className="text-center">
        <span className="block text-lg font-bold text-gray-600 mb-1 sm:text-base">XX</span>
        <span className="text-2xl font-bold text-gray-800 sm:text-xl">---</span>
      </div>
      <div className="text-center">
        <span className="block text-lg font-bold text-gray-600 mb-1 sm:text-base">YY</span>
        <span className="text-2xl font-bold text-gray-800 sm:text-xl">---</span>
      </div>
      <div className="text-center">
        <span className="block text-lg font-bold text-gray-600 mb-1 sm:text-base">ZZ</span>
        <span className="text-2xl font-bold text-gray-800 sm:text-xl">---</span>
      </div>
    </div>
  );
};
