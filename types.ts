export type EffortLevel = 1 | 2 | 3; // 1 = Easy, 2 = Medium, 3 = Hard

export interface Task {
  id: string;
  name: string;
  areaId: string;
  frequencyDays: number;
  effort: EffortLevel;
  lastCompleted: number; // Timestamp
  assignedTo: string | null; // User ID
  description?: string;
  icon?: string; // Optional custom icon/image
}

export interface Area {
  id: string;
  name: string;
  image?: string; // Base64 image
}

export interface User {
  id: string;
  name: string;
  color: string; // Tailwind color class suffix (e.g., 'sky-500')
  avatar?: string; // Initials or emoji
}

export interface Log {
  id: string;
  taskId: string;
  userId: string;
  timestamp: number;
  points: number;
  taskName: string; // Snapshot of name
}

export interface AppState {
  tasks: Task[];
  areas: Area[];
  users: User[];
  logs: Log[];
  currentUser: string; // ID of the user currently viewing the app
}

export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";

// Augment window for AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}