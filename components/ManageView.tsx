import React, { useState } from 'react';
import { User, Area, AppState } from '../types';
import { Trash2, Edit2, Save, X, Check } from 'lucide-react';

interface ManageViewProps {
  state: AppState;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteArea: (areaId: string) => void;
}

const COLORS = [
  { label: 'Sky', value: 'sky-500', bg: 'bg-sky-500' },
  { label: 'Emerald', value: 'emerald-500', bg: 'bg-emerald-500' },
  { label: 'Rose', value: 'rose-500', bg: 'bg-rose-500' },
  { label: 'Amber', value: 'amber-500', bg: 'bg-amber-500' },
  { label: 'Violet', value: 'violet-500', bg: 'bg-violet-500' },
];

const ManageView: React.FC<ManageViewProps> = ({ state, onUpdateUser, onDeleteArea }) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const startEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditColor(user.color);
  };

  const saveUser = () => {
    if (editingUserId && editName.trim()) {
      onUpdateUser(editingUserId, { name: editName, color: editColor });
      setEditingUserId(null);
    }
  };

  return (
    <div className="px-6 py-6 pb-32 animate-fade-in space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <p className="text-sm text-textMuted">Configure profiles and zones.</p>
      </div>

      {/* Profiles Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Crew Profiles</h3>
        
        <div className="space-y-3">
          {state.users.map(user => {
            const isEditing = editingUserId === user.id;

            return (
              <div key={user.id} className="bg-surface border border-white/5 rounded-xl p-4 transition-all">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-textMuted">Editing {user.name}</span>
                       <button onClick={() => setEditingUserId(null)} className="text-textMuted hover:text-white"><X size={16}/></button>
                    </div>
                    
                    {/* Name Input */}
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-textMuted">Display Name</label>
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase text-textMuted">Theme Color</label>
                        <div className="flex space-x-3">
                            {COLORS.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setEditColor(c.value)}
                                    className={`w-8 h-8 rounded-full ${c.bg} border-2 transition-transform ${editColor === c.value ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={saveUser}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                    >
                        <Save size={18} />
                        <span>Save Changes</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <div className={`w-10 h-10 rounded-full bg-${user.color.split('-')[0]}-500/20 text-${user.color.split('-')[0]}-500 flex items-center justify-center font-bold border border-${user.color.split('-')[0]}-500/50`}>
                           {user.name.charAt(0)}
                       </div>
                       <div>
                           <h4 className="text-white font-bold">{user.name}</h4>
                           <p className="text-xs text-textMuted">Player {user.id === 'user-a' ? 'A' : 'B'}</p>
                       </div>
                    </div>
                    <button 
                        onClick={() => startEdit(user)}
                        className="p-2 bg-white/5 rounded-full text-textMuted hover:text-white active:scale-95"
                    >
                        <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Areas Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Zones (Areas)</h3>
        
        <div className="grid grid-cols-1 gap-3">
           {state.areas.map(area => {
               const taskCount = state.tasks.filter(t => t.areaId === area.id).length;
               return (
                   <div key={area.id} className="flex items-center justify-between bg-surface border border-white/5 rounded-xl p-3 px-4">
                       <div className="flex items-center space-x-3">
                            <div className="text-lg">
                                {area.id.includes('kitchen') ? '🍳' : area.id.includes('bath') ? '🛁' : area.id.includes('outside') ? '🌳' : area.id.includes('living') ? '🛋️' : '🏠'}
                            </div>
                            <span className="text-sm font-medium text-white">{area.name}</span>
                       </div>
                       {taskCount === 0 && (
                           <button 
                                onClick={() => onDeleteArea(area.id)}
                                className="text-danger opacity-50 hover:opacity-100 p-2"
                            >
                               <Trash2 size={16} />
                           </button>
                       )}
                       {taskCount > 0 && (
                           <span className="text-xs text-textMuted">{taskCount} active</span>
                       )}
                   </div>
               )
           })}
        </div>
        <p className="text-xs text-textMuted text-center pt-2">
            Create new zones when adding tasks. Zones with 0 tasks can be deleted.
        </p>
      </section>

    </div>
  );
};

export default ManageView;