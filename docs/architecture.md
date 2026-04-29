# Architecture

## System Overview

```mermaid
graph TB
    subgraph Client["Browser (port 5173)"]
        UI[React + TypeScript]
        Redux[Redux Toolkit]
        UI <--> Redux
    end

    subgraph Backend["Backend (port 3000)"]
        Express[Express.js API]
        Auth[JWT Middleware]
        Express --> Auth
    end

    subgraph DB["Database"]
        MySQL[(MySQL 8)]
    end

    UI -- HTTP/Axios --> Express
    Express -- mysql2 --> MySQL
```

## Request Flow

### Public request (e.g. GET /api/products)

```mermaid
sequenceDiagram
    participant Browser
    participant Express
    participant MySQL

    Browser->>Express: GET /api/products
    Express->>MySQL: SELECT * FROM products
    MySQL-->>Express: rows[]
    Express-->>Browser: 200 JSON
```

### Authenticated request (e.g. POST /api/orders)

```mermaid
sequenceDiagram
    participant Browser
    participant JWT Middleware
    participant Express
    participant MySQL

    Browser->>JWT Middleware: POST /api/orders + Bearer token
    JWT Middleware->>JWT Middleware: verify(token, JWT_SECRET)
    alt invalid token
        JWT Middleware-->>Browser: 401 Unauthorized
    else valid
        JWT Middleware->>Express: req.user = { id, email, role }
        Express->>MySQL: INSERT INTO orders...
        MySQL-->>Express: insertId
        Express-->>Browser: 201 Created
    end
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Redux
    participant API
    participant DB

    User->>Frontend: Submit login form
    Frontend->>API: POST /api/auth/login
    API->>DB: SELECT user WHERE email = ?
    DB-->>API: user row
    API->>API: bcrypt.compare(password, hash)
    API-->>Frontend: { token }
    Frontend->>Redux: dispatch(loginSuccess({ token, email, userId }))
    Redux->>localStorage: save token
    Frontend->>Frontend: navigate to "/"
```

## Frontend Architecture

```mermaid
graph TD
    main[main.tsx] --> App[App.tsx]
    App --> Provider[Redux Provider]
    Provider --> Router[React Router]
    Router --> Layout[LayoutMain]
    Router --> Login[LoginPage]
    Router --> Register[RegisterPage]
    Layout --> Header[HeaderMenu]
    Layout --> ProductList[ProductList]
    Layout --> CartItems[CartItems]

    subgraph Redux Store
        cartSlice[cartSlice]
        authSlice[authSlice]
    end

    Header --> authSlice
    CartItems --> cartSlice
    CartItems --> authSlice
    ProductList --> cartSlice
```

## Backend Structure

```
backend/src/
├── server.js          # HTTP server, listens on PORT
├── app.js             # Express app, CORS, routes mounting
├── config/
│   └── db.js          # mysql2 connection pool
├── controller/
│   ├── authController.js     # register, login, getMe
│   ├── productController.js  # CRUD products
│   └── orderController.js    # createOrder
├── middleware/
│   └── authMiddleware.js     # JWT verification
└── routers/
    ├── authRoutes.js    # /api/auth/*
    ├── productRoutes.js # /api/products/*
    └── orderRoutes.js   # /api/orders/*
```
