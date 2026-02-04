import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LastWeekChart = ({ count }) => {
  const data = {
    labels: ["Completed Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [count],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  return <Bar data={data} />;
};

export default LastWeekChart;
