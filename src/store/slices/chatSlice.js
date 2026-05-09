import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const sendMessage = createAsyncThunk(
  'chat/send',
  async (question, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/chat', { question });
      return { question, answer: res.data.answer };
    } catch (err) {
      return rejectWithValue('Failed to get answer');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state) => { state.messages = []; },
    clearChatError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({
          role: 'user',
          content: action.meta.arg,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          id: Date.now(),
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'ai',
          content: action.payload.answer,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          id: Date.now() + 1,
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          role: 'ai',
          content: '⚠ ' + (action.payload || 'Something went wrong'),
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          id: Date.now() + 1,
          isError: true,
        });
      });
  },
});

export const { clearMessages, clearChatError } = chatSlice.actions;
export default chatSlice.reducer;