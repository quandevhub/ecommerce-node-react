# API Reference

Base URL: `http://localhost:3000/api`

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Auth

### POST /auth/register

Register a new user.

**Body**
```json
{ "email": "user@example.com", "password_hash": "plaintext_password" }
```

**Response 201**
```json
{ "message": "User registered successfully", "token": "<jwt>" }
```

**Errors**

| Status | Message |
|---|---|
| 400 | Email và mật khẩu là bắt buộc |
| 409 | Email đã được sử dụng |
| 500 | Lỗi máy chủ, vui lòng thử lại sau |

---

### POST /auth/login

Authenticate and receive a JWT token.

**Body**
```json
{ "email": "user@example.com", "password_hash": "plaintext_password" }
```

**Response 200**
```json
{ "message": "Login successful", "token": "<jwt>" }
```

**Errors**

| Status | Message |
|---|---|
| 400 | Email và mật khẩu là bắt buộc |
| 400 | Email hoặc mật khẩu không đúng |

---

### GET /auth/me

Get the current authenticated user. **Requires auth.**

**Response 200**
```json
{ "user": { "id": 1, "email": "user@example.com", "role": "user" } }
```

---

## Products

### GET /products

List all products.

**Response 200**
```json
[
  { "id": 1, "name": "Product A", "price": 99000, "stock": 10, "image_url": "..." }
]
```

---

### GET /products/:id

Get a single product.

**Response 200**
```json
{ "id": 1, "name": "Product A", "price": 99000, "stock": 10, "image_url": "..." }
```

**Errors:** `404 Not Found`

---

### POST /products

Create a product.

**Body**
```json
{ "name": "Product A", "price": 99000, "stock": 10, "image_url": "..." }
```

**Response 201**
```json
{ "id": 5, "name": "Product A", ... }
```

---

### PUT /products/:id

Update a product.

**Body** — any subset of product fields.

**Response 200** — updated product.

---

### DELETE /products/:id

Delete a product.

**Response 204 No Content**

---

## Orders

### POST /orders

Create a new order. **Requires auth.**

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
  "data": { "user_id": 1, "productsCount": 2 }
}
```

**Errors**

| Status | Message |
|---|---|
| 400 | Invalid order payload |
| 500 | Failed to create order |
