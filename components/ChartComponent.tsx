// components/ChartComponent.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

interface ChartComponentProps {
  data: any;
  type?: 'bar' | 'doughnut' | 'line';
  options?: any;
  height?: number;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ 
  data, 
  type = 'bar', 
  options = {},
  height = 300 
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    ...options,
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} />;
      case 'line':
        return <Line data={data} options={defaultOptions} />;
      default:
        return <Bar data={data} options={defaultOptions} />;
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
