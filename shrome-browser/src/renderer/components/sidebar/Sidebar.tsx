import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { toggleSidebar, setSidebarPanel } from '../../store/browserSlice';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sidebar, bookmarks, history } = useSelector((state: RootState) => state.browser);

  const handleClose = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="sidebar animate-slide-in">
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4 border-b border-border-color">
        <h2 className="font-semibold text-lg">
          {sidebar.activePanel === 'bookmarks' && 'Bookmarks'}
          {sidebar.activePanel === 'history' && 'History'}
          {sidebar.activePanel === 'downloads' && 'Downloads'}
          {sidebar.activePanel === 'extensions' && 'Extensions'}
          {!sidebar.activePanel && 'Quick Access'}
        </h2>
        <button onClick={handleClose} className="btn-icon">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar navigation */}
      <div className="flex flex-col p-2 border-b border-border-color">
        <button
          onClick={() => dispatch(setSidebarPanel('bookmarks'))}
          className={`sidebar-item ${sidebar.activePanel === 'bookmarks' ? 'bg-sidebar-item-hover' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span>Bookmarks</span>
        </button>

        <button
          onClick={() => dispatch(setSidebarPanel('history'))}
          className={`sidebar-item ${sidebar.activePanel === 'history' ? 'bg-sidebar-item-hover' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>History</span>
        </button>

        <button
          onClick={() => dispatch(setSidebarPanel('downloads'))}
          className={`sidebar-item ${sidebar.activePanel === 'downloads' ? 'bg-sidebar-item-hover' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Downloads</span>
        </button>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-auto p-2">
        {sidebar.activePanel === 'bookmarks' && (
          <div className="space-y-1">
            {bookmarks.length === 0 ? (
              <p className="text-sm text-text-secondary p-4 text-center">
                No bookmarks yet
              </p>
            ) : (
              bookmarks.map(bookmark => (
                <a
                  key={bookmark.id}
                  href={bookmark.url}
                  className="sidebar-item"
                >
                  <div className="w-6 h-6 rounded bg-gnome-blue/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gnome-blue">
                      {bookmark.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{bookmark.title}</p>
                    <p className="text-xs text-text-secondary truncate">{bookmark.url}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        )}

        {sidebar.activePanel === 'history' && (
          <div className="space-y-1">
            {history.length === 0 ? (
              <p className="text-sm text-text-secondary p-4 text-center">
                No browsing history
              </p>
            ) : (
              history.slice(0, 50).map(entry => (
                <a
                  key={entry.id}
                  href={entry.url}
                  className="sidebar-item"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.title}</p>
                    <p className="text-xs text-text-secondary truncate">{entry.url}</p>
                  </div>
                  <span className="text-xs text-text-secondary flex-shrink-0">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </a>
              ))
            )}
          </div>
        )}

        {sidebar.activePanel === 'downloads' && (
          <div className="p-4 text-center text-sm text-text-secondary">
            No active downloads
          </div>
        )}

        {sidebar.activePanel === 'extensions' && (
          <div className="p-4 text-center text-sm text-text-secondary">
            No extensions installed
          </div>
        )}

        {!sidebar.activePanel && (
          <div className="space-y-2">
            <div className="p-3 bg-bg-tertiary rounded-lg">
              <p className="text-xs text-text-secondary mb-1">Quick Actions</p>
              <div className="flex gap-2">
                <button className="btn-secondary text-sm py-1 px-2">New Tab</button>
                <button className="btn-secondary text-sm py-1 px-2">New Window</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
