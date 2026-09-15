import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClosedTasksChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#10b881",
          "#0284c7",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? "#111827" : "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#9ca3af" : "#475569",
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default ClosedTasksChart;
