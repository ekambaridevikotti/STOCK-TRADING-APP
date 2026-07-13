# SB Stocks

SB Stocks is a full-stack MERN (MongoDB, Express, React, Node) application that lets users
practice stock trading with virtual funds — no financial risk. It includes user
registration/login, a stock catalog, buy/sell simulation, portfolio and watchlist
management, and an admin panel for managing stock listings and users.

## Project Structure

```
sb-stocks/
├── backend/            # Express + MongoDB API
│   ├── config/         # DB connection
│   ├── models/         # Mongoose schemas (User, Stock, Portfolio, Transaction, Watchlist)
│   ├── controllers/    # Route handlers / business logic
│   ├── routes/         # Express routers
│   ├── middleware/     # Auth, admin, error handling
│   ├── utils/          # Helpers (JWT generation)
│   ├── seed/           # Sample stock data seeder
│   ├── server.js        # App entrypoint
│   └── package.json
└── frontend/           # React SPA
    ├── public/
    └── src/
        ├── components/  # Navbar, StockTable, TradeModal, PortfolioChart, PrivateRoute
        ├── pages/       # Login, Register, Dashboard, StockDetails, Portfolio, Watchlist, AdminPanel
        ├── redux/       # Redux Toolkit store + slices (auth, stocks, portfolio)
        ├── services/    # Axios API client with JWT interceptor
        └── App.jsx
```

## Getting Started

### Prerequisites
- Node.js v16+
- npm
- MongoDB (local install or a MongoDB Atlas cluster)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set MONGO_URI, JWT_SECRET, PORT, etc.
npm run dev
```

The API will run at `http://localhost:5000/api` by default.

Optionally seed some sample stocks so the app has data to trade:

```bash
node seed/seedStocks.js
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL if your backend runs elsewhere
npm start
```

The React app will run at `http://localhost:3000`.

### 3. Creating an Admin User

By default, every new registration gets the `user` role. To promote a user to `admin`,
update their document directly in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Core Features

- **Auth**: JWT-based registration/login with bcrypt password hashing.
- **Stock Listings**: Search and browse stocks with live-style price fields.
- **Paper Trading**: Buy/sell endpoints that update balance, holdings, and record transactions.
- **Portfolio**: Real-time valuation, profit/loss per holding, and a doughnut chart of allocation.
- **Watchlist**: Add/remove stocks to track without holding them.
- **Admin Panel**: Create/update/deactivate stocks and activate/deactivate user accounts.

## Notes on Real-Time Market Data

This scaffold ships with a `Stock` model and admin CRUD so you can manage listings
manually or seed them. To pull real-time US market data, wire up a provider such as
Finnhub, IEX Cloud, or Alpha Vantage inside `backend/controllers/stockController.js`
(the `.env.example` already reserves `STOCK_API_KEY` / `STOCK_API_BASE_URL` for this).

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend**: React, Redux Toolkit, React Router, Axios, Chart.js, Bootstrap, React Toastify
