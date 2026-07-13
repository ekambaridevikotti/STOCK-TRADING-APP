import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminPanel = () => {
  const [stocks, setStocks] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ symbol: '', companyName: '', sector: '', currentPrice: '' });

  const fetchData = async () => {
    try {
      const [stocksRes, usersRes] = await Promise.all([
        api.get('/stocks'),
        api.get('/admin/users'),
      ]);
      setStocks(stocksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateStock = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stocks', {
        ...form,
        currentPrice: Number(form.currentPrice),
      });
      toast.success('Stock added');
      setForm({ symbol: '', companyName: '', sector: '', currentPrice: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add stock');
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      await api.delete(`/admin/stocks/${id}`);
      toast.success('Stock deactivated');
      fetchData();
    } catch (err) {
      toast.error('Failed to deactivate stock');
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await api.put(`/admin/users/${id}/status`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <div className="card dashboard-card p-3 my-3">
        <h5>Add New Stock</h5>
        <form className="row g-2" onSubmit={handleCreateStock}>
          <div className="col-md-2">
            <input
              className="form-control"
              placeholder="Symbol"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Company Name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Sector"
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              step="0.01"
              className="form-control"
              placeholder="Price"
              value={form.currentPrice}
              onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              Add Stock
            </button>
          </div>
        </form>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card dashboard-card p-3">
            <h5>Manage Stocks</h5>
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
                {stocks.map((s) => (
                  <tr key={s._id}>
                    <td>{s.symbol}</td>
                    <td>{s.companyName}</td>
                    <td>${s.currentPrice?.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteStock(s._id)}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card dashboard-card p-3">
            <h5>Manage Users</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleToggleUser(u._id)}
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
