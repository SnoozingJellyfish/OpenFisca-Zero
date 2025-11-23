import React from 'react';

export const FormulaSection: React.FC = () => {
  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 flex flex-col gap-2">
      <h3 className="text-lg font-bold mb-4 text-gray-800">前提の計算式</h3>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full px-5 items-center">
          <div className="text-right text-lg font-medium text-gray-800">
            従来制度の財政収支
          </div>
          <div className="text-lg font-medium text-gray-800">=</div>
          <div className="text-left text-lg font-medium text-gray-800">
            提案制度の財政収支
          </div>
        </div>

        <div className="text-2xl text-gray-400">↕</div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full px-5 items-center">
          <div className="text-right text-lg font-medium text-gray-800">
            Σ(従来制度の手当＋所得税引後の収入)
          </div>
          <div className="text-lg font-medium text-gray-800">=</div>
          <div className="text-left text-lg font-medium text-gray-800">
            Σ(最低生活保障 ＋ γ×β×100万(収入/100万)<sup>α</sup>)
          </div>
        </div>
      </div>
    </div>
  );
};
