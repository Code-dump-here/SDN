import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchQuizzes = createAsyncThunk("quizzes/fetchAll", async () => {
  const res = await api.get("/quizzes");
  return res.data;
});

export const fetchQuiz = createAsyncThunk("quizzes/fetchOne", async (id) => {
  const res = await api.get(`/quizzes/${id}/populate`);
  return res.data;
});

export const createQuiz = createAsyncThunk("quizzes/create", async (data) => {
  const res = await api.post("/quizzes", data);
  return res.data;
});

export const updateQuiz = createAsyncThunk("quizzes/update", async ({ id, data }) => {
  const res = await api.put(`/quizzes/${id}`, data);
  return res.data;
});

export const deleteQuiz = createAsyncThunk("quizzes/delete", async (id) => {
  await api.delete(`/quizzes/${id}`);
  return id;
});

const quizSlice = createSlice({
  name: "quizzes",
  initialState: { list: [], current: null, loading: false, error: null },
  reducers: {
    clearCurrent(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuizzes.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchQuizzes.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchQuiz.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchQuiz.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchQuiz.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createQuiz.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const idx = state.list.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q._id !== action.payload);
      });
  },
});

export const { clearCurrent } = quizSlice.actions;
export default quizSlice.reducer;
