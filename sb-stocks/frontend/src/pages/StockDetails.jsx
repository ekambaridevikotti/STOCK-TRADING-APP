import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import TradeModal from '../components/TradeModal';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/stocks/${symbol}`);
      setStock(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  if (loading) return <p>Loading...</p>;
  if (!stock) return <p>Stock not found.</p>;

  const change = stock.currentPrice - stock.previousClose;
  const isGain = change >= 0;

  return (
    <div>
      <div className="card dashboard-card p-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h2>{stock.symbol}</h2>
            <p className="text-muted mb-1">{stock.companyName}</p>
            <p className="text-muted">Sector: {stock.sector}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Trade
          </button>
        </div>

        <hr />
        <div className="row">
          <div className="col-md-3">
            <h6 className="text-muted">Current Price</h6>
            <h4>${stock.currentPrice?.toFixed(2)}</h4>
          </div>
          <div className="col-md-3">
            <h6 className="text-muted">Change</h6>
            <h4 className={isGain ? 'gain' : 'loss'}>{change.toFixed(2)}</h4>
          </div>
          <div className="col-md-3">
            <h6 className="text-muted">Day High</h6>
            <h4>${stock.dayHigh?.toFixed(2)}</h4>
          </div>
          <div className="col-md-3">
            <h6 className="text-muted">Day Low</h6>
            <h4>${stock.dayLow?.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      {showModal && (
        <TradeModal
          stock={stock}
          onClose={() => setShowModal(false)}
          onSuccess={fetchStock}
        />
      )}
    </div>
  );
};

export default StockDetails;
