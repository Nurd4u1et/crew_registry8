const CACHE_KEY = "crew-registry-public-api-cache-v1";
const MAX_ENTRIES = 50;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function readEntries() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function readCached(key) {
  const entry = readEntries()[key];
  if (!entry || Date.now() - entry.savedAt > MAX_AGE_MS) return null;
  return entry.value;
}

function saveCached(key, value) {
  const entries = readEntries();
  entries[key] = { value, savedAt: Date.now() };
  const recent = Object.entries(entries)
    .sort(([, a], [, b]) => b.savedAt - a.savedAt)
    .slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(recent)));
  } catch {
  }
}

export async function networkFirst(key, request) {
  try {
    const value = await request();
    saveCached(key, value);
    return value;
  } catch (error) {
    const cached = readCached(key);
    if (cached !== null) {
      window.dispatchEvent(new CustomEvent("crew-cache-used"));
      return { value: cached, fromCache: true };
    }
    throw error;
  }
}

export function isOfflineSnapshot(result) {
  return Boolean(result?.fromCache);
}

