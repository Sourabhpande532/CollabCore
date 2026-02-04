import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ClosedTasksChart = ({ data }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#198754",
          "#0d6efd",
          "#dc3545",
          "#6f42c1",
          "#fd7e14",
        ],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default ClosedTasksChart;
