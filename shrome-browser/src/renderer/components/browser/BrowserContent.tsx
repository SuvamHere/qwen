import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const BrowserContent: React.FC = () => {
  const { tabs, activeTabId } = useSelector((state: RootState) => state.browser);
  const activeTab = tabs.find(t => t.id === activeTabId);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-primary">
        <div className="text-center text-text-secondary">
          <p className="text-lg">No tab selected</p>
          <p className="text-sm mt-2">Press Ctrl+T to open a new tab</p>
        </div>
      </div>
    );
  }

  // Handle internal Shrome pages
  if (activeTab.url.startsWith('shrome://')) {
    return (
      <div className="flex-1 bg-bg-primary overflow-auto">
        {activeTab.url === 'shrome://newtab' && <NewTabPage />}
        {activeTab.url === 'shrome://settings' && <SettingsPage />}
        {activeTab.url === 'shrome://bookmarks' && <BookmarksPage />}
        {activeTab.url === 'shrome://history' && <HistoryPage />}
      </div>
    );
  }

  // WebView for external URLs - will be implemented with electron webview
  return (
    <div className="flex-1 bg-white relative">
      {/* Loading indicator */}
      {activeTab.isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-200 overflow-hidden">
          <div className="h-full bg-gnome-blue animate-pulse w-1/3" />
        </div>
      )}
      
      {/* WebView placeholder - will be replaced with actual Electron webview */}
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gnome-blue/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-gnome-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">WebView Integration</h2>
          <p className="text-gray-500 max-w-md">
            The browser will load external URLs using Electron's webview component.
            This is a placeholder for the MVP version.
          </p>
          <p className="text-sm text-gray-400 mt-4">Current URL: {activeTab.url}</p>
        </div>
      </div>
    </div>
  );
};

// New Tab Page Component
const NewTabPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Shrome Browser</h1>
        <p className="text-text-secondary">A modern, Linux-inspired web browser</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { name: 'Google', url: 'https://google.com', icon: 'G' },
          { name: 'GitHub', url: 'https://github.com', icon: 'GH' },
          { name: 'Reddit', url: 'https://reddit.com', icon: 'R' },
          { name: 'YouTube', url: 'https://youtube.com', icon: 'YT' },
          { name: 'Twitter', url: 'https://twitter.com', icon: 'TW' },
          { name: 'Wikipedia', url: 'https://wikipedia.org', icon: 'W' },
        ].map((site) => (
          <a
            key={site.name}
            href={site.url}
            className="flex flex-col items-center p-4 rounded-lg 
                       bg-bg-secondary hover:bg-bg-tertiary transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-gnome-blue/20 flex items-center justify-center mb-2">
              <span className="text-gnome-blue font-bold">{site.icon}</span>
            </div>
            <span className="text-sm text-text-secondary">{site.name}</span>
          </a>
        ))}
      </div>

      {/* Search bar */}
      <div className="w-full max-w-xl">
        <div className="address-bar">
          <input
            type="text"
            placeholder="Search the web or enter a URL"
            className="flex-1 bg-transparent outline-none"
          />
          <button className="btn-icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Placeholder pages
const SettingsPage: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p className="text-text-secondary">Settings page coming soon...</p>
  </div>
);

const BookmarksPage: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
    <p className="text-text-secondary">Bookmark manager coming soon...</p>
  </div>
);

const HistoryPage: React.FC = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">History</h1>
    <p className="text-text-secondary">Browsing history coming soon...</p>
  </div>
);

export default BrowserContent;
