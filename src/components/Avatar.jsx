import { DEPARTMENT_COLORS } from "../constants";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function Avatar({ name, department, size = "md" }) {
  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ backgroundColor: DEPARTMENT_COLORS[department] ?? "#355c7d" }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

