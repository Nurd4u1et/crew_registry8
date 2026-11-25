import {
  DEPARTMENTS,
  MODULES,
  ORIGINS,
  RANKS,
  SHIFTS,
  STATUSES,
} from "../constants.js";

function mulberry32(seed) {
  let a = seed;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  "Mira", "Tomas", "Aiya", "Jonas", "Lena", "Dmitri", "Saule", "Kofi", "Ines", "Rafael",
  "Yuki", "Amara", "Olek", "Nadia", "Bruno", "Talgat", "Ingrid", "Samir", "Chloe", "Arman",
  "Petra", "Hugo", "Zhanna", "Idris", "Vera", "Kai", "Mateo", "Leila", "Sven", "Dana",
];

const LAST_NAMES = [
  "Okafor", "Lindqvist", "Serik", "Moreau", "Tanaka", "Volkov", "Reyes", "Haddad", "Novak", "Bekov",
  "Osei", "Fischer", "Castillo", "Nurlan", "Ivers", "Kowalski", "Mbeki", "Arslan", "Duval", "Rahimov",
];

const SPECIALTIES = {
  Command: ["Station policy", "Crisis coordination", "Crew scheduling"],
  Engineering: ["Reactor maintenance", "Hull repair", "Life-support plumbing"],
  Medical: ["Low-gravity medicine", "Radiation care", "Trauma response"],
  Science: ["Orbital mechanics", "Materials testing", "Exobiology"],
  Operations: ["Docking control", "Cargo logistics", "Comms relay"],
  Hydroponics: ["Algae cultivation", "Seed banking", "Water recycling"],
};

const BLURBS = {
  Command: [
    "Keeps the station running on schedule and the crew pointed in the same direction.",
    "Signs off on every departure and every emergency drill.",
  ],
  Engineering: [
    "Knows which panel hums wrong before the sensors do.",
    "Spends most shifts inside the walls of the station.",
  ],
  Medical: [
    "First call when something goes wrong, and usually the last.",
    "Keeps the crew healthy through long stretches without gravity.",
  ],
  Science: [
    "Runs experiments that only make sense a long way from home.",
    "Turns raw sensor logs into reports the station can act on.",
  ],
  Operations: [
    "Moves cargo, ships and messages through the station without a hitch.",
    "Keeps traffic around the docks orderly, even on busy days.",
  ],
  Hydroponics: [
    "Grows what the crew eats and recycles what they drink.",
    "Treats the garden deck like a very large, very green engine.",
  ],
};

const RANK_WEIGHTS = [0.2, 0.3, 0.28, 0.15, 0.07];
const STATUS_WEIGHTS = [0.45, 0.2, 0.2, 0.15];

function pick(random, list) {
  return list[Math.floor(random() * list.length)];
}

function pickWeighted(random, list, weights) {
  const roll = random();
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += weights[i];
    if (roll < sum) return list[i];
  }
  return list[list.length - 1];
}

function buildCrew(count) {
  const random = mulberry32(2026);
  const used = new Set();
  const crew = [];
  const start = Date.UTC(2016, 0, 1);
  const end = Date.UTC(2026, 8, 30);

  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    let last = LAST_NAMES[(i * 7 + Math.floor(i / 30) * 3) % LAST_NAMES.length];
    let shift = 0;
    while (used.has(`${first} ${last}`)) {
      shift++;
      last = LAST_NAMES[(i * 7 + shift) % LAST_NAMES.length];
    }
    used.add(`${first} ${last}`);

    const department = pick(random, DEPARTMENTS);
    const rank = pickWeighted(random, RANKS, RANK_WEIGHTS);
    const rankIndex = RANKS.indexOf(rank);

    const tenure = (rankIndex / (RANKS.length - 1)) * 0.6 + random() * 0.4;
    const joined = new Date(end - tenure * (end - start));
    const missions = rankIndex * 6 + Math.floor(random() * 8);

    crew.push({
      id: i + 1,
      name: `${first} ${last}`,
      description: pick(random, BLURBS[department]),
      department,
      rank,
      status: pickWeighted(random, STATUSES, STATUS_WEIGHTS),
      module: pick(random, MODULES),
      shift: pick(random, SHIFTS),
      origin: pick(random, ORIGINS),
      specialty: pick(random, SPECIALTIES[department]),
      missions,
      joinedAt: joined.toISOString().slice(0, 10),
    });
  }
  return crew;
}

export const initialDataSample = buildCrew(72);

