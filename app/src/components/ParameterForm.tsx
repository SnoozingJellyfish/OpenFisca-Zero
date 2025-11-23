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
      <h3 className="text-lg font-bold mb-4 text-gray-800">計算パラメータ</h3>
      
      <div className="flex flex-col gap-4">
        {/* Alpha */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="font-medium text-gray-700">収入逓減率 α =</label>
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
        <div className="flex flex-col gap-2">
          <div className="font-medium text-gray-700">世帯構成補正 β =</div>
          <div className="pl-4 flex flex-col gap-2">
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
          <span className="font-medium text-gray-700">財政調整変数 γ =</span>
          <span className="text-xl font-bold text-teal-600">
            {gamma !== null ? gamma.toFixed(4) : '計算中...'}
          </span>
        </div>
      </div>
    </div>
  );
};
