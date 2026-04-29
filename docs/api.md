# API Reference

**Base URL:** `http://localhost:3000/api`  
**Content-Type:** `application/json`

## Authentication

Protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

The token is returned from `/auth/register` or `/auth/login`. It contains `{ id, email, role }` and expires per `JWT_EXPIRES_IN` env var (default: `1d`).

**Middleware errors** (`checkAuth`):

| Status | Message |
|---|---|
| 401 | Authorization header missing |
| 401 | Invalid token |

---

## TypeScript Types

```ts
interface User {
  id: number
  email: string
  role: "user" | "admin"
}

interface Product {
  id: number
  name: string
  description?: string
  image_url: string
  price: number
  stock: number
}

interface OrderItem {
  product_id: number
  quantity: number
  price: number
}

interface CreateOrderBody {
  user_id: number
  products: OrderItem[]
}
```

---

## Auth

### POST /auth/register

Register a new user. Returns JWT on success.

**Body**
```json
{
  "email": "user@example.com",
  "password_hash": "plaintext_password"
}
```

**Response 201**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**

| Status | Condition | Message |
|---|---|---|
| 400 | Missing email or password | Email và mật khẩu là bắt buộc |
| 409 | Email already registered | Email đã được sử dụng |
| 500 | Database error | Lỗi máy chủ, vui lòng thử lại sau |

**curl**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password_hash":"secret123"}'
```

---

### POST /auth/login

Authenticate and receive a JWT token.

**Body**
```json
{
  "email": "user@example.com",
  "password_hash": "plaintext_password"
}
```

**Response 200**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**

| Status | Condition | Message |
|---|---|---|
| 400 | Missing email or password | Email và mật khẩu là bắt buộc |
| 400 | Wrong credentials | Email hoặc mật khẩu không đúng |
| 500 | Database error | Lỗi máy chủ, vui lòng thử lại sau |

**curl**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password_hash":"secret123"}'
```

---

### GET /auth/me

Get current authenticated user info. **Requires auth.**

**Response 200**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Errors**

| Status | Condition | Message |
|---|---|---|
| 401 | No/invalid token | See Auth middleware errors |
| 404 | User not found in DB | User not found |
| 500 | Database error | Database error |

**curl**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Products

### GET /products

List all products. No auth required.

**Response 200**
```json
[
  {
    "id": 1,
    "name": "Product A",
    "description": "Some description",
    "image_url": "https://example.com/img.jpg",
    "price": 99000,
    "stock": 10
  }
]
```

**Errors:** `500` — database error with `{ "error": "<message>" }`

**curl**
```bash
curl http://localhost:3000/api/products
```

---

### GET /products/:id

Get a single product by ID. No auth required.

**Response 200**
```json
{
  "id": 1,
  "name": "Product A",
  "description": "Some description",
  "image_url": "https://example.com/img.jpg",
  "price": 99000,
  "stock": 10
}
```

**Errors**

| Status | Condition | Message |
|---|---|---|
| 404 | ID not found | Product not found |
| 500 | Database error | `{ "error": "<message>" }` |

**curl**
```bash
curl http://localhost:3000/api/products/1
```

---

### POST /products

Create a new product. No auth required.

**Body**
```json
{
  "name": "Product B",
  "description": "Optional description",
  "image_url": "https://example.com/img.jpg",
  "price": 150000,
  "stock": 25
}
```

**Response 201**
```json
{
  "message": "Product created successfully",
  "productId": 7
}
```

**Errors:** `500` — database error.

**curl**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Product B","price":150000,"stock":25,"image_url":"https://example.com/img.jpg"}'
```

---

### PUT /products/:id

Update an existing product. All body fields required. No auth required.

**Body**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "image_url": "https://example.com/new.jpg",
  "price": 120000,
  "stock": 15
}
```

**Response 200**
```json
{ "message": "Product updated successfully" }
```

**Errors**

| Status | Condition | Message |
|---|---|---|
| 404 | ID not found | Product not found |
| 500 | Database error | `{ "error": "<message>" }` |

**curl**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","description":"Desc","image_url":"https://x.com/img.jpg","price":120000,"stock":15}'
```

---

### DELETE /products/:id

Delete a product by ID. No auth required.

**Response 200**
```json
{ "message": "Product deleted successfully" }
```

**Errors**

| Status | Condition | Message |
|---|---|---|
| 404 | ID not found | Product not found |
| 500 | Database error | `{ "error": "<message>" }` |

**curl**
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

---

## Orders

### POST /orders

Create a new order. No JWT middleware currently — `user_id` is taken from request body.

> **Note:** `user_id` in body must match a valid user in the database.

**Body**
```json
{
  "user_id": 1,
  "products": [
    { "product_id": 2, "quantity": 1, "price": 99000 },
    { "product_id": 5, "quantity": 2, "price": 45000 }
  ]
}
```

**Response 201**
```json
{
  "message": "Order created successfully",
  "data": {
    "user_id": 1,
    "productsCount": 2
  }
}
```

`total_amount` is calculated server-side as `sum(price * quantity)`.

**Errors**

| Status | Condition | Message |
|---|---|---|
| 400 | Missing user_id or empty products | Invalid order payload |
| 500 | Failed to insert order | Failed to create order |
| 500 | Failed to insert order items | Failed to create order items |

**curl**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "products": [
      {"product_id": 2, "quantity": 1, "price": 99000}
    ]
  }'
```

---

## Endpoint Summary

| Method | Path | Auth | Controller |
|---|---|---|---|
| POST | /auth/register | — | authController.register |
| POST | /auth/login | — | authController.login |
| GET | /auth/me | JWT | authController.getMe |
| GET | /products | — | productController.getAllProducts |
| GET | /products/:id | — | productController.getProductById |
| POST | /products | — | productController.createProduct |
| PUT | /products/:id | — | productController.updateProduct |
| DELETE | /products/:id | — | productController.deleteProduct |
| POST | /orders | — | orderController.createOrder |
