import { ArrowUpRight } from "lucide-react";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <Icon size={20} />
        </div>

        <ArrowUpRight size={18} />
      </div>

      <div className="stat-card-content">
        <span>{title}</span>

        <strong>{value}</strong>

        <p>{description}</p>
      </div>
    </div>
  );
};

export default StatCard;