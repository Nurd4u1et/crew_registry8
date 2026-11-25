import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllCrew } from "../services/service";

export const fetchDashboardRosterThunk = createAsyncThunk(
  "dashboard/fetchRoster",
  async () => {
    try { return await fetchAllCrew(); }
    catch { return fetchAllCrew(); }
  },
  { condition: (arg, { getState }) => arg?.force || getState().dashboard.status !== "loading" },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { crew: [], status: "idle", error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardRosterThunk.pending, (state, action) => {
        state.status = "loading";
        state.error = "";
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchDashboardRosterThunk.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.crew = action.payload;
        state.status = "success";
        delete state.currentRequestId;
      })
      .addCase(fetchDashboardRosterThunk.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "error";
        state.error = action.error.message || "Could not load the roster";
        delete state.currentRequestId;
      });
  },
});

export default dashboardSlice.reducer;
