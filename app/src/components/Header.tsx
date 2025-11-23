import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-gray-600 flex items-center justify-center overflow-hidden py-4">
      <div className="w-full max-w-[92rem] mx-auto flex justify-center">
        <img 
          src="/images/title3.png" 
          alt="OpenFisca Zero" 
          className="w-1/2 h-auto object-contain"
        />
      </div>
    </header>
  );
};
