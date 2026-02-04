import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);

const PendingWorkChart = ({ totalDays }) => {
  const data = {
    labels: ["Pending Days"],
    datasets: [
      {
        label: "Days",
        data: [totalDays],
        backgroundColor: "#ffc107",
      },
    ],
  };

  return <Bar data={data} />;
};

export default PendingWorkChart;
