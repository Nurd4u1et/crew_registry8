import { useDispatch, useStore } from "react-redux";
import {
  createCrewMemberThunk,
  deleteCrewMemberThunk,
  fetchCrewListThunk,
  updateCrewMemberThunk,
} from "../store/crewSlice";
import { fetchDashboardRosterThunk } from "../store/dashboardSlice";

function useMutation(thunk) {
  const dispatch = useDispatch();
  const store = useStore();
  async function mutateAsync(payload) {
    const result = await dispatch(thunk(payload)).unwrap();
    const state = store.getState();
    Object.keys(state.crew.lists).forEach((query) => dispatch(fetchCrewListThunk({ query, force: true })));
    if (state.dashboard.status !== "idle") dispatch(fetchDashboardRosterThunk({ force: true }));
    return result;
  }
  return { mutateAsync };
}

export const useAddCrewMember = () => useMutation(createCrewMemberThunk);
export const useEditCrewMember = () => useMutation(updateCrewMemberThunk);
export const useDeleteCrewMember = () => useMutation(deleteCrewMemberThunk);
