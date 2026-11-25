export const DEPARTMENTS = [
  "Command",
  "Engineering",
  "Medical",
  "Science",
  "Operations",
  "Hydroponics",
];

export const STATUSES = ["On duty", "Off duty", "On mission", "On leave"];

export const RANKS = ["Cadet", "Technician", "Specialist", "Officer", "Commander"];

export const MODULES = ["Ring A", "Ring B", "Core Spine", "Dock 7", "Garden Deck"];

export const SHIFTS = ["Alpha", "Beta", "Gamma"];

export const ORIGINS = ["Earth", "Luna", "Mars", "Ceres", "Europa", "Titan"];

export const DEPARTMENT_COLORS = {
  Command: "#2b3a67",
  Engineering: "#8a5a00",
  Medical: "#0f7b6c",
  Science: "#5b3fa8",
  Operations: "#355c7d",
  Hydroponics: "#3f7d2a",
};

export const SORT_OPTIONS = [
  { value: "name", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "rank-desc", label: "Rank, highest first" },
  { value: "rank-asc", label: "Rank, lowest first" },
  { value: "missions-desc", label: "Most missions" },
  { value: "joined-new", label: "Joined, newest" },
  { value: "joined-old", label: "Joined, oldest" },
];

