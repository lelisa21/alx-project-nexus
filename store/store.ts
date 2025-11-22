import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';
import { pollsReducer } from '@/features/polls';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
