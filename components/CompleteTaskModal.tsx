import React from 'react';
import { User, Task } from '../types';
import { X } from 'lucide-react';
import { getPointsForEffort } from '../services/storageService';

interface CompleteTaskModalProps {
  task: Task | null;
  users: User[];
  onConfirm: (userId: string) => void;
  onCancel: () => void;
}

const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({ task, users, onConfirm, onCancel }) => {
  if (!task) return null;

  const points = getPointsForEffort(task.effort);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
              <h3 className="text-xl font-bold text-slate-800">Who did it?</h3>
              <p className="text-sm text-slate-500">Completing: <span className="font-semibold text-teal-600">{task.name}</span></p>
          </div>
          <button onClick={onCancel} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => onConfirm(user.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all active:scale-95
                ${user.id === 'user-a' 
                  ? 'border-teal-100 bg-teal-50 text-teal-700 hover:border-teal-300' 
                  : 'border-orange-100 bg-orange-50 text-orange-700 hover:border-orange-300'
                }`}
            >
              <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center text-xl font-bold text-white
                ${user.id === 'user-a' ? 'bg-teal-400' : 'bg-orange-400'}`}>
                {user.name.charAt(0)}
              </div>
              <span className="font-bold">{user.name}</span>
              <span className="text-xs opacity-70 mt-1">+{points} pts</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteTaskModal;