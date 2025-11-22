
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar , Doughnut } from 'react-chartjs-2';
import { Poll } from '@/interface';
import { getRandomColor } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface PollChartProps {
  poll: Poll;
  type?: 'bar' | 'doughnut';
}

export function PollChart({ poll, type = 'bar' }: PollChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);

  const options: ChartOptions<'bar' | 'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || context.raw;
            const total = poll.totalVotes;
            const percentage = total > 0 ? ((value as number) / total * 100).toFixed(1) : '0';
            return `${label}: ${value} votes (${percentage}%)`;
          },
        },
      },
    },
  };

  const data = {
    labels: poll.options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(opt => opt.votes),
        backgroundColor: poll.options.map((_, index) => {
          const color = getRandomColor(index).replace('bg-', '');
          return `var(--tw-${color})`;
        }),
        borderColor: poll.options.map((_, index) => {
          const color = getRandomColor(index).replace('bg-', '');
          return `var(--tw-${color})`;
        }),
        borderWidth: 2,
      },
    ],
  };

  // Add CSS variables for Chart.js colors
  useEffect(() => {
    const root = document.documentElement;
    const colors = [
      'indigo-500', 'blue-500', 'green-500', 'yellow-500',
      'red-500', 'purple-500', 'pink-500', 'orange-500'
    ];
    
    colors.forEach(color => {
      const computedStyle = getComputedStyle(root);
      const value = computedStyle.getPropertyValue(`--${color}`);
      if (!value) {
        root.style.setProperty(`--tw-${color}`, 
          color === 'indigo-500' ? '#6366f1' :
          color === 'blue-500' ? '#3b82f6' :
          color === 'green-500' ? '#10b981' :
          color === 'yellow-500' ? '#f59e0b' :
          color === 'red-500' ? '#ef4444' :
          color === 'purple-500' ? '#8b5cf6' :
          color === 'pink-500' ? '#ec4899' :
          '#f97316'
        );
      }
    });
  }, []);

  return (
    <div className="h-64">
      {type === 'bar' ? (
        <Bar ref={chartRef} data={data} options={options as ChartOptions<'bar'>} />
      ) : (
        <Doughnut ref={chartRef} data={data} options={options as ChartOptions<'doughnut'>} />
      )}
    </div>
  );
}
