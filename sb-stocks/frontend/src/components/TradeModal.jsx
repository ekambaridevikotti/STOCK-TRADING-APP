import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const TradeModal = ({ stock, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('BUY');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === 'BUY' ? '/transactions/buy' : '/transactions/sell';
      await api.post(endpoint, { symbol: stock.symbol, quantity: Number(quantity) });
      toast.success(`${type === 'BUY' ? 'Bought' : 'Sold'} ${quantity} share(s) of ${stock.symbol}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Trade {stock.symbol}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Action</label>
                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <p>
                Current Price: <strong>${stock.currentPrice?.toFixed(2)}</strong>
              </p>
              <p>
                Estimated Total: <strong>${(stock.currentPrice * quantity).toFixed(2)}</strong>
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : `Confirm ${type}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
