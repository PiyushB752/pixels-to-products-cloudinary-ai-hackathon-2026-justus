import { CalendarDays } from "lucide-react";

const AssignmentPreview = ({ assignments }) => {
  if (!assignments || assignments.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>No pending assignments.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-list">
      {assignments.map((assignment) => (
        <div
          className="dashboard-list-item"
          key={assignment._id}
        >
          <div>
            <strong>{assignment.title}</strong>
            <span>{assignment.subject}</span>
          </div>

          <div className="dashboard-list-meta">
            <CalendarDays size={15} />

            <span>
              {new Date(
                assignment.dueDate,
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentPreview;