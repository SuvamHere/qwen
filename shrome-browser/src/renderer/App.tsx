import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { addTab, setActiveTab, updateSettings } from './store/browserSlice';
import TabBar from './components/tabs/TabBar';
import NavigationBar from './components/navigation/NavigationBar';
import BrowserContent from './components/browser/BrowserContent';
import Sidebar from './components/sidebar/Sidebar';
import StatusBar from './components/shared/StatusBar';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tabs, activeTabId, settings, sidebar, isIncognito } = useSelector(
    (state: RootState) => state.browser
  );

  // Initialize with a default tab on mount
  useEffect(() => {
    if (tabs.length === 0) {
      dispatch(addTab({ url: 'shrome://newtab', title: 'New Tab' }));
    }
  }, [tabs.length, dispatch]);

  // Apply theme based on settings
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Set incognito mode class
  useEffect(() => {
    if (isIncognito) {
      document.body.classList.add('incognito');
    } else {
      document.body.classList.remove('incognito');
    }
  }, [isIncognito]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary overflow-hidden">
      {/* Tab Bar */}
      <TabBar />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar.isOpen && <Sidebar />}
        
        {/* Browser Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navigation Bar */}
          <NavigationBar />
          
          {/* Web Content / WebView */}
          <BrowserContent />
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default App;
