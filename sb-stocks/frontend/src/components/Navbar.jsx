import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        SB Stocks
      </Link>
      {userInfo && (
        <div className="d-flex ms-auto align-items-center gap-3">
          <Link className="nav-link text-light" to="/">
            Dashboard
          </Link>
          <Link className="nav-link text-light" to="/portfolio">
            Portfolio
          </Link>
          <Link className="nav-link text-light" to="/watchlist">
            Watchlist
          </Link>
          {userInfo.role === 'admin' && (
            <Link className="nav-link text-light" to="/admin">
              Admin
            </Link>
          )}
          <span className="text-light small">
            Balance: ${userInfo.balance?.toLocaleString()}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
