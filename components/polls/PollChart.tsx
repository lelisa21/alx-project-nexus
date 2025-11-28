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
import { Bar, Doughnut } from 'react-chartjs-2';
import { Poll } from '@/interface';

// Register ChartJS components
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

  // Chart options
  const options: ChartOptions<'bar' | 'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6B7280', 
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB', 
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
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

  // Chart data
  const data = {
    labels: poll.options.map(opt => opt.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(opt => opt.votes),
        backgroundColor: [
          'rgba(25, 158, 11, 0.8)', 
          'rgba(150, 102, 241, 0.8)',  
          'rgba(59, 10, 246, 0.8)', 
          'rgba(16, 185, 129, 0.8)',  
          'rgba(239, 68, 68, 0.8)', 
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(249, 115, 22, 0.8)',  
        ],
        borderColor: [
          'rgb(25, 158, 11)',
          'rgb(99, 102, 241)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(249, 115, 22)',
        ],
        borderWidth: 2,
        borderRadius: 0,
      },
    ],
  };

  // Dark mode adaptation
  useEffect(() => {
    const updateChartForDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (chartRef.current) {
        const chart = chartRef.current;
        
        // Update legend colors for dark mode
        if (chart.options.plugins.legend.labels) {
          chart.options.plugins.legend.labels.color = isDark ? '#9CA3AF' : '#6B7280';
        }
        
        chart.update('none');
      }
    };

    updateChartForDarkMode();
    

    const observer = new MutationObserver(updateChartForDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  if (poll.totalVotes === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No votes yet</p>
          <p className="text-sm">Chart will appear when votes come in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      {type === 'bar' ? (
        <Bar 
          ref={chartRef} 
          data={data} 
          options={options as ChartOptions<'bar'>} 
        />
      ) : (
        <Doughnut 
          ref={chartRef} 
          data={data} 
          options={options as ChartOptions<'doughnut'>} 
        />
      )}
    </div>
  );
}
