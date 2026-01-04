import React from 'react';
import { Task, User } from '../types';
import { Calendar, User as UserIcon, AlertCircle } from 'lucide-react';
import { getPointsForEffort } from '../services/storageService';

interface TaskCardProps {
  task: Task;
  onComplete: (task: Task) => void;
  areaName: string;
  assignedUser?: User;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, areaName, assignedUser }) => {
  const points = getPointsForEffort(task.effort);
  const now = Date.now();
  const dueDate = task.lastCompleted + (task.frequencyDays * 86400 * 1000);
  const totalDuration = task.frequencyDays * 86400 * 1000;
  const elapsed = now - task.lastCompleted;
  
  const isOverdue = now > dueDate;
  const daysOverdue = Math.floor((now - dueDate) / (86400 * 1000));
  
  // Progress Calculation
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  // Dynamic Colors
  let statusColor = "bg-primary"; // Default Blue
  if (progressPercent > 75) statusColor = "bg-yellow-500";
  if (isOverdue) statusColor = "bg-danger";

  return (
    <div 
      onClick={() => onComplete(task)}
      className="relative w-full bg-surface rounded-xl p-4 mb-3 border border-white/5 active:bg-surfaceHighlight transition-colors duration-200"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-2 mb-1">
             <span className="text-[10px] uppercase font-bold text-textMuted tracking-wider">{areaName}</span>
             {assignedUser && (
                 <div className="flex items-center space-x-1 bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-textMuted">
                    <UserIcon size={8} />
                    <span>{assignedUser.name}</span>
                 </div>
             )}
          </div>
          <h3 className="text-base font-semibold text-textMain leading-tight">{task.name}</h3>
        </div>
        
        <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-white">{points}<span className="text-xs font-normal text-textMuted ml-0.5">pts</span></span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
         <div className="flex items-center text-xs text-textMuted">
            {isOverdue ? (
                <span className="text-danger flex items-center font-medium">
                    <AlertCircle size={12} className="mr-1" />
                    {daysOverdue > 0 ? `${daysOverdue}d Late` : 'Due Now'}
                </span>
            ) : (
                <span className="flex items-center">
                    <Calendar size={12} className="mr-1 opacity-70" />
                    Due in {Math.ceil((dueDate - now) / (86400 * 1000))}d
                </span>
            )}
         </div>
      </div>

      {/* Progress Bar Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 overflow-hidden rounded-b-xl">
         <div 
            className={`h-full ${statusColor} transition-all duration-500`} 
            style={{ width: `${progressPercent}%` }}
         />
      </div>

       {/* Optional Icon Overlay */}
      {task.icon && (
         <img src={task.icon} alt="" className="absolute right-0 bottom-0 w-20 h-20 opacity-5 mix-blend-overlay pointer-events-none" />
      )}
    </div>
  );
};

export default TaskCard;