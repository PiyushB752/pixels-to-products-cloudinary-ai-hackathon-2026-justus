import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../services/assignmentService";

import "./Assignments.css";

const initialForm = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
  status: "Pending",
};

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(initialForm);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const filteredAssignments = useMemo(() => {
    if (filter === "All") {
      return assignments;
    }

    return assignments.filter(
      (assignment) => assignment.status === filter
    );
  }, [assignments, filter]);

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

  const openEditForm = (assignment) => {
    setEditingId(assignment._id);

    setForm({
      title: assignment.title,
      description: assignment.description || "",
      subject: assignment.subject || "",
      dueDate: formatDateForInput(assignment.dueDate),
      status: assignment.status,
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
      toast.error("Assignment title is required");
      return;
    }

    if (!form.dueDate) {
      toast.error("Due date is required");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateAssignment(editingId, form);
        toast.success("Assignment updated");
      } else {
        await createAssignment(form);
        toast.success("Assignment created");
      }

      closeForm();
      await fetchAssignments();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save assignment"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (assignment, status) => {
    try {
      await updateAssignment(assignment._id, {
        status,
      });

      toast.success("Status updated");
      await fetchAssignments();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this assignment?"
    );

    if (!confirmed) return;

    try {
      await deleteAssignment(id);

      toast.success("Assignment deleted");
      await fetchAssignments();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete assignment"
      );
    }
  };

  if (loading) {
    return (
      <div className="assignments-page">
        <div className="assignment-state">
          Loading assignments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignments-page">
        <div className="assignment-state error">
          <p>{error}</p>

          <button onClick={fetchAssignments}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-page">
      <div className="page-header">
        <div>
          <h1>Assignments</h1>
          <p>
            Keep track of your academic deadlines and
            progress.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Assignment
        </button>
      </div>

      <div className="assignment-filters">
        {["All", "Pending", "In Progress", "Completed"].map(
          (status) => (
            <button
              key={status}
              className={
                filter === status ? "active" : ""
              }
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          )
        )}
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="assignment-empty">
          <CheckCircle2 size={42} />

          <h3>
            {filter === "All"
              ? "No assignments yet"
              : `No ${filter.toLowerCase()} assignments`}
          </h3>

          <p>
            {filter === "All"
              ? "Add your first assignment to start tracking your work."
              : "Try another status filter."}
          </p>

          {filter === "All" && (
            <button
              className="primary-button"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Add Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
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
            className="assignment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Assignment"
                    : "Add Assignment"}
                </h2>

                <p>
                  Add the assignment details below.
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
              className="assignment-form"
              onSubmit={handleSubmit}
            >
              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Database Design Report"
                />
              </label>

              <label>
                Subject
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Database Systems"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Add assignment details..."
                  rows="4"
                />
              </label>

              <label>
                Due Date
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>
                </select>
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
                    ? "Update Assignment"
                    : "Add Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignmentCard({
  assignment,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <article className="assignment-card">
      <div className="assignment-card-top">
        <div>
          {assignment.subject && (
            <span className="assignment-subject">
              {assignment.subject}
            </span>
          )}

          <h3>{assignment.title}</h3>
        </div>

        <span
          className={`status-badge ${getStatusClass(
            assignment.status
          )}`}
        >
          {assignment.status}
        </span>
      </div>

      {assignment.description && (
        <p className="assignment-description">
          {assignment.description}
        </p>
      )}

      <div className="assignment-due-date">
        <Calendar size={16} />

        <span>
          Due {formatDisplayDate(assignment.dueDate)}
        </span>
      </div>

      <div className="assignment-card-actions">
        <select
          value={assignment.status}
          onChange={(event) =>
            onStatusChange(
              assignment,
              event.target.value
            )
          }
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <button
          className="icon-button"
          onClick={() => onEdit(assignment)}
          title="Edit"
        >
          <Pencil size={17} />
        </button>

        <button
          className="icon-button danger"
          onClick={() =>
            onDelete(assignment._id)
          }
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
  if (!date) return "No due date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "Completed":
      return "completed";

    case "In Progress":
      return "progress";

    default:
      return "pending";
  }
}

export default Assignments;