import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];

const PortfolioChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return <p className="text-muted">No holdings to display yet.</p>;
  }

  const data = {
    labels: holdings.map((h) => h.symbol),
    datasets: [
      {
        data: holdings.map((h) => h.currentValue),
        backgroundColor: holdings.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '320px', margin: '0 auto' }}>
      <Doughnut data={data} />
    </div>
  );
};

export default PortfolioChart;
