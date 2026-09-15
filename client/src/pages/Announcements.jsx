import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Edit,
  FileText,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../services/announcementService";

import "./Announcements.css";

const categories = [
  "All",
  "Exam",
  "Assignment",
  "Event",
  "Academic",
  "General",
];

const categoryIcons = {
  Exam: FileText,
  Assignment: FileText,
  Event: Calendar,
  Academic: Bell,
  General: Bell,
};

const emptyForm = {
  title: "",
  content: "",
  category: "General",
  publishedAt: "",
};

const formatDate = (date) => {
  if (!date) return "No date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAnnouncements({
        category: activeCategory,
        search,
      });

      setAnnouncements(data.announcements || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load announcements";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAnnouncements();
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);

    setForm({
      title: announcement.title || "",
      content: announcement.content || "",
      category: announcement.category || "General",
      publishedAt: announcement.publishedAt
        ? new Date(announcement.publishedAt).toISOString().slice(0, 16)
        : "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!form.content.trim()) {
      toast.error("Please enter announcement content");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        content: form.content,
        category: form.category,
        publishedAt: form.publishedAt || undefined,
      };

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, payload);
        toast.success("Announcement updated");
      } else {
        await createAnnouncement(payload);
        toast.success("Announcement created");
      }

      closeModal();
      fetchAnnouncements();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    try {
      await deleteAnnouncement(id);

      toast.success("Announcement deleted");

      setAnnouncements((previous) =>
        previous.filter((announcement) => announcement._id !== id)
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete announcement"
      );
    }
  };

  return (
    <div className="announcements-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Campus updates</p>
          <h1>Announcements</h1>
          <p className="page-description">
            Stay updated with important college notices and academic updates.
          </p>
        </div>

        <button className="primary-button" onClick={openCreateModal}>
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      <div className="announcement-toolbar">
        <div className="announcement-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="announcement-state">
          <div className="loading-spinner" />
          <p>Loading announcements...</p>
        </div>
      ) : error ? (
        <div className="announcement-state error-state">
          <Bell size={32} />
          <h3>Unable to load announcements</h3>
          <p>{error}</p>
          <button
            className="secondary-button"
            onClick={fetchAnnouncements}
          >
            Try Again
          </button>
        </div>
      ) : announcements.length === 0 ? (
        <div className="announcement-state">
          <Bell size={40} />
          <h3>No announcements found</h3>
          <p>
            {search
              ? "Try a different search term."
              : "There are no announcements in this category yet."}
          </p>
        </div>
      ) : (
        <div className="announcement-list">
          {announcements.map((announcement) => {
            const Icon =
              categoryIcons[announcement.category] || Bell;

            return (
              <article
                className="announcement-card"
                key={announcement._id}
              >
                <div className="announcement-icon">
                  <Icon size={20} />
                </div>

                <div className="announcement-content">
                  <div className="announcement-card-top">
                    <span
                      className={`announcement-category category-${announcement.category.toLowerCase()}`}
                    >
                      {announcement.category}
                    </span>

                    <span className="announcement-date">
                      <Calendar size={14} />
                      {formatDate(announcement.publishedAt)}
                    </span>
                  </div>

                  <h2>{announcement.title}</h2>

                  <p>{announcement.content}</p>
                </div>

                <div className="announcement-actions">
                  <button
                    title="Edit announcement"
                    onClick={() =>
                      openEditModal(announcement)
                    }
                  >
                    <Edit size={17} />
                  </button>

                  <button
                    title="Delete announcement"
                    className="delete-action"
                    onClick={() =>
                      handleDelete(announcement._id)
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="announcement-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingAnnouncement
                    ? "Edit Announcement"
                    : "Create Announcement"}
                </h2>

                <p>
                  {editingAnnouncement
                    ? "Update this campus notice."
                    : "Publish a new campus notice."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter announcement title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="Write the announcement..."
                  value={form.content}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {categories
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="publishedAt">
                    Published At
                  </label>
                  <input
                    id="publishedAt"
                    name="publishedAt"
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                  disabled={saving}
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
                    : editingAnnouncement
                    ? "Update Announcement"
                    : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;