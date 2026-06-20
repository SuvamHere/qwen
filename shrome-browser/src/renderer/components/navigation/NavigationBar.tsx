import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { 
  navigateTab, goBack, goForward, reloadTab, 
  toggleSidebar, setIncognitoMode 
} from '../../store/browserSlice';

const NavigationBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tabs, activeTabId, isIncognito } = useSelector((state: RootState) => state.browser);
  const [urlInput, setUrlInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId);

  // Update URL input when active tab changes
  useEffect(() => {
    if (activeTab && !isFocused) {
      setUrlInput(activeTab.url);
    }
  }, [activeTab?.url, activeTabId, isFocused]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTabId && urlInput.trim()) {
      let url = urlInput.trim();
      
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('shrome://')) {
        // Check if it looks like a domain
        if (url.includes('.') && !url.includes(' ')) {
          url = 'https://' + url;
        } else {
          // Treat as search query
          const searchEngine = 'google'; // Will be configurable
          const searchEngines: Record<string, string> = {
            google: 'https://www.google.com/search?q=',
            duckduckgo: 'https://duckduckgo.com/?q=',
            bing: 'https://www.bing.com/search?q=',
          };
          url = searchEngines[searchEngine] + encodeURIComponent(url);
        }
      }
      
      dispatch(navigateTab({ id: activeTabId, url }));
      setUrlInput(url);
      setIsFocused(false);
    }
  };

  const handleBack = () => {
    if (activeTabId) {
      dispatch(goBack(activeTabId));
    }
  };

  const handleForward = () => {
    if (activeTabId) {
      dispatch(goForward(activeTabId));
    }
  };

  const handleRefresh = () => {
    if (activeTabId) {
      dispatch(reloadTab(activeTabId));
    }
  };

  const handleHome = () => {
    if (activeTabId) {
      dispatch(navigateTab({ id: activeTabId, url: 'shrome://newtab' }));
    }
  };

  const handleIncognitoToggle = () => {
    dispatch(setIncognitoMode(!isIncognito));
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-toolbar-bg border-b border-toolbar-border">
      {/* Sidebar toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="btn-icon"
        title="Toggle Sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleBack}
          disabled={!activeTab?.canGoBack}
          className="btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
          title="Go Back (Alt+Left)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleForward}
          disabled={!activeTab?.canGoForward}
          className="btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
          title="Go Forward (Alt+Right)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={handleRefresh}
          className="btn-icon"
          title="Refresh (F5)"
        >
          <svg className={`w-5 h-5 ${activeTab?.isLoading ? 'animate-spin' : ''}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <button
          onClick={handleHome}
          className="btn-icon"
          title="Home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {/* Address bar */}
      <form onSubmit={handleNavigate} className="flex-1">
        <div className={`address-bar ${isFocused ? 'ring-2 ring-gnome-blue' : ''}`}>
          {/* Security indicator */}
          {activeTab?.url?.startsWith('https://') && (
            <svg className="w-4 h-4 text-gnome-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A1 1 0 0114 6.196V10a1 1 0 01-.293.707l-4 4a1 1 0 01-1.414 0l-4-4A1 1 0 014 10V6.196a1 1 0 013.944-4.252zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
            </svg>
          )}
          
          {/* Incognito indicator */}
          {isIncognito && (
            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          )}

          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent outline-none text-sm"
            placeholder="Search or enter address"
          />

          {/* Bookmark star button */}
          <button
            type="button"
            className="btn-icon"
            title="Bookmark this page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Extension icons placeholder */}
      <div className="flex items-center gap-1">
        {/* Extensions will be added here */}
      </div>

      {/* Menu button */}
      <button
        className="btn-icon"
        title="Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {/* Incognito mode toggle */}
      <button
        onClick={handleIncognitoToggle}
        className={`btn-icon ${isIncognito ? 'text-purple-500 bg-purple-500/10' : ''}`}
        title="New Incognito Window"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      </button>
    </div>
  );
};

export default NavigationBar;
