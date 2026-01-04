import React, { useState, useEffect } from 'react';
import { loadState, saveState } from './services/storageService';
import { AppState, Task, User, Area } from './types';
import TaskCard from './components/TaskCard';
import CompleteTaskModal from './components/CompleteTaskModal';
import Navigation from './components/Navigation';
import ImageGenerator from './components/ImageGenerator';
import StatsView from './components/StatsView';
import HistoryView from './components/HistoryView';
import ManageView from './components/ManageView';
import TaskForm from './components/TaskForm';
import { Zap, UserCircle, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(loadState());
  const [view, setView] = useState<'dashboard' | 'stats' | 'history' | 'manage' | 'generator'>('dashboard');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleConfirmCompletion = (userId: string) => {
    if (!selectedTask) return;

    const points = selectedTask.effort === 1 ? 1 : selectedTask.effort === 2 ? 3 : 5;
    
    // Create new log
    const newLog = {
      id: Date.now().toString(),
      taskId: selectedTask.id,
      taskName: selectedTask.name,
      userId,
      timestamp: Date.now(),
      points
    };

    // Update task lastCompleted
    const updatedTasks = state.tasks.map(t => 
      t.id === selectedTask.id ? { ...t, lastCompleted: Date.now() } : t
    );

    setState(prev => ({
      ...prev,
      tasks: updatedTasks,
      logs: [...prev.logs, newLog]
    }));

    setSelectedTask(null);
  };

  const handleCreateTask = (newTaskData: any, newAreaName?: string) => {
    let finalAreaId = newTaskData.areaId;

    // Handle new area creation
    if (newAreaName) {
        const newAreaId = `area-${Date.now()}`;
        const newArea: Area = {
            id: newAreaId,
            name: newAreaName
        };
        
        setState(prev => ({
            ...prev,
            areas: [...prev.areas, newArea]
        }));
        
        finalAreaId = newAreaId;
    }

    const newTask: Task = {
        id: `task-${Date.now()}`,
        lastCompleted: Date.now() - (newTaskData.frequencyDays * 86400 * 1000), // Set as due immediately-ish
        ...newTaskData,
        areaId: finalAreaId
    };
    
    setState(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask]
    }));
    setIsTaskFormOpen(false);
  };

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
      setState(prev => ({
          ...prev,
          users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u)
      }));
  };

  const handleDeleteArea = (areaId: string) => {
      // Safety check: ensure no tasks are using this area
      const hasTasks = state.tasks.some(t => t.areaId === areaId);
      if (hasTasks) {
          alert("Cannot delete zone containing active tasks.");
          return;
      }
      setState(prev => ({
          ...prev,
          areas: prev.areas.filter(a => a.id !== areaId)
      }));
  };

  const switchUser = () => {
      const nextUser = state.currentUser === 'user-a' ? 'user-b' : 'user-a';
      setState(prev => ({...prev, currentUser: nextUser}));
  };

  const currentUser = state.users.find(u => u.id === state.currentUser);

  // Filter Tasks
  const filteredTasks = state.tasks
    .filter(t => {
        if (filterMode === 'mine') {
            return t.assignedTo === state.currentUser || t.assignedTo === null;
        }
        return true;
    })
    .sort((a, b) => {
        // Sort by due date
        const aDue = a.lastCompleted + (a.frequencyDays * 86400 * 1000);
        const bDue = b.lastCompleted + (b.frequencyDays * 86400 * 1000);
        return aDue - bDue;
    });

  return (
    <div className="h-full w-full overflow-y-auto no-scrollbar bg-background">
      
      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen relative">
        
        {/* Header (Cockpit Style) */}
        <header className="pt-6 pb-4 px-6 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Zap className="text-primary" size={24} fill="currentColor" />
            <h1 className="text-xl font-black text-white tracking-tight uppercase">Chore<span className="text-primary">OS</span></h1>
          </div>
          
          {/* User Toggle */}
          <button 
            onClick={switchUser}
            className="flex items-center space-x-2 bg-surface px-3 py-1.5 rounded-full border border-white/10 active:bg-surfaceHighlight transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${currentUser?.id === 'user-a' ? 'bg-primary' : 'bg-accent'}`}></div>
            <span className="text-xs font-bold text-textMuted uppercase">{currentUser?.name}</span>
            <UserCircle size={16} className="text-textMuted" />
          </button>
        </header>

        {view === 'dashboard' && (
          <div className="px-6 py-4 pb-32 space-y-6 animate-fade-in">
            
            {/* Filter Tabs */}
            <div className="flex bg-surface rounded-lg p-1 border border-white/5">
                <button 
                    onClick={() => setFilterMode('all')}
                    className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filterMode === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-textMuted'}`}
                >
                    All Tasks
                </button>
                <button 
                    onClick={() => setFilterMode('mine')}
                    className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${filterMode === 'mine' ? 'bg-white/10 text-white shadow-sm' : 'text-textMuted'}`}
                >
                    My Tasks
                </button>
            </div>

            <section className="space-y-1">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  areaName={state.areas.find(a => a.id === task.areaId)?.name || 'Unknown'}
                  assignedUser={state.users.find(u => u.id === task.assignedTo)} 
                  onComplete={handleTaskClick} 
                />
              ))}
              {filteredTasks.length === 0 && (
                  <div className="py-20 text-center opacity-50">
                      <p className="text-textMuted">No tasks due.</p>
                      <button onClick={() => setIsTaskFormOpen(true)} className="mt-2 text-primary text-sm font-bold">Add One +</button>
                  </div>
              )}
            </section>
          </div>
        )}

        {view === 'stats' && (
            <StatsView users={state.users} logs={state.logs} tasks={state.tasks} />
        )}

        {view === 'history' && (
            <HistoryView logs={state.logs} users={state.users} />
        )}

        {view === 'manage' && (
           <ManageView 
              state={state} 
              onUpdateUser={handleUpdateUser} 
              onDeleteArea={handleDeleteArea}
           />
        )}

        {view === 'generator' && (
            <ImageGenerator />
        )}

      </main>

      {/* Modals */}
      <CompleteTaskModal 
        task={selectedTask}
        users={state.users}
        onConfirm={handleConfirmCompletion}
        onCancel={() => setSelectedTask(null)}
      />

      {isTaskFormOpen && (
          <TaskForm 
            areas={state.areas} 
            users={state.users}
            onSave={handleCreateTask}
            onCancel={() => setIsTaskFormOpen(false)} 
          />
      )}

      <Navigation 
        currentView={view} 
        setView={setView} 
        onAdd={() => setIsTaskFormOpen(true)}
      />
    </div>
  );
};

export default App;