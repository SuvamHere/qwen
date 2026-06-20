import React from 'react';
import { Tab } from '../../types';

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: (event: React.MouseEvent) => void;
  onPin: (event: React.MouseEvent) => void;
  isPinnedView?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  tab,
  isActive,
  onClick,
  onClose,
  onPin,
  isPinnedView = false,
}) => {
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    // Context menu will be implemented later
    console.log('Tab context menu', tab.id);
  };

  return (
    <div
      className={`
        group flex items-center gap-2 px-3 py-2 rounded-t-lg 
        border-r border-border-color cursor-pointer
        transition-all duration-200 min-w-[120px] max-w-[200px]
        ${isActive ? 'bg-tab-active-bg text-tab-text-active' : 'bg-tab-bg text-tab-text'}
        ${isPinnedView ? 'min-w-[40px] max-w-[40px] p-2' : ''}
        hover:bg-tab-hover-bg
      `}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      title={tab.title}
    >
      {/* Favicon or loading indicator */}
      {!isPinnedView && (
        <div className="flex-shrink-0 w-4 h-4">
          {tab.isLoading ? (
            <div className="spinner" />
          ) : tab.favicon ? (
            <img src={tab.favicon} alt="" className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full rounded bg-gnome-blue/20 flex items-center justify-center">
              <span className="text-xs font-bold text-gnome-blue">
                {tab.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab title */}
      {!isPinnedView && (
        <span className="flex-1 truncate text-sm font-medium">
          {tab.title}
        </span>
      )}

      {/* Pin indicator for pinned tabs in regular view */}
      {tab.isPinned && !isPinnedView && (
        <svg className="w-3 h-3 text-gnome-blue" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      )}

      {/* Close button (not shown for pinned tabs) */}
      {!isPinnedView && (
        <button
          onClick={onClose}
          className="tab-close p-0.5 rounded-full opacity-0 group-hover:opacity-100 
                     hover:bg-red-500 hover:text-white transition-all duration-200"
          title="Close tab"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Pin/Unpin button (shown on hover for non-pinned view) */}
      {!isPinnedView && (
        <button
          onClick={onPin}
          className="hidden group-hover:block p-0.5 rounded-full 
                     hover:bg-gnome-blue hover:text-white transition-all duration-200"
          title={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TabItem;
