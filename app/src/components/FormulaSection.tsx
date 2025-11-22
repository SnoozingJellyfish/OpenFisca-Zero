import React from 'react';

export const FormulaSection: React.FC = () => {
  return (
    <div className="py-5 bg-white flex flex-col items-center gap-2">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full max-w-7xl px-5 items-center">
        <div className="text-right text-lg font-medium text-gray-800">
          従来制度の財政収支
        </div>
        <div className="text-lg font-medium text-gray-800">=</div>
        <div className="text-left text-lg font-medium text-gray-800">
          提案制度の財政収支
        </div>
      </div>

      <div className="text-2xl text-gray-400">↕</div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full max-w-7xl px-5 items-center">
        <div className="text-right text-lg font-medium text-gray-800">
          Σ(従来制度の手当＋所得税引後の収入)
        </div>
        <div className="text-lg font-medium text-gray-800">=</div>
        <div className="text-left text-lg font-medium text-gray-800">
          Σ(最低生活保障 ＋ γ × β × (収入)<sup>α</sup>)
        </div>
      </div>
    </div>
  );
};
