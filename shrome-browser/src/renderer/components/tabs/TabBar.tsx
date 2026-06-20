import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { addTab, closeTab, setActiveTab, pinTab } from '../../store/browserSlice';
import TabItem from './TabItem';

const TabBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tabs, activeTabId, tabGroups } = useSelector((state: RootState) => state.browser);

  const handleAddTab = () => {
    dispatch(addTab({ fromTabId: activeTabId || undefined }));
  };

  const handleTabClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(closeTab(tabId));
  };

  const handlePinTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(pinTab(tabId));
  };

  // Separate pinned and unpinned tabs
  const pinnedTabs = tabs.filter(t => t.isPinned);
  const unpinnedTabs = tabs.filter(t => !t.isPinned);

  return (
    <div className="flex items-end bg-toolbar-bg border-b border-toolbar-border px-2 pt-2 select-none">
      {/* Window controls placeholder */}
      <div className="flex items-center gap-2 pr-4">
        <div className="w-3 h-3 rounded-full bg-gnome-red hover:bg-red-600 cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-gnome-orange hover:bg-orange-600 cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-gnome-green hover:bg-green-600 cursor-pointer" />
      </div>

      {/* Pinned tabs */}
      {pinnedTabs.length > 0 && (
        <div className="flex items-center gap-1 border-r border-border-color pr-2 mr-2">
          {pinnedTabs.map(tab => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => handleTabClick(tab.id)}
              onClose={(e) => handleCloseTab(tab.id, e)}
              onPin={(e) => handlePinTab(tab.id, e)}
              isPinnedView={true}
            />
          ))}
        </div>
      )}

      {/* Regular tabs */}
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {unpinnedTabs.map(tab => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onClick={() => handleTabClick(tab.id)}
            onClose={(e) => handleCloseTab(tab.id, e)}
            onPin={(e) => handlePinTab(tab.id, e)}
          />
        ))}

        {/* New tab button */}
        <button
          onClick={handleAddTab}
          className="flex items-center justify-center w-8 h-8 rounded-lg 
                     hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200
                     text-text-secondary hover:text-text-primary"
          title="New Tab (Ctrl+T)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Tab groups indicator */}
      {tabGroups.length > 0 && (
        <div className="flex items-center gap-1 pl-2 ml-2 border-l border-border-color">
          {tabGroups.slice(0, 3).map(group => (
            <div
              key={group.id}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: group.color }}
              title={group.name}
            />
          ))}
          {tabGroups.length > 3 && (
            <span className="text-xs text-text-secondary">+{tabGroups.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TabBar;
