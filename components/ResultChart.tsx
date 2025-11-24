
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Poll } from "../interface";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {

  data: any;
  type?: "bar" | "doughnut";
  options?: any;
  height?: number;
}

export const ChartComponent: React.FC<ChartProps> = ({
  data,
  type = "bar",
  options = {},
  height = 300,
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    ...options,
  };

  const Chart = type === "bar" ? Bar : Doughnut;

  return (
    <div style={{ height: `${height}px` }}>
      <Chart data={data} options={defaultOptions} />
    </div>
  );
};


interface Props {
  poll: Poll;
}

export const ResultChart: React.FC<Props> = ({ poll }) => {
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

  return (
    <div style={{ height: "300px" }}>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default ResultChart;
