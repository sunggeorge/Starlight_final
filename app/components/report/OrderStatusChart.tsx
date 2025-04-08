import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export interface OrderStatusData {
  status: string;
  amount: number;
}

interface Props {
  data: OrderStatusData[];
}

const OrderStatusChart: React.FC<Props> = ({ data }) => {
  const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#9CCC65'];

  const barData = {
    labels: data.map((d) => d.status),
    datasets: [
      {
        label: 'Amount',
        data: data.map((d) => d.amount),
        backgroundColor: data.map((_, i) => chartColors[i % chartColors.length]),
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const pieData = {
    labels: data.map((d) => d.status),
    datasets: [
      {
        label: 'Amount',
        data: data.map((d) => d.amount),
        backgroundColor: data.map((_, i) => chartColors[i % chartColors.length]),
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const total = context.chart._metasets[0].total;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-4">
      <div className="w-full md:w-1/2">
        <h3 className="text-md font-semibold mb-2 text-center">Bar Chart</h3>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="text-md font-semibold mb-2 text-center">Pie Chart</h3>
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default OrderStatusChart;