import { configureStore } from '@reduxjs/toolkit';
import browserReducer from './browserSlice';

export const store = configureStore({
  reducer: {
    browser: browserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for IPC events
        ignoredActions: ['browser/addTab', 'browser/closeTab'],
        // Ignore these field paths in state
        ignoredPaths: ['browser.tabs'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
