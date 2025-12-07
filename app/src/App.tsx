import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { HouseholdFormSingle } from './components/HouseholdFormSingle';
import { ResultSummarySingle } from './components/ResultSummarySingle';
import { IncomeGraph } from './components/IncomeGraph';
import { ExplanationSection } from './components/ExplanationSection';
import { ParameterForm } from './components/ParameterForm';
import { useGammaCalculation } from './hooks/useGammaCalculation';
import { useHouseholdCalculation } from './hooks/useHouseholdCalculation';
import type { BetaParams, Household } from './types';

function App() {
  const [alpha, setAlpha] = useState<number>(0.85);
  const [betaParams, setBetaParams] = useState<BetaParams>({
    child: 0.2,
    elder: 0.75,
    couple: 0.9
  });
  
  // HouseholdFormの状態をここで管理するか、refで取得するか。
  // HouseholdFormが内部でstateを持っているため、リフトアップが必要。
  // しかし、HouseholdFormを大きく書き換えるのはリスクがあるため、
  // HouseholdFormからメンバー情報の変更を通知してもらう形にするのが良いが、
  // 今回はHouseholdFormのstateをAppに持ち上げる形に修正する。
  
  const [households, setHouseholds] = useState<Household[]>([
    {
      id: 1,
      name: '世帯1',
      members: [
        { id: 1, name: 'メンバー1', age: '', income: '', gender: 'male' }
      ]
    }
  ]);

  const { gamma } = useGammaCalculation(alpha, betaParams);
  const { calculate, result, loading } = useHouseholdCalculation(alpha, betaParams, gamma);

  // メンバー情報やパラメータが変更されたら再計算したいが、
  // API呼び出しを含むため、ボタンを押したタイミングか、デバウンスが必要。
  // ここではuseEffectで依存配列が変わるたびに計算するのはAPI負荷が高いため、
  // ひとまず自動計算にするが、本来は計算ボタンがあったほうが良いかもしれない。
  // しかし要件では「入力された世帯情報から...表示して」とあるので、リアルタイム性が求められている可能性がある。
  // useHouseholdCalculation内でuseEffectを使っていないため、ここでuseEffectを使う。
  
  // 簡易的なデバウンス実装
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHouseholdsChange = (newHouseholds: Household[]) => {
    setHouseholds(newHouseholds);
    triggerCalculation(newHouseholds);
  };

  const triggerCalculation = (currentHouseholds: Household[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      calculate(currentHouseholds);
    }, 1000); // 1秒デバウンス
  };
  
  // パラメータ変更時も再計算
  const handleAlphaChange = (val: number) => {
    setAlpha(val);
    triggerCalculation(households);
  };
  
  const handleBetaParamsChange = (params: BetaParams) => {
    setBetaParams(params);
    triggerCalculation(households);
  };

  return (
    <div className="min-h-screen bg-[#e0f2f1] font-sans">
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5 max-w-[92rem] mx-auto p-5">
        {/* Top Left: Formula & Parameters */}
        <div className="flex flex-col gap-2">
          <ExplanationSection />
          <h2 className="text-2xl font-bold text-teal-600 mt-2">Step.1</h2>
          <ParameterForm 
            alpha={alpha}
            setAlpha={handleAlphaChange}
            betaParams={betaParams}
            setBetaParams={handleBetaParamsChange}
            gamma={gamma}
          />
        </div>

        {/* Top Right: Graph */}
        <div className="w-full">
          <IncomeGraph alpha={alpha} />
        </div>

        {/* Divider */}
        {/* <div className="col-span-1 md:col-span-2 border-t border-gray-300 my-2"></div> */}

        {/* Household Info and Results - paired by household */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-teal-600 mb-1">Step.2</h2>
          {/* Header Row */}
          <div className="grid grid-cols-2 gap-2 md:gap-5 mb-5">
            <h3 className="text-lg font-bold text-gray-800">世帯情報</h3>
            <h3 className="text-lg font-bold text-gray-800">計算結果（年額）</h3>
          </div>

          {/* Households and Results */}
          <div className="flex flex-col gap-5">
            {households.map((household) => (
              <div key={household.id} className="grid grid-cols-2 gap-2 md:gap-5 items-start">
                {/* Household Form */}
                <div className="h-full">
                  <HouseholdFormSingle 
                    household={household}
                    updateHousehold={(updatedHousehold) => {
                      const newHouseholds = households.map(h => 
                        h.id === household.id ? updatedHousehold : h
                      );
                      handleHouseholdsChange(newHouseholds);
                    }}
                    canDelete={household.id !== 1}
                    onDelete={() => {
                      const newHouseholds = households.filter(h => h.id !== household.id);
                      handleHouseholdsChange(newHouseholds);
                    }}
                  />
                </div>

                {/* Result */}
                <div className="h-full">
                  <ResultSummarySingle 
                    household={household}
                    result={result ? result[household.id] : null}
                    loading={loading}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Household Button */}
          <div className="mt-6">
            <button 
              className="bg-teal-600 text-white border-none py-2.5 px-5 rounded cursor-pointer text-base transition-colors hover:bg-teal-700 w-full sm:w-auto" 
              onClick={() => {
                const newHouseholdId = households.length > 0 ? Math.max(...households.map(h => h.id)) + 1 : 1;
                const allMembers = households.flatMap(h => h.members);
                const maxMemberId = allMembers.length > 0 ? Math.max(...allMembers.map(m => m.id)) : 0;
                const newMemberId = maxMemberId + 1;

                handleHouseholdsChange([
                  ...households,
                  {
                    id: newHouseholdId,
                    name: `世帯${newHouseholdId}`,
                    members: [
                      { id: newMemberId, name: 'メンバー1', age: '', income: '', gender: 'male' }
                    ]
                  }
                ]);
              }}
            >
              + 世帯追加
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
