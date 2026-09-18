# Postman Collection Guide
# Looper AI — Financial Analytics Dashboard

---

## 1. Importing the Collection

1. Open **Postman**.
2. Click **Import** (top-left).
3. Select **File** and choose:
   ```
   Looper_AI_Financial_Analytics_Postman_Collection.json
   ```
4. Click **Import**. The collection appears in the left sidebar under **Collections**.

---

## 2. Setting `{{baseUrl}}`

The collection variable `{{baseUrl}}` is pre-set to `http://localhost:5000`.

To change it:
1. Click the collection name → **Variables** tab.
2. Edit the **Current Value** of `baseUrl`.
3. For local development: `http://localhost:5000` (default).
4. For a deployed server: replace with your deployment URL.

---

## 3. How Authentication Works

This API uses **JWT Bearer token** authentication.

### Getting a token

1. Expand the **Authentication** folder.
2. Run **Login**.
3. The test script automatically saves the token to `{{authToken}}`.

### Credentials

| Field | Value |
|-------|-------|
| Email | `admin@penta.com` |
| Password | `password123` |

### How protected requests use the token

Every request in the **Dashboard** and **Transactions** folders is pre-configured with:

```
Authorization: Bearer {{authToken}}
```

This is set at the **collection level** (Auth tab → Bearer Token → `{{authToken}}`), so all requests inherit it automatically. Individual requests override this only where needed (e.g. the "No Token" error demo uses `noauth`).

### Token expiry

Tokens expire after **24 hours**. If you get a `401 TOKEN_EXPIRED` response, re-run the **Login** request to refresh `{{authToken}}`.

---

## 4. Running the Requests

### Recommended order

1. **Authentication → Login** *(must run first — populates `{{authToken}}`)*
2. **Dashboard → Summary Metrics**
3. **Dashboard → Revenue vs Expense Trends**
4. **Dashboard → Category Breakdown**
5. **Dashboard → Recent Transactions**
6. **Transactions → Get All Transactions** *(also populates `{{sampleTransactionId}}`)*
7. **Transactions → Get Transaction by ID** *(uses `{{sampleTransactionId}}`)*
8. Any filter/search/sort requests
9. **Transactions → Export CSV — All Columns** (use **Send and Download**)

### Running the entire collection

1. Click the **▶ Run** button on the collection.
2. The **Collection Runner** runs all 24 requests in order.
3. Tests will pass once the backend is running and seeded.

---

## 5. Which Requests Require JWT

| Folder | Request | JWT Required |
|--------|---------|:---:|
| Authentication | Login | ❌ No |
| Authentication | Login — Wrong Password | ❌ No |
| Authentication | Get Current User (me) | ✅ Yes |
| Authentication | Logout | ✅ Yes |
| Authentication | Protected Request — No Token | ❌ (intentionally no auth) |
| Dashboard | All 4 endpoints | ✅ Yes |
| Transactions | All 14 endpoints | ✅ Yes |

---

## 6. CSV Export Notes

When running the **Export CSV** requests in Postman:

- Click **Send and Download** (arrow beside Send) instead of just **Send**.
- Postman will prompt you to save the `.csv` file to disk.
- The file will contain proper headers based on the `fields` array in the request body.
- Filters in the `filters` object are applied before generating the CSV.

---

## 7. Collection Variables

| Variable | Set by | Purpose |
|----------|--------|---------|
| `{{baseUrl}}` | Manual (pre-set to `http://localhost:5000`) | Server base URL |
| `{{authToken}}` | Login test script (automatic) | JWT token for protected requests |
| `{{sampleTransactionId}}` | Get All Transactions test script (automatic) | MongoDB ObjectId for single-transaction lookup |

---

## 8. Backend Prerequisites

Before running the collection:

1. MongoDB must be running (`mongodb://localhost:27017`).
2. Backend must be started:
   ```bash
   cd backend
   npm run dev
   ```
3. Database must be seeded:
   ```bash
   npm run seed
   ```
4. Health check: `GET http://localhost:5000/health` should return `{"status":"ok"}`.
