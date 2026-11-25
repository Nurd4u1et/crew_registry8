import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCrewMemberThunk } from "../store/crewSlice";
import { selectCrewMemberEntry } from "../store/selectors";
import { NOT_FOUND_MESSAGE } from "../services/service";

export default function useCrewMember(id) {
  const dispatch = useDispatch();
  const entry = useSelector((state) => id == null ? undefined : selectCrewMemberEntry(state, id));
  useEffect(() => { if (id != null) dispatch(fetchCrewMemberThunk(id)); }, [dispatch, id]);
  let phase = "success";
  if (id == null) phase = "notfound";
  else if (entry?.data) phase = "success";
  else if (entry?.status === "error") phase = entry.error === NOT_FOUND_MESSAGE ? "notfound" : "error";
  else phase = "loading";
  return {
    phase,
    member: entry?.data ?? null,
    error: entry?.error ?? "",
    reload: () => id == null ? undefined : dispatch(fetchCrewMemberThunk(id)),
  };
}
