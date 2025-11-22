import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Poll } from "../interface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  poll: Poll;
}

const ResultChart: React.FC<Props> = ({ poll }) => {
  const data = {
    labels: poll.options.map((o) => o.text),
    datasets: [
      {
        label: "# of Votes",
        data: poll.options.map((o) => o.votes),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return <Bar data={data} />;
};

export default ResultChart;
