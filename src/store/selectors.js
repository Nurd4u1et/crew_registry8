import { createSelector } from "@reduxjs/toolkit";
import { DEPARTMENTS, MODULES, RANKS, STATUSES } from "../constants";

export const selectCrewListEntry = (state, query) => state.crew.lists[query];
export const selectCrewMemberEntry = (state, id) => state.crew.details[id];
export const selectDashboardCrew = (state) => state.dashboard.crew;
export const selectOnline = (state) => state.app.online;

const countBy = (list, field, order) => {
  const counts = Object.fromEntries(order.map((value) => [value, 0]));
  list.forEach((item) => { counts[item[field]] = (counts[item[field]] ?? 0) + 1; });
  return order.map((label) => ({ label, count: counts[label] }));
};

export const selectDashboardStats = createSelector(
  [selectDashboardCrew, (_, department) => department],
  (crew, department) => {
    const list = department ? crew.filter((member) => member.department === department) : crew;
    const total = list.length;
    const totalMissions = list.reduce((sum, member) => sum + member.missions, 0);
    const senior = list.filter((member) => member.rank === "Officer" || member.rank === "Commander").length;
    return {
      total,
      onDuty: list.filter((member) => member.status === "On duty").length,
      totalMissions,
      averageMissions: total ? totalMissions / total : 0,
      seniorShare: total ? Math.round((senior / total) * 100) : 0,
      byStatus: countBy(list, "status", STATUSES),
      byRank: countBy(list, "rank", RANKS),
      byModule: countBy(list, "module", MODULES),
      topMissions: [...list].sort((a, b) => b.missions - a.missions).slice(0, 5),
    };
  },
);

export const selectDepartmentOptions = createSelector(
  [selectDashboardCrew],
  (crew) => [...new Set(crew.map((member) => member.department))].sort((a, b) => DEPARTMENTS.indexOf(a) - DEPARTMENTS.indexOf(b)),
);
