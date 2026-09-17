# Penta — Financial Analytics Dashboard

A production-quality full-stack Financial Analytics Dashboard built as a technical assignment.

---

## Features

- **JWT Authentication** — Login / logout, protected routes and APIs
- **Interactive Dashboard** — Summary cards, Revenue vs Expense trend chart, category breakdown, recent transactions
- **Transactions Table** — Server-side pagination, filtering (date, amount, category, status, user), search, and column sorting
- **CSV Export** — Configurable column selection modal, automatic browser download
- **Error Handling** — Visible AlertChip notifications for all error states
- **Dark UI** — Faithfully reproduced from Figma "Penta" financial dashboard design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Material UI v5, Recharts, React Router v6, Axios |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| CSV | json2csv |

---

## Project Structure

```
financial-analytics-dashboard/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express + TypeScript
├── data/
│   └── transactions.json   # 300-record sample dataset
├── README.md
├── PROJECT_ANALYSIS.md
├── DATA_VALIDATION.md
└── PART1_CHECKPOINT.md
```

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017 (or any MongoDB URI)
- npm v9+

---

## Environment Variables

### Backend (`backend/.env`)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/financial_analytics
JWT_SECRET=penta_financial_dashboard_jwt_secret_2024_do_not_expose
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

---

## Setup Instructions

### 1. Clone / open the project

```
cd financial-analytics-dashboard
```

### 2. Install backend dependencies

```
cd backend
npm install
```

### 3. Install frontend dependencies

```
cd frontend
npm install
```

### 4. Configure environment

Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in your MongoDB URI.

### 5. Seed the database

This imports all 300 transactions and creates demo users:

```
cd backend
npm run seed
```

Expected output:
```
Connected to MongoDB
Seeding users...
✓ Seeded 2 users
Loading 300 transactions...
✓ Seeded 300 transactions
── Seed complete ──────────────────────────────────────
Demo login credentials:
  Email:    admin@penta.com
  Password: password123
```

---

## Running the Application

### Start the backend

```
cd backend
npm run dev
```

Server starts on: `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

### Start the frontend

```
cd frontend
npm run dev
```

App opens on: `http://localhost:5173`

---

## Demo Login Credentials

| Field | Value |
|---|---|
| Email | `admin@penta.com` |
| Password | `password123` |

---

## Dataset

The sample dataset (`data/transactions.json`) contains **300 records** with the following fields:

| Field | Type | Values |
|---|---|---|
| `id` | Number | 1–300 |
| `date` | ISO 8601 | Jan–Dec 2024 |
| `amount` | Float (always positive) | $150–$5000 |
| `category` | String | `"Revenue"`, `"Expense"` |
| `status` | String | `"Paid"`, `"Pending"` |
| `user_id` | String | `user_001`–`user_004` |
| `user_profile` | String (URL) | `https://thispersondoesnotexist.com/` |

**Display name mapping (presentation layer):**
- `user_001` → Alex Morgan
- `user_002` → Jamie Chen
- `user_003` → Riley Johnson
- `user_004` → Sam Williams

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/dashboard/summary` | Yes | Balance, revenue, expenses, savings |
| GET | `/api/dashboard/trends` | Yes | Monthly revenue/expense trend |
| GET | `/api/dashboard/categories` | Yes | Category breakdown |
| GET | `/api/dashboard/recent` | Yes | 5 most recent transactions |
| GET | `/api/transactions` | Yes | Paginated, filtered, sorted list |
| GET | `/api/transactions/:id` | Yes | Single transaction |
| POST | `/api/transactions/export` | Yes | CSV export (Part 2) |

See `API_DOCUMENTATION.md` for full query parameter reference.

---

## Building for Production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```
