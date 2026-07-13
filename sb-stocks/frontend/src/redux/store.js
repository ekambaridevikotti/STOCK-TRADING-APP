import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import stockReducer from './stockSlice';
import portfolioReducer from './portfolioSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    portfolio: portfolioReducer,
  },
});

export default store;
