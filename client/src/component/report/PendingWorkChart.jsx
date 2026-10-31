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

const PendingWorkChart = ({ totalDays, tasks = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const pendingByProject = {};
  tasks
    .filter((t) => t.status !== "Completed")
    .forEach((t) => {
      const projName = t.project?.name || "Unassigned";
      pendingByProject[projName] =
        (pendingByProject[projName] || 0) + (Number(t.timeToComplete) || 0);
    });

  const projectLabels = Object.keys(pendingByProject);
  const labels =
    projectLabels.length > 0 ? projectLabels : ["Total Pending Days"];
  const values =
    projectLabels.length > 0 ? Object.values(pendingByProject) : [totalDays];

  const data = {
    labels,
    datasets: [
      {
        label: "Pending Days",
        data: values,
        backgroundColor: "#f59e0b",
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

export default PendingWorkChart;
