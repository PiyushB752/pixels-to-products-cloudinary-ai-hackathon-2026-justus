import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from "../services/eventService";

import "./Events.css";

const initialForm = {
  title: "",
  description: "",
  type: "Other",
  date: "",
  location: "",
};

const eventTypes = [
  "All",
  "Hackathon",
  "Workshop",
  "Seminar",
  "Tech Talk",
  "Festival",
  "Club Activity",
  "Other",
];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");
  const [registeredOnly, setRegisteredOnly] =
    useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(initialForm);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesType =
        filter === "All" || event.type === filter;

      const matchesRegistration =
        !registeredOnly || event.registered;

      return (
        matchesType && matchesRegistration
      );
    });
  }, [events, filter, registeredOnly]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingId(event._id);

    setForm({
      title: event.title,
      description: event.description || "",
      type: event.type,
      date: formatDateForInput(event.date),
      location: event.location || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    if (!form.date) {
      toast.error("Event date is required");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateEvent(editingId, form);
        toast.success("Event updated");
      } else {
        await createEvent(form);
        toast.success("Event created");
      }

      closeForm();
      await fetchEvents();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save event"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRegistration = async (event) => {
    try {
      if (event.registered) {
        await unregisterFromEvent(event._id);
        toast.success("Unregistered from event");
      } else {
        await registerForEvent(event._id);
        toast.success("Registered for event");
      }

      await fetchEvents();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update registration"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this event?"
    );

    if (!confirmed) return;

    try {
      await deleteEvent(id);

      toast.success("Event deleted");
      await fetchEvents();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete event"
      );
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="event-state">
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="event-state error">
          <p>{error}</p>

          <button onClick={fetchEvents}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h1>Campus Events</h1>
          <p>
            Discover workshops, hackathons, seminars,
            and other campus activities.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      <div className="events-toolbar">
        <div className="event-type-filters">
          {eventTypes.map((type) => (
            <button
              key={type}
              className={
                filter === type ? "active" : ""
              }
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          className={`registered-filter ${
            registeredOnly ? "active" : ""
          }`}
          onClick={() =>
            setRegisteredOnly((current) => !current)
          }
        >
          <Users size={16} />
          Registered
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="event-empty">
          <Calendar size={42} />

          <h3>No events found</h3>

          <p>
            There are no upcoming events matching your
            current filters.
          </p>

          {filter === "All" &&
            !registeredOnly && (
              <button
                className="primary-button"
                onClick={openCreateForm}
              >
                <Plus size={18} />
                Add Event
              </button>
            )}
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleRegistration}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
        >
          <div
            className="event-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Event"
                    : "Add Event"}
                </h2>

                <p>
                  Enter the details for the campus
                  event.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form
              className="event-form"
              onSubmit={handleSubmit}
            >
              <label>
                Event Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Campus Hackathon"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the event..."
                  rows="4"
                />
              </label>

              <label>
                Event Type
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  {eventTypes
                    .filter(
                      (type) => type !== "All"
                    )
                    .map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Main Auditorium"
                />
              </label>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Event"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  onRegister,
  onEdit,
  onDelete,
}) {
  return (
    <article className="event-card">
      <div className="event-card-header">
        <span className="event-type">
          {event.type}
        </span>

        {event.registered && (
          <span className="registered-badge">
            Registered
          </span>
        )}
      </div>

      <h3>{event.title}</h3>

      {event.description && (
        <p className="event-description">
          {event.description}
        </p>
      )}

      <div className="event-details">
        <div>
          <Calendar size={16} />
          {formatDisplayDate(event.date)}
        </div>

        <div>
          <Clock size={16} />
          {formatDisplayTime(event.date)}
        </div>

        {event.location && (
          <div>
            <MapPin size={16} />
            {event.location}
          </div>
        )}

        <div>
          <Users size={16} />
          {event.registrationCount || 0} registered
        </div>
      </div>

      <div className="event-actions">
        <button
          className={`register-button ${
            event.registered
              ? "registered"
              : ""
          }`}
          onClick={() => onRegister(event)}
        >
          {event.registered
            ? "Unregister"
            : "Register"}
        </button>

        <button
          className="icon-button"
          onClick={() => onEdit(event)}
          title="Edit"
        >
          <Pencil size={17} />
        </button>

        <button
          className="icon-button danger"
          onClick={() => onDelete(event._id)}
          title="Delete"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}

function formatDateForInput(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
}

function formatDisplayDate(date) {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayTime(date) {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default Events;