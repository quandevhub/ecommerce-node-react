# Cấu trúc dự án Ecommerce Node.js + React

## Thư mục gốc

```
ecommerce-node-react/
├── backend/                    # Express.js API Server
├── frontend/                   # React + TypeScript + Vite
├── docs/                       # Tài liệu dự án
├── .gitignore
└── .git
```

## Backend — Node.js + Express

```
backend/
├── src/
│   ├── app.js                  # Express app config (cors, routes)
│   ├── server.js               # Entry point (listen port)
│   ├── config/
│   │   └── db.js               # MySQL connection (mysql2)
│   ├── controller/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   ├── productController.js # CRUD sản phẩm
│   │   └── orderController.js  # Tạo đơn hàng
│   ├── middleware/
│   │   └── authMiddleware.js   # Xác thực JWT (Bearer token)
│   └── routers/
│       ├── authRoutes.js       # /api/auth/*
│       ├── productRoutes.js    # /api/products/*
│       └── orderRoutes.js      # /api/orders/*
├── Dockerfile                  # Node 20 Alpine, port 3000
├── docker-compose.yml          # Backend + MySQL 8
├── package.json
└── .env
```

### API Endpoints

| Route | Method | Auth | Chức năng |
|-------|--------|------|-----------|
| `/api/auth/register` | POST | - | Đăng ký (bcryptjs + JWT) |
| `/api/auth/login` | POST | - | Đăng nhập |
| `/api/auth/me` | GET | JWT | Lấy thông tin user |
| `/api/products` | GET | - | Danh sách sản phẩm |
| `/api/products/:id` | GET | - | Chi tiết sản phẩm |
| `/api/products` | POST | - | Tạo sản phẩm |
| `/api/products/:id` | PUT | - | Cập nhật sản phẩm |
| `/api/products/:id` | DELETE | - | Xóa sản phẩm |
| `/api/orders` | POST | - | Tạo đơn hàng |

### Dependencies chính

| Package | Version | Mục đích |
|---------|---------|---------|
| express | 5.2.1 | Web framework |
| mysql2 | 3.20.0 | MySQL driver |
| bcryptjs | 3.0.3 | Hash password |
| jsonwebtoken | 9.0.3 | JWT token |
| cors | 2.8.6 | CORS middleware |
| dotenv | 17.3.1 | Biến môi trường |
| nodemon | 3.1.14 | Hot reload (dev) |

## Frontend — React + TypeScript + Vite

```
frontend/
├── src/
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   ├── app/
│   │   ├── router.tsx          # React Router config
│   │   ├── store.ts            # Redux store
│   │   └── layout/
│   │       ├── LayoutMain.tsx  # Layout wrapper (header + outlet)
│   │       └── HeaderMenu.tsx  # Navigation (Store, Cart + badge)
│   ├── pages/
│   │   └── store/
│   │       ├── ProductList.tsx # Trang danh sách sản phẩm
│   │       └── ProductItem.tsx # Card component sản phẩm
│   ├── features/
│   │   └── cart/
│   │       ├── cartItems.tsx   # Trang giỏ hàng
│   │       └── cartSlice.ts    # Redux slice (add/decrease/remove/clear)
│   ├── entities/
│   │   └── types.ts            # TypeScript interfaces
│   ├── hooks/
│   │   ├── useAppDispatch.ts   # Typed Redux dispatch
│   │   └── useAppSelectot.ts   # Typed Redux selector
│   └── services/
│       └── api.ts              # Axios instance (baseURL: VITE_API_BASE)
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── .env
```

### Routes

| Path | Component | Chức năng |
|------|-----------|-----------|
| `/` | ProductList | Danh sách sản phẩm |
| `/cart` | CartItems | Giỏ hàng |

### Redux Cart Actions

| Action | Chức năng |
|--------|-----------|
| `addToCart` | Thêm sản phẩm vào giỏ |
| `deCreaseQuantity` | Giảm số lượng |
| `removeCartItem` | Xóa sản phẩm khỏi giỏ |
| `clearCart` | Xóa toàn bộ giỏ hàng |

### Dependencies chính

| Package | Version | Mục đích |
|---------|---------|---------|
| react | 19.2.4 | UI framework |
| react-router-dom | 7.13.2 | Routing |
| @reduxjs/toolkit | 2.11.2 | State management |
| react-redux | 9.2.0 | React-Redux binding |
| axios | 1.14.0 | HTTP client |
| tailwindcss | 3.4.19 | CSS framework |
| typescript | 5.9 | Type safety |
| vite | 8.0.1 | Build tool |

## Docker

### Dockerfile (Backend)
- Base image: `node:20-alpine`
- Port: `3000`
- Command: `npm run dev`

### docker-compose.yml
- **backend**: Build từ Dockerfile, mount source (hot reload)
- **mysql**: Image `mysql:8`, port `3306`, DB `ecommerce_node_react`, volume persistent

## Luồng hoạt động

### Authentication
1. Register: `POST /api/auth/register` → hash bcrypt → lưu DB → trả JWT
2. Login: `POST /api/auth/login` → verify bcrypt → trả JWT
3. Protected: Gửi `Authorization: Bearer <token>` → middleware verify JWT

### E-Commerce
1. Fetch sản phẩm: `GET /api/products` → hiển thị ProductList
2. Thêm giỏ hàng: dispatch `addToCart` → Redux state
3. Checkout: `POST /api/orders` với danh sách sản phẩm

## Tech Stack tổng quan

| Thành phần | Công nghệ | Phiên bản |
|-----------|-----------|---------|
| Backend Framework | Express.js | 5.2.1 |
| Database | MySQL | 8 |
| Authentication | JWT + bcryptjs | - |
| Frontend Framework | React + TypeScript | 19 + 5.9 |
| State Management | Redux Toolkit | 2.11.2 |
| Routing | React Router | 7.13.2 |
| HTTP Client | Axios | 1.14.0 |
| CSS | Tailwind CSS | 3.4.19 |
| Build Tool | Vite | 8.0.1 |
| Container | Docker + Compose | - |
