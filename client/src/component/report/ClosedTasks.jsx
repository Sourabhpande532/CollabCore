import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClosedTasksChart = ({ data = {} }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const labels = Object.keys(data);
  const values = Object.values(data);

  if (labels.length === 0) {
    return (
      <div className='text-center py-5 text-secondary'>
        No completed tasks recorded for this breakdown yet.
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#0d9488",
          "#0284c7",
          "#f59e0b",
          "#10b981",
          "#ef4444",
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? "#111827" : "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#9ca3af" : "#475569",
          padding: 16,
        },
      },
    },
  };

  return (
    <div style={{ height: "280px", position: "relative" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ClosedTasksChart;
