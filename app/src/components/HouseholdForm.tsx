import React, { useState } from 'react';

interface Member {
  id: number;
  name: string;
  age: string;
  income: string;
  gender: string;
}

export const HouseholdForm: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: '世帯員1', age: '', income: '', gender: 'female' }
  ]);

  const addMember = () => {
    const newId = members.length + 1;
    setMembers([...members, { id: newId, name: `世帯員${newId}`, age: '', income: '', gender: 'female' }]);
  };

  const updateMember = (id: number, field: keyof Member, value: string) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">世帯員情報</h3>
      <div className="mb-5 flex flex-col gap-0">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="font-bold min-w-[80px] text-gray-700 mb-1 sm:mb-0">{member.name}</span>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <label className="text-sm text-gray-600">性別</label>
              <select 
                value={member.gender}
                onChange={(e) => updateMember(member.id, 'gender', e.target.value)}
                className="p-1.5 border border-gray-300 rounded w-20 focus:outline-none focus:border-sky-400 flex-1 sm:flex-none sm:w-20 bg-white text-gray-700"
              >
                <option value="female">女</option>
                <option value="male">男</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <label className="text-sm text-gray-600">年齢</label>
              <input 
                type="text" 
                value={member.age}
                onChange={(e) => updateMember(member.id, 'age', e.target.value)}
                className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-sky-400 flex-1 sm:flex-none sm:w-20" 
                placeholder="30" 
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <label className="text-sm text-gray-600">年収 (万円)</label>
              <input 
                type="text" 
                value={member.income}
                onChange={(e) => updateMember(member.id, 'income', e.target.value)}
                className="p-1.5 border border-gray-300 rounded w-24 text-right focus:outline-none focus:border-sky-400 flex-1 sm:flex-none sm:w-24" 
                placeholder="300" 
              />
            </div>
          </div>
        ))}
      </div>
      <button 
        className="bg-green-500 text-white border-none py-2.5 px-5 rounded cursor-pointer text-base transition-colors hover:bg-green-600 w-full sm:w-auto" 
        onClick={addMember}
      >
        + 世帯員追加
      </button>
    </div>
  );
};
