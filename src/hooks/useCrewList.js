import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCrewListThunk } from "../store/crewSlice";
import { selectCrewListEntry } from "../store/selectors";

export default function useCrewList(query) {
  const dispatch = useDispatch();
  const entry = useSelector((state) => selectCrewListEntry(state, query));
  const previousData = useRef(null);
  useEffect(() => { dispatch(fetchCrewListThunk(query)); }, [dispatch, query]);
  if (entry?.data) previousData.current = entry.data;
  const data = entry?.data ?? previousData.current;
  const phase = entry?.data ? "success" : entry?.status === "error" ? "error" : "loading";
  return { phase, data: data ?? null, error: entry?.error ?? "", reload: () => dispatch(fetchCrewListThunk(query)) };
}
