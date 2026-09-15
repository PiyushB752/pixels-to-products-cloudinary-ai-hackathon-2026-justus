import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Circle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import "./Tasks.css";

const initialForm = {
  title: "",
  description: "",
  priority: "Medium",
  dueDate: "",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(initialForm);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "All") {
      return tasks;
    }

    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }

    if (filter === "Pending") {
      return tasks.filter((task) => !task.completed);
    }

    return tasks.filter(
      (task) => task.priority === filter
    );
  }, [tasks, filter]);

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

  const openEditForm = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: formatDateForInput(task.dueDate),
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
      toast.error("Task title is required");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateTask(editingId, form);
        toast.success("Task updated");
      } else {
        await createTask(form);
        toast.success("Task created");
      }

      closeForm();
      await fetchTasks();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save task"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      await updateTask(task._id, {
        completed: !task.completed,
      });

      await fetchTasks();

      toast.success(
        task.completed
          ? "Task marked as pending"
          : "Task completed"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(id);

      toast.success("Task deleted");
      await fetchTasks();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="task-state">
          Loading tasks...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tasks-page">
        <div className="task-state error">
          <p>{error}</p>

          <button onClick={fetchTasks}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>
            Organize your personal and academic tasks.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="task-summary">
        <div>
          <span>Total</span>
          <strong>{tasks.length}</strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {tasks.filter(
              (task) => !task.completed
            ).length}
          </strong>
        </div>

        <div>
          <span>Completed</span>
          <strong>
            {tasks.filter(
              (task) => task.completed
            ).length}
          </strong>
        </div>

        <div>
          <span>High Priority</span>
          <strong>
            {tasks.filter(
              (task) =>
                task.priority === "High" &&
                !task.completed
            ).length}
          </strong>
        </div>
      </div>

      <div className="task-filters">
        {[
          "All",
          "Pending",
          "Completed",
          "High",
          "Medium",
          "Low",
        ].map((item) => (
          <button
            key={item}
            className={
              filter === item ? "active" : ""
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="task-empty">
          <Circle size={42} />

          <h3>
            {filter === "All"
              ? "No tasks yet"
              : `No ${filter.toLowerCase()} tasks`}
          </h3>

          <p>
            {filter === "All"
              ? "Create a task to start organizing your work."
              : "Try another filter."}
          </p>

          {filter === "All" && (
            <button
              className="primary-button"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Add Task
            </button>
          )}
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={toggleTask}
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
            className="task-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Task"
                    : "Add Task"}
                </h2>

                <p>
                  Add the details for your task.
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
              className="task-form"
              onSubmit={handleSubmit}
            >
              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Review lecture notes"
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Add task details..."
                  rows="4"
                />
              </label>

              <label>
                Priority
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="High">High</option>
                </select>
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
                    ? "Update Task"
                    : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`task-item ${
        task.completed ? "completed" : ""
      }`}
    >
      <button
        className={`task-check ${
          task.completed ? "checked" : ""
        }`}
        onClick={() => onToggle(task)}
        title={
          task.completed
            ? "Mark as pending"
            : "Mark as completed"
        }
      >
        {task.completed ? (
          <Check size={17} />
        ) : (
          <Circle size={18} />
        )}
      </button>

      <div className="task-content">
        <div className="task-title-row">
          <h3>{task.title}</h3>

          <span
            className={`priority-badge ${task.priority.toLowerCase()}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p>{task.description}</p>
        )}

        {task.dueDate && (
          <div className="task-due-date">
            <Calendar size={15} />
            Due {formatDisplayDate(task.dueDate)}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          className="icon-button"
          onClick={() => onEdit(task)}
          title="Edit"
        >
          <Pencil size={17} />
        </button>

        <button
          className="icon-button danger"
          onClick={() => onDelete(task._id)}
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

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default Tasks;