import React from 'react';
import { Log, User } from '../types';
import { Clock } from 'lucide-react';

interface HistoryViewProps {
  logs: Log[];
  users: User[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, users }) => {
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';
  const getUserColor = (id: string) => users.find(u => u.id === id)?.color || 'text-textMuted';

  return (
    <div className="px-6 py-6 pb-32 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
            <Clock className="text-primary" />
            <h2 className="text-2xl font-bold text-white">History</h2>
        </div>

        {sortedLogs.length === 0 ? (
            <div className="text-center text-textMuted py-10">
                <p>No chores completed yet.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {sortedLogs.map(log => {
                    const date = new Date(log.timestamp);
                    const user = users.find(u => u.id === log.userId);
                    
                    return (
                        <div key={log.id} className="bg-surface p-4 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-medium">{log.taskName || 'Unnamed Task'}</h4>
                                <p className="text-xs text-textMuted">
                                    {date.toLocaleDateString()} at {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-bold bg-white/5 px-2 py-1 rounded text-${user?.color.split('-')[0]}-400`}>
                                    {user?.name}
                                </div>
                                <div className="text-xs text-textMuted mt-1">+{log.points} pts</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
  );
};

export default HistoryView;