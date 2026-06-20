// Browser Tab Types
export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  isPinned: boolean;
  groupId?: string;
  history: string[];
  historyIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

// Tab Group Types
export interface TabGroup {
  id: string;
  name: string;
  color: string;
  tabIds: string[];
  isExpanded: boolean;
}

// Bookmark Types
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folderId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
  children: (Bookmark | BookmarkFolder)[];
}

// History Types
export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  visitCount: number;
}

// Download Types
export interface Download {
  id: string;
  filename: string;
  url: string;
  path: string;
  state: 'pending' | 'downloading' | 'completed' | 'cancelled' | 'failed';
  progress: number;
  totalBytes: number;
  receivedBytes: number;
  startTime: number;
  endTime?: number;
  mimeType: string;
}

// Settings Types
export interface BrowserSettings {
  theme: 'light' | 'dark' | 'system';
  searchEngine: SearchEngine;
  homepage: string;
  newTabPage: string;
  enableAdBlocker: boolean;
  enableTrackingProtection: boolean;
  httpsOnlyMode: boolean;
  enableHardwareAcceleration: boolean;
  fontSize: number;
  defaultZoomLevel: number;
  autoPlayMedia: boolean;
  savePasswords: boolean;
  autofillForms: boolean;
  enableExtensions: boolean;
  syncEnabled: boolean;
  syncServer?: string;
}

export type SearchEngine = 'google' | 'duckduckgo' | 'bing' | 'custom';

export interface SearchEngineConfig {
  name: string;
  url: string;
  searchUrl: string;
  icon?: string;
}

// Profile Types
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isGuest: boolean;
  createdAt: number;
}

// Password Manager Types
export interface SavedPassword {
  id: string;
  url: string;
  username: string;
  password: string; // Encrypted
  createdAt: number;
  updatedAt: number;
  lastUsed?: number;
}

// Extension Types
export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  isEnabled: boolean;
  permissions: string[];
  icon?: string;
  optionsPage?: string;
}

// Window State
export interface WindowState {
  id: number;
  isMaximized: boolean;
  isFullScreen: boolean;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Session Types
export interface SessionData {
  tabs: Tab[];
  activeTabId: string;
  windows: WindowState[];
  timestamp: number;
}

// AI Assistant Types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIAssistantState {
  isOpen: boolean;
  messages: AIMessage[];
  isLoading: boolean;
}

// Split Screen Types
export interface SplitView {
  isActive: boolean;
  leftTabId: string;
  rightTabId: string;
  splitRatio: number; // 0-1, where 0.5 is equal split
}

// Browser State (Root)
export interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  tabGroups: TabGroup[];
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  history: HistoryEntry[];
  downloads: Download[];
  settings: BrowserSettings;
  profiles: UserProfile[];
  activeProfileId: string;
  passwords: SavedPassword[];
  extensions: Extension[];
  sidebar: {
    isOpen: boolean;
    activePanel: 'bookmarks' | 'history' | 'downloads' | 'extensions' | null;
  };
  aiAssistant: AIAssistantState;
  splitView: SplitView;
  isIncognito: boolean;
}
