import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export const ExplanationSection: React.FC = () => {
  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">What is this?</h3>
        <div className="text-lg text-gray-700 leading-relaxed">
          <p className="mb-2">
            最低生活保障(BI)、累進課税(収入逓減率<span className="text-red-500 font-bold">α</span>)、世帯構成によるコスト補正(<span className="text-blue-500 font-bold">β</span>)を組み合わせた制度シミュレーション
          </p>
          <div className="pl-2 border-l-2 border-teal-100 ml-1">
            <p className="mb-1">
              <span className="font-bold text-teal-600">Step.1</span> 計算パラメータの<span className="text-red-500 font-bold">α</span>, <span className="text-blue-500 font-bold">β</span>を設定してください。<span className="text-red-500 font-bold">α</span>の効果は右のグラフで確認できます。
              <br />
              <span className="text-sm text-gray-500 pl-4 block mt-0.5">
                従来制度から財政収支が変わらないように残りのパラメータ(<span className="text-purple-500 font-bold">γ</span>)が自動計算されます。
              </span>
            </p>
            <p>
              <span className="font-bold text-teal-600">Step.2</span> 世帯情報を入力してください。設定したパラメータでその世帯が受け取れる金額が計算されます。
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-2">
        <div className="flex items-center gap-2 relative">
          <h4 className="text-lg font-bold text-gray-800">計算式</h4>
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
            <div className="absolute z-50 w-80 p-4 top-full mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0">
              <p className="mb-2">
                「従来制度の手当+所得税引後の収入」は、代表的な手当である生活保護・児童手当・児童扶養手当と、収入から所得税(所得控除考慮)を引いた金額を合計したものです。
              </p>
              <p className="mb-2">
                「最低生活保障」は従来の生活保護の最低生活費を基準とした金額です。
              </p>
              <p className="mb-2">
                統計データから生成した日本の代表的な約1万世帯のサンプルに対して、それぞれの計算金額の総和(Σ)を計算します。
              </p>
              <p>
                従来制度から財政収支が変わらないように財政調整変数γが調整されるため、提案制度による新たな財政負担は生じません。
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full mb-6">
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
            <div className="text-right text-lg font-medium text-gray-800 flex items-center justify-end gap-1">
              <div className="relative flex flex-col items-center">
                <span className="text-2xl leading-none font-serif">Σ</span>
                <span className="text-[0.8rem] text-gray-800 absolute top-5 w-max font-sans">全市民</span>
              </div>
              <span className="font-serif text-2xl">{'{'}</span>
              従来制度の手当＋所得税引後の収入
              <span className="font-serif text-2xl">{'}'}</span>
            </div>
            <div className="text-lg font-medium text-gray-800">=</div>
            <div className="text-left text-lg font-medium text-gray-800 flex items-center gap-1">
              <div className="relative flex flex-col items-center">
                <span className="text-2xl leading-none font-serif">Σ</span>
                <span className="text-[0.8rem] text-gray-800 absolute top-5 w-max font-sans">全市民</span>
              </div>
              <span>
                <span className="font-serif text-2xl">{'{'}</span>
                最低生活保障 ＋ <span className="text-purple-800">γ</span>×
                <span className="text-blue-500">β</span>×
                <span>(収入<span className="text-sm text-gray-500">/100万</span>)<sup><span className="text-red-500">α</span></sup></span><span className="text-sm text-gray-500">×100万</span>
                <span className="font-serif text-2xl">{'}'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
