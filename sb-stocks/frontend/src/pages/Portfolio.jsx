import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio } from '../redux/portfolioSlice';
import PortfolioChart from '../components/PortfolioChart';

const Portfolio = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  if (loading || !data) return <p>Loading portfolio...</p>;

  return (
    <div>
      <h2>My Portfolio</h2>
      <div className="row my-3">
        <div className="col-md-4">
          <div className="card dashboard-card p-3">
            <h6 className="text-muted">Cash Balance</h6>
            <h4>${data.balance?.toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-3">
            <h6 className="text-muted">Holdings Value</h6>
            <h4>${data.totalCurrentValue?.toLocaleString()}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-3">
            <h6 className="text-muted">Net Worth</h6>
            <h4>${data.netWorth?.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="card dashboard-card p-3">
            <h5>Holdings</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg. Price</th>
                  <th>Current Price</th>
                  <th>P/L</th>
                </tr>
              </thead>
              <tbody>
                {data.holdings.map((h) => (
                  <tr key={h.symbol}>
                    <td className="fw-bold">{h.symbol}</td>
                    <td>{h.quantity}</td>
                    <td>${h.averageBuyPrice.toFixed(2)}</td>
                    <td>${h.currentPrice.toFixed(2)}</td>
                    <td className={h.profitLoss >= 0 ? 'gain' : 'loss'}>
                      {h.profitLoss >= 0 ? '+' : ''}
                      {h.profitLoss.toFixed(2)} ({h.profitLossPercent.toFixed(2)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card dashboard-card p-3">
            <h5>Allocation</h5>
            <PortfolioChart holdings={data.holdings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
