import React from 'react';
import { User, Log, Task } from '../types';
import { calculatePoints, getPointsForEffort } from '../services/storageService';
import { PieChart, TrendingUp, Scale, CheckCircle2 } from 'lucide-react';

interface StatsViewProps {
  users: User[];
  logs: Log[];
  tasks: Task[];
}

const StatsView: React.FC<StatsViewProps> = ({ users, logs, tasks }) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);

  // 1. Completion Stats (Points Earned this Month)
  const scores = users.map(u => ({
    ...u,
    currentScore: calculatePoints(logs, u.id, startOfMonth.getTime())
  }));
  
  const totalScore = scores.reduce((acc, s) => acc + s.currentScore, 0);
  
  // 2. Workload Allocation (Contracted Effort per Week)
  // Calculate how many points a user is "supposed" to get per week based on assignments
  const getAllocatedWeeklyPoints = (userId: string) => {
    return tasks
      .filter(t => t.assignedTo === userId)
      .reduce((acc, t) => {
         const points = getPointsForEffort(t.effort);
         const frequencyPerWeek = 7 / t.frequencyDays;
         return acc + (points * frequencyPerWeek);
      }, 0);
  };

  const workload = users.map(u => ({
    ...u,
    weeklyPoints: Math.round(getAllocatedWeeklyPoints(u.id))
  }));
  const totalWorkload = workload.reduce((acc, w) => acc + w.weeklyPoints, 0);


  return (
    <div className="px-6 py-6 pb-32 animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-white mb-2">Performance Center</h2>

      {/* Monthly Score Card */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5 relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-primary" size={20} />
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Monthly Output</h3>
        </div>

        <div className="flex justify-between items-end mb-4">
             {scores.map(user => (
                 <div key={user.id} className="text-center flex-1">
                     <div className="text-3xl font-bold text-white mb-1">{user.currentScore}</div>
                     <div className="text-xs text-textMuted font-medium">{user.name}</div>
                 </div>
             ))}
        </div>

        {/* Visual Balance Bar */}
        <div className="h-2 bg-black/40 rounded-full flex overflow-hidden">
            {scores.map((user, idx) => {
                const pct = totalScore === 0 ? 50 : (user.currentScore / totalScore) * 100;
                return (
                    <div 
                        key={user.id} 
                        style={{ width: `${pct}%` }}
                        className={`h-full ${idx === 0 ? 'bg-primary' : 'bg-accent'}`}
                    />
                );
            })}
        </div>
      </div>

      {/* Allocation/Fairness Card */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <div className="flex items-center space-x-2 mb-6">
            <Scale className="text-purple-400" size={20} />
            <h3 className="text-sm font-bold text-textMuted uppercase tracking-wider">Workload Fairness</h3>
        </div>
        
        <p className="text-xs text-textMuted mb-4">
            Based on current task assignments, here is the expected weekly effort for each person.
        </p>

        <div className="space-y-4">
            {workload.map(user => {
                const pct = totalWorkload === 0 ? 0 : (user.weeklyPoints / totalWorkload) * 100;
                return (
                    <div key={user.id}>
                        <div className="flex justify-between text-xs mb-1 text-textMain">
                            <span>{user.name}</span>
                            <span className="font-mono">{user.weeklyPoints} pts/wk</span>
                        </div>
                        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                             <div 
                                style={{ width: `${pct}%` }}
                                className={`h-full ${user.id === 'user-a' ? 'bg-primary' : 'bg-accent'}`}
                             />
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

      {/* Completion Rate / Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center space-y-2">
             <div className="text-3xl font-bold text-white">{logs.length}</div>
             <div className="text-xs text-textMuted text-center">Tasks Done Total</div>
          </div>
          <div className="bg-surface rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center space-y-2">
             <div className="text-3xl font-bold text-white">{tasks.length}</div>
             <div className="text-xs text-textMuted text-center">Active Tasks</div>
          </div>
      </div>
    </div>
  );
};

export default StatsView;