import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { HouseholdForm } from './components/HouseholdForm';
import { ResultSummary } from './components/ResultSummary';
import { IncomeGraph } from './components/IncomeGraph';
import { FormulaSection } from './components/FormulaSection';
import { ParameterForm } from './components/ParameterForm';
import { useGammaCalculation } from './hooks/useGammaCalculation';
import { useHouseholdCalculation } from './hooks/useHouseholdCalculation';
import type { BetaParams, Member } from './types';

function App() {
  const [alpha, setAlpha] = useState<number>(0.85);
  const [betaParams, setBetaParams] = useState<BetaParams>({
    child: 0.5,
    elder: 0.7,
    couple: 0.9
  });
  
  // HouseholdFormの状態をここで管理するか、refで取得するか。
  // HouseholdFormが内部でstateを持っているため、リフトアップが必要。
  // しかし、HouseholdFormを大きく書き換えるのはリスクがあるため、
  // HouseholdFormからメンバー情報の変更を通知してもらう形にするのが良いが、
  // 今回はHouseholdFormのstateをAppに持ち上げる形に修正する。
  
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: '世帯員1', age: '', income: '', gender: 'female' }
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

  const handleMembersChange = (newMembers: Member[]) => {
    setMembers(newMembers);
    triggerCalculation(newMembers);
  };

  const triggerCalculation = (currentMembers: Member[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      calculate(currentMembers);
    }, 1000); // 1秒デバウンス
  };
  
  // パラメータ変更時も再計算
  const handleAlphaChange = (val: number) => {
    setAlpha(val);
    triggerCalculation(members);
  };
  
  const handleBetaParamsChange = (params: BetaParams) => {
    setBetaParams(params);
    triggerCalculation(members);
  };

  return (
    <div className="min-h-screen bg-[#e0f2f1] font-sans">
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5 max-w-[92rem] mx-auto p-5">
        {/* Top Left: Formula & Parameters */}
        <div className="flex flex-col gap-5">
          <FormulaSection />
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
        <div className="col-span-1 md:col-span-2 border-t border-gray-300 my-2"></div>

        {/* Bottom Left: Household Info */}
        <div className="h-full">
          <HouseholdForm members={members} setMembers={handleMembersChange} />
        </div>

        {/* Bottom Right: Results */}
        <div className="h-full">
          <ResultSummary result={result} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;
