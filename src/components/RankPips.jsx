import { RANKS } from "../constants";

export default function RankPips({ rank }) {
  const level = RANKS.indexOf(rank) + 1;

  return (
    <span className="pips" role="img" aria-label={`${rank}, level ${level} of ${RANKS.length}`}>
      {RANKS.map((name, index) => (
        <span key={name} className={index < level ? "pip pip-on" : "pip"} />
      ))}
    </span>
  );
}

