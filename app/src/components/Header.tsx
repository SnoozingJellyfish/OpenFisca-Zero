import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative w-full h-[100px] md:h-[120px] overflow-hidden bg-gray-100 flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {/* Z top line */}
        <div className="absolute top-5 left-[5%] md:left-[10%] w-[90%] md:w-[80%] h-2.5 bg-sky-200 opacity-60"></div>
        {/* Z diagonal line */}
        <div className="absolute top-5 right-[15%] md:right-[10%] w-2.5 h-[120px] bg-sky-200 opacity-60 origin-top-right rotate-[20deg]"></div>
        {/* Z bottom line */}
        <div className="absolute bottom-5 left-[5%] md:left-[10%] w-[90%] md:w-[80%] h-2.5 bg-sky-200 opacity-60"></div>
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 m-0 leading-tight tracking-wide">OpenFisca Zero</h1>
        <h2 className="text-base md:text-xl font-normal text-gray-600 m-0 pl-[0.2em]">オープンフィスカ ゼロ</h2>
      </div>
    </header>
  );
};
