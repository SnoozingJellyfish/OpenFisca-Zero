import React from 'react';
import type { Household, Member } from '../types';

interface HouseholdFormSingleProps {
  household: Household;
  updateHousehold: (household: Household) => void;
  canDelete: boolean;
  onDelete: () => void;
}

export const HouseholdFormSingle: React.FC<HouseholdFormSingleProps> = ({ household, updateHousehold, canDelete, onDelete }) => {
  const addMember = () => {
    // Find max member ID across all current members
    const maxMemberId = household.members.length > 0 ? Math.max(...household.members.map(m => m.id)) : 0;
    const newMemberId = maxMemberId + 1;
    const newMemberIndex = household.members.length + 1;

    updateHousehold({
      ...household,
      members: [
        ...household.members,
        { id: newMemberId, name: `メンバー${newMemberIndex}`, age: '', income: '', gender: 'male' }
      ]
    });
  };

  const deleteMember = (memberId: number) => {
    updateHousehold({
      ...household,
      members: household.members.filter(member => member.id !== memberId)
    });
  };

  const updateMember = (memberId: number, field: keyof Member, value: string) => {
    updateHousehold({
      ...household,
      members: household.members.map(member => 
        member.id === memberId ? { ...member, [field]: value } : member
      )
    });
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-700">{household.name}</h4>
        {canDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 px-2 py-1 text-sm border border-red-500 rounded hover:bg-red-50"
          >
            × 世帯削除
          </button>
        )}
      </div>
      <div className="pl-2 sm:pl-4 flex flex-col gap-0 mb-3">
        {household.members.map((member, index) => (
          <div key={member.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0 flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="font-bold min-w-[80px] text-gray-700 mb-1 sm:mb-0">メンバー{index + 1}</span>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <label className="text-sm text-gray-600">性別</label>
              <select 
                value={member.gender}
                onChange={(e) => updateMember(member.id, 'gender', e.target.value)}
                className="p-1.5 border border-gray-300 rounded w-20 focus:outline-none focus:border-teal-400 flex-1 sm:flex-none sm:w-20 bg-white text-gray-700"
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
                className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-teal-400 flex-1 sm:flex-none sm:w-20" 
                placeholder="30" 
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <label className="text-sm text-gray-600">年収 (万円)</label>
              <input 
                type="text" 
                value={member.income}
                onChange={(e) => updateMember(member.id, 'income', e.target.value)}
                className="p-1.5 border border-gray-300 rounded w-24 text-right focus:outline-none focus:border-teal-400 flex-1 sm:flex-none sm:w-24" 
                placeholder="300" 
              />
            </div>
            {index > 0 && (
              <button
                onClick={() => deleteMember(member.id)}
                className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-400 text-red-400 hover:bg-red-50 hover:border-red-600 transition-colors text-base font-bold"
                title="メンバーを削除"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <button 
        className="text-teal-600 border border-teal-600 bg-white py-1.5 px-3 rounded cursor-pointer text-sm transition-colors hover:bg-teal-50 w-full sm:w-auto" 
        onClick={addMember}
      >
        + メンバー追加
      </button>
    </div>
  );
};
