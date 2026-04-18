import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ProductList from "../pages/store/ProductList";
import LayoutMain from "./layout/LayoutMain";
import CartItems from "../features/cart/cartItems";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<LayoutMain />}>
            <Route index element={<ProductList />} />
            <Route path="cart" element={<CartItems />} />
        </Route>
    )
);

export default router;