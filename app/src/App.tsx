import { useState } from 'react';
import { Header } from './components/Header';
import { HouseholdForm } from './components/HouseholdForm';
import { ResultSummary } from './components/ResultSummary';
import { IncomeGraph } from './components/IncomeGraph';
import { FormulaSection } from './components/FormulaSection';
import { ParameterForm } from './components/ParameterForm';
import { useGammaCalculation } from './hooks/useGammaCalculation';
import type { BetaParams } from './types';

function App() {
  const [alpha, setAlpha] = useState<number>(0.85);
  const [betaParams, setBetaParams] = useState<BetaParams>({
    child: 0.5,
    elder: 0.7,
    couple: 0.9
  });

  const { gamma } = useGammaCalculation(alpha, betaParams);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <FormulaSection />
      <main className="flex flex-col md:flex-row p-5 gap-5 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <IncomeGraph alpha={alpha} />
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <ParameterForm 
            alpha={alpha}
            setAlpha={setAlpha}
            betaParams={betaParams}
            setBetaParams={setBetaParams}
            gamma={gamma}
          />
          <HouseholdForm />
          <ResultSummary />
        </div>
      </main>
    </div>
  );
}

export default App;
