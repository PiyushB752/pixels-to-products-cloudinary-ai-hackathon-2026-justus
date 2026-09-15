import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Tasks from "./pages/Tasks";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import AIAssistant from "./pages/AIAssistant";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            <Route
              path="/assignments"
              element={<Assignments />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/events"
              element={<Events />}
            />

            <Route
              path="/announcements"
              element={<Announcements />}
            />

            <Route
              path="/ai-assistant"
              element={<AIAssistant />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;