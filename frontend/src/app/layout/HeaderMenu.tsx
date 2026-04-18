import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelectot";

export default function HeaderMenu() {
    const cartItems = useAppSelector(state => state.cart.items);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    return (
        <>
            <header className="sticky top-0 z-20 border-b border-gray-700 bg-gray-800/95 px-4 py-3 text-white backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Link to="/">Store</Link>
                        <Link to="/cart">
                            <span className="inline-flex items-center gap-2">
                                Cart
                                <span
                                    className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-900 transition"
                                >
                                    {totalQuantity}
                                </span>
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>

                        <span className="hidden text-sm font-medium text-gray-200 sm:inline">
                            Hello, User
                        </span>
                        <button
                            type="button"
                            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>
        </>
    )
}