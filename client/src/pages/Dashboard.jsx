import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ClipboardList,
  CheckSquare,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/dashboardService";

import StatCard from "../components/dashboard/StatCard";
import AttendanceChart from "../components/dashboard/AttendanceChart";
import AssignmentPreview from "../components/dashboard/AssignmentPreview";
import EventPreview from "../components/dashboard/EventPreview";
import "../pages/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboard();

      setDashboard(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button onClick={loadDashboard}>
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  const statistics = dashboard?.statistics;

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Student Dashboard
          </p>

          <h1>
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>

          <p>
            Here's a quick overview of your campus
            activities.
          </p>
        </div>
      </section>

      <section className="dashboard-stats">
        <StatCard
          title="Attendance"
          value={`${statistics?.overallAttendance ?? 0}%`}
          description="Overall attendance"
          icon={CalendarCheck}
        />

        <StatCard
          title="Assignments"
          value={statistics?.totalPendingAssignments ?? 0}
          description="Pending assignments"
          icon={ClipboardList}
        />

        <StatCard
          title="Tasks"
          value={statistics?.totalPendingTasks ?? 0}
          description="Tasks remaining"
          icon={CheckSquare}
        />

        <StatCard
          title="Events"
          value={statistics?.upcomingEvents ?? 0}
          description="Upcoming events"
          icon={CalendarDays}
        />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card attendance-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Attendance Overview</h2>
              <p>
                Subject-wise attendance percentage
              </p>
            </div>
          </div>

          <AttendanceChart
            subjects={dashboard?.attendance?.subjects}
          />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Upcoming Assignments</h2>
              <p>Your next deadlines</p>
            </div>
          </div>

          <AssignmentPreview
            assignments={dashboard?.assignments}
          />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Upcoming Events</h2>
              <p>What's happening on campus</p>
            </div>
          </div>

          <EventPreview
            events={dashboard?.events}
          />
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Recent Announcements</h2>
              <p>Latest campus updates</p>
            </div>
          </div>

          {dashboard?.announcements?.length > 0 ? (
            <div className="dashboard-list">
              {dashboard.announcements.map(
                (announcement) => (
                  <div
                    className="dashboard-list-item"
                    key={announcement._id}
                  >
                    <div>
                      <strong>
                        {announcement.title}
                      </strong>

                      <span>
                        {announcement.category}
                      </span>
                    </div>

                    <span>
                      {new Date(
                        announcement.publishedAt,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <p>No recent announcements.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;