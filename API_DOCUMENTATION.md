# API Documentation
# Penta Financial Analytics Dashboard

Base URL: `http://localhost:5000/api`

All protected endpoints require: `Authorization: Bearer <JWT_TOKEN>`

---

## Authentication

### POST /api/auth/login

Login with email and password.

**Request body:**
```json
{ "email": "admin@penta.com", "password": "password123" }
```

**Success 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": { "_id": "...", "email": "admin@penta.com", "name": "Admin User", "avatarUrl": "..." }
  }
}
```

**Error 401:**
```json
{ "success": false, "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password" } }
```

---

### POST /api/auth/logout *(protected)*

Clears server-side session (JWT is stateless; client must delete the token).

**Success 200:**
```json
{ "success": true, "data": { "message": "Logged out successfully" } }
```

---

### GET /api/auth/me *(protected)*

Returns current authenticated user profile. Password hash is never included.

**Success 200:**
```json
{ "success": true, "data": { "user": { "_id": "...", "email": "...", "name": "..." } } }
```

---

## Dashboard

### GET /api/dashboard/summary *(protected)*

Returns aggregate financial metrics calculated from MongoDB.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 175000.50,
    "totalExpenses": 120000.75,
    "balance": 54999.75,
    "savings": 54999.75,
    "revenueChange": 12.5,
    "expensesChange": -3.2,
    "balanceChange": 8.1,
    "savingsChange": 8.1
  }
}
```

Notes:
- `balance = totalRevenue - totalExpenses`
- `savings = balance` (net income)
- `*Change` fields are month-over-month percentage change

---

### GET /api/dashboard/trends *(protected)*

Returns monthly revenue/expense trend for a full year.

**Query params:**
- `year` (optional, default: most recent year in dataset)

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "Jan", "monthNum": 1, "year": 2024, "revenue": 15000.00, "expenses": 8500.00 },
    { "month": "Feb", "monthNum": 2, "year": 2024, "revenue": 12000.00, "expenses": 9200.00 },
    ...12 entries total
  ]
}
```

---

### GET /api/dashboard/categories *(protected)*

Returns category breakdown with totals and percentages.

**Response:**
```json
{
  "success": true,
  "data": [
    { "category": "Revenue", "total": 175000.50, "count": 150, "percentage": 59.3 },
    { "category": "Expense", "total": 120000.75, "count": 150, "percentage": 40.7 }
  ]
}
```

---

### GET /api/dashboard/recent *(protected)*

Returns the 5 most recent transactions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "id": 247,
      "date": "2024-11-29T08:36:15.000Z",
      "amount": 2700.00,
      "category": "Revenue",
      "status": "Paid",
      "user_id": "user_003",
      "user_profile": "https://thispersondoesnotexist.com/",
      "userName": "Riley Johnson"
    }
  ]
}
```

---

## Transactions

### GET /api/transactions *(protected)*

Returns paginated, filtered, sorted transactions.

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | — | Text search across user_id, category, status |
| `dateFrom` | ISO date | — | Start of date range (inclusive) |
| `dateTo` | ISO date | — | End of date range (inclusive, end of day) |
| `amountMin` | number | — | Minimum amount (inclusive) |
| `amountMax` | number | — | Maximum amount (inclusive) |
| `category` | `Revenue` \| `Expense` | — | Filter by category |
| `status` | `Paid` \| `Pending` | — | Filter by status |
| `user_id` | string | — | Filter by user_id (e.g. `user_001`) |
| `sortField` | string | `date` | Field to sort by: `date`, `amount`, `category`, `status`, `user_id`, `id` |
| `sortDir` | `asc` \| `desc` | `desc` | Sort direction |
| `page` | number | `1` | Page number (1-based) |
| `limit` | number | `10` | Records per page (max 100) |

**Success 200:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 300,
    "totalPages": 30
  }
}
```

**Example requests:**
```
GET /api/transactions?category=Revenue&status=Paid&page=1&limit=10
GET /api/transactions?dateFrom=2024-01-01&dateTo=2024-03-31&sortField=amount&sortDir=desc
GET /api/transactions?search=user_001&page=2&limit=25
GET /api/transactions?amountMin=1000&amountMax=3000&category=Expense
```

---

### GET /api/transactions/:id *(protected)*

Returns a single transaction by MongoDB ObjectId.

**Success 200:**
```json
{ "success": true, "data": { "_id": "...", "id": 42, ... } }
```

**Error 404:**
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "Transaction not found" } }
```

---

### POST /api/transactions/export *(protected — Part 2)*

Generates and returns a CSV file.

**Request body:**
```json
{
  "fields": ["id", "date", "amount", "category", "status", "userName"],
  "filters": { "category": "Revenue", "status": "Paid" }
}
```

**Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="transactions_export_2024-01-01T00-00-00.csv"

id,date,amount,category,status,userName
1,2024-01-15,1500.00,Revenue,Paid,Alex Morgan
...
```

---

## Standard Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `INVALID_TOKEN` | 401 | JWT signature invalid |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `SERVER_ERROR` | 500 | Internal server error |
