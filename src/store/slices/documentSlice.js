import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDocuments = createAsyncThunk(
  'documents/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/documents');
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to load documents');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Upload failed');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/documents/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue('Delete failed');
    }
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    list: [],
    activeDoc: null,
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {
    setActiveDoc: (state, action) => { state.activeDoc = action.payload; },
    clearDocError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => { state.loading = true; })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.list.unshift(action.payload);
        state.activeDoc = action.payload;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.id !== action.payload);
        if (state.activeDoc?.id === action.payload) state.activeDoc = null;
      });
  },
});

export const { setActiveDoc, clearDocError } = documentSlice.actions;
export default documentSlice.reducer;