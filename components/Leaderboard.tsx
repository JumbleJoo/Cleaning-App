import React from 'react';
import { User, Log } from '../types';
import { calculatePoints } from '../services/storageService';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  users: User[];
  logs: Log[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, logs }) => {
  // Calculate points for this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);
  
  const scores = users.map(u => ({
    ...u,
    currentScore: calculatePoints(logs, u.id, startOfMonth.getTime())
  }));

  const userA = scores[0];
  const userB = scores[1];
  
  const totalScore = (userA?.currentScore || 0) + (userB?.currentScore || 0);
  
  // Avoid division by zero
  const percentageA = totalScore === 0 ? 50 : Math.round((userA.currentScore / totalScore) * 100);
  const percentageB = 100 - percentageA;

  const isAhead = userA.currentScore > userB.currentScore ? userA : (userB.currentScore > userA.currentScore ? userB : null);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly Goal</h2>
        {isAhead && (
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full bg-${isAhead.color.split('-')[0]}-100 text-${isAhead.color}`}>
                <Trophy size={12} className="mr-1" />
                {isAhead.name} leads!
            </div>
        )}
      </div>

      <div className="flex justify-between items-end mb-2">
         <div className="text-center">
             <div className="text-3xl font-black text-slate-800">{userA.currentScore}</div>
             <div className={`text-xs font-bold text-${userA.color} uppercase`}>{userA.name}</div>
         </div>
         <div className="text-slate-300 font-serif italic pb-2">vs</div>
         <div className="text-center">
             <div className="text-3xl font-black text-slate-800">{userB.currentScore}</div>
             <div className={`text-xs font-bold text-${userB.color} uppercase`}>{userB.name}</div>
         </div>
      </div>

      {/* Progress Bar Balance */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
         <div 
           className={`h-full bg-teal-400 transition-all duration-700 ease-out`} 
           style={{ width: `${percentageA}%` }}
         />
         <div 
           className={`h-full bg-orange-400 transition-all duration-700 ease-out`} 
           style={{ width: `${percentageB}%` }}
         />
         {/* Center Marker */}
         <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white mix-blend-overlay opacity-50"></div>
      </div>
    </div>
  );
};

export default Leaderboard;