import { MapPin, CalendarDays } from "lucide-react";

const EventPreview = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>No upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-list">
      {events.map((event) => (
        <div
          className="dashboard-list-item"
          key={event._id}
        >
          <div>
            <strong>{event.title}</strong>

            <span>
              <MapPin size={14} />
              {event.location}
            </span>
          </div>

          <div className="dashboard-list-meta">
            <CalendarDays size={15} />

            <span>
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventPreview;