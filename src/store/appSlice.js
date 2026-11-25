import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: { online: navigator.onLine, cachedSnapshot: false },
  reducers: {
    connectivityChanged(state, action) { state.online = action.payload; },
    cachedSnapshotUsed(state) { state.cachedSnapshot = true; },
  },
});

export const { connectivityChanged, cachedSnapshotUsed } = appSlice.actions;
export default appSlice.reducer;
