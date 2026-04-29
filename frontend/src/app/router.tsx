import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ProductList from "../pages/store/ProductList";
import LayoutMain from "./layout/LayoutMain";
import CartItems from "../features/cart/cartItems";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LayoutMain />}>
        <Route index element={<ProductList />} />
        <Route path="cart" element={<CartItems />} />
      </Route>
    </>,
  ),
);

export default router;
