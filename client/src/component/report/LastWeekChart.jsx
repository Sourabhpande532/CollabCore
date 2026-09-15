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

const LastWeekChart = ({ count }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const data = {
    labels: ["Completed Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [count],
        backgroundColor: "#0d9488",
        borderRadius: 6,
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
    scales: {
      x: {
        ticks: { color: isDark ? "#9ca3af" : "#475569" },
        grid: { color: isDark ? "#1f2937" : "#e2e8f0" },
      },
      y: {
        ticks: { color: isDark ? "#9ca3af" : "#475569" },
        grid: { color: isDark ? "#1f2937" : "#e2e8f0" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default LastWeekChart;
