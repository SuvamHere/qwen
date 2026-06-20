import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const StatusBar: React.FC = () => {
  const { tabs, activeTabId, downloads } = useSelector((state: RootState) => state.browser);
  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeDownloads = downloads.filter(d => d.state === 'downloading');

  return (
    <div className="flex items-center justify-between px-4 py-1 bg-toolbar-bg border-t border-toolbar-border text-xs text-text-secondary">
      <div className="flex items-center gap-4">
        {/* Status text */}
        <span className="truncate max-w-md">
          {activeTab?.isLoading ? 'Loading...' : 'Ready'}
        </span>
        
        {/* Active downloads indicator */}
        {activeDownloads.length > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {activeDownloads.length} download{activeDownloads.length !== 1 ? 's' : ''} in progress
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Zoom level */}
        <span>100%</span>
        
        {/* Connection status */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gnome-green" />
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
