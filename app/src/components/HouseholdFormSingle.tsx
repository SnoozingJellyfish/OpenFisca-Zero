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
          <div key={member.id} className="flex flex-wrap items-center gap-2 py-3 border-b border-gray-200 last:border-0">
            <span className="font-bold w-full sm:w-auto min-w-[60px] text-gray-700 mb-1 sm:mb-0">メンバー{index + 1}</span>
            
            <div className="flex flex-col gap-2 w-full sm:flex-row sm:flex-wrap">
              <div className="flex items-center gap-2 justify-between sm:justify-start">
                <label className="text-xs text-gray-600 whitespace-nowrap w-8 sm:w-auto">性別</label>
                <select 
                  value={member.gender}
                  onChange={(e) => updateMember(member.id, 'gender', e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-full sm:w-16 text-sm focus:outline-none focus:border-teal-400 bg-white text-gray-700 flex-1 sm:flex-none"
                >
                  <option value="female">女</option>
                  <option value="male">男</option>
                  <option value="other">他</option>
                </select>
              </div>

              <div className="flex items-center gap-2 justify-between sm:justify-start">
                <label className="text-xs text-gray-600 whitespace-nowrap w-8 sm:w-auto">年齢</label>
                <input 
                  type="text" 
                  value={member.age}
                  onChange={(e) => updateMember(member.id, 'age', e.target.value)}
                  className="p-1.5 border border-gray-300 rounded w-full sm:w-12 text-right text-sm focus:outline-none focus:border-teal-400 flex-1 sm:flex-none" 
                  placeholder="30" 
                />
              </div>

              <div className="flex items-center gap-2 justify-between sm:justify-start">
                <label className="text-xs text-gray-600 whitespace-nowrap w-8 sm:w-auto">年収</label>
                <div className="flex items-center gap-1 flex-1 sm:flex-none">
                  <input 
                    type="text" 
                    value={member.income}
                    onChange={(e) => updateMember(member.id, 'income', e.target.value)}
                    className="p-1.5 border border-gray-300 rounded w-full sm:w-16 text-right text-sm focus:outline-none focus:border-teal-400 flex-1 sm:flex-none" 
                    placeholder="300" 
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">万</span>
                </div>
              </div>

              {index > 0 && (
                <button
                  onClick={() => deleteMember(member.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-400 text-red-400 hover:bg-red-50 hover:border-red-600 transition-colors text-base font-bold ml-auto sm:ml-0 mt-1 sm:mt-0"
                  title="メンバーを削除"
                >
                  ×
                </button>
              )}
            </div>
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
