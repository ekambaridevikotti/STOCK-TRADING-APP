import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks } from '../redux/stockSlice';
import StockTable from '../components/StockTable';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.stocks);
  const { userInfo } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchStocks(search));
  }, [dispatch, search]);

  return (
    <div>
      <h2>Welcome back, {userInfo?.name}</h2>
      <div className="card dashboard-card p-3 my-3">
        <div className="row">
          <div className="col-md-4">
            <h6 className="text-muted">Virtual Balance</h6>
            <h4>${userInfo?.balance?.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="card dashboard-card p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Market Watch</h5>
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? <p>Loading stocks...</p> : <StockTable stocks={list} />}
      </div>
    </div>
  );
};

export default Dashboard;
