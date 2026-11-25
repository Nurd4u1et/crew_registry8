import { Link, useLocation } from "react-router-dom";
import Avatar from "./Avatar";
import RankPips from "./RankPips";
import StatusBadge from "./StatusBadge";

export default function CrewCard({ member }) {
  const location = useLocation();

  return (
    <article className="card">
      <Link
        to={`/crew/${member.id}`}
        state={{ from: location.search }}
        className="card-link"
      >
        <div className="card-top">
          <Avatar name={member.name} department={member.department} />
          <div>
            <h3 className="card-name">{member.name}</h3>
            <p className="card-meta">{member.department}</p>
          </div>
        </div>
        <p className="card-text">{member.description}</p>
        <div className="card-bottom">
          <span className="card-rank">
            <RankPips rank={member.rank} />
            {member.rank}
          </span>
          <StatusBadge status={member.status} />
        </div>
      </Link>
    </article>
  );
}

