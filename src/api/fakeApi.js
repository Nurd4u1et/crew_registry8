import { API_CONFIG, DATA_KEY } from "./settings.js";
import { initialDataSample } from "./initial-data-sample.js";
import { RANKS } from "../constants.js";

function fakeRequest(operation, options = {}) {
  const {
    minDelay = API_CONFIG.minDelay,
    maxDelay = API_CONFIG.maxDelay,
    errorChance = API_CONFIG.errorChance,
  } = options;

  return new Promise((resolve, reject) => {
    const delayMS =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setTimeout(() => {
      if (Math.random() < errorChance) {
        reject(new Error("Simulated server Error"));
        return;
      }

      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delayMS);
  });
}

function initializeDatabase() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialDataSample));
  }
}

function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}

initializeDatabase();

function sortItems(items, sort) {
  const rankOf = (item) => RANKS.indexOf(item.rank);

  return [...items].sort((a, b) => {
    switch (sort) {
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rank-desc":
        return rankOf(b) - rankOf(a) || a.name.localeCompare(b.name);
      case "rank-asc":
        return rankOf(a) - rankOf(b) || a.name.localeCompare(b.name);
      case "missions-desc":
        return b.missions - a.missions || a.name.localeCompare(b.name);
      case "joined-new":
        return b.joinedAt.localeCompare(a.joinedAt);
      case "joined-old":
        return a.joinedAt.localeCompare(b.joinedAt);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });
}

export async function getItemsList(query = "") {
  return fakeRequest(() => {
    const params = new URLSearchParams(query);
    const search = params.get("search")?.trim().toLowerCase();
    const sort = params.get("sort") || "name";
    const page = Math.max(1, Number(params.get("page")) || 1);
    const limit = Math.max(1, Number(params.get("limit")) || 10);

    let items = readData();

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.specialty.toLowerCase().includes(search),
      );
    }

    for (const field of ["department", "status", "rank", "module", "shift"]) {
      const value = params.get(field);
      if (value) {
        items = items.filter((item) => item[field] === value);
      }
    }

    items = sortItems(items, sort);

    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      data: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages,
    };
  });
}

export async function getItem(id) {
  return fakeRequest(() => {
    const items = readData();
    const item = items.find((item) => item.id === Number(id));

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  });
}

export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();
    const nextId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    const newItem = { ...data, id: nextId };

    writeData([...items, newItem]);
    return newItem;
  });
}

export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    if (!items.some((item) => item.id === numericId)) {
      throw new Error("Item not found");
    }

    const updatedItems = items.map((item) =>
      item.id === numericId ? { ...item, ...changes, id: numericId } : item,
    );

    writeData(updatedItems);
    return updatedItems.find((item) => item.id === numericId);
  });
}

export async function deleteItem(id) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    if (!items.some((item) => item.id === numericId)) {
      throw new Error("Item not found");
    }

    writeData(items.filter((item) => item.id !== numericId));
    return { success: true, id: numericId };
  });
}

