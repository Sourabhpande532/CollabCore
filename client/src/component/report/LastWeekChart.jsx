import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LastWeekChart = ({ count, tasks = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const statusCounts = tasks.reduce(
    (acc, t) => {
      const st = t.status || "To Do";
      acc[st] = (acc[st] || 0) + 1;
      return acc;
    },
    { "Completed (7d)": count },
  );

  const labels =
    tasks.length > 0
      ? ["Completed (7d)", "Completed (All)", "In Progress", "To Do", "Blocked"]
      : ["Completed Tasks"];

  const values =
    tasks.length > 0
      ? [
          count,
          statusCounts.Completed || count,
          statusCounts["In Progress"] || 0,
          statusCounts["To Do"] || 0,
          statusCounts.Blocked || 0,
        ]
      : [count];

  const colors =
    tasks.length > 0
      ? ["#0d9488", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"]
      : ["#0d9488"];

  const data = {
    labels,
    datasets: [
      {
        label: "Tasks",
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: isDark ? "#9ca3af" : "#475569",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#9ca3af" : "#475569" },
        grid: { color: isDark ? "#1f2937" : "#e2e8f0" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: isDark ? "#9ca3af" : "#475569", precision: 0 },
        grid: { color: isDark ? "#1f2937" : "#e2e8f0" },
      },
    },
  };

  return (
    <div style={{ height: "260px", position: "relative" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default LastWeekChart;
