# Frontend — React + TypeScript

React 19 SPA for the ecommerce application. Built with Vite, Redux Toolkit, and Tailwind CSS.

## Setup

```bash
npm install

# Create .env
echo "VITE_API_BASE=http://localhost:3000/api" > .env

npm run dev     # http://localhost:5173
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | ESLint |
| `npm run test` | Playwright E2E tests |
| `npm run test:auth` | Auth tests only |
| `npm run test:cart` | Cart tests only |
| `npm run test:ui` | Playwright interactive UI |

## Structure

```
src/
├── app/
│   ├── router.tsx          # Route definitions
│   ├── store.ts            # Redux store
│   └── layout/
│       ├── LayoutMain.tsx  # Shell with header + outlet
│       └── HeaderMenu.tsx  # Nav: store, cart badge, auth state
├── pages/
│   ├── store/
│   │   ├── ProductList.tsx
│   │   └── ProductItem.tsx
│   └── auth/
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
├── features/
│   ├── cart/
│   │   ├── cartSlice.ts    # add / decrease / remove / clear
│   │   └── cartItems.tsx   # Cart page + checkout
│   └── auth/
│       └── authSlice.ts    # login / logout, token in localStorage
├── entities/
│   └── types.ts            # Shared TypeScript interfaces
├── services/
│   └── api.ts              # Axios instance + auth interceptor
├── hooks/
│   ├── useAppDispatch.ts
│   └── useAppSelectot.ts
└── utils/
    └── parseApiError.ts
```

## Routes

| Path | Component |
|---|---|
| `/` | ProductList |
| `/cart` | CartItems |
| `/login` | LoginPage |
| `/register` | RegisterPage |

For full documentation see [docs/](../docs/).
