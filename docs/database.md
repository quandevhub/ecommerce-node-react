# Database

**Engine:** MySQL 8  
**Database name:** `ecommerce_node_react`

## ER Diagram

```mermaid
erDiagram
    users {
        int id PK
        varchar email UK
        varchar password_hash
        enum role "user | admin"
        timestamp created_at
    }

    products {
        int id PK
        varchar name
        decimal price
        int stock
        varchar image_url
        timestamp created_at
    }

    orders {
        int id PK
        int user_id FK
        enum status "pending | paid | shipped | cancelled"
        decimal total_amount
        timestamp created_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }

    users ||--o{ orders : "places"
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "included in"
```

## Tables

### users

| Column | Type | Notes |
|---|---|---|
| id | INT AUTO_INCREMENT | PK |
| email | VARCHAR(255) | UNIQUE NOT NULL |
| password_hash | VARCHAR(255) | bcrypt hash |
| role | ENUM | `user` (default), `admin` |
| created_at | TIMESTAMP | DEFAULT NOW() |

### products

| Column | Type | Notes |
|---|---|---|
| id | INT AUTO_INCREMENT | PK |
| name | VARCHAR(255) | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |
| stock | INT | DEFAULT 0 |
| image_url | VARCHAR(500) | |
| created_at | TIMESTAMP | DEFAULT NOW() |

### orders

| Column | Type | Notes |
|---|---|---|
| id | INT AUTO_INCREMENT | PK |
| user_id | INT | FK → users.id |
| status | ENUM | `pending`, `paid`, `shipped`, `cancelled` |
| total_amount | DECIMAL(10,2) | |
| created_at | TIMESTAMP | DEFAULT NOW() |

### order_items

| Column | Type | Notes |
|---|---|---|
| id | INT AUTO_INCREMENT | PK |
| order_id | INT | FK → orders.id |
| product_id | INT | FK → products.id |
| quantity | INT | NOT NULL |
| price | DECIMAL(10,2) | Snapshot giá lúc đặt hàng |

## Notes

- `order_items.price` lưu giá tại thời điểm đặt hàng, không phải giá hiện tại của sản phẩm.
- `orders` và `order_items` nên được insert trong cùng một transaction để tránh dữ liệu không nhất quán.
