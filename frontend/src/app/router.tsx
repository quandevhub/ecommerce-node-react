import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import ProductList from "../pages/store/ProductList";
import LayoutMain from "./layout/LayoutMain";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<LayoutMain />}>
            <Route index element={<ProductList />} />
        </Route>
    )
);

export default router;