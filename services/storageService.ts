import { AppState, Task, Area, User, Log } from '../types';

const STORAGE_KEY = 'chore_harmony_v2_tesla';

const INITIAL_AREAS: Area[] = [
  { id: 'area-kitchen', name: 'Kitchen' },
  { id: 'area-bathroom', name: 'Bathroom' },
  { id: 'area-living', name: 'Living Room' },
  { id: 'area-outside', name: 'Outside' },
];

const INITIAL_USERS: User[] = [
  { id: 'user-a', name: 'Alex', color: 'sky-500', avatar: 'A' },
  { id: 'user-b', name: 'Sam', color: 'emerald-500', avatar: 'S' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    name: 'Wipe Counters',
    areaId: 'area-kitchen',
    frequencyDays: 1, 
    effort: 1, 
    lastCompleted: Date.now() - 86400000 * 2,
    assignedTo: 'user-a',
    description: 'Use the disinfectant spray.'
  },
  {
    id: 'task-2',
    name: 'Scrub Shower',
    areaId: 'area-bathroom',
    frequencyDays: 7, 
    effort: 3, 
    lastCompleted: Date.now() - 86400000 * 8,
    assignedTo: 'user-b',
    description: 'Don\'t forget the glass door.'
  },
  {
    id: 'task-3',
    name: 'Empty Trash',
    areaId: 'area-kitchen',
    frequencyDays: 3,
    effort: 1,
    lastCompleted: Date.now(),
    assignedTo: 'user-a'
  },
  {
    id: 'task-4',
    name: 'Vacuum Rugs',
    areaId: 'area-living',
    frequencyDays: 5,
    effort: 2,
    lastCompleted: Date.now() - 86400000 * 3,
    assignedTo: null // Shared task
  },
  {
    id: 'task-5',
    name: 'Mow Lawn',
    areaId: 'area-outside',
    frequencyDays: 14,
    effort: 3,
    lastCompleted: Date.now() - 86400000 * 10,
    assignedTo: 'user-b'
  }
];

const getInitialState = (): AppState => {
  return {
    areas: INITIAL_AREAS,
    tasks: INITIAL_TASKS,
    users: INITIAL_USERS,
    logs: [],
    currentUser: 'user-a',
  };
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      const initial = getInitialState();
      saveState(initial);
      return initial;
    }
    const parsed = JSON.parse(serialized);
    // Migration check: if currentUser is missing
    if (!parsed.currentUser) {
      parsed.currentUser = 'user-a';
      parsed.users = INITIAL_USERS; // Reset users to ensure format
    }
    return parsed;
  } catch (e) {
    console.error("Failed to load state", e);
    return getInitialState();
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const calculatePoints = (logs: Log[], userId: string, since: number): number => {
  return logs
    .filter(l => l.userId === userId && l.timestamp >= since)
    .reduce((acc, curr) => acc + curr.points, 0);
};

export const getPointsForEffort = (effort: 1 | 2 | 3): number => {
  switch(effort) {
    case 1: return 1;
    case 2: return 3;
    case 3: return 5;
    default: return 1;
  }
};
