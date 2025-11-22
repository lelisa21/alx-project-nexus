import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll } from '@/interface';

interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  loading: boolean;
  error: string | null;
}

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  loading: false,
  error: null,
};

const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setPolls: (state, action: PayloadAction<Poll[]>) => {
      state.polls = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentPoll: (state, action: PayloadAction<Poll | null>) => {
      state.currentPoll = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.unshift(action.payload);
    },
    updatePoll: (state, action: PayloadAction<Poll>) => {
      const index = state.polls.findIndex(poll => poll.id === action.payload.id);
      if (index !== -1) {
        state.polls[index] = action.payload;
      }
      if (state.currentPoll?.id === action.payload.id) {
        state.currentPoll = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setPolls, 
  setCurrentPoll, 
  addPoll, 
  updatePoll, 
  setLoading, 
  setError 
} = pollsSlice.actions;

export default pollsSlice.reducer;
