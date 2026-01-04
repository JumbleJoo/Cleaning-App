import React, { useState } from 'react';
import { Task, Area, User, EffortLevel } from '../types';
import { X, Check, Plus } from 'lucide-react';

interface TaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'lastCompleted'>, newAreaName?: string) => void;
  onCancel: () => void;
  areas: Area[];
  users: User[];
  initialData?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, areas, users, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  
  // Area State
  const [areaId, setAreaId] = useState(initialData?.areaId || (areas.length > 0 ? areas[0].id : ''));
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [customAreaName, setCustomAreaName] = useState('');

  const [frequency, setFrequency] = useState(initialData?.frequencyDays || 7);
  const [effort, setEffort] = useState<EffortLevel>(initialData?.effort || 1);
  const [assignedTo, setAssignedTo] = useState<string | null>(initialData?.assignedTo || null);

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    // Validate custom area
    if (isCustomArea && !customAreaName.trim()) return;

    onSave({
      name,
      areaId: isCustomArea ? 'NEW_AREA_PLACEHOLDER' : areaId,
      frequencyDays: frequency,
      effort,
      assignedTo,
    }, isCustomArea ? customAreaName : undefined);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
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
                    autoFocus
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-textMuted/30"
                />
            </div>

            {/* Area Selection - Dropdown + Custom */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Zone / Area</label>
                
                {!isCustomArea ? (
                    <div className="relative">
                        <select
                            value={areaId}
                            onChange={(e) => {
                                if (e.target.value === 'CUSTOM_NEW') {
                                    setIsCustomArea(true);
                                } else {
                                    setAreaId(e.target.value);
                                }
                            }}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-primary"
                        >
                            {areas.map(area => (
                                <option key={area.id} value={area.id} className="bg-surface text-white">
                                    {area.name}
                                </option>
                            ))}
                            <option value="CUSTOM_NEW" className="bg-surface text-primary font-bold">
                                + Create New Zone...
                            </option>
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-textMuted">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 animate-fade-in">
                        <input 
                            type="text" 
                            value={customAreaName}
                            onChange={(e) => setCustomAreaName(e.target.value)}
                            placeholder="Name of new zone..."
                            className="flex-1 bg-black/20 border border-primary rounded-lg p-3 text-white focus:outline-none"
                        />
                        <button 
                            onClick={() => setIsCustomArea(false)}
                            className="p-3 bg-white/5 rounded-lg text-textMuted hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Frequency */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted flex justify-between">
                    <span>Frequency</span>
                    <span className="text-primary font-mono">{frequency} days</span>
                </label>
                <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                    <input 
                        type="range" 
                        min="1" 
                        max="60" 
                        value={frequency}
                        onChange={(e) => setFrequency(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-textMuted mt-1 px-1">
                        <span>Daily</span>
                        <span>Weekly</span>
                        <span>Monthly</span>
                    </div>
                </div>
            </div>

            {/* Effort */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Effort Level</label>
                <div className="flex space-x-3">
                    {[1, 2, 3].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setEffort(lvl as EffortLevel)}
                            className={`flex-1 p-3 rounded-lg border flex flex-col items-center justify-center transition-all
                                ${effort === lvl 
                                    ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' 
                                    : 'bg-transparent border-white/10 text-textMuted hover:bg-white/5'}`}
                        >
                            <span className="text-lg mb-1">{Array(lvl).fill('⚡').join('')}</span>
                            <span className="text-[10px] uppercase font-bold">
                                {lvl === 1 ? 'Easy' : lvl === 2 ? 'Medium' : 'Hard'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Assigned To */}
            <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-textMuted">Assign To</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setAssignedTo(null)}
                        className={`p-3 rounded-lg border text-xs font-bold transition-all truncate
                            ${assignedTo === null
                                ? 'bg-white/10 border-white text-white' 
                                : 'bg-transparent border-white/10 text-textMuted hover:bg-white/5'}`}
                    >
                        Unassigned
                    </button>
                    {users.map(u => (
                         <button
                            key={u.id}
                            onClick={() => setAssignedTo(u.id)}
                            className={`p-3 rounded-lg border text-xs font-bold transition-all truncate
                                ${assignedTo === u.id
                                    ? `bg-${u.color.split('-')[0]}-500/20 border-${u.color.split('-')[0]}-500 text-${u.color.split('-')[0]}-500` 
                                    : 'bg-transparent border-white/10 text-textMuted hover:bg-white/5'}`}
                        >
                            {u.name}
                        </button>
                    ))}
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 flex space-x-4 bg-surfaceHighlight/10">
            <button onClick={handleSubmit} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center group">
                <Check size={20} className="mr-2 group-hover:scale-110 transition-transform" /> 
                {initialData ? 'Save Changes' : 'Create Task'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;