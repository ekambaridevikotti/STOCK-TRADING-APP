import React from 'react';
import { useNavigate } from 'react-router-dom';

const StockTable = ({ stocks }) => {
  const navigate = useNavigate();

  if (!stocks || stocks.length === 0) {
    return <p className="text-muted">No stocks found.</p>;
  }

  return (
    <table className="table table-hover stock-table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Company</th>
          <th>Price</th>
          <th>Change</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((stock) => {
          const change = stock.currentPrice - stock.previousClose;
          const changePercent = stock.previousClose
            ? ((change / stock.previousClose) * 100).toFixed(2)
            : '0.00';
          const isGain = change >= 0;

          return (
            <tr key={stock._id} onClick={() => navigate(`/stocks/${stock.symbol}`)}>
              <td className="fw-bold">{stock.symbol}</td>
              <td>{stock.companyName}</td>
              <td>${stock.currentPrice?.toFixed(2)}</td>
              <td className={isGain ? 'gain' : 'loss'}>
                {isGain ? '+' : ''}
                {change.toFixed(2)} ({changePercent}%)
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StockTable;
