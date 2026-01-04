import React from 'react';
import { Home, BarChart2, List, PlusCircle, Clock } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'stats' | 'history' | 'manage' | 'generator';
  setView: (view: 'dashboard' | 'stats' | 'history' | 'manage' | 'generator') => void;
  onAdd: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, onAdd }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-white/5 pb-safe pt-2 px-1 h-20 flex justify-between items-start z-50">
      <button
        onClick={() => setView('dashboard')}
        className={`flex flex-col items-center justify-center w-12 sm:w-14 space-y-1.5 ${currentView === 'dashboard' ? 'text-primary' : 'text-textMuted'}`}
      >
        <Home size={22} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
        <span className="text-[10px] font-medium tracking-wide">Home</span>
      </button>
      
      <button
        onClick={() => setView('stats')}
        className={`flex flex-col items-center justify-center w-12 sm:w-14 space-y-1.5 ${currentView === 'stats' ? 'text-primary' : 'text-textMuted'}`}
      >
        <BarChart2 size={22} strokeWidth={currentView === 'stats' ? 2.5 : 2} />
        <span className="text-[10px] font-medium tracking-wide">Stats</span>
      </button>

      {/* Floating Action Button for Add - Centered (Item 3 of 5) */}
      <div className="-mt-6 mx-1">
          <button 
            onClick={onAdd}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
              <PlusCircle size={28} />
          </button>
      </div>

      <button
        onClick={() => setView('history')}
        className={`flex flex-col items-center justify-center w-12 sm:w-14 space-y-1.5 ${currentView === 'history' ? 'text-primary' : 'text-textMuted'}`}
      >
        <Clock size={22} strokeWidth={currentView === 'history' ? 2.5 : 2} />
        <span className="text-[10px] font-medium tracking-wide">History</span>
      </button>

      <button
        onClick={() => setView('manage')}
        className={`flex flex-col items-center justify-center w-12 sm:w-14 space-y-1.5 ${currentView === 'manage' ? 'text-primary' : 'text-textMuted'}`}
      >
        <List size={22} strokeWidth={currentView === 'manage' ? 2.5 : 2} />
        <span className="text-[10px] font-medium tracking-wide">Manage</span>
      </button>
    </nav>
  );
};

export default Navigation;