import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardRosterThunk } from "../store/dashboardSlice";

export default function useAllCrew() {
  const dispatch = useDispatch();
  const { crew, status, error } = useSelector((state) => state.dashboard);
  useEffect(() => { dispatch(fetchDashboardRosterThunk()); }, [dispatch]);
  return {
    phase: crew.length > 0 ? "success" : status === "idle" || status === "loading" ? "loading" : status,
    crew,
    error,
    reload: () => dispatch(fetchDashboardRosterThunk()),
  };
}
