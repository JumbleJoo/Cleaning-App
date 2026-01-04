import React, { useState } from 'react';
import { Task, Area, User, EffortLevel } from '../types';
import { X, Check } from 'lucide-react';

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'lastCompleted'>) => void;
  onCancel: () => void;
  areas: Area[];
  users: User[];
  initialData?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, areas, users, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [areaId, setAreaId] = useState(initialData?.areaId || areas[0]?.id || '');
  const [frequency, setFrequency] = useState(initialData?.frequencyDays || 7);
  const [effort, setEffort] = useState<EffortLevel>(initialData?.effort || 1);
  const [assignedTo, setAssignedTo] = useState<string | null>(initialData?.assignedTo || null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name,
      areaId,
      frequencyDays: frequency,
      effort,
      assignedTo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-surfaceHighlight/30">
          <h3 className="text-lg font-bold text-white">{initialData ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onCancel} className="p-2 text-textMuted hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            
            {/* Name */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Task Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Water Plants"
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Area */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Area</label>
                <div className="grid grid-cols-2 gap-2">
                    {areas.map(area => (
                        <button
                            key={area.id}
                            onClick={() => setAreaId(area.id)}
                            className={`p-2 rounded-lg text-sm font-medium border transition-all
                                ${areaId === area.id 
                                    ? 'bg-primary/20 border-primary text-primary' 
                                    : 'bg-transparent border-white/10 text-textMuted hover:bg-white/5'}`}
                        >
                            {area.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted flex justify-between">
                    <span>Frequency</span>
                    <span className="text-primary">Every {frequency} days</span>
                </label>
                <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={frequency}
                    onChange={(e) => setFrequency(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            {/* Effort */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Effort Level</label>
                <div className="flex space-x-4">
                    {[1, 2, 3].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setEffort(lvl as EffortLevel)}
                            className={`flex-1 p-3 rounded-lg border flex justify-center transition-all
                                ${effort === lvl 
                                    ? 'bg-primary/20 border-primary text-primary' 
                                    : 'bg-transparent border-white/10 text-textMuted'}`}
                        >
                            {Array(lvl).fill('⚡').join('')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Assign To</label>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setAssignedTo(null)}
                        className={`flex-1 p-3 rounded-lg border text-sm transition-all
                            ${assignedTo === null
                                ? 'bg-white/10 border-white text-white' 
                                : 'bg-transparent border-white/10 text-textMuted'}`}
                    >
                        Anyone
                    </button>
                    {users.map(u => (
                         <button
                            key={u.id}
                            onClick={() => setAssignedTo(u.id)}
                            className={`flex-1 p-3 rounded-lg border text-sm transition-all
                                ${assignedTo === u.id
                                    ? `bg-${u.color.split('-')[0]}-500/20 border-${u.color.split('-')[0]}-500 text-${u.color.split('-')[0]}-500` 
                                    : 'bg-transparent border-white/10 text-textMuted'}`}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 flex space-x-4">
            <button onClick={onSave.bind(null, {name, areaId, frequencyDays: frequency, effort, assignedTo})} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center">
                <Check size={20} className="mr-2" /> Save Task
            </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;