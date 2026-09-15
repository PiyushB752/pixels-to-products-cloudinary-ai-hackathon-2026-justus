import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const AttendanceChart = ({ subjects }) => {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="dashboard-empty-state">
        <p>No attendance data available.</p>
      </div>
    );
  }

  const chartData = subjects.map((subject) => ({
    subject: subject.subject,
    attendance: subject.percentage,
  }));

  return (
    <div className="attendance-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="subject"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />

          <Tooltip />

          <Bar
            dataKey="attendance"
            name="Attendance"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;