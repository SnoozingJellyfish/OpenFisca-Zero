import React from 'react';
import type { Household, Member } from '../types';

interface HouseholdFormProps {
  households: Household[];
  setHouseholds: (households: Household[]) => void;
}

export const HouseholdForm: React.FC<HouseholdFormProps> = ({ households, setHouseholds }) => {
  const addHousehold = () => {
    const newHouseholdId = households.length > 0 ? Math.max(...households.map(h => h.id)) + 1 : 1;
    // Find the max member ID across all households to ensure uniqueness
    const allMembers = households.flatMap(h => h.members);
    const maxMemberId = allMembers.length > 0 ? Math.max(...allMembers.map(m => m.id)) : 0;
    const newMemberId = maxMemberId + 1;

    setHouseholds([
      ...households,
      {
        id: newHouseholdId,
        name: `世帯${newHouseholdId}`,
        members: [
          { id: newMemberId, name: `世帯員${newMemberId}`, age: '', income: '', gender: 'female' }
        ]
      }
    ]);
  };

  const addMember = (householdId: number) => {
    // Find the max member ID across all households to ensure uniqueness
    const allMembers = households.flatMap(h => h.members);
    const maxMemberId = allMembers.length > 0 ? Math.max(...allMembers.map(m => m.id)) : 0;
    const newMemberId = maxMemberId + 1;

    setHouseholds(households.map(household => {
      if (household.id === householdId) {
        return {
          ...household,
          members: [
            ...household.members,
            { id: newMemberId, name: `世帯員${newMemberId}`, age: '', income: '', gender: 'female' }
          ]
        };
      }
      return household;
    }));
  };

  const updateMember = (householdId: number, memberId: number, field: keyof Member, value: string) => {
    setHouseholds(households.map(household => {
      if (household.id === householdId) {
        return {
          ...household,
          members: household.members.map(member => 
            member.id === memberId ? { ...member, [field]: value } : member
          )
        };
      }
      return household;
    }));
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-sm sm:p-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">世帯情報</h3>
      <div className="flex flex-col gap-6">
        {households.map((household) => (
          <div key={household.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-bold text-gray-700 mb-3">{household.name}</h4>
            <div className="pl-2 sm:pl-4 flex flex-col gap-0 mb-3">
              {household.members.map((member) => (
                <div key={member.id} className="flex items-center gap-4 py-3 border-b border-gray-200 last:border-0 flex-col sm:flex-row sm:items-center sm:gap-4">
                  <span className="font-bold min-w-[80px] text-gray-700 mb-1 sm:mb-0">{member.name}</span>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <label className="text-sm text-gray-600">性別</label>
                    <select 
                      value={member.gender}
                      onChange={(e) => updateMember(household.id, member.id, 'gender', e.target.value)}
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
                      onChange={(e) => updateMember(household.id, member.id, 'age', e.target.value)}
                      className="p-1.5 border border-gray-300 rounded w-20 text-right focus:outline-none focus:border-teal-400 flex-1 sm:flex-none sm:w-20" 
                      placeholder="30" 
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <label className="text-sm text-gray-600">年収 (万円)</label>
                    <input 
                      type="text" 
                      value={member.income}
                      onChange={(e) => updateMember(household.id, member.id, 'income', e.target.value)}
                      className="p-1.5 border border-gray-300 rounded w-24 text-right focus:outline-none focus:border-teal-400 flex-1 sm:flex-none sm:w-24" 
                      placeholder="300" 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="text-teal-600 border border-teal-600 bg-white py-1.5 px-3 rounded cursor-pointer text-sm transition-colors hover:bg-teal-50 w-full sm:w-auto" 
              onClick={() => addMember(household.id)}
            >
              + メンバー追加
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button 
          className="bg-teal-600 text-white border-none py-2.5 px-5 rounded cursor-pointer text-base transition-colors hover:bg-teal-700 w-full sm:w-auto" 
          onClick={addHousehold}
        >
          + 世帯追加
        </button>
      </div>
    </div>
  );
};
