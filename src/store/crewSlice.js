import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCrewMember,
  editCrewMember,
  fetchCrewList,
  fetchCrewMember,
  removeCrewMember,
} from "../services/service";

const errorMessage = (error) => error?.message || "Something went wrong";
const listQuery = (arg) => typeof arg === "string" ? arg : arg.query;

async function retryRead(request) {
  try { return await request(); }
  catch (error) {
    if (error.message === "Item not found") throw error;
    return request();
  }
}

export const fetchCrewListThunk = createAsyncThunk(
  "crew/fetchList",
  (arg) => retryRead(() => fetchCrewList(listQuery(arg))),
  { condition: (arg, { getState }) => arg?.force || getState().crew.lists[listQuery(arg)]?.status !== "loading" },
);

export const fetchCrewMemberThunk = createAsyncThunk(
  "crew/fetchMember",
  (id) => retryRead(() => fetchCrewMember(id)),
  { condition: (id, { getState }) => getState().crew.details[id]?.status !== "loading" },
);

export const createCrewMemberThunk = createAsyncThunk("crew/create", (data) => addCrewMember(data));
export const updateCrewMemberThunk = createAsyncThunk("crew/update", ({ id, changes }) => editCrewMember(id, changes));
export const deleteCrewMemberThunk = createAsyncThunk("crew/delete", (id) => removeCrewMember(id));

const requestState = () => ({ status: "loading", error: "" });
const rejectedState = (action) => ({ status: "error", error: errorMessage(action.payload || action.error) });

const crewSlice = createSlice({
  name: "crew",
  initialState: {
    lists: {},
    details: {},
    mutations: {
      create: { status: "idle", error: "" },
      update: { status: "idle", error: "" },
      delete: { status: "idle", error: "" },
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrewListThunk.pending, (state, action) => {
        const query = listQuery(action.meta.arg);
        state.lists[query] = { ...state.lists[query], ...requestState(), currentRequestId: action.meta.requestId };
      })
      .addCase(fetchCrewListThunk.fulfilled, (state, action) => {
        const query = listQuery(action.meta.arg);
        if (state.lists[query]?.currentRequestId !== action.meta.requestId) return;
        state.lists[query] = { status: "success", error: "", data: action.payload };
      })
      .addCase(fetchCrewListThunk.rejected, (state, action) => {
        const query = listQuery(action.meta.arg);
        if (state.lists[query]?.currentRequestId !== action.meta.requestId) return;
        state.lists[query] = { ...state.lists[query], ...rejectedState(action) };
      })
      .addCase(fetchCrewMemberThunk.pending, (state, action) => {
        state.details[action.meta.arg] = { ...state.details[action.meta.arg], ...requestState(), currentRequestId: action.meta.requestId };
      })
      .addCase(fetchCrewMemberThunk.fulfilled, (state, action) => {
        if (state.details[action.meta.arg]?.currentRequestId !== action.meta.requestId) return;
        state.details[action.meta.arg] = { status: "success", error: "", data: action.payload };
      })
      .addCase(fetchCrewMemberThunk.rejected, (state, action) => {
        if (state.details[action.meta.arg]?.currentRequestId !== action.meta.requestId) return;
        state.details[action.meta.arg] = { ...state.details[action.meta.arg], ...rejectedState(action) };
      })
      .addCase(createCrewMemberThunk.pending, (state) => {
        state.mutations.create = { status: "loading", error: "" };
      })
      .addCase(createCrewMemberThunk.fulfilled, (state) => {
        state.mutations.create = { status: "success", error: "" };
      })
      .addCase(createCrewMemberThunk.rejected, (state, action) => {
        state.mutations.create = rejectedState(action);
      })
      .addCase(updateCrewMemberThunk.pending, (state) => {
        state.mutations.update = { status: "loading", error: "" };
      })
      .addCase(updateCrewMemberThunk.fulfilled, (state, action) => {
        state.mutations.update = { status: "success", error: "" };
        state.details[action.meta.arg.id] = { status: "success", error: "", data: action.payload };
      })
      .addCase(updateCrewMemberThunk.rejected, (state, action) => {
        state.mutations.update = rejectedState(action);
      })
      .addCase(deleteCrewMemberThunk.pending, (state) => {
        state.mutations.delete = { status: "loading", error: "" };
      })
      .addCase(deleteCrewMemberThunk.fulfilled, (state, action) => {
        state.mutations.delete = { status: "success", error: "" };
        delete state.details[action.meta.arg];
      })
      .addCase(deleteCrewMemberThunk.rejected, (state, action) => {
        state.mutations.delete = rejectedState(action);
      });
  },
});

export default crewSlice.reducer;
