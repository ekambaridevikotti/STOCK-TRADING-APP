import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState({ stocks: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/watchlist');
      setWatchlist(data);
    } catch (err) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (symbol) => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      toast.success(`Removed ${symbol} from watchlist`);
      fetchWatchlist();
    } catch (err) {
      toast.error('Failed to remove stock');
    }
  };

  if (loading) return <p>Loading watchlist...</p>;

  return (
    <div>
      <h2>My Watchlist</h2>
      <div className="card dashboard-card p-3 mt-3">
        {watchlist.stocks.length === 0 ? (
          <p className="text-muted">Your watchlist is empty. Add stocks from their detail page.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.stocks.map((stock) => (
                <tr key={stock._id}>
                  <td className="fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate(`/stocks/${stock.symbol}`)}>
                    {stock.symbol}
                  </td>
                  <td>{stock.companyName}</td>
                  <td>${stock.currentPrice?.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(stock.symbol)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
