import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type StudySession = {
  id: string;
  topic: string;
  hours: number;
  date: string;
};

type StudyState = {
  sessions: StudySession[];
  loading: boolean;
  error: string | null;
};

const initialState: StudyState = {
  sessions: [],
  loading: true,
  error: null,
};

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    setLoading(state: StudyState) {
      state.loading = true;
      state.error = null;
    },
    setSessions(state, action: PayloadAction<StudySession[]>) {
      state.sessions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSession(state, action: PayloadAction<StudySession>) {
      state.sessions.unshift(action.payload);
      state.error = null;
    },
    removeSession(state, action: PayloadAction<string>) {
      state.sessions = state.sessions.filter(
        (session) => session.id !== action.payload,
      );
    },

    setLoadError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setSessions,
  addSession,
  removeSession,
  setLoadError,
} = studySlice.actions;

export default studySlice.reducer;
