import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendanceService";

import "./Attendance.css";

const initialForm = {
  subject: "",
  classesAttended: 0,
  classesMissed: 0,
};

function Attendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAttendance();
      setAttendance(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "subject" ? value : Number(value),
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item._id);

    setForm({
      subject: item.subject,
      classesAttended: item.classesAttended,
      classesMissed: item.classesMissed,
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

    if (!form.subject.trim()) {
      toast.error("Enter a subject name");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateAttendance(editingId, form);
        toast.success("Attendance updated");
      } else {
        await createAttendance(form);
        toast.success("Attendance added");
      }

      closeForm();
      await fetchAttendance();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this attendance record?"
    );

    if (!confirmed) return;

    try {
      await deleteAttendance(id);

      toast.success("Attendance deleted");
      await fetchAttendance();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete attendance"
      );
    }
  };

  if (loading) {
    return (
      <div className="attendance-page">
        <div className="attendance-state">
          Loading attendance...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-page">
        <div className="attendance-state error">
          <p>{error}</p>
          <button onClick={fetchAttendance}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const overall = attendance?.overall;
  const subjects = attendance?.subjects || [];

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>
            Track your attendance across all subjects.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Subject
        </button>
      </div>

      <section className="attendance-overview">
        <div className="overall-card">
          <span className="overview-label">
            Overall Attendance
          </span>

          <strong className="overall-percentage">
            {overall?.percentage || 0}%
          </strong>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(
                  overall?.percentage || 0,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="attendance-summary">
          <div>
            <span>Attended</span>
            <strong>
              {overall?.classesAttended || 0}
            </strong>
          </div>

          <div>
            <span>Missed</span>
            <strong>
              {overall?.classesMissed || 0}
            </strong>
          </div>

          <div>
            <span>Total Classes</span>
            <strong>
              {overall?.totalClasses || 0}
            </strong>
          </div>
        </div>
      </section>

      <section className="attendance-section">
        <div className="section-header">
          <div>
            <h2>Subject-wise Attendance</h2>
            <p>
              Detailed attendance for each subject.
            </p>
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <h3>No attendance records yet</h3>
            <p>
              Add your first subject to start tracking
              attendance.
            </p>

            <button
              className="primary-button"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Add Subject
            </button>
          </div>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Attended</th>
                  <th>Missed</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.subject}</strong>
                    </td>

                    <td>{item.classesAttended}</td>

                    <td>{item.classesMissed}</td>

                    <td>{item.totalClasses}</td>

                    <td>
                      <span
                        className={`attendance-badge ${
                          item.percentage >= 75
                            ? "good"
                            : "warning"
                        }`}
                      >
                        {item.percentage}%
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-button"
                          onClick={() =>
                            openEditForm(item)
                          }
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-button danger"
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
        >
          <div
            className="attendance-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Attendance"
                    : "Add Attendance"}
                </h2>
                <p>
                  Enter the attendance details for the
                  subject.
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
              className="attendance-form"
              onSubmit={handleSubmit}
            >
              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures"
                />
              </label>

              <label>
                Classes Attended
                <input
                  type="number"
                  name="classesAttended"
                  min="0"
                  value={form.classesAttended}
                  onChange={handleChange}
                />
              </label>

              <label>
                Classes Missed
                <input
                  type="number"
                  name="classesMissed"
                  min="0"
                  value={form.classesMissed}
                  onChange={handleChange}
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
                    ? "Update"
                    : "Add Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;