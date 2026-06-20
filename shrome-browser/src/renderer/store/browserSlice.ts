import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { BrowserState, Tab, Bookmark, HistoryEntry, Download, BrowserSettings, TabGroup } from '../types';

const defaultSettings: BrowserSettings = {
  theme: 'system',
  searchEngine: 'google',
  homepage: 'https://www.google.com',
  newTabPage: 'shrome://newtab',
  enableAdBlocker: true,
  enableTrackingProtection: true,
  httpsOnlyMode: false,
  enableHardwareAcceleration: true,
  fontSize: 16,
  defaultZoomLevel: 100,
  autoPlayMedia: true,
  savePasswords: true,
  autofillForms: true,
  enableExtensions: true,
  syncEnabled: false,
};

const initialState: BrowserState = {
  tabs: [],
  activeTabId: null,
  tabGroups: [],
  bookmarks: [],
  bookmarkFolders: [],
  history: [],
  downloads: [],
  settings: defaultSettings,
  profiles: [{
    id: 'default',
    name: 'Default Profile',
    color: '#3584e4',
    isGuest: false,
    createdAt: Date.now(),
  }],
  activeProfileId: 'default',
  passwords: [],
  extensions: [],
  sidebar: {
    isOpen: false,
    activePanel: null,
  },
  aiAssistant: {
    isOpen: false,
    messages: [],
    isLoading: false,
  },
  splitView: {
    isActive: false,
    leftTabId: '',
    rightTabId: '',
    splitRatio: 0.5,
  },
  isIncognito: false,
};

const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    // Tab Management
    addTab: (state, action: PayloadAction<{ url?: string; title?: string; fromTabId?: string }>) => {
      const { url = 'shrome://newtab', title = 'New Tab', fromTabId } = action.payload;
      
      const newTab: Tab = {
        id: uuidv4(),
        title,
        url,
        isLoading: false,
        isPinned: false,
        history: [url],
        historyIndex: 0,
        canGoBack: false,
        canGoForward: false,
      };
      
      state.tabs.push(newTab);
      
      // Set as active tab
      state.activeTabId = newTab.id;
      
      // If opened from another tab, insert after it
      if (fromTabId) {
        const fromTabIndex = state.tabs.findIndex(t => t.id === fromTabId);
        if (fromTabIndex !== -1) {
          state.tabs.splice(fromTabIndex + 1, 0, newTab);
          state.tabs.pop(); // Remove the duplicate added at end
        }
      }
    },
    
    closeTab: (state, action: PayloadAction<string>) => {
      const tabId = action.payload;
      const tabIndex = state.tabs.findIndex(t => t.id === tabId);
      
      if (tabIndex === -1) return;
      
      // If closing active tab, switch to adjacent tab
      if (state.activeTabId === tabId) {
        if (state.tabs.length > 1) {
          const nextTabIndex = tabIndex < state.tabs.length - 1 ? tabIndex + 1 : tabIndex - 1;
          state.activeTabId = state.tabs[nextTabIndex].id;
        } else {
          state.activeTabId = null;
        }
      }
      
      state.tabs = state.tabs.filter(t => t.id !== tabId);
      
      // Remove from any tab groups
      state.tabGroups.forEach(group => {
        group.tabIds = group.tabIds.filter(id => id !== tabId);
      });
    },
    
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTabId = action.payload;
    },
    
    updateTab: (state, action: PayloadAction<{ id: string; updates: Partial<Tab> }>) => {
      const { id, updates } = action.payload;
      const tab = state.tabs.find(t => t.id === id);
      if (tab) {
        Object.assign(tab, updates);
      }
    },
    
    navigateTab: (state, action: PayloadAction<{ id: string; url: string }>) => {
      const { id, url } = action.payload;
      const tab = state.tabs.find(t => t.id === id);
      
      if (tab) {
        // Clear forward history when navigating to new URL
        tab.history = tab.history.slice(0, tab.historyIndex + 1);
        tab.history.push(url);
        tab.historyIndex = tab.history.length - 1;
        tab.url = url;
        tab.canGoBack = tab.historyIndex > 0;
        tab.canGoForward = false;
        tab.isLoading = true;
      }
    },
    
    tabLoaded: (state, action: PayloadAction<{ id: string; title?: string; favicon?: string }>) => {
      const { id, title, favicon } = action.payload;
      const tab = state.tabs.find(t => t.id === id);
      if (tab) {
        tab.isLoading = false;
        if (title) tab.title = title;
        if (favicon) tab.favicon = favicon;
        
        // Add to history
        const historyEntry: HistoryEntry = {
          id: uuidv4(),
          url: tab.url,
          title: tab.title,
          timestamp: Date.now(),
          visitCount: 1,
        };
        
        // Check if URL already exists in history
        const existingEntry = state.history.find(h => h.url === tab.url);
        if (existingEntry) {
          existingEntry.visitCount++;
          existingEntry.timestamp = Date.now();
        } else {
          state.history.unshift(historyEntry);
          // Limit history size
          if (state.history.length > 1000) {
            state.history = state.history.slice(0, 1000);
          }
        }
      }
    },
    
    goBack: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find(t => t.id === action.payload);
      if (tab && tab.canGoBack) {
        tab.historyIndex--;
        tab.url = tab.history[tab.historyIndex];
        tab.canGoBack = tab.historyIndex > 0;
        tab.canGoForward = tab.historyIndex < tab.history.length - 1;
        tab.isLoading = true;
      }
    },
    
    goForward: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find(t => t.id === action.payload);
      if (tab && tab.canGoForward) {
        tab.historyIndex++;
        tab.url = tab.history[tab.historyIndex];
        tab.canGoBack = tab.historyIndex > 0;
        tab.canGoForward = tab.historyIndex < tab.history.length - 1;
        tab.isLoading = true;
      }
    },
    
    reloadTab: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find(t => t.id === action.payload);
      if (tab) {
        tab.isLoading = true;
      }
    },
    
    pinTab: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find(t => t.id === action.payload);
      if (tab) {
        tab.isPinned = !tab.isPinned;
      }
    },
    
    // Tab Groups
    createTabGroup: (state, action: PayloadAction<{ name: string; color: string; tabIds: string[] }>) => {
      const newGroup: TabGroup = {
        id: uuidv4(),
        name: action.payload.name,
        color: action.payload.color,
        tabIds: action.payload.tabIds,
        isExpanded: true,
      };
      state.tabGroups.push(newGroup);
      
      // Update tabs with group ID
      action.payload.tabIds.forEach(tabId => {
        const tab = state.tabs.find(t => t.id === tabId);
        if (tab) {
          tab.groupId = newGroup.id;
        }
      });
    },
    
    deleteTabGroup: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      const group = state.tabGroups.find(g => g.id === groupId);
      
      if (group) {
        // Remove group ID from tabs
        group.tabIds.forEach(tabId => {
          const tab = state.tabs.find(t => t.id === tabId);
          if (tab) {
            tab.groupId = undefined;
          }
        });
        
        state.tabGroups = state.tabGroups.filter(g => g.id !== groupId);
      }
    },
    
    // Bookmarks
    addBookmark: (state, action: PayloadAction<Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newBookmark: Bookmark = {
        ...action.payload,
        id: uuidv4(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      state.bookmarks.push(newBookmark);
    },
    
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(b => b.id !== action.payload);
    },
    
    updateBookmark: (state, action: PayloadAction<{ id: string; updates: Partial<Bookmark> }>) => {
      const { id, updates } = action.payload;
      const bookmark = state.bookmarks.find(b => b.id === id);
      if (bookmark) {
        Object.assign(bookmark, updates);
        bookmark.updatedAt = Date.now();
      }
    },
    
    // Downloads
    addDownload: (state, action: PayloadAction<Omit<Download, 'id'>>) => {
      const newDownload: Download = {
        ...action.payload,
        id: uuidv4(),
      };
      state.downloads.push(newDownload);
    },
    
    updateDownload: (state, action: PayloadAction<{ id: string; updates: Partial<Download> }>) => {
      const { id, updates } = action.payload;
      const download = state.downloads.find(d => d.id === id);
      if (download) {
        Object.assign(download, updates);
      }
    },
    
    removeDownload: (state, action: PayloadAction<string>) => {
      state.downloads = state.downloads.filter(d => d.id !== action.payload);
    },
    
    // Settings
    updateSettings: (state, action: PayloadAction<Partial<BrowserSettings>>) => {
      Object.assign(state.settings, action.payload);
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    
    setSidebarPanel: (state, action: PayloadAction<'bookmarks' | 'history' | 'downloads' | 'extensions' | null>) => {
      state.sidebar.activePanel = action.payload;
      if (action.payload !== null) {
        state.sidebar.isOpen = true;
      }
    },
    
    // AI Assistant
    toggleAIAssistant: (state) => {
      state.aiAssistant.isOpen = !state.aiAssistant.isOpen;
    },
    
    addAIMessage: (state, action: PayloadAction<{ role: 'user' | 'assistant' | 'system'; content: string }>) => {
      state.aiAssistant.messages.push({
        id: uuidv4(),
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    
    setAILoading: (state, action: PayloadAction<boolean>) => {
      state.aiAssistant.isLoading = action.payload;
    },
    
    // Split View
    toggleSplitView: (state, action: PayloadAction<{ leftTabId: string; rightTabId: string }>) => {
      if (state.splitView.isActive) {
        state.splitView.isActive = false;
      } else {
        state.splitView = {
          isActive: true,
          leftTabId: action.payload.leftTabId,
          rightTabId: action.payload.rightTabId,
          splitRatio: 0.5,
        };
      }
    },
    
    // Incognito Mode
    setIncognitoMode: (state, action: PayloadAction<boolean>) => {
      state.isIncognito = action.payload;
    },
    
    // Clear browsing data
    clearHistory: (state) => {
      state.history = [];
    },
    
    clearDownloads: (state) => {
      state.downloads = state.downloads.filter(d => d.state === 'downloading');
    },
  },
});

export const {
  addTab,
  closeTab,
  setActiveTab,
  updateTab,
  navigateTab,
  tabLoaded,
  goBack,
  goForward,
  reloadTab,
  pinTab,
  createTabGroup,
  deleteTabGroup,
  addBookmark,
  removeBookmark,
  updateBookmark,
  addDownload,
  updateDownload,
  removeDownload,
  updateSettings,
  toggleSidebar,
  setSidebarPanel,
  toggleAIAssistant,
  addAIMessage,
  setAILoading,
  toggleSplitView,
  setIncognitoMode,
  clearHistory,
  clearDownloads,
} = browserSlice.actions;

export default browserSlice.reducer;
