import React from 'react';
import type { BetaParams } from '../types';

interface ParameterFormProps {
  alpha: number;
  setAlpha: (value: number) => void;
  betaParams: BetaParams;
  setBetaParams: (params: BetaParams) => void;
  gamma: number | null;
}

export const ParameterForm: React.FC<ParameterFormProps> = ({
  alpha,
  setAlpha,
  betaParams,
  setBetaParams,
  gamma
}) => {
  const handleBetaChange = (field: keyof BetaParams, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setBetaParams({ ...betaParams, [field]: numValue });
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">計算パラメータ
        <span className="text-base text-gray-700 font-medium ml-2 mr-1">（最低生活保障にプラスされる金額の調整）</span>
      </h3>
      
      <div className="flex flex-col gap-4">
        {/* Alpha */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="font-medium text-gray-700">収入逓減率 <span className="text-red-500 font-bold">α</span> =</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            max="1" 
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-teal-400" 
            placeholder="0.85" 
          />
        </div>

        {/* Beta */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 pt-1.5">
            <div className="font-medium text-gray-700 whitespace-nowrap">世帯構成補正</div>
            <div className="relative group flex items-center">
              <button
                type="button"
                className="text-gray-400 hover:text-teal-600 transition-colors focus:outline-none flex items-center"
                aria-label="Help"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </button>
              <div className="absolute z-50 w-80 p-4 top-full mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 left-0">
                <p className="mb-2">
                  最低生活保障にプラスされる金額に対し、世帯構成による支出の比率を設定します。
                </p>
                <p className="mb-2">
                  児童の補正は両親の平均収入に対して掛けられ、子育て支援の意味合いがあります。
                </p>
                <p>
                  複数人世帯の補正比率は、家や備品を共用できることによる支出低下比率を意味します。
                </p>
              </div>
              <span className="text-blue-500 font-bold ml-1 mr-1">β</span>
              <span className="text-gray-700 font-medium ml-1 mr-1">=</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">大人:</span>
                <input 
                  type="text" 
                  value="1" 
                  disabled 
                  className="p-1.5 border border-gray-300 rounded w-20 text-right bg-gray-100 text-gray-500 cursor-not-allowed" 
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-600">児童:</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="1" 
                  value={betaParams.child}
                  onChange={(e) => handleBetaChange('child', e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-teal-400" 
                  placeholder="0.5" 
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-600">高齢者:</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="1" 
                  value={betaParams.elder}
                  onChange={(e) => handleBetaChange('elder', e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-teal-400" 
                  placeholder="0.7" 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">単身世帯:</span>
                <input 
                  type="text" 
                  value="1" 
                  disabled 
                  className="p-1.5 border border-gray-300 rounded w-20 text-right bg-gray-100 text-gray-500 cursor-not-allowed" 
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-600">複数人世帯:</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  max="1" 
                  value={betaParams.couple}
                  onChange={(e) => handleBetaChange('couple', e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-teal-400" 
                  placeholder="0.9" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gamma */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">財政調整変数 <span className="text-purple-500 font-bold">γ</span> =</span>
          <span className="text-xl font-medium text-gray-700">
            {gamma !== null ? gamma.toFixed(4) : '計算中...'}
          </span>
        </div>
      </div>
    </div>
  );
};
