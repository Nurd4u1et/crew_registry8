import {
  getItemsList,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from "../api/fakeApi.js";
import { networkFirst } from "./offlineDataCache.js";

export const NOT_FOUND_MESSAGE = "Item not found";

export function buildListQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.set(key, String(value));
    }
  });
  return `?${query.toString()}`;
}

export function fetchCrewList(query) {
  return networkFirst(`list:${query}`, () => getItemsList(query)).then((result) =>
    result.fromCache ? { ...result.value, fromCache: true } : result,
  );
}

export async function fetchAllCrew() {
  const result = await networkFirst("roster", () => getItemsList("?limit=1000&sort=name"));
  if (result.fromCache) return result.value.data;
  return result.data;
}

export function fetchCrewMember(id) {
  return networkFirst(`detail:${id}`, () => getItem(id)).then((result) =>
    result.fromCache ? result.value : result,
  );
}

export function addCrewMember(data) {
  return createItem(data);
}

export function editCrewMember(id, changes) {
  return updateItem(id, changes);
}

export function removeCrewMember(id) {
  return deleteItem(id);
}

